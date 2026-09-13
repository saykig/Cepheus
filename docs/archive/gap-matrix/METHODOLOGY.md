# Frontier AI governance evidence-coding methodology

This dataset is a dated comparative assessment of Frontier AI governance in the European Union, United States, United Kingdom, and China. Its evidence cutoff is 21 July 2026. Coding was performed on 22 July 2026. The four selected jurisdictions do not constitute a complete global measure.

## Separate records for sources, evidence, and assessments

`sources.json` is a bibliography. A source record describes a document, issuing body, date, jurisdiction, and legal character; its existence or length has no scoring effect.

`evidence.json` contains atomic factual propositions. Each record links to one source and identifies a locator, jurisdiction, direction, observation date, and limitations. Evidence records never contain component scores. A single source may support several evidence records, one evidence record may inform several components, and a component may require many evidence records.

`component-assessments.json` contains the ten ordinal judgments. Each assessment identifies supporting and counterevidence and includes four jurisdiction cells so that a single holistic score does not conceal major differences among the selected jurisdictions. Jurisdiction cells do not contain sub-scores and are not averaged.

## Applying a component rubric

Each component has its own five-anchor rubric in `scoring-rubrics.json`. Coders compare the combined evidence with the substantive conditions in those anchors and select the highest anchor whose core conditions are supported. A score is not calculated by counting sources, evidence records, institutions, legal provisions, or jurisdictions.

When the evidence falls between anchors, is materially incomparable across jurisdictions, or lacks coverage needed for the judgment, the component remains `pending` with a null score and null confidence. A provisional score requires supporting evidence, a rubric-based rationale, explicit limitations or counterevidence, and a non-null confidence judgment. Confidence describes evidentiary support; it does not alter the numeric result.

## Conflicting and global evidence

Evidence pointing in different directions is retained rather than filtered out. Supporting and counterevidence are recorded separately, and each jurisdiction cell summarizes the conflict and the limits of comparison. Corporate primary documents may establish facts about a company's own procedures, disclosure, operational decisions, or access arrangements, but company policy claims are not treated as independent proof that the wider governance system is effective.

Evidence marked `Global` is used only when it supplies relevant context. Its limitations must explain why the underlying population or geography may not represent the four selected jurisdictions. For example, Stanford's category of notable AI models is not relabelled as frontier models and cannot alone establish a frontier-governance condition in each jurisdiction.

## Aggregation and public status

Each axis uses five components with equal weights of 0.2:

`round(100 * sum(weight * score / 4))`

The internal result is null if any required component score is null. The public result is additionally withheld unless all five component assessments for that axis have status `reviewed` or `published`. The gap is knowledge concentration minus public authority and is public only when both public axis results are available. No derived axis result or gap is written back to the JSON files.

Mathematical aggregation makes the coding reproducible, but it does not make the result objectively value-free. Component definitions, rubric anchors, evidence selection, treatment of conflicting evidence, and the choice to make one holistic cross-jurisdiction judgment all involve documented methodological judgment.

Governance significance remains a separate tier-only metric. Its internal component calculation follows the same weighted formula, but the interface exposes only `low`, `moderate`, `high`, or `very high`; it never publishes an exact internal score.
