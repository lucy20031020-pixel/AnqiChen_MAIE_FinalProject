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

## Exhibition entrance checks — 27 November 2026

The revision is compared with the saved submitted version: `model.js` is byte-identical; the original stylesheet is preserved as a prefix with only new scoped entrance rules appended; the research JSON changes only the community display name. Scenario definitions, birthdates, document availability, methods, outcomes, storage key/format and paper dimensions are unchanged.

- Introduction has the supplied four paragraphs, one main entry link, no step navigation and no character form. Keyboard activation opens the reading-group invitation. Merely viewing the introduction/invitation does not create a draft check.
- Invitation shows the original reading-group title/body and the 16-reply action. Replies are absent until Granted. That action opens one existing character form with the supplied COMMONROOM age-confirmation sentence.
- The 23 existing interactive routes now run with the reading-group post. Granted reveals the sample reply; Pending, unresolved and exit routes show closed replies. Sidebar, Data trail and card retain the actual selected title. All record values still match the restored state.
- Other discussions remain accessible; a separate original discussion can still be opened, checked and reopened after success. Returning to the invitation after success does not submit new evidence.
- Reset clears all previous visit state using the original mechanism and returns to the introduction. Refresh and previous compact-state/privacy assertions remain covered.
- Desktop and 390/320 px entrance/invitation, original LENS screens, outcome, records, SVG downloads, all active print cards and the single-sheet passport template remain covered. No runtime QR or camera/upload behaviour is added.

Browser artifacts for this revision: `/tmp/avp-exhibition-qa`. Local browser checks do not replace a physical exhibition/print test. No deployment or remote push is performed by this entrance revision.

## Full community feed follow-up — 27 November 2026

- Introduction first paragraph and **Open the COMMONROOM** link are checked; the other three paragraphs, intro layout and original colours remain unchanged.
- Both plain community URLs and legacy `?post=zine` URLs show all original posts. Ordering is reading group, archive, night workers. Exact titles, previews, counts and the reading-group invitation body match the unchanged JSON data. The supplied recommended-visit label and sentence appear once above the first entry.
- Browse discussions targets the complete `#discussions` feed. Visiting the community does not start a check.
- Reading-group, archive and night-worker entries are exercised separately. Each check sidebar, successful result, Data trail and card retains the selected title. No other discussion is substituted with the reading group. Existing Pending/exit/unresolved and successful routes remain covered.
- Mobile 390/320 px community pages include the whole feed; reset still returns to the introduction and clears the same stored state. Model, research data, existing stylesheet rules and paper dimensions remain unchanged.

Artifacts: `/tmp/avp-all-posts-qa`. This is local browser verification, not a new participant evaluation or deployment.

## Real passport photo and simplified sidebar — 27 November 2026

- The original JPEG at source_pic/physical_passport.jpg is 3338 × 5012 px. The supplied caption and alt text are exact. Chrome confirms successful decoding, original aspect ratio, contain sizing, desktop side-by-side placement and mobile stacking at 390/320 px. Screenshots were inspected.
- Local static previews with both a site root and /master_web/ subdirectory return the image with HTTP 200 and image/jpeg content type. Response hashes match the original file. The relative image URL resolves correctly in both configurations.
- The sidebar has no membership/presence counts. The community entrance retains UK and the fictional 18+ rule, but no source-check date. Research behind this experience still displays the unchanged source date.
- Open the forum retains the original community.html destination. All three posts, selected-post records, 23 existing check routes, reset, 50 model tests, mobile and print/download checks still pass. No model or research-data change was required.

Artifacts: /tmp/avp-passport-photo-qa. These are local static previews; no real online deployment or physical-phone network test was performed. Recheck the live image after publishing the updated code and source_pic folder.

## Disclosure consequences and character comparison — 27 November 2026

- 53 passing model tests, including the exact declaration-only stop narrative; submitted face/ID/review flags; unavailable-ID versus voluntary withdrawal; and clean switching in both directions while preserving post/profile. Existing scenario outcomes remain unchanged.
- All 23 existing interactive routes complete with matching summaries on result, Data trail and Passport. These are checked against the actual restored event history. Print fields are compared with the same actual record; unsent IDs and samples remain absent from Provided.
- The face-confirmation buttons have equal measured width/height and matching foreground/background styles. Provider and adult/stop wording match the supplied text. Screenshots were inspected.
- A real Stop here click after selecting but not sending the image retains only the declaration. Existing post-image stop, additional-ID success, no-ID unresolved outcome and Pending review routes remain covered. Missing ID is not automatically marked Withdrawn.
- The artist’s comparison question appears after the card. The first card is printed before switching. The new character retains the discussion and profile, starts at the declaration with no events/records/reason/samples, and survives refresh without restoring old values. The old card URL is no longer available from the cleared state. C-02 can request a Pending review without acquiring an ID, print that card, then switch back to a fresh C-01 visit.
- Existing 390/320 px layouts, selected-discussion titles, source date placement, original photograph, reset, all fixed examples, print-card dimensions and one-sheet passport export remain checked.

Artifacts: `/tmp/avp-disclosure-qa`. These are local functional/layout checks, not participant or real-service evaluation. No live deployment was performed.
