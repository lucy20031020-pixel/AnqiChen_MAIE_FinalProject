# Verification — organisation-colour and paper-record revision

23 November 2026. Local isolated Chrome, fictional samples and repeatable examples. No publication, real verification, participant evaluation or physical print test is claimed.

## Current checks

- 50 passing model tests: 37 fixed current/archived outcomes, supplied-date validation, evidence/refusal rules, no-ID enforcement, compact storage and refresh reconstruction, idempotent records and submitted-check counts. Three obsolete QR tests were removed with the feature.
- 23 interactive routes through the real forms: both fictional adults, first-check success, uncertainty, unavailable sample, accepted-ID fallback, no accepted ID, review/Pending, refusals and early/later exits. No submitted record is inferred from merely choosing a sample.
- Every route’s Data trail is compared against its actual event history. Evidence arrows appear only for submitted materials. Provider-return arrows appear only for submitted LENS events; declined or unavailable evidence is labelled Nothing / No evidence sent. The visible returned-result list has exactly the actual LENS assessments. COMMONROOM and LENS have distinct colour values and explicit names.
- Passport fields match restored records, including LENS assessment/output, COMMONROOM access/review, unverified birthday declaration, and unsent review status. All 23 print cards retain 105 × 148 mm dimensions without measured overflow. Every downloaded SVG retains the model field values and contains no QR geometry or scan message. Results, Passport, print and download no longer load or render the removed feature.
- Both supplied characters, autofill/manual birthday input, invalid-date clearing, missing selections, keyboard submit, refresh, review reason, processing skip and reduced-motion support remain functional. Refresh does not duplicate a submission. Reset clears the current packet plus older prototype keys.
- Original-discussion access is retained on success and previews remain after exit. Fixed examples and invalid-ID states work with browser storage disabled. All 37 examples are checked at mobile width. Interactive screens and records are checked at 390/320 px without horizontal overflow.
- The existing navy LENS identity remains confined to provider stages; COMMONROOM and Passport keep the warm palette. Organisation names and arrows accompany the new colours, including in the mobile layout.
- Automatic request audit contains only same-host GET requests. No forms, external tracking, uploads, camera, login, identity API or remote image service is used. QR scripts, decoder dependency, bundled vendor assets and PUBLIC_BASE_URL config were removed.

## Paper and visual inspection

Success FC-02, Pending FC-11, no-evidence Pending FC-17 and the folded passport template were exported to PDFs. The cards keep their border, fields, symbols, scenario IDs and fictional-work notice; navigation/buttons are hidden in print. The obsolete QR area and publication placeholder are absent. SVG downloads remain 105 × 148 mm. Institution labels are coloured and long labels wrap into their own column. All 23 downloaded SVG roots were independently checked for 105mm / 148mm attributes; rendered text bounding boxes remain inside the card border and label text stays clear of the value column.

The updated passport PDF is verified as one landscape A4 page. Measured spread: 260 × 182 mm; placement area: 109 × 152 mm; inner card outline: 105 × 148 mm; outline inset: about 2 mm on each edge. Layout measurements are stored in paper-dimensions.json. The nominal folded size is 130 × 182 mm. The entry page has no measured content overflow. The old 40 mm placeholder and a PDF-only positioning overflow were corrected. The browser regression now asserts the full card border dimensions and the passport PDF page count, not just on-screen geometry.

Screenshots of the colour-labelled timeline, QR-free Passport and rendered Pending print card were inspected. COMMONROOM and LENS label contrast ratios are 5.99 and 8.92; successful, review and no-evidence fixed examples were additionally checked at 320 px. Original materials, returned age information and final access are presented separately. Unsent material has no evidence-transfer arrow.

Physical printer scaling, small type, cutting, folding and passport fit still need a real 100% print. Mobile browser emulation is not a physical-phone evaluation. The representative text-contrast and keyboard checks do not constitute a complete accessibility audit.

## Reproduce

Use README commands to start the static server, then `node --test tests/*.test.cjs` and optional `npm run test:browser`. Browser artifacts are in `/tmp/avp-card-fit-qa`: screenshots, 23 SVG card downloads, selected card/passport PDFs and network-audit.json. Tests do not publish the site. No public base-URL configuration is needed.

Real-service accuracy, deletion, review timing, failure probabilities and exact live consent/fallback UI are outside these tests. Research source gaps remain documented separately.
