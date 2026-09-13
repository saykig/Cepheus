# Institutional links — research and publication protocol

Release candidate for evidence through **12 September 2026**. The release manifest
retains `1.0.0-rc.1` until the owner signs off on the reviewed research fingerprint.
Agent checking is disclosed; it is not external expert review.

**OBSERVATION IS NOT ANALYSIS. ANALYSIS IS PERMITTED. ANALYSIS MUST BE TRACEABLE.**

## Research question and boundary

How are technical control, public authority, evaluation capacity, information
access and operational reliance distributed across a bounded set of frontier-AI
institutions, and through which documented interfaces do they interact?

The observation period is 1 January 2024–12 September 2026. The primary geography
is the US, UK and EU. Earlier sources may establish institutional context but do
not automatically create an in-period relationship. The systematic search floor
is Anthropic, OpenAI, Google/Google DeepMind, Microsoft and xAI across six families:
US public evaluation, UK public evaluation, UK strategic cooperation, US defence,
EU compliance interfaces and LLNL research/deployment. `data/coverage.json`
records all 30 cells and evidence-triggered additions. This is not a global census.

Admit named providers, public institutions or research organizations only where
an inspected source explicitly establishes participation in an admitted interface.
Do not add organizations for symmetry. Organizational units are identified as
units; contracting entities are not silently replaced with product brands or
parents. An announcement naming an organization may support an organizational
agreement record with the legal signatory explicitly unknown. A contract-award
record requires resolved awardee identity. Generic category nodes are prohibited.
Co-membership in a programme cannot establish bilateral collaboration.

## Three distinct units of analysis

1. **Observed interface:** named endpoints connected by a documented instrument
   or event. Preserve source → atomic proposition → instrument → relationship.
   Announcement, agreement, actual access, testing and deployment are different
   observations. Relation definitions and arrow rules live in `relation-types.json`.
2. **Coded attribute:** an institution in a specified function, jurisdiction and
   period, assessed under an explicit construct definition and ordinal rubric.
   `attribute-rubrics.json` defines authority, information access, evaluation
   capacity, technical control, substitution and operational reliance. Anchors
   are author-defined qualitative judgments, not validated numerical measures.
   Adjacent anchors that cannot be distinguished remain unresolved. No ordinal
   anchor is converted to an interval, a total, a ranking or a time series.
3. **Analytical relationship:** a scoped finding with a published derivation rule,
   necessary conditions, input relationships/attributes, evidence, counterevidence
   and limitations. The conjunction of the specified conditions must support an
   established result. An unresolved assessment can publish as unresolved; it
   does not establish independence or absence of the hypothesized relationship.

Contractual restrictions, technical control over provision and deployment, and
operational dependence are separate constructs. A restriction is not a remote
kill switch. A deployed static model can remain technically controlled by its
operator while its replacement, continuing licence, support or new capabilities
involve a provider. Dependence need not involve a remote veto. It does require an
identified operational function and consequential constraints on substitution,
within an explicit time horizon. Procurement alone is insufficient. Conversely,
the absence of a remote veto is not sufficient to disprove dependence.

The dependency investigation actively searches contracts, government testimony,
migration requirements, switching costs, available alternatives and unique
capability requirements. General contractor burdens cannot silently be assigned
to a named military function. A promise of alternatives is not demonstrated
functional equivalence; a transition period is not permanent irreplaceability.
Findings may be narrowed to divided control or recurrent reliance when evidence
cannot establish the stronger result. Rubric changes are disclosed and reviewed,
not made silently to secure a desired conclusion.

## Sources and atomic evidence

Prefer legislation, contracts, full agreements, evaluation reports and official
institutional publications. Company documents support facts about that company's
arrangements, with attribution and limits. Secondary reporting discovers or
corroborates claims; it does not replace a usable primary source. A court judgment
is primary even when retrieved from a document mirror; distinguish its findings
from allegations in filings and from another case's procedural status.

Each proposition records a source version and a stable section/page/paragraph
locator, the narrow claim and what it does not establish. Sources retain
publication, revision and retrieval dates separately. `source-versions.json`
records a SHA-256 of retrievable bytes or an explicit capture failure. A byte hash
identifies the retrieved representation, not a guarantee that a mutable website
will retain it. A blocked byte capture does not erase independently inspected
text, and is visibly disclosed. Sources without usable content cannot support a
published proposition. A stable document locator plus recorded version is required.

Material conflicts require a recorded disposition. Do not delete a contradiction
because a newer source is more convenient. For example, the August 2026 district
ruling corrects claims about contractual versus technical control and specific
legal outcomes; it does not settle separate litigation or disprove every possible
dependency. Later source versions cannot establish earlier wording automatically.

## Time, status and institutional succession

`announcedOn`, `observedBy`, effective dates and status-check date are distinct.
Unknown dates remain null. Publication dates can bound an observation but must
not be presented as the unreported test or contract date. Explicitly record day,
month or upper-bound precision. Never infer current activity from a null end date.

For every admitted relationship inspect both-party records and relevant indexes;
search amendments, implementation, expiry, termination, restrictions, succession
and conflicting accounts through the cutoff. Store executed queries, inspected
sources and unresolved gaps in `status-checks.json` and the search logs. “Last
confirmed” is a dated observation, not uninterrupted continuity. Allowed results:
active/current; ended/expired; superseded; terminated; historical event only;
unresolved/unknown. Active/current requires affirmative evidence of continuity.
Historical events remain inspectable even if access later ended. Where later
restrictions do not name an affected agreement, do not transfer them to every edge.

`succession.json` distinguishes renaming from replacement or re-establishment.
Old agreements do not automatically transfer to successors. A transfer needs its
own evidence. Historical US AISI and CAISI remain distinguishable; functional
cluster placement does not resolve legal or institutional succession.

## Coverage and uncertainty

Search each developer–family cell on both parties' domains and inspect relevant
publication/register pages. Preserve exact executed queries, discoveries,
inspections, exclusions and retrieval failures. Search-result URLs are discovery
logs, not a claim every returned page was inspected. Cell “searched—supported”
means a candidate interface was found, not automatic publication. “Searched—
unsupported” means the executed search did not establish an admissible interface;
it does not establish absence. “Blocked” means an unresolved access or identity
barrier prevented completion. A cell can contain supported records and additional
blocked candidates. The release displays limitations rather than a completeness
percentage. Substantive expansion requires a recorded reason and triggering evidence.

Domains are non-exclusive relationship tags: biosecurity requires explicit
biological-risk/protective research evidence; cybersecurity requires digital
security/cyber-risk evidence; cross-domain AI concerns general-purpose models or
cross-risk arrangements. Defence and public services are use contexts, not
invented research domains. The primary visual has no decorative domain filters.

## Review and release gate

The workflow is candidate → provisional → reviewed → published, with rejected
and withdrawn states retained. A separate checker examines source support,
endpoint identity, predicate/direction, date/status, rubric anchoring, analytical
derivation, counterevidence and limits. The coder cannot approve their own record.
When the checker materially recodes a record, the original coder independently
checks that corrected record. Reviewer identity and human/agent type are public.

Approvals bind a canonical SHA-256 of the material research collections, including
search and status logs. Publication-state changes do not change the evidence hash;
evidence, reasoning, source version, scope or rubric changes invalidate approvals.
This deliberately conservative whole-research hash may require rechecking more
records than a per-record dependency graph would. No automatic “approved” field
is generated merely because schema validation passes.

Only published records enter the visualization, with dependency closure enforced.
Reviewed unknowns may publish when their uncertainty is explicit. The candidate
repository may contain unreviewed material. The owner must approve the current
fingerprint before `release.json` becomes `1.0.0`; neither agent review nor passing
software tests substitutes for that editorial decision. The public methodology
link is pinned to a commit containing this protocol.

## Visual grammar and audit

React renders equal-size institutional marks from deterministic coordinates
produced by D3 during export. There is no runtime simulation, link force, charge
or centrality calculation. Functional clusters are public decisions, model
developers and evaluation/research; they are categorical and not mutually
exclusive political identities. Position, distance, circle size and line width
measure no quantity. One contextual mechanism is foregrounded; exploration
normally shows no edges. A separate annotation identifies analytical findings.

Explicit essay markers select six states: opening, public decisions, interfaces,
technical knowledge, provenance and exploration. Ordinary scrolling and a small
IntersectionObserver implementation suffice; Scrollama adds no required behavior.
The evidence routes preserve the full chain from an analytical finding through
attributes and observed interfaces to exact sources. Keyboard selection and
non-hover evidence access use the same model as pointer interaction.

## Reproduction and limits of validation

Run `pnpm research:validate`, `pnpm test`, `pnpm typecheck`, `pnpm research:export`,
`pnpm build` and `pnpm test:e2e`. Ajv checks structure; TypeScript validation checks
identity, provenance, date/status, publication and analytical invariants. Negative
fixtures reject co-mention edges, automatic dependence/authority/compliance,
successor inheritance, unreviewed publication, stale hashes and synthetic scores.
Substantive source support cannot be proved by a schema: separate inspection is
required. UI testing covers story transitions, audit routes, keyboard operation,
responsive reading, reduced motion and axe accessibility checks.

The original v0.1 is preserved in `releases/v0.1/`. Retired Gap Matrix research is
methodological history only: none of its ordinal-to-100 conversions, synthetic
series, rankings or numerical dependency weights enters this object.
