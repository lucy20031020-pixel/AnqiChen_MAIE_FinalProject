# Age Verification Passport — edition 05 / paper records and organisation colours

A local-first fictional exhibition built on the existing COMMONROOM forum, check, data trail, Passport, SVG download and print template. No identity service, image analysis, upload, camera, login or analytics is connected. The thesis is unchanged. Website publication is a separate step from the repository upload.

## Run locally

```sh
cd master_web
python3 -m http.server 8080
```

Open http://localhost:8080 (or use VS Code Live Server). No install, build or backend is needed. Serve through HTTP; `file://` cannot fetch `data/research.json`.

## The visit

Previews are visible to everyone. Full discussions and comments require age confirmation under **COMMONROOM’s fictional 18+ community rule**. These ordinary topics are not represented as legally age-restricted. This is a UK research setting, not registration for a whole platform. Source dates appear on the forum; the existing source check date remains 17 November 2026, not a new audit.

1. Open a discussion and choose **Alex Rowan / C-01** (accepted sample ID) or **Morgan Vale / C-02** (no accepted ID). Both are fictional adults. Expand Character details to see supplied details later.
2. Type the supplied birthdate or use **Use fictional details**. Only that character’s exact supplied date is accepted. An incorrect input is cleared and never saved. **Send declaration** represents sending the fictional date to COMMONROOM. It is labelled self-declaration and never verifies age independently. There is no second confirmation screen or checkbox.
3. Continue to fictional provider LENS. Select the built-in abstract image, inspect recipient/purpose, then **Send sample**. Selection alone sends nothing. The short, skippable illustration runs no analysis. Reduced-motion preferences bypass its delay.
4. In the initial example, the estimate is too uncertain to confirm 18+. COMMONROOM asks for a sample ID; the visitor can provide it, request review, or leave. Alex selects and sends the sample ID in one form. Morgan has no accepted ID to select and can request review, leave, or keep an unresolved outcome.
5. Review uses a supplied reason, no free text. Sending it produces **Pending**, never an automatic approval. It is not sent to a real service; waiting time is unspecified.
6. Every ending generates a record. Success opens the discussion originally selected. Returning to the forum reopens that discussion without another check; other discussions still show the entry requirement. Leaving preserves access to previews. Switching discussions during an unfinished route closes that route accurately before starting the next.
7. Data trail leads with the outcome and actual additional disclosures. Expand the full process to distinguish requested information, actual submissions, provider assessment, COMMONROOM’s received result and access decision. Passport, print and SVG use the same record fields.

The Research dialog’s **Try another example** offers first-check success (estimate 25), uncertainty (estimate 18), or an unavailable first check. Results are set in advance and repeatable, not random failure rates or judgments about the visitor. A first-check success can grant access to either adult. The estimate of 18 is explicitly uncertain in this fictional setting; no real provider confidence threshold is asserted. Accepted-ID availability follows the character card. Existing age credentials are excluded from active routes because issuer/sharing evidence is incomplete.

## Disclosures and institutions

- A declaration sends the fictional date to COMMONROOM. Typing/autofilling alone does not send it.
- A selected-but-unsent image or ID is not Provided. Reached but unfulfilled requests are listed separately.
- LENS assesses the fictional image. COMMONROOM receives the example estimate and status and decides access.
- The fictional ID page contains a name, birthdate and exhibition marker. In this scenario LENS sees the image and reads its birthdate. COMMONROOM receives sample birthdate/status, not name/image. S03 informs the output type; the fields, sample and operation are fictional.
- Review adds a case reference and selected reason to COMMONROOM support. It does not add ID evidence.
- Data trail counts actual submitted face/document checks, excluding declarations and unavailable attempts. The card separately labels attempts, which can include an unavailable step.

`data/research.json` is the shared source for UK context, fictional rules, characters, samples, methods, recipients, events, routes, real published statements, unknowns, source IDs/links/check dates and documented/fictional/speculative tags. Platform and provider have separate roles. LENS is fictional; prices, contracts and internal processing are not invented. Real named-service deletion statements appear only under research details and are not deletion rules for LENS. Unknowns distinguish source gaps from unspecified fictional rules. Speculative future accumulation remains separately labelled.

## Browser state and network requests

`sessionStorage['age-verification-passport-v5']` saves a whitelisted compact packet: fictional character/sample IDs, profile, post, stage, event IDs, choices, route/request metadata, local slip identifiers and insertion checkbox. Serializer format remains version 4; edition 05 invalidates earlier packets. Names, dates (including valid supplied dates), incorrect inputs, free text, images and expanded assessments are **not saved**. Displayed values are reconstructed from the JSON.

Refresh restores the current stage, submitted events, selected reason and insertion note. The supplied birthday is reconstructed only after accepted declaration input; image selection restores before sending. A document radio checked but not sent can require selection again after refresh. Processing refresh returns the same result once without submitting again.

**Start a new visit** clears drafts, choices, profiles and slips plus all known v1–v5 local/session storage keys. It does not delete paper or downloaded files. Use one exhibition tab and reset between visitors. Browser session restoration may preserve a tab; closing it is not a reliable reset. Separate tabs have separate state. Fixed public examples never read or write visitor storage.

Forms are handled locally with no HTTP submission. Automatic requests are only same-host HTML, CSS, JS and research JSON. System fonts and inline sample SVGs require no external service. Source links navigate when clicked. No tracking, upload, payment, login, camera or verification API is added.

## Paper and download

Cards and downloadable SVGs are **105 × 148 mm**. Print at 100% with browser headers/footers disabled; cut along the border. Print mode hides navigation/buttons and preserves fields.

Cards identify **LENS assessment**, **LENS → COMMONROOM** returned results, **COMMONROOM access decision** and a separate **COMMONROOM review** status. Institutional colours match Data trail. A received birthday declaration is explicitly not independently checked. Only submitted reviews are Pending; an opened but unsent review is Not submitted, and an untouched review route is Not requested. Attempt counts are separate from review status. Every screen/print/SVG uses the shared record schema. The card says **Fictional scenario · No real age assessment · Not proof of age**.

The passport template prints on one landscape A4 sheet. Cut the **260 × 182 mm** spread and fold at the centre for a nominal **130 × 182 mm** passport. Its card area is **109 × 152 mm**, with a centred **105 × 148 mm** outline: about **2 mm clearance on each edge**. The previous short placeholder box is replaced with this full-size area. The template is a placement guide, not a manufactured pocket or binding pattern. Physical thickness, printing/cutting tolerances and any separately made passport still need a real fit check. The insertion checkbox is a manual note, not a sensor.

QR codes, scan instructions, the publication placeholder, PUBLIC_BASE_URL configuration and bundled encoder have been removed at the artist’s request. Result, Passport, print and SVG now contain the record itself. The scenario number still identifies a route for comparison between paper cards.

The standalone `record.html?scenario=FC-02` example page remains available by its normal URL, without login or browser storage. Current FC and archived CR examples are retained. They are fixed examples, not private visitor histories. No public-address configuration is needed to run or deploy the site.

### Organisation colours in Data trail

COMMONROOM uses orange-red labels and LENS uses deep-blue labels, matching their respective screens. Names, explicit role descriptions and arrows accompany the colours. First/additional submissions show **Character → recipient**. Returned age results show **LENS → COMMONROOM**. The expanded process adds requested fields, actual evidence, assessment and the final platform decision. A refused or unavailable sample shows **No evidence sent** and has no evidence-transfer arrow. All transfers are derived from actual record events, not from every available method.

### Publish when ready

No publishing is performed by this revision. Two static-host options:

- Upload/deploy **the contents of `master_web/`** as the site root on a static HTTPS host. Build command: none; output directory: `master_web` if the host checks out the complete project. Include `data/` and `.nojekyll`.
- For GitHub Pages, create a website repository with **only the contents of `master_web/` at its root**, including `.nojekyll`. Commit/upload it yourself, then Settings → Pages → Deploy from a branch → select that branch and `/ (root)` → Save. GitHub Pages branch publication supports root or `/docs`, not an arbitrary `master_web` folder; an existing repository can instead use a custom workflow deploying that folder. These source-folder options are described in the [official GitHub Pages guide](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

After publishing, open the community, complete a visit, and open a fixed example URL directly on another device. No QR or base-URL setup is required. Check phone layout and print a card at 100% for cropping, small text and passport fit.

## Research gaps and revision record

See `docs/research-map.md`, `docs/change-log.md` and `docs/verification.md`. Needed for claims of real UI fidelity: dated UK declaration/consent notices, fallback screens, provider-readable fields, actual appeal entry/recipient/timing and retained process-record documentation. Fictional steps remain labelled until supported. No new real-platform mechanism is inferred from the prototype.

The supplied Figma link was inaccessible to the assistant in this revision. Visual changes follow the user’s specified warm-white/charcoal/orange direction, not a claimed inspection of that reference. The original source workspace had no `.git` metadata during the implementation review; the repository upload was prepared separately.

## Checks

```sh
node --check app.js
node --test tests/*.test.cjs
```

Optional browser verification (development-only dependencies):

```sh
npm install
# Run the local server separately:
npm run test:browser
```

Uses installed Chrome by default. `AVP_BROWSER_CHANNEL=chromium` selects Playwright Chromium; `AVP_TEST_URL` changes local server URL; `AVP_TEST_OUTPUT` changes the default `/tmp/avp-card-fit-qa`. The browser tests use the local server; fixed example pages are also checked with both browser storage APIs disabled.
