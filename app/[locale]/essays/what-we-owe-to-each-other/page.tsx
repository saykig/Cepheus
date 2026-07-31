import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import {
  EssayEndnotes,
  EssayFootnoteProvider,
  FootnoteRef,
} from 'app/components/essay-footnotes'
import { EssayDisclosure } from 'app/components/essay-disclosure'
import { EssayIndex } from 'app/components/essay-index'
import { FrontierScoreExplorer } from 'app/components/frontier-score-explorer'
import { GapMapMatrix } from 'app/components/gap-map-matrix'
import { InstitutionalLinkMap } from 'app/components/institutional-link-map'
import sourcesData from '../../../../public/data/sources.json'
import { essayLabels } from 'app/lib/essay-copy'
import { isLocale } from 'app/lib/i18n'
import { LocalizedEssayDraft } from 'app/components/localized-essay-draft'
import { TechnicalCapacityFigure } from 'app/components/technical-capacity-figure'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const labels = isLocale(locale) ? essayLabels[locale] : essayLabels.en
  return { title: labels.titleLineOne + ' ' + labels.titleLineTwo, description: labels.subtitle }
}

function CitationLink({ children, id }: { children: ReactNode; id: number }) {
  const source = sourcesData.sources.find((item) => item.id === id)

  if (!source) return <>{children}</>

  return (
    <a
      className="citation-link"
      href={source.url}
      rel="noreferrer"
      target="_blank"
    >
      {children}
    </a>
  )
}

export default async function CepheusEssay({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!isLocale(locale)) notFound()
  const labels = essayLabels[locale]
  const sections = [
    {
      id: 'first-collision',
      title: labels.firstCollision,
      children: [{ id: 'gap-matrix', title: labels.gap }],
    },
    {
      id: 'what-is-expected-of-us',
      title: labels.expected,
      children: [
        { id: 'institutional-friction-explorer', title: labels.friction },
      ],
    },
    {
      id: 'what-do-we-owe-to-each-other',
      title: labels.owe,
      children: [{ id: 'cepheus-map', title: labels.link }],
    },
  ]

  if (locale !== 'en') return <LocalizedEssayDraft locale={locale} />

  return (
    <article className="essay-page technical-capacity-essay">
      <header className="essay-hero">
        <div className="essay-hero-inner">
          <h1>
            <span>{labels.titleLineOne}</span>
            <span>{labels.titleLineTwo}</span>
          </h1>
          <p className="essay-subtitle">
            {labels.subtitle}
          </p>
          <p className="essay-meta">
            <span className="author">Sara Kim</span>
          </p>
        </div>
      </header>

      <div className="essay-layout">
        <EssayIndex sections={sections} updated={labels.updated} locale={locale} />

        <EssayFootnoteProvider>
          <div className="essay-body">
          <h2 className="essay-opening-heading" id="first-collision">
            {labels.firstCollision}
          </h2>
          <p>
            In February 2026, while sitting in my office, I opened a Flipboard
            notification about a confrontation between{' '}
            <CitationLink id={1}>
              Anthropic and the Pentagon in an AP article
            </CitationLink>.
          </p>
          <p>
            The dispute concerned the conditions under which the Department of
            Defense could use Claude. Anthropic refused to
            remove safeguards related to mass domestic surveillance and fully
            autonomous weapons, arguing that current frontier systems remained
            too unreliable for certain high-stakes uses. Pentagon officials
            responded that a private company should not determine how the
            military could lawfully use technology it had purchased. Both sides
            claimed to be protecting national security. Both institutions
            possessed something the other could not easily replace:{' '}
            <strong>
              the government held public authority, while Anthropic held
              technical expertise and control over the system.
            </strong>
          </p>
          <TechnicalCapacityFigure />
          <p>
            At first, I read it as a dispute over one government contract, but it
            exposed a much larger institutional problem.{' '}
            <strong>AI is being built in one world and governed in another.</strong>{' '}
            The people developing the systems, the people legally empowered to
            make public decisions, and the people who will bear the consequences
            of failure are often not the same people.
          </p>
          <p>
            The clash between Anthropic and the Pentagon gave institutional
            form to a problem I had previously understood only in the abstract.
            Governments cannot govern advanced AI without access to technical
            knowledge. AI companies cannot independently determine the public
            rules governing defense, security, surveillance, or biological risk.
            And neither side can simply replace the other. Yet, the institutions
            connecting them remain fragmented, temporary, and frequently
            adversarial.
          </p>
          <p>
            As a student, I had already watched ChatGPT and Claude develop at a
            pace that was difficult to reconcile with the slower world of laws,
            public institutions, and university disciplines. Their rapid
            improvement made me wonder whether an equivalent policy world
            existed around them. But the better question was not whether AI
            policy existed. It clearly did. The real questions were more
            difficult:
          </p>
          <ol className="essay-questions">
            <li>
              <strong>Who has legal or political authority?</strong>
            </li>
            <li>
              <strong>Who controls the technology or infrastructure?</strong>
            </li>
            <li>
              <strong>
                Why is there no reliable institution connecting these groups?
              </strong>
            </li>
          </ol>

          <section className="essay-visual-block" id="gap-matrix">
            <GapMapMatrix locale={locale} />
            <p className="tool-caption">
              Points below the diagonal have higher knowledge concentration than
              public authority. These pilot points are illustrative values for the
              visual only, not finalized or evidence-backed assessments.
            </p>
            <EssayDisclosure title="Where do these institutions meet?">
              <p>
                The answer may include procurement contracts, model-use policies,
                reporting requirements, safety evaluations, licensing systems,
                technical standards, joint research programs, advisory bodies,
                red-team exercises, and public-private partnerships.
              </p>
              <p>
                These interfaces translate public goals into technical
                requirements. A law may state that an AI system must be safe or
                accountable, but that principle must eventually become an
                evaluation, an access control, a reporting process, a contract
                clause, or an operational restriction.{' '}
                <CitationLink id={6}>
                  NIST&apos;s AI Risk Management Framework is one example of an
                  institution
                </CitationLink>{' '}
                trying to create a shared structure that different organizations
                can use when designing, deploying, and evaluating AI systems.
              </p>
              <p>
                The Anthropic-Pentagon confrontation can be understood as a
                contested interface. The contract connected a private model to a
                public mission, but it did not produce agreement over who could
                define the acceptable conditions of use.
              </p>
            </EssayDisclosure>
          </section>

          <p>
            The third question is key.{' '}
            <strong>
              What is expected of us, then, is neither perfect coordination nor
              a single institution capable of seeing everything.
            </strong>{' '}
            A more realistic starting point is to make the relationships
            visible: who understands the technology, who can make the
            decisions, and where responsibility sits.
          </p>
          <p>
            I have found it helpful to think of these as three views of the same
            system. The{' '}
            <a className="citation-link" href="#gap-matrix">
              Gap Matrix
            </a>{' '}
            shows where technical knowledge and public authority separate. The{' '}
            <a
              className="citation-link"
              href="#institutional-friction-explorer"
            >
              Friction Index
            </a>{' '}
            shows how that mismatch differs across fields. The{' '}
            <a className="citation-link" href="#cepheus-map">
              Institutional Link Map
            </a>{' '}
            traces the dependencies and interfaces through which these
            institutions might be connected.
          </p>
          <p>
            This is the core of the Cepheus Link. Its central claim is
            that the governance problem of frontier AI lies in the distance
            between who knows, who decides, and who bears the risk. The greater
            that distance, the more likely AI policy is to become late,
            adversarial, or technically unworkable. Cepheus is therefore
            proposed as a policy-intelligence platform for mapping that distance
            across public and private institutions.
          </p>

          <h2 id="what-is-expected-of-us">
            {labels.expected}
            <FootnoteRef number={1} />
          </h2>
          <p>
            AI is often described as something that is simply happening to us,
            passively. Models will become more capable, competition will
            intensify, and governments will eventually have to adapt. This
            language captures the speed of change, but it can also make
            responsibility disappear. Before asking whether policy can keep up,
            we should ask a more basic question:{' '}
            <em>what is expected of us?</em> Here, I would put the problem more
            simply: rooms full of experts, but too few hallways between them.
          </p>
          <p>
            Much of frontier AI is developed inside a small number of private
            companies. These companies recruit the technical talent, operate the
            computing infrastructure, evaluate their models, and control how
            those models are released.{' '}
            <CitationLink id={13}>Stanford&apos;s 2025 AI Index</CitationLink>{' '}
            found that industry produced roughly 90 per cent of the notable AI
            models identified in 2024. At the same time,{' '}
            <CitationLink id={12}>
              the U.S. Government Accountability Office
            </CitationLink>{' '}
            has warned of serious shortages of AI expertise across the federal
            workforce. The people closest to the technology are therefore often
            separated from the institutions expected to govern its public
            consequences.
          </p>
          <p>
            Authority is divided in a different way. Governments distribute
            responsibility across legislatures, courts, defence departments,
            regulators, and international bodies. Each sees the technology
            through its own mandate. One institution may write the rules,
            another may purchase the system, and another may only become
            involved after something has gone wrong. Responsibility still
            exists, but it is spread across institutions that may not share the
            same information or even agree on what the main problem is.
          </p>
          <p>
            The divide is also linguistic. Engineers tend to ask whether a
            system works and how reliably it performs. Policymakers are more
            likely to ask who is authorized to use it and who will be held
            responsible if it fails. Companies must also consider deployment,
            competition, and their obligations to customers or investors. They
            may all be discussing the same model while approaching it as a
            different kind of problem.
          </p>
          <p>
            Their timelines rarely match either, as models can change within
            weeks, while legislation, judicial review, and international effort
            can take years. It is tempting to reduce this to the claim that
            policy moves too slowly, but caution is part of what public
            institutions are for. They are expected to follow procedures and
            remain accountable to law. Private firms can usually move faster
            because they are not bound by the same public processes, but speed
            alone does not give them public legitimacy.
          </p>

          <section
            className="essay-visual-block"
            id="institutional-friction-explorer"
          >
            <FrontierScoreExplorer locale={locale} />
            <p className="tool-caption">
              Adjust the weights to test how knowledge, authority, dependency,
              and coordination change the ranking.
            </p>
            <EssayDisclosure title="Who can actually decide?">
              <p>
                Authority can include the power to regulate, procure, deploy,
                restrict, investigate, fund, audit, prosecute, or establish
                standards. These powers rarely belong to the same institution.
              </p>
              <p>
                In cybersecurity, a government agency may issue guidance or
                investigate an attack, while private companies still control the
                affected networks and infrastructure. In military AI, elected
                governments and defence institutions hold authority over
                military operations, but contractors and AI companies may control
                the systems through which those decisions are carried out. In
                biosecurity, authority may be divided among health agencies,
                research regulators, laboratories, security institutions, and
                international bodies.
              </p>
              <p>
                The Anthropic-Pentagon dispute belongs partly on this map. The
                Pentagon argued that military decisions belonged to the state.
                Anthropic accepted that principle but argued that it should not
                be required to provide a system for uses it considered
                technically unreliable or incompatible with basic safeguards.
                The dispute was not simply about whether the military or the
                company had authority. It was about which kind of authority
                applied to which decision.
              </p>
            </EssayDisclosure>
          </section>

          <p>
            This mismatch becomes more serious when private technical choices
            begin to shape public life. A decision about model access or
            safeguards may be made inside a company, yet its consequences can
            reach national security, civil liberties, and critical
            infrastructure. Governments may then depend on systems they cannot
            fully inspect, meanwhile the company understands the technology but
            does not possess the authority to decide every public use. In
            return, the government possesses that authority but may lack the
            knowledge needed to exercise it well.
          </p>
          <p>
            I therefore do not think the central problem is a simple shortage
            of expertise. The expertise exists already, but it is distributed
            across institutions that organize knowledge and authority
            separately. Specialization still matters too, because it gives us
            depth and makes complex work possible. The problem begins when those
            divisions also become the main way we understand issues that are
            already moving across them.
          </p>
          <h2 id="what-do-we-owe-to-each-other">
            {labels.owe}
          </h2>
          <p>
            Then, as people working in policy and technology, we have to ask
            ourselves: what is expected of us? More importantly, what do we owe
            one another<FootnoteRef number={2} />, and what should that require
            of us? I do not think the answer is that engineers should become
            policymakers, or that policymakers need to understand every
            technical detail. These fields exist separately for good reasons.
            But once the same systems begin to shape public life, that
            separation can no longer excuse the distance it has.
          </p>
          <p>
            When different institutions each hold part of the knowledge needed
            to understand a serious risk, they have some responsibility to make
            those parts intelligible to one another. The failure in this
            challenge is simply allowing the gaps and distance between them to
            remain even after their consequences have become visible.
          </p>
          <p>
            Alignment, then, is not a matter of policy catching up with
            technology, or technology simply submitting to policy. It should
            create enough shared understanding where each side can see what the
            other knows, what it cannot know, and where responsibility cannot
            simply be passed along. The goal is not to arrive at some perfect
            agreement as we try to close this gap.<FootnoteRef number={3} /> What
            matters is that the institutions involved can explain their
            decisions to one another and to the people who will live with their
            consequences.
          </p>
          <p>
            Cepheus is my attempt to make those relationships easier to see. It
            would not tell institutions what to decide, nor would it remove
            disagreement between them. It would show where knowledge sits,
            where authority lies, and where one institution has become
            dependent on another. I think that matters a lot, because good
            judgment depends, at least in part, on having an honest picture of
            the system in which decisions are being made.
          </p>
          <p>
            Thus, these relationships form something closer to an institutional
            system than a simple divide between government and industry. The
            map below is a preliminary picture of that system:
          </p>

          <section className="essay-visual-block" id="cepheus-map">
            <InstitutionalLinkMap locale={locale} />
            <EssayDisclosure title="Who depends on whom?">
              <p>
                A government may possess legal authority while depending on a
                private company for access to a frontier model, cloud
                infrastructure, computing capacity, technical maintenance, or
                system evaluation. A private company may depend on government
                contracts, public research, regulation, security clearances, or
                access to government data.
              </p>
              <p>
                In cybersecurity, governments and infrastructure operators often
                rely on private firms to detect vulnerabilities and share threat
                information.{' '}
                <CitationLink id={11}>
                  CISA&apos;s Joint Cyber Defense Collaborative was created around
                  this basic reality
                </CitationLink>
                {', '}providing a mechanism for government and industry to
                coordinate on cybersecurity threats.
              </p>
              <p>
                In military AI, defence institutions may rely on commercial
                models and cloud systems that they do not fully own. The Anthropic
                dispute demonstrated what happens when a government becomes
                operationally interested in a system while the supplier retains
                control over important conditions of use.
              </p>
              <p>
                In biosecurity, AI companies may depend on external scientists
                to evaluate biological capabilities, while public-health
                institutions may depend on private laboratories, commercial data,
                and proprietary AI tools.
              </p>
              <p>
                The Institutional Link Map would make these
                relationships visible because dependency can shape decisions as
                strongly as law does.
              </p>
            </EssayDisclosure>
          </section>

          <p>
            It is important to note that, no map can decide what these
            institutions should do. It can, however, make it harder for any
            institution to claim that the relevant knowledge or responsibility
            belonged entirely to someone else.
          </p>
          <p>
            Perhaps this is what the worlds of policy and technology owe one
            another: not to become the same, but to make a serious effort to
            render their knowledge understandable across the boundary between
            them.
          </p>

            <EssayEndnotes />
          </div>
        </EssayFootnoteProvider>
      </div>
    </article>
  )
}
