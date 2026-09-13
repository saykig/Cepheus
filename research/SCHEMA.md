# Institutional research record contract — 1.0.0-rc.1

The executable contract is `schema/dataset.schema.json` plus the TypeScript semantic validator. `data/` is canonical; `public/data/institutional-map/bundle.json` is generated from the separately approved publication closure. Source metadata, atomic propositions, events/interfaces, qualitative coding, and analytical conclusions are separate collections.

- `sources`, `source-versions`: exact document identity/version/locator, retrieval outcome and available byte fingerprint. Failed byte capture is disclosed, never replaced with a invented digest.
- `evidence`: one narrow directly supported proposition, source/version/locator, limitation and coder.
- `institutions`, `instruments`: named parties and mechanisms, source identifiers, identity limitations, coder and publication state.
- `relationships`, `relation-types`: exact endpoints, direction rules, observed mechanism, supporting/counterevidence, date precision, event/current status, status check and limits.
- `status-checks`, `status-search-log`, `succession`: explicit dated checks and queries; continuity and succession require evidence, not null end dates.
- `institution-attributes`, `attribute-rubrics`: construct, unit, context/date, ordinal anchor or unresolved, evidence/counterevidence, reasoning and limits. Ordinal anchors have no interval meaning.
- `analytical-relations`, `analytical-rubrics`: independent analytical types and derivation conditions, linked observations/attributes, support/counterevidence, necessary/sufficient conditions, outcome and limits.
- `coverage`, `search-log`, `dependency-investigation`: 30-cell search floor and evidence-triggered expansion, actual queries, inspected sources, exclusions and retrieval failures.
- `reviews`: separate agent/human identity, record-specific disposition and approval fingerprint. No self-review. A material change invalidates approval.
- `release`: evidence period, candidate version, pinned methodology commit, editorial sign-off and public closure.

Missing values stay null/unresolved. Publication transitions are candidate → provisional → reviewed → published, with rejected/withdrawn alternatives. An adequately reviewed unknown may publish. Material inputs are canonically hashed, excluding publication-state transitions; the final manifest may become 1.0.0 only with owner sign-off bound to the current research fingerprint.

The build computes fixed categorical D3 collision layout from sorted published institution IDs. All visible marks are equal sized. Neither distance nor size encodes institutional importance, authority or dependence. Story references must resolve to published records. The archived v0.1 contract is historical and is never used for production.
