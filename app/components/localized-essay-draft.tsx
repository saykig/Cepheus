import readingLayout from 'app/components/essay-reading-layout.module.css'
import { ConstellationSession, InstitutionalLinkMap } from './institutional-link-map'
import { institutionalEssayCopy } from 'app/lib/institutional-essay-copy'
import { essayDrafts } from 'app/lib/essay-drafts'
import { essayLabels } from 'app/lib/essay-copy'
import type { Locale } from 'app/lib/i18n'

type DraftLocale = Exclude<Locale, 'en'>

export function LocalizedEssayDraft({ locale }: { locale: DraftLocale }) {
  const labels = essayLabels[locale]
  const draft = essayDrafts[locale]
  const researchCopy=institutionalEssayCopy[locale]

  return (
    <article className={`essay-page ${readingLayout.page}`}>
      <header className="essay-hero">
        <div className="essay-hero-inner">
          <h1><span>{labels.titleLineOne}</span><span>{labels.titleLineTwo}</span></h1>
          <p className="essay-subtitle">{labels.subtitle}</p><p style={{fontSize:".75rem"}}>{researchCopy.draft}</p>
        </div>
      </header>
      <ConstellationSession><div className="essay-layout">
        <div className="essay-body">
          <h2 className="essay-opening-heading" id="first-collision" data-institutional-step="opening">{labels.firstCollision}</h2>
          {draft.opening.map((paragraph,index) => <div key={paragraph}><p>{paragraph}</p>{index===1?<><p>{researchCopy.correction} <a href="/institutional-links/dod-anthropic-contested">↗</a></p><div className={readingLayout.mobileMoment}><InstitutionalLinkMap locale={locale} initialStep={0}/></div></>:null}</div>)}
          <ol className="essay-questions" data-institutional-step="public-decisions">{draft.questions.map((question) => <li key={question}><strong>{question}</strong></li>)}</ol>
          {draft.bridge.map((paragraph,index) => <p key={paragraph} data-institutional-step={index===1?"interfaces":undefined}>{paragraph}</p>)}<div className={readingLayout.mobileMoment}><InstitutionalLinkMap locale={locale} initialStep={2}/></div>
          <h2 id="what-is-expected-of-us">{labels.expected}</h2>
          {draft.expected.map((paragraph,index) => (
            <div key={paragraph} data-institutional-step={index===1?"technical-knowledge":undefined}>
              <p>{paragraph}</p>
            </div>
          ))}
          <p data-institutional-step="provenance">{researchCopy.audit}</p>
          <h2 id="what-do-we-owe-to-each-other" data-institutional-step="exploration">{labels.owe}</h2>
          {draft.owe.map((paragraph, index) => (
            <div key={paragraph}>
              <p>{index===3?researchCopy.scope:index===4?researchCopy.map:paragraph}</p>
              {index === 4 ? (
                <section className="essay-visual-block" id="cepheus-map" data-essay-visual="link">
                  <div className={readingLayout.inlineMap}><InstitutionalLinkMap locale={locale} /></div>
                </section>
              ) : null}
            </div>
          ))}
        </div>
        <aside className={readingLayout.storySide}><InstitutionalLinkMap locale={locale} story initialStep={0}/></aside>
      </div></ConstellationSession>
    </article>
  )
}
