import { EssayIndex } from './essay-index'
import { InstitutionalLinkMap } from './institutional-link-map'
import { essayDrafts } from 'app/lib/essay-drafts'
import { essayLabels } from 'app/lib/essay-copy'
import type { Locale } from 'app/lib/i18n'

type DraftLocale = Exclude<Locale, 'en'>

export function LocalizedEssayDraft({ locale }: { locale: DraftLocale }) {
  const labels = essayLabels[locale]
  const draft = essayDrafts[locale]
  const sections = [
    { id: 'first-collision', title: labels.firstCollision },
    { id: 'what-is-expected-of-us', title: labels.expected },
    { id: 'what-do-we-owe-to-each-other', title: labels.owe, children: [{ id: 'cepheus-map', title: labels.link }] },
  ]

  return (
    <article className="essay-page">
      <header className="essay-hero">
        <div className="essay-hero-inner">
          <h1><span>{labels.titleLineOne}</span><span>{labels.titleLineTwo}</span></h1>
          <p className="essay-subtitle">{labels.subtitle}</p>
        </div>
      </header>
      <div className="essay-layout">
        <EssayIndex sections={sections} updated={labels.updated} locale={locale} />
        <div className="essay-body">
          <h2 className="essay-opening-heading" id="first-collision">{labels.firstCollision}</h2>
          {draft.opening.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <ol className="essay-questions">{draft.questions.map((question) => <li key={question}><strong>{question}</strong></li>)}</ol>
          {draft.bridge.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <h2 id="what-is-expected-of-us">{labels.expected}</h2>
          {draft.expected.map((paragraph) => (
            <div key={paragraph}>
              <p>{paragraph}</p>
            </div>
          ))}
          <h2 id="what-do-we-owe-to-each-other">{labels.owe}</h2>
          {draft.owe.map((paragraph, index) => (
            <div key={paragraph}>
              <p>{paragraph}</p>
              {index === 4 ? (
                <section className="essay-visual-block" id="cepheus-map" data-essay-visual="link">
                  <InstitutionalLinkMap locale={locale} />
                </section>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
