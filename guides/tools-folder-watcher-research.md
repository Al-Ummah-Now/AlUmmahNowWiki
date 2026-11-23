[← Home](../README.md) · [TOOLS-PLANS](../epics/TOOLS-PLANS-tools-consolidation-testing-research.md) · [TOOLS-ADMIN](../epics/TOOLS-ADMIN-admin-import-tool.md)

# Tools cross-platform folder watcher research and recommendation

| | |
|---|---|
| **Epic** | [TOOLS-PLANS](../epics/TOOLS-PLANS-tools-consolidation-testing-research.md) (`TP-D5`) |
| **Applies to** | [AlUmmahNowTools](../repos/AlUmmahNowTools.md) (`AlUmmahNow.ToolsCore`, `AlUmmahNow.VisualImporterUno`, `AlUmmahNow.FileScanService`) |
| **Date** | 2026-11-23 |
| **Owner decision** | [`TP-D5`](../epics/decisions.md#tp-d5-cross-platform-folder-watcher-without-localdb) — cross-platform (Windows, macOS, Linux), zero extra installs, drop SQL Server LocalDB |

## Executive recommendation

Replace `AlUmmahNow.FileScanService` + SQL Server LocalDB with an **in-process cross-platform watcher inside `AlUmmahNow.ToolsCore`** backed by **SQLite**, with **catch-up scan on app start** as the default downtime recovery mechanism and an **optional "Keep watching in background" (launch at login)** mode later if staff want unattended uploads while the window is closed:

1. **Detection engine:** .NET's built-in `System.IO.FileSystemWatcher` (native `ReadDirectoryChangesW` on Windows, `FSEvents` on macOS, `inotify` on Linux — zero native dependencies) wrapped in a **per-folder watcher + debouncer + size/mtime stability gate** (porting Maktaba's settling design), paired with a **periodic polling fallback** for network shares (SMB/NFS/CIFS), FUSE mounts, and `FileSystemWatcher` buffer overflows (`Error` event).
2. **State store:** **SQLite** (WAL mode, `Microsoft.Data.Sqlite` — ships its own native `e_sqlite3` bundle for Windows, macOS, and Linux inside the app, zero external DB install), replacing SQL Server LocalDB (`(localdb)\MSSQLLocalDB`) which only runs on Windows.
3. **Surviving the app being closed (recommended two-tier design):**
   - **Phase 1 (default, zero OS friction, ships first):** **Catch-up scan on start.** On startup, the watcher diffs every configured watched folder against the SQLite `watched_files` snapshot (`path`, `size_bytes`, `mtime_utc`, `sha256`, `state`). Any video added, modified, or renamed while Tools was closed is immediately detected, settled, and enqueued into `ToolsCore`'s crash-safe `WorkQueue` (which already persists across restarts). Nothing is ever missed during downtime, and no OS background permissions or signed login-item entitlements are required (important because `AlUmmahNowTools` currently ships unsigned).
   - **Phase 2 (opt-in, once installers are code-signed):** **Launch at login / user background agent** (macOS `LaunchAgent` plist in `~/Library/LaunchAgents`, Linux `systemd --user` unit + `loginctl enable-linger`, Windows per-user Scheduled Task at logon — mirroring Maktaba's `cmd/maktaba-server/internal/service/service.go`, NOT a Windows System Service so mapped network drives remain visible to the user's session). Even with Phase 2 enabled, Phase 1's catch-up scan on boot remains the backstop for reboots, crashes, and sleeping laptops.

---

## 1. Why the current `AlUmmahNow.FileScanService` cannot meet `TP-D5`

| Current component | Why it fails `TP-D5` |
|---|---|
| **SQL Server LocalDB** (`ImportDbContext` → `Server=(localdb)\MSSQLLocalDB`) | Windows-only, requires separate Microsoft SQL Server Express LocalDB installer. Completely unavailable on macOS and Linux. |
| **Separate SignalR daemon** (`AlUmmahNow.FileScanService` + `FileScanServiceManager` + `FileScanSignalRClient`) | Adds a second process to bundle, locate, start, health-check, bind on loopback (`localhost:5000`), and shut down cleanly across three OSes — solely to watch local folders and report progress to one desktop UI. |
| **Legacy direct-upload stub** (`ImportWorker.cs`) | Still contains placeholder comments for direct R2/Bunny uploads instead of feeding `ToolsCore`'s `WorkQueue` and `admin-api` TUS pipeline (`TOOLS-ADMIN` TA-11/TA-12). |

---

## 2. What Maktaba does (reference implementation)

The sibling **Maktaba** repository solves the exact same cross-platform video folder watching problem in two layers:

### A. Live watcher + debouncer + polling fallback (`pipeline/src/maktaba_pipeline/watcher/`)
- **Per-library observer isolation (`watcher/service.py`):** Each watched root gets its own observer (`watchdog` native `Observer` on local disks, `PollingObserver` on network mounts and in tests) so one unreachable or misbehaving folder never breaks the others.
- **Early filtering at the source (`LibraryObserver._is_eligible`):** Drops hidden files (`.`), sidecar/temp directories, partial-download extensions (`.part`, `.crdownload`, `.tmp`), and non-video extensions before they reach the debouncer. Promotes `.part` → `.mp4` renames into fresh `CREATE` events so downloads that finish by atomic rename are never missed.
- **Three-layer settling gate (`watcher/debouncer.py`):** Never enqueues a file mid-copy:
  1. **Per-path debounce timer** (`debounce_sec = 2.0 s`) collapses bursts of `Modified` events into one probe.
  2. **Stable-size probe** (`settle_ticks = 2`): queries file size on consecutive ticks and only settles after two consecutive probes return the exact same byte count.
  3. **Mtime quarantine** (`settle_sec = 1.0 s`): even if size matched, re-arms if `now - mtime < settle_sec`, catching copies that stall briefly before flushing.
- **Bounded handoff queue (`queue_capacity = 4096`):** Prevents an event storm (e.g., `mv` of 10,000 files) from pinning RAM; any dropped overflow is caught by the periodic/startup sweep.
- **Restart resilience (`story-09-02-filesystem-watcher.md` AC-4):** Every startup runs a one-shot full sweep before/alongside live events, closing the "missed while stopped" gap completely.

### B. Surviving app close (`cmd/maktaba-server/internal/service/service.go` & `apps/desktop/src-tauri/src/tray.rs`)
- Maktaba separates the always-on server (`maktaba-launcher`) from the desktop window and installs a **per-user OS service** so the server keeps running when the user closes the window:
  - **Linux:** `systemd --user` unit (`~/.config/systemd/user/*.service`) + `loginctl enable-linger` (or system unit in server mode).
  - **macOS:** `launchd` `LaunchAgent` (`~/Library/LaunchAgents/*.plist`) loaded into `gui/<uid>`.
  - **Windows:** **Per-user logon Scheduled Task** (`schtasks /Create`) as the default — explicitly chosen over a Windows Service because **mapped network drives (SMB) are per-user logon sessions** and invisible to `LocalSystem` services.
- In the desktop app (`tray.rs`), closing the window keeps the background service running (with a tray menu offering **Pause**, **Quit** leaving the service running, and **Stop and Quit**), and on Linux without a system tray it mirrors those controls into the window menu.

---

## 3. Options evaluated for `AlUmmahNowTools`

### Watcher + storage architecture

| Option | Cross-platform (Win/macOS/Linux) | Zero extra installs | Network drives (SMB/NFS) | Complexity | Verdict |
|---|---|---|---|---|---|
| **Option 1 (Recommended): In-process watcher in `AlUmmahNow.ToolsCore` (`FileSystemWatcher` + polling fallback) + SQLite (WAL)** | Identical .NET 9 code on all 3 OSes | Yes — `FileSystemWatcher` is in BCL; `Microsoft.Data.Sqlite` bundles native `e_sqlite3` | Yes — auto-fallback to periodic polling on network mounts, FUSE, or `Error`/buffer overflow | **Low–Medium** (single process, directly feeds `WorkQueue`, fully testable with synthetic clocks in `ToolsCore.Tests`) | **Recommended** |
| **Option 2: Keep `FileScanService` as a separate SignalR daemon, swap LocalDB → SQLite** | Yes (after porting) | Yes | Same | **High** — still ships, spawns, supervises, and secures a second binary + loopback HTTP/SignalR server on 3 OSes | **Not recommended** unless headless CLI-only watching without the GUI becomes a primary requirement |
| **Option 3: Rust `notify` crate in `AlUmmahNowCore` (`aun-core`) over FFI** | Yes | Yes (via `aun-core`) | `notify` still needs polling fallback + debouncer | **Medium–High** — adds FFI callback plumbing and cross-language state sync when .NET already has native `FileSystemWatcher` and owns `WorkQueue` | **Not recommended** unless Desktop Studio (non-Tools) later needs the exact same watcher |

### Surviving the app being closed

| Mechanism | Works while Tools is completely closed? | Works with unsigned builds (`v2026.11.22`)? | Sees mapped Windows drives & macOS TCC folders? | User UX & complexity |
|---|---|---|---|---|
| **A. Catch-up scan on start (Recommended baseline — Phase 1)** | Uploads wait until Tools opens, then catch up automatically within seconds | **Yes — 100% reliable on all 3 OSes** | **Yes** (runs in the user's interactive session) | Zero setup, zero surprise background CPU/bandwidth, zero OS permission prompts; never misses a file dropped while closed |
| **B. Launch at login + minimize to tray (Optional — Phase 2)** | Yes, as long as the user is signed into their desktop | Partial — macOS Ventura+ warns on unsigned Login Items / `LaunchAgent`s; Linux tray support varies by desktop environment | **Yes** (runs in user session) | Familiar Dropbox/OneDrive pattern; needs tray icon + "Quit vs. Hide" behavior and code signing on macOS/Windows |
| **C. Detached headless background agent (`systemd --user` / `LaunchAgent` / Windows logon task)** | Yes, even when the GUI window is closed | Partial — macOS flags unsigned `LaunchAgent`s in Login Items; needs IPC back to the GUI | **Yes** (per-user logon task on Windows sees mapped drives; System Service does **not**) | Highest complexity (re-introduces multi-process IPC + lifecycle management, like Maktaba's launcher) |

---

## 4. Recommended design for `AlUmmahNow.ToolsCore` (`TOOLS-ADMIN` TA-14 follow-up)

### 1. In-process `FolderWatcher` in `AlUmmahNow.ToolsCore`
- **Native watch + polling hybrid:**
  - Open one `FileSystemWatcher` per configured watched folder (`IncludeSubdirectories = true`, `InternalBufferSize = 65536`, watching `FileName | Size | LastWrite`).
  - Listen to `Created`, `Changed`, `Renamed`, and `Error`.
  - On `Error` (buffer overflow or disconnected share), `PlatformNotSupportedException` / `IOException` (e.g., `inotify` watch limit on Linux or SMB/FUSE mount), or when the folder is detected as a network mount (`DriveType.Network` / UNC `\\server\share` / `/Volumes/*` / `/mnt/*` / `/media/*` / user toggle), seamlessly switch that folder to a **polling scanner** (default every 30 s) without affecting other watched folders.
  - Also run a low-frequency **periodic reconciliation sweep** (e.g., every 10 minutes) as a safety net for missed OS events.
- **Settling debouncer (ported from Maktaba `debouncer.py`):**
  - Filter out hidden files, temp/partial downloads (`.part`, `.tmp`, `.crdownload`, `.download`), and non-video extensions at the edge.
  - Promote rename-from-temp (`foo.mp4.part` → `foo.mp4`) into a fresh creation event.
  - Require **2 consecutive stable size probes** (`debounce = 2 s`) **and** `mtime` older than `2 s` (plus non-exclusive read-open check on Windows) before handing the file to the queue.
  - Inject `TimeProvider` and a thin filesystem stat abstraction so every debounce, partial-copy, rename, and overflow case has fast deterministic unit tests in `AlUmmahNow.ToolsCore.Tests`.
- **Direct handoff to `ToolsCore` `WorkQueue`:**
  - Settled files go straight into the existing approval/review list (or auto-enqueue into `WorkQueue` for folders configured with a target channel + auto-import), using the `admin-api` TUS pipeline (`TOOLS-ADMIN` TA-11/TA-12) — zero direct R2 or Bunny credentials.

### 2. SQLite state store (dropping SQL Server LocalDB)
- Single local SQLite file under the user's app data directory (`AlUmmahNow/Tools/watcher.db`), opened with `PRAGMA journal_mode=WAL; PRAGMA busy_timeout=5000;`.
- Minimal schema (versioned via simple numbered migrations):
  - `watched_folders (id, path, channel_id, include_subfolders, mode [auto|poll], auto_enqueue, enabled, last_scan_utc)`
  - `watched_files (id, folder_id, relative_path, size_bytes, mtime_utc_ticks, sha256, status [discovered|pending_approval|queued|imported|ignored|missing], work_item_id, updated_utc)`
- Replaces `ImportDbContext` + `Microsoft.EntityFrameworkCore.SqlServer` + `(localdb)\MSSQLLocalDB`, eliminating the last Windows-only runtime dependency in Tools.

### 3. Downtime survival plan
- **Ship Phase 1 first (catch-up scan on start):**
  - Whenever Tools starts, `FolderWatcher` performs an incremental catch-up scan of every enabled `watched_folders` row against `watched_files` (`relative_path`, `size_bytes`, `mtime_utc_ticks`).
  - New or changed files pass through the same stability check and enter the approval queue / `WorkQueue`; deleted files are marked `missing` (never triggering remote platform deletes).
  - Because `ToolsCore`'s `WorkQueue` already persists queued/in-progress uploads to disk and resumes TUS transfers automatically, closing Tools mid-upload and reopening it later resumes cleanly with zero lost work.
- **Add Phase 2 only when needed (and after macOS/Windows code signing):**
  - Offer an opt-in **"Start Tools at login and keep watching in the background"** preference (Windows per-user logon task or Startup shortcut, macOS `LaunchAgent` plist, Linux XDG autostart `.desktop` / `systemd --user` unit) with a minimal tray icon (Windows/macOS, and window-menu fallback on Linux like Maktaba's `tray.rs`).
  - Keep Phase 1's catch-up scan active in all modes so sleep, reboot, or crashes never leave a missed-file hole.
