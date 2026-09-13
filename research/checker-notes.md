# Separate agent substantive checker notes

Reviewer: `codex-research-checker` (agent, not external expert). Evidence cutoff: 12 September 2026. This document records independent inspection, findings and corrections; it is **not blanket publication approval**. Material corrections by this checker require another reviewer. Owner editorial sign-off remains required for v1.0.

## Independently inspected core sources

- NIST, 29 August 2024, updated 4 May 2026: https://www.nist.gov/news-events/news/2024/08/us-ai-safety-institute-signs-agreements-regarding-ai-safety-research . Body paragraphs beginning “Today” and “Each company”: separate OpenAI and Anthropic access-framework MoUs announced. Announcement does not establish access to every model. The 2026 update's institutional re-establishment note does not renew an agreement.
- Joint Claude 3.5 report: https://www.nist.gov/document/us-aisi-uk-aisi-joint-testing-report-upgrade-claude-35-sonnet-111924 . Sections 1 and 2.1, printed pp. 1–2: independently run tests, shared methods/findings, limited access/testing period. This supports a historical, exercise-specific assessment of evaluation constrained by access duration. Counterevidence to blanket evaluator incapacity: demonstrated independent tests and methodological work. Section 2.2 says release 10 October while section 1 and model identifier indicate 22 October; retain source-internal discrepancy and conservative event upper bound.
- UK/OpenAI full MoU: https://www.gov.uk/government/publications/memorandum-of-understanding-between-the-uk-and-openai-on-ai-opportunities/memorandum-of-understanding-between-uk-and-openai-on-ai-opportunities . Introduction, section 4 and final paragraph: DSIT/OpenAI shared intent, proposed technical exchange expansion; voluntary and nonbinding. Publication 21 July 2025. No “General terms / signatories” heading exists on this document.
- UK/Anthropic full MoU: https://www.gov.uk/government/publications/memorandum-of-understanding-between-the-uk-and-anthropic-on-ai-opportunities/memorandum-of-understanding-between-uk-and-anthropic-on-ai-opportunities . Sections II–III and Signatories: **signed 13 February 2025**, published 14 February. Existing research collaboration acknowledged; future activities are intentions. Nonbinding; no procurement preference. Signing is not announcement date.
- UK/Google DeepMind full MoU: https://www.gov.uk/government/publications/memorandum-of-understanding-between-the-uk-and-google-deepmind-on-ai-opportunities-and-security/memorandum-of-understanding-between-the-uk-and-google-deepmind-on-ai-opportunities-and-security . General terms identify **Google LLC** and DSIT acting on behalf of Crown. Term is 36 months from last signature, whose date is omitted from HTML. Published 11 December 2025. Section 3 promises priority AISI access; this does not prove completed testing or compulsory information access.

## Affirmative 2026 MoU status evidence

- DSIT answer HL1108, 2 July 2026: https://questions-statements.parliament.uk/written-questions/detail/2026-06-18/hl1108 . Answer confirms work with OpenAI under the 21 July 2025 memorandum; last-confirmed activity, not uninterrupted September continuity.
- DSIT answer HL14421, 25 February 2026: https://questions-statements.parliament.uk/written-questions/detail/2026-02-09/hl14421 . Answer says DeepMind MoU implementation underway, early phases for many commitments. Explicit counterevidence to complete implementation.
- Anthropic, 27 January 2026: https://www.anthropic.com/news/gov-UK-partnership . Opening and engineering paragraphs link GOV.UK assistant development to February MoU. Engineers **will** work alongside GDS; independent maintenance is a goal, not accomplished independence or evidence of substitutable model service. Government corroboration: https://www.gov.uk/government/news/top-british-ai-expertise-to-help-spark-renewal-of-public-services-and-bolster-national-security . Neither establishes general public rollout or effectiveness.

## Anthropic / DoD conflict and analytical constraints

- Company position, 26 February 2026: https://www.anthropic.com/news/statement-department-of-war . Two exceptions and concluding paragraphs describe disagreement over contractual use conditions. Claims of mission-critical use require attribution/corroboration, not automatic dependence coding.
- DC Circuit order, 8 April 2026, case 26-1049: https://media.cadc.uscourts.gov/orders/docs/2026/04/26-1049LDSN3.pdf . **PDF page 4** (first page of attached per curiam statement), not page 3, records use, March determination, contract cancellation and begun removal. Stay denied without merits resolution. Later district judgment must be included.
- NDCal document 250, 27 August 2026: https://cases.justia.com/federal/district-courts/california/candce/3:2026cv01996/465515/250/0.pdf . Printed pp. 1–2 and 58–59: summary judgment on specified claims with exceptions; relief to issue separately. Printed p. 5: intelligence/defence use since 2024; Claude Gov used through partners since March 2025. Printed p. 6: restrictions contractually imposed, not technologically enforceable by Anthropic; provider lacks direct visibility into DoW use. This limits a remote-veto inference but does **not** prohibit dependency analysis based on lifecycle provision, identified functions and substitution costs. Printed p. 7 records procurement ceiling, not spending, and continuing contract discussions. A dated contested contractual interface is supported.
- DC consolidated case 26-1162 docket: https://dockets.justia.com/docket/circuit-courts/cadc/26-1162 . June 24 consolidation with 26-1049; latest listed brief 3 August 2026. Docket mirror explicitly last retrieved August 3, so cannot certify September finality. CourtListener docket retrieval failed for both DC and NDCal; record failure separately from unsupported search result.

## Initial canonical-data audit (before corrections)

1. `march-removal` locator must identify PDF page 4 / attached statement first page.
2. UK Anthropic relationship currently calls signature date announcement date. Separate signature/date precision from publication.
3. Several MoU locators use a generic heading absent from the actual source; replace with document-specific headings.
4. CAISI 2026 bulletin claims only evaluation agreements; `access-agreement` requires additional model-access evidence or a narrower predicate.
5. CDAO announcement uses organizational names and is not an executed contract. Precise legal awardee unresolved: procurement records should remain provisional until resolved or explicitly represented as announcement about named organizational counterparty.
6. All status checks currently contain a queued relationship query. Family search does not prove that queued query was executed. Do not approve a claim of completed per-relationship status verification on that basis.
7. Byte fingerprints and retrieval completeness remain publication checks. No approval is implied by the existence of these notes.

## Discovered scope candidates

NIST July 2026 Kimi K3 evaluation introduces Moonshot AI: https://www.nist.gov/news-events/news/2026/07/uk-aisi-caisi-preliminary-assessment-kimi-k3s-cyber-capabilities . Parent's release boundary excludes foreign developers outside US/UK/EU; log as discovered-out-of-scope rather than unsupported.
## Completed checker corrections (require root's independent recheck)

The checker has finished editing canonical collections at this pass: 29 sources, 56 atomic propositions, 29 observed relationships, 7 attributes and 3 analytical assessments. Every materially edited record with a coder field is marked `codex-research-checker` and remains provisional. These changes must not be approved by this same checker.

- Corrected `independent-tests`, `march-removal`, three UK MoU locators, UK Anthropic signing/announcement distinction and GDS future-tense engineering intent.
- Narrowed Google/Microsoft/xAI CAISI records to the new undirected `evaluation-agreement` predicate, because announcement alone does not specify actual access rights. Changed corresponding evidence and instruments.
- Replaced body-less AISI blog locator with the authoritative 9 February 2024 GOV.UK document: https://www.gov.uk/government/publications/ai-safety-institute-approach-to-evaluations/ai-safety-institute-approach-to-evaluations . `aisi-remit` and `uk-public-remit` now explicitly describe February 2024, not assumed September 2026 powers. The rubric's limited anchor means advisory authority in this context, not a little binding authority.
- Corrected UK succession provenance: https://www.gov.uk/government/news/tackling-ai-security-risks-to-unleash-growth-and-deliver-plan-for-change , heading and opening bullets, explicitly renames the institute on 14 February 2025. The 2024 approach document could not support this. Updated current institution name while retaining dated historical provenance; no agreements transferred.
- Added `dod-ai-strategy-2026`, signed 9 January (hosting path dated 12 January; publication date left null). https://media.defense.gov/2026/Jan/12/2003855671/-1/-1/0/ARTIFICIAL-INTELLIGENCE-STRATEGY-FOR-THE-DEPARTMENT-OF-WAR.PDF . Printed p. 4, AI Model Parity, directs vendor update cadence; printed p. 5, Clarifying Responsible AI, directs any-lawful-use contracting; p. 5, MOSA, directs modularity/third-party integration. These are policy instructions, not proof they were accomplished or every contract amended.
- Added court p. 17 §II.F propositions separating Anthropic's model provision, cloud/DoW replacement approval and the provider's inability to alter deployed static models. Added supplier's named functions and conditional transition offer from February 26 statement. Upgraded `dod-claude-control` to shared/constrained and `dod-reliance` to meaningful within specified context. Updated `dod-substitution` counterevidence and the contested/dependency assessments. None infers a realtime veto or procurement-based dependence.
- Added historical `uk-anthropic-fable-evaluation`: https://www.anthropic.com/news/fable-mythos-access , 12 June 2026, safeguards list second bullet, explicitly names UK AISI's prelaunch red-teaming. No exact test dates or independently inspected UK test report. Opening and compliance paragraphs document supplier-reported all-user Fable/Mythos suspension, expressly exempt other models. No unidentified US-government node added.
- Added September status context: https://questions-statements.parliament.uk/written-statements/detail/2026-09-07/hcws314 , paragraph beginning “Following the detection”, says AISI stopped relevant activity after its own incident and is strengthening evaluation security drawing on NCSC advice. It does not identify an affected supplier agreement or end all work. https://questions-statements.parliament.uk/written-questions/detail/2026-08-28/21385 retrieval failed; no proposition derived.
- Added important qualifications to two LLNL coding-client availability edges: https://hpc.llnl.gov/technical-bulletins/bulletin-608 , opening/Getting Started documents clients; Helpful Tips item 2 restricts default model endpoints to LivAI/LLamaMe. This does not prove provider-operated model service or a direct supplier contract.

## Substantive disposition of unchanged root-coded candidates

These dispositions assess source support, not final publication approval; the final hash, executed status checks and export integrity remain outstanding.

| Records | Substantive disposition |
| --- | --- |
| `openai-us-access`, `anthropic-us-access` | Announcement of model-access frameworks supported. Unknown continuity appropriate. May 2026 renegotiation cannot be assigned to either historical instrument without evidence. |
| Three 2024 US/UK Anthropic evaluation records | Historical exercise supported by full report. Independent tests are not necessarily independent test design. Exact test date and source-internal release discrepancy must remain explicit. |
| `anthropic-llnl-deployment` | July supplier announcement and August LLNL rollout support deployment; no causal effectiveness claim. July source's computational-biology bullet explicitly reports biosecurity support; do not infer proven outcomes. |
| `microsoft-uk-2026` | Microsoft's May 5 own-agreement announcement supports research/evaluation agreement, not completed tests. |
| Four `*-cdao-award` | Withhold publication pending exact legal counterpart resolution or defensible narrowed organizational announcement semantics. Official CDAO source lists brands, not all contracting entities. Court August p. 7 and Anthropic's own July14 article corroborate Anthropic award; others require exact awardee checks. Ceiling is not spending. |
| Five `*-eu-code` | Signatory listing supported; xAI only Safety and Security. Code signature is not demonstrated statutory compliance; register current version July31 is a dated observation, not assumed uninterrupted September status. |
| Three UK cooperation edges | Full MoUs and 2026 followups support formal intent plus dated implementation activity, not legal compulsion or full delivery. Checker made material evidence/date corrections requiring root review. |
| `caisi-gsa-cooperation`, `caisi-openmined-research` | March official MoU/CRADA announcements support exact named interfaces. No efficacy or authority inferred. |
| `dod-anthropic-contested` | Supplier position, April order and August judgment support dated contested interface. Separate statutory/designation tracks and postjudgment relief unresolved; do not call dispute finally settled. |
| `uk-sonnet-capacity`, `us-sonnet-capacity` | Historical exercise-specific substantial-but-access-constrained evaluation supported by independent tests plus documented limited period. Not an enduring institute-wide rank. |
| `uk-information` | Unresolved is appropriate: access duration in one voluntary episode does not establish all compulsory powers. |
| `uk-sonnet-access-constraint` | Narrow analytical result supported by the full joint report. Do not extrapolate to enduring provider dependency. |

## Positive analytical result and unestablished dependency conditions

The evidence supports a differentiated institutional structure: independently conducted public evaluation constrained by a documented access window; a contested contractual interface; recurrent defence use with named functions reported by its supplier; and divided consequential lifecycle control (provider provision versus operational customer's/cloud provider's gatekeeping). These are political-science findings, not merely an agreement catalogue.

Operational dependence is permitted by the rubric but not yet established for the specified DoD functions. Supplier necessity could arise without any remote shutdown capability. Here, no inspected source establishes function-specific need for continuing Anthropic provision or the cost/viability of substitute providers. The modularity policy and conditional transition offer are counterevidence requiring investigation, not proof of actual substitutes. `met: false` on those conditions means **not established**, not proven absent; UI and validators must preserve that distinction.

The source search included the March12 former-defence-official amicus https://clearinghouse-umich-production.s3.amazonaws.com/media/doc/174011.pdf , printed pp.8–11. It argues broader partnership harms but supplies no assessed replacement costs or function-specific substitute evidence. No dependency anchor was forced.

## Outstanding publication blockers

1. Root independently checks all checker-coded material corrections/new records and records their disposition.
2. Four brand-level procurement records remain provisional unless exact-party evidence is resolved.
3. Execute and log relationship status queries, including later conflicting legal accounts; queued queries are not completed checks. September3 secondary discovery reports continuing DoD designation and requires primary followup; August district judgment is not entire legal status.
4. Regenerate source fingerprints for four additions and changed AISI URL; inspect content, not merely hash an empty shell.
5. Review final canonical hash, coverage cells, review provenance and production export. No hash approved by this document. Editorial sign-off is still required for release manifest v1.0.

## Active function-specific substitution investigation (second pass)

The follow-up investigation is recorded in `data/dependency-investigation.json`; existing canonical collections were not changed in this pass. It logs executed searches, inspected documents, retrieval failures and a proposed **dated transitional-dependence assessment** requiring separate root review.

A previously missing primary link is decisive: the CIO's March24 Senate testimony ties continued operational use to a managed removal period. Original March6 memorandum permits transitional licenses/support under approved plans. These justify investigating dependence on an installed provider-specific capability independently of ongoing remote provider control. The candidate is bounded to March24 operational assistance, with no permanent or September continuity claim. Its inference is explicitly conditional on preserving current operations during replacement; it asserts neither an exact switching duration nor measured cost.

Counterevidence is retained: multiple-model architecture, official optimism about disruption, subsequent provider agreements, and frozen deployed copies. Anonymous association-member costs cannot establish a named agency's task-specific switching cost. The May19 service testimony leaves replacement cost assessment unfinished. A publicly tested substitute with verified workflow parity or evidence of completed migration would require revising this candidate for the applicable date and context.

This is a candidate analytical judgment, not publication approval or a new observed fact. A revised general rubric must distinguish transitional product dependence from ongoing-service dependence symmetrically across providers; do not rewrite the construct merely to guarantee an Anthropic finding.
