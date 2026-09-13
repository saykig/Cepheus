# Institutional relationships: research pilot v0.1

Prepared 12 September 2026. This replaces the institutional map's illustrative
weights with inspectable, dated relationship records. It is an exploratory
research design, not a comprehensive or independently reviewed dataset.

## Question and unit of analysis

Who is connected to whom, by which documented mechanism, in which domain and
period? A record describes one relationship between two named institutions,
through an identified instrument or event. Different mechanisms between the
same institutions remain separate records.

The initial purposive sample covers five institutions and six relationships in
US/UK model access, evaluation and research deployment. Sources describe events
in 2024–2025; the latest substantive deployment source is dated July 2025. The NIST announcement also carries a later institutional-name notice, not a new access event. Sources were
consulted on 12 September 2026. This is a historical sample, **not a current
network as of the consultation date**. No claim of geographic, institutional or
domain completeness is made. A missing edge means not documented in this sample.

## Institutions, domains and mechanisms

Nodes are named organizations or identifiable organizational units. A unit such
as US AISI is attributed to NIST in its record. Historical names are displayed
with their period; institutional succession does not silently transfer an old
agreement to a new entity. Universities as a collective, industries, and policy
fields are not institution nodes. A specific university or laboratory can be.

Domains are overlapping tags attached to relationships, not exclusive buckets:

| Domain | Inclusion rule |
| --- | --- |
| Biosecurity | The source explicitly relates the mechanism to biological risk, protective research or biosecurity evaluation. Biology alone is insufficient. |
| Cybersecurity | The source explicitly relates it to digital security, cyber risk or cyber capability evaluation. |
| Cross-domain AI | The mechanism addresses general-purpose models or evaluation across risk domains. Not a substitute for all unspecified records. |

Defence, civilian public services, and research are **use contexts**, stored
separately from domains. Military use can intersect cyber or biosecurity, but
does not imply either. Nuclear/radiological safety, infrastructure, health and
autonomous weapons need their own inclusion rules if later evidence warrants
them. They are research candidates, not empty decorative filters in the pilot.

An institution inherits visible domain membership only through a visible edge.
Two organizations' membership in the same programme does not automatically
create a bilateral collaboration between them.

## Evidence and admission

The public data directory contains separate `sources.json`, `evidence.json`,
`institutions.json`, `instruments.json` and `relationships.json` records.

1. Record a primary document's publisher, URL, publication/revision dates and
   consultation date. A bibliography entry alone is not evidence for an edge.
2. Extract a narrow factual proposition and a stable locator (section, paragraph,
   article, page or table). Record what the source does not establish.
3. Identify both institutions and the mechanism. Separate a public announcement
   of an agreement from evidence that an evaluation or deployment occurred.
4. Code domain, context, jurisdiction, direction and temporal status; explain
   those choices in the relationship's rationale. Link supporting and conflicting
   evidence. An empty counterevidence list means none recorded, not none exists.
5. Mark the record `provisional`. Independent checking may promote it to
   `reviewed`; this initial release has not received that review.

Government notices can support announcements and completed public activities.
Company statements support **company-reported** activities, not independent
findings of effectiveness. Contracts, legislation and full evaluation reports
are preferred for their underlying terms. A source must name the parties and
mechanism; merely discussing them together is insufficient. Unsupported
candidate links stay in the research backlog, outside the rendered graph.

## Direction and meaning

| Relation | Meaning of the arrow / line |
| --- | --- |
| Model access | Model provider → recipient of access. |
| Evaluation | Evaluating institution → model provider whose system was evaluated. |
| Research deployment | Supplier → institution reported to be using its system. |
| Joint evaluation | Undirected: named institutions conducted a shared exercise. |

These predicates are descriptive. Procurement does not prove dependence;
dependence would require separate evidence of an operational requirement and
the constraints on substitution. Evaluation access does not establish
regulatory authority, and a voluntary standard does not establish a compulsory
obligation. No pilot edge measures authority, influence, effectiveness or risk.

Instruments appear in the selected edge's evidence panel, keeping the main map
legible. A future instrument-node view must preserve the original relationship
ID so one relationship is not counted twice merely because it is drawn in two
segments. An MoU is not assumed binding without its terms.

## Time, status and uncertainty

`announcedOn`, `observedBy`, `effectiveFrom`, `effectiveTo` and
`currentStatusCheckedOn` are distinct. Unknown dates are `null`, never filled
with publication dates. A null end date does not mean an ongoing relationship.
`eventStatus` describes the documented event (announced, conducted or reported
deployment); `currentStatus` is separate and is `unverified` for this pilot.

Evidence basis is shown as official notice, joint report or company report.
We do not assign numeric confidence. Review status describes checking, not the
strength or importance of the relationship. Disputed or superseded records
must retain their history and counterevidence; do not silently overwrite them.

## Display and reproducibility

The interface joins records by stable IDs, filters relationships by domain,
then displays their endpoints. It does not aggregate scores. Every edge opens
its mechanism, dates, evidence basis, provenance, locator and limitation.
All provisional records are labelled as a research pilot. Missing referenced
records, invalid directions and unsupported edges fail validation.

Nodes have equal size; lines have equal weight. Arrow direction follows the
predicate above. Dashed versus solid lines distinguish model access from other
mechanisms, with labels available on focus and selection. Color indicates
selection only. Positions are manually arranged for readability in a separate
layout file; position, distance and centrality have **no measured meaning**.
Multiple mechanisms between the same parties receive separate curves.

Read the source → evidence → relationship chain in the JSON files. Run
`npm test` for referential, temporal, scope and publication invariants, and
`npm run typecheck` for the consuming interface. These checks cannot determine
whether a source supports a claim: that requires substantive review.

## Expansion plan

First review the six pilot links against the underlying MoUs and evaluation
report, then check present status and institutional succession. Next add a
documented civilian cybersecurity collaboration, named academic partners and
a defence procurement case. For each, record alternative explanations and
scope before adding it to the graph. Expand jurisdiction coverage deliberately;
do not fill a desired visual shape by selecting convenient sources.

Rejected automatic migrations: the legacy CISA → OpenAI reporting requirement,
NATO DIANA → OpenAI partnership and Universities → Anthropic research partnership
have no edge-specific evidence in the old dataset. Their absence here is not a
finding that those relationships do not exist.

## Paused measurements

The Gap Matrix, Friction Index and capability/capacity chart are removed from
essay rendering in every environment. Their code and data are archived with
recovery instructions. The existing gap-matrix evidence work is retained as
reference research; its ordinal-to-100 aggregation is **not adopted** here.
No axis score, inferred historical series, balance line, ranking or numerical
dependency strength is generated by this methodology.

## Changelog

- v0.1, 12 September 2026: five named institutions; six dated relationship
  records from three primary sources; domain/context separation; source-level
  disclosure; legacy visuals paused. All substantive coding remains provisional.
