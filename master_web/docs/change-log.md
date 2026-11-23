# Edition 03 — implementation and AI assistance

17 November 2026. Local changes only; no push, publication or thesis edit.

## Preserved and extended

The existing forum, multi-page navigation, deterministic state machine, separate data trail, fixed QR routes, local slips, SVG download, print controls and folded passport template remain. The new content/rules source is `data/research.json`. The model is initialised from that JSON and shares `recordFields` across the screen, print and SVG.

The forum now visibly identifies UK, a single content gate, the fictional nature of the 18+ rule and the source-check date. Four demo accounts let visitors compare a first-check success with uncertainty, inability to submit and an unsupported fallback. These are account circumstances, not an unrestricted method menu. Profile selection remains separate from evidence selection.

New inability routes record an attempt with no face evidence and no estimated age. They are distinct from a submitted sample producing an inconclusive estimate. All routes finish with consistent fields, a text/symbol outcome and source/unknown identifiers. New visits clear the active profile and prior slips. Source statements about real deletion/results are visible alongside the authored scenario's gaps.

A cool grey/navy visual system replaces the green/cream presentation. System fonts remove automatic font-service requests. Cards and SVG share a 105 × 148 mm size and fit the revised passport entry sheet. Existing credentials are excluded from the main route. Public QR configuration stays empty until an actual hosting address is supplied.

## One complete research → design → code → encounter chain

1. **Research basis.** The supplied thesis draft §§4.4–4.6 distinguishes evidence processing from access control. S03 (Persona's Reddit FAQ) distinguishes an estimated age from a birthdate returned after a document check, and locates decision authority with the requesting business. S04 (Discord help) supplies a comparison involving additional methods. These are published descriptions, not measured performance or an operational audit.
2. **Design rule.** In account B, an inconclusive facial estimate leaves the selected discussion restricted. COMMONROOM offers an ID fallback, platform review or exit. The fixed sequence and sample values are fictional choices; they are not presented as a universal Reddit order or a failure probability.
3. **Implementation.** `research.json` defines `face_uncertain`, `document_accepted`, their separate requested/returned information, sources and tags. `model.js` permits the document stage only after an inconclusive/unavailable first step. Its `transition` adds the chosen events, `finish` snapshots the journey once, and `recordFields` derives the same receipt schema for all routes. A completed ID route is CR-02; the no-face-input equivalent is CR-09.
4. **Audience encounter.** A visitor wants to read a specific thread. Account A grants access after one estimate; account B must add an ID, ask the platform to review, or leave. The card makes the difference inspectable: evidence sent, recipient, estimate versus birthdate output, platform decision and attempts. Choosing review produces Pending rather than a promised correction. These are intended effects of the interaction, not findings from a participant study.

## AI assistance in this revision

The AI assistant inspected existing code/README/research notes and the cited primary pages, structured JSON, implemented the state-machine/data-source integration, added the inability route, aligned receipt fields and outputs, adjusted visuals and print dimensions, and wrote local automated checks and documentation. It also generated the fictional scenario wording and sample outcomes.

The assistant did not collect participant data, conduct interviews, run live verification, inspect internal platform systems, audit deletion, or establish real failure rates. It did not edit the thesis, push code or publish the site. Human authorship/review is still needed for the research interpretation, archived source collection, final visual judgment and public hosting/physical-phone validation. AI-generated simulations are labelled fictional; the shared-passport extension is labelled speculative.

# Edition 04 — audience-operated fictional submissions

This revision extends the same site rather than building a separate demo. It adds two preset adult characters, a constrained birthdate declaration, sample selection and explicit sending confirmation, illustrative/skippable processing, an ID-availability barrier and predefined review reasons. Earlier forum, outcomes, records, printing and QR configuration remain; CR example URLs retain archived meanings, while new FC codes identify fixed examples of character routes.

Research → rule → implementation → encounter: S01 provides the context of a requested birthdate, and S03 distinguishes an estimate from a document birthdate returned to a platform. The new input/confirmation sequence is authored rather than claimed as an exact reproduction. The design rule separates choosing/typing from sending. `transition` validates the chosen character's supplied date and requires explicit confirmation for declaration, face and ID; character C-02 cannot select an accepted sample. `requestedNotProvided` subtracts actual submitted methods from reached requests. `pack` serializes only whitelisted IDs/enums/flags. The visitor can type or autofill, inspect recipients, refuse an additional disclosure, choose a review reason, then see that unsent materials are absent from Provided.

The AI assistant implemented these local interactions, the abstract SVG samples, deterministic scripts, state serialization/reconstruction, record comparison and tests; it updated the documentation. The fictional names, birthdates, document availability, confirmation text and reason choices are authored scenario content. No real faces/IDs were collected or analysed. No participant study, live verification, deletion audit, publication or thesis edit was performed. Sources for actual field/consent/alternative/review UI fidelity remain to be supplied.

# Edition 05 — discussion access, disclosure pauses and paper return

23 November 2026. Local revision of the same project; no thesis edit, push or publication. The workspace contains no Git metadata, so branch identity could not be checked. The supplied Figma reference could not be read; the requested palette and page directions informed the visual revision.

The forum now gates full discussions/comments consistently, preserves visible previews, and reopens the originally selected discussion after success. Declaration and ID each use a single explicit submit form; the face sample stays in one component from selection to sending. The handoff identifies fictional provider LENS and its assessment role separately from COMMONROOM’s access decision. The uncertainty pause, no-ID barrier, review and refusal routes remain. Shorter visitor copy moves codes and research qualifications into expandable details. Warm-white/charcoal pages, orange actions, restrained LENS styling and paper stamps replace the blue system.

Data trail leads with outcome and actual added disclosure. Submitted-check counts exclude declarations and unavailable attempts; printed cards label attempts separately. The same actual-event fields feed Passport/print/SVG, including unprovided requests. QR logic now appears on the access result as well as the card. With no deployment address supplied, every output shows a publication notice; a configured public HTTPS base enables genuine scenario-specific QR SVGs. Test fixtures do not change that configuration.

Research → design → code → experience example: S03 distinguishes the provider’s estimated-age output from the birthdate returned after a document check and identifies the requesting business’s decision role. The design keeps these outputs distinct and preserves a pause before requesting richer evidence. `research.json` defines separate fictional face/ID events; `model.js` derives disclosure fields from actual submissions; `app.js` renders the ID request with LENS recipient fields, platform response and review/exit actions. Alex can add ID data; Morgan can remain restricted or Pending without manufacturing a document. A printed record shows what each actually sent. The specific estimate, uncertainty, accepted-ID rule and order are fictional design choices, not observed platform thresholds or real failure rates.

AI assistance covered inspection of existing code/research notes, copy and visual revision, form consolidation around the existing state machine, per-discussion permissions, outcome summaries, QR integration, local automated browser/print checks and documentation. It did not perform age analysis, collect personal data, establish real retention/accuracy, conduct participant research, see the inaccessible Figma, deploy or test a physical phone/print. Source interpretation and the final public exhibition need human review.

# Edition 05 follow-up — no QR, visible organisation roles

23 November 2026. At the artist’s request, removed QR output and scan/publication messages from result, Passport, print, download and the folded template. Removed the QR scripts, public-address config, bundled encoder, decoding dependency and obsolete QR tests. Older entries above describe historical revisions, not the current feature set. Fixed scenario pages, numbers, local slips and paper dimensions remain.

LENS now has a navy service identity. Data trail uses orange-red COMMONROOM labels and deep-blue LENS labels, with names and arrows so meaning does not depend on colour. Submitted evidence is shown separately from results returned to COMMONROOM. Refused/unavailable materials never receive a submission arrow. Provider stages and platform access decisions have distinct timeline markers. The underlying journey rules, evidence fields and storage format are unchanged.

Research → design → implementation → encounter: the thesis distinguishes source evidence from the age result returned to the platform, and provider assessment from platform control. The interface assigns each organisation a consistent colour and names both endpoints of real simulated transfers. `disclosureSummary` and `timeline` read actual `events`, excluding unsubmitted materials. Visitors can follow Character → LENS → COMMONROOM and see that the final access decision belongs to COMMONROOM. This is visual explanation of the fictional model, not a claim that the prototype audits a real service.

AI assistance covered local removal of the QR feature, scoped provider styling, organisation-labelled event rendering, regression checks and README updates. No thesis changes, publication, real identity processing or participant evaluation were performed.

# Card authority and passport fit revision

23 November 2026. Card labels now distinguish LENS assessment and returned age results from COMMONROOM’s access decision and review status. Birthday declarations state that they were not independently checked. Review has its own Not requested / Not submitted / Pending field; choosing a reason alone never generates a submitted review. Consecutive result descriptions use “later” to avoid suggesting that an estimate turns into a birthdate. Fictional/no-real-assessment notices appear in screen, print and download. The same shared model fields feed all outputs.

The nominal card remains 105 × 148 mm. The old passport placeholder was only 40 mm high. It is replaced by a 109 × 152 mm placement area with a centred 105 × 148 mm outline, leaving approximately 2 mm per edge. The cut spread is 260 × 182 mm and folds to 130 × 182 mm on a single landscape A4 print. The placement outline uses grid centring: absolute percentage positioning was found to shift in PDF pagination and create an extra page, so it was removed. PDF page-count verification now catches that failure.

Research → design → implementation → experience: the thesis separates evidence assessment from access control. Authority-labelled card fields and corresponding institution colours make that separation inspectable on paper. The digital record and card use the same actual submission events, while a Pending review remains separate from approval. This revision adds no real verification, personal data or account service. AI assistance covered implementation, geometry measurement, automated checks, PDF inspection and documentation. Physical printing, cutting and insertion remain to be tested by the artist.
