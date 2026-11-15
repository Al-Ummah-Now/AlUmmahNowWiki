[← Home](../README.md) · [Epic 23](../epics/E23-release-engineering.md) · [Release process](release-process.md)

# Store release: what the owner pastes where

Every store pipeline, store listing, universal-link file and attestation check is already built ([NAT-REL](../epics/E23-release-engineering.md)). Each one waits for a value only the owner can get. Until that value is pasted in, the step **skips with a notice and never fails the build**, the file is **not served**, and the check stays **off**. This page lists every value: where it comes from, and the one place it goes.

Nothing on this page is committed to a repo. GitHub secrets go in **repo → Settings → Secrets and variables → Actions → New repository secret** (or the org's secrets, to share them across the native repos). Values in videos admin are typed into the page, saved per environment and audited.

## 1. Before anything: D-U-N-S and the store accounts

| Step | Where | Why |
|---|---|---|
| D-U-N-S number for the organisation | [Dun & Bradstreet D-U-N-S lookup for Apple developers](https://developer.apple.com/enroll/duns-lookup/) (free) | Apple and Google both need it to open an **organisation** account, so the store shows the organisation, not a person, as the seller |
| Apple Developer Program, organisation | [developer.apple.com/programs/enroll](https://developer.apple.com/programs/enroll/) | Team ID, signing, TestFlight, App Store |
| Google Play Console, organisation | [play.google.com/console/signup](https://play.google.com/console/signup) | Play internal track, Play App Signing, Play Integrity |
| Microsoft Partner Center, company | [Open a Microsoft Store developer account](https://learn.microsoft.com/en-us/windows/apps/publish/partner-center/open-a-developer-account) | Microsoft Store listing and Store-signed MSIX |
| App records | App Store Connect → Apps → New App (one per bundle id below); Play Console → Create app (one per package); Partner Center → New product → MSIX app (reserve the name) | The pipelines upload into these records; they never create them |

Store submission for review stays a person's click in each console. The pipelines stop at TestFlight, the Play internal track and a Partner Center draft.

## 2. The app ids (already decided)

| App | Apple bundle id | Android package |
|---|---|---|
| Viewer | `net.alummahnow.viewer` (Mac `net.alummahnow.viewer.mac`) | `net.alummahnow.app` (TV and Fire TV: `net.alummahnow.tv`) |
| Studio | `net.alummahnow.studio` (Mac `net.alummahnow.studio.mac`) | `net.alummahnow.studio` |
| Admin (internal) | `net.alummahnow.admin` (Mac `net.alummahnow.admin.mac`) | `net.alummahnow.admin` |

QA builds add `.qa` to each id. Videos admin → Mobile apps starts with these ids filled in for its environment; only the Team ID and the fingerprints are empty.

## 3. Videos admin → Mobile apps (once per environment)

Open **videos admin → Site → Mobile apps** on production (`admin.alummahnow.net/mobile-apps`), and again on stage and QA if you test there. Only an Admin or Super admin can save. Every save is kept in the page's history with who changed what.

| Field | Where to find the value | What it turns on |
|---|---|---|
| **Apple Team ID** (10 characters) | [developer.apple.com/account](https://developer.apple.com/account) → Membership details → Team ID | `https://videos.alummahnow.net/.well-known/apple-app-site-association` (Viewer and Studio links open in the app, Studio and Admin passkeys) and the passkey file on `alummahnow.net`. Empty: neither file lists Apple apps |
| Apple bundle ids | Filled in; change only if an App Store Connect record uses a different id | The same file |
| **Android SHA-256 fingerprints**, per package | Play Console → the app → Test and release → Setup → **App signing**: copy *both* "App signing key certificate" and "Upload key certificate" SHA-256 lines (the upload one also from `keytool -list -v -keystore upload.jks -alias aun-upload`). QA's Studio (`net.alummahnow.studio.qa`) uses the CI pre-release key `5A:1B:3D:2B:57:6E:9A:2D:F0:BF:1B:E3:F1:8C:40:20:13:F9:5C:09:EA:EE:7C:F7:31:10:C4:2F:B5:69:DD:C0` | `https://videos.alummahnow.net/.well-known/assetlinks.json` (verified App Links, passkeys) and the passkey file on `alummahnow.net`. A package with no fingerprint is left out; with none at all the file is not served |
| App Attest on, environment | Turn on once the Team ID is set and an App Store / TestFlight build is out. **Production** for TestFlight and App Store builds, **Development** only for builds run from Xcode | iPhone and iPad apps can prove they are the real app (see [Bot protection](bot-protection.md)) |
| Play Integrity on, **Cloud project number** | Play Console → Test and release → App integrity → Play Integrity API → link a Google Cloud project; the number is on that project's dashboard in [console.cloud.google.com](https://console.cloud.google.com) | Android apps can prove they are the real app. Also needs the worker secret in §5 |
| Require a proof from these clients | Leave empty until the apps that send a proof are released. Then add the native client ids one at a time | Writes from a listed client without a valid proof are refused (403) and show on the Abuse page as "App write without attestation refused" |

The page's "What the videos site serves" card shows the exact files a save produces, with links to the live ones.

## 4. GitHub secrets per repo

### AlUmmahNowApple

| Secret | Where to get it | Used for |
|---|---|---|
| `APPLE_TEAM_ID` | Same Team ID as §3 | Signing, export options |
| `ASC_KEY_ID`, `ASC_ISSUER_ID`, `ASC_KEY_P8` | App Store Connect → Users and Access → Integrations → App Store Connect API → generate a key with the App Manager role. Paste the whole `.p8` file text into `ASC_KEY_P8` (it downloads once) | Automatic signing in CI and the TestFlight upload |
| `DEVELOPER_ID_P12`, `DEVELOPER_ID_P12_PASSWORD` | Xcode → Settings → Accounts → Manage Certificates → + Developer ID Application, then export it from Keychain Access as `.p12`; base64 the file into `DEVELOPER_ID_P12` | Signed and notarized Mac `.dmg` / `.zip` downloads |

### AlUmmahNowAndroid

Full steps: [docs/RELEASE.md](https://github.com/Al-Ummah-Now/AlUmmahNowAndroid/blob/main/docs/RELEASE.md). Secrets go in the repo's `play-release` and `github-release` environments.

| Secret / variable | Where to get it | Used for |
|---|---|---|
| `AUN_UPLOAD_KEYSTORE_BASE64`, `AUN_UPLOAD_KEYSTORE_PASSWORD`, `AUN_UPLOAD_KEY_ALIAS`, `AUN_UPLOAD_KEY_PASSWORD` | Create the upload key once: `keytool -genkeypair -v -keystore upload.jks -alias aun-upload -keyalg RSA -keysize 4096 -validity 10000`; `base64 -i upload.jks` into the first secret, the alias is `aun-upload` | Signed bundles (artifact `play-bundles`), the Fire TV APK and a full (not pre-release) GitHub release. Without them releases use the CI pre-release key |
| `PLAY_SERVICE_ACCOUNT_JSON` | Google Cloud → enable the Google Play Android Developer API → IAM → Service accounts → create one → Keys → JSON (paste it whole). Play Console → Users and permissions → give it **Release manager** on all four apps | Upload of each app's bundle, listing and screenshots to the internal testing track |
| Variables `PLAY_VIEWER_READY`, `PLAY_STUDIO_READY`, `PLAY_TV_READY`, `ADMIN_PLAY_READY` | Set each to `true` once that app's **first** `.aab` was uploaded by hand under Internal testing (Play requires the first upload to be manual; take it from the `play-bundles` artifact of a tag run; Admin's bundle is built locally, see RELEASE.md). Leave `PLAY_TV_READY` off until the TV app has its real screens | Turns the automatic upload on per app |
| `ADMIN_GOOGLE_SERVICES_JSON` (optional) | Firebase project of the internal Admin app | Admin review alerts |
| `AMAZON_APPSTORE_CLIENT_ID`, `AMAZON_APPSTORE_CLIENT_SECRET`, `AMAZON_APPSTORE_APP_ID` | Amazon Developer Console → create the app `net.alummahnow.tv` (App ID `amzn1.devportal.mobileapp.…`) → API Access → App Submission API security profile (client id and secret) | Puts the Fire TV APK into an open edit; you press **Submit** in the console |

Play Console, once per app (`net.alummahnow.app`, `net.alummahnow.tv`, `net.alummahnow.studio`, `net.alummahnow.admin`): create it with Play App Signing on; App content (privacy policy and account-deletion URLs, App access with a dedicated reviewer account for Studio and Admin, never yours, no ads, content rating, target audience, Data safety copied from `store/play/data-safety.md`); store settings (category, contact email, website); a 1024×500 feature graphic per app and a 1280×720 TV banner.

### AlUmmahNowDesktop

| Secret | Where to get it | Used for |
|---|---|---|
| Partner Center publisher id and package identity | Partner Center → the product → Product identity (`Package/Identity/Name`, `Publisher`) | Store-signed MSIX for the Microsoft Store (no certificate needed for Store builds) |
| Code-signing certificate for direct downloads | Azure Trusted Signing (tenant id, client id, secret) or an OV/EV certificate in a cloud HSM | Signed MSI and exe outside the Store |
| `ADMIN_WINDOWS_CERT_PFX_BASE64`, `ADMIN_WINDOWS_CERT_PASSWORD`, `ADMIN_WINDOWS_PUBLISHER`, `ADMIN_WINDOWS_PACKAGE_NAME`, `ADMIN_RELEASE_BUCKET` | Internal Admin app's private MSIX channel ([ADMIN_WINDOWS](https://github.com/Al-Ummah-Now/AlUmmahNowDesktop/blob/main/docs/ADMIN_WINDOWS.md)) | Admin for Windows |

The exact secret names for the Store upload steps are listed in each repo's release doc.

## 5. Cloudflare: one worker secret

| Secret | Worker | Where to get it |
|---|---|---|
| `PLAY_INTEGRITY_SERVICE_ACCOUNT` | `api-videos` on each environment (Cloudflare dashboard → Workers → the api-videos worker → Settings → Variables and secrets → Add → type Secret) | A JSON key of a service account in the Cloud project linked in §3 (Google Cloud → IAM → Service accounts → Keys → JSON). Enable the Play Integrity API in that project. Paste the whole JSON |

Without it, Play Integrity checks answer 503 `not_configured` and Android apps keep working as before. App Attest needs no secret.

## 6. After pasting: how to check

- **Links and passkeys.** Open `https://videos.alummahnow.net/.well-known/apple-app-site-association` and `/.well-known/assetlinks.json`: they show your Team ID and fingerprints within a minute or so of saving (cached up to 5 minutes). Apple's CDN refetches the file on its own schedule.
- **Pipelines.** Push the next release tag in a native repo. The run summary says which upload steps ran and which skipped, and why.
- **Attestation.** After turning it on, the Abuse page counts refused app writes. Add client ids to "Require a proof" only after the apps that send a proof are out.
