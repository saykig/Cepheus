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
            improvement of AI frontiers made me wonder whether an equivalent
            policy world existed around them. And AI policy does exist today, but
            trying to answer the below questions are much more difficult in
            today's political landscape:
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

          <section
            className="essay-visual-block"
            id="gap-matrix"
            data-essay-visual="gap"
          >
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
            I should also say, quite candidly, that I would almost certainly gain
            a great deal from writing this alongside people with deep expertise
            and passions in biology, physics, mathematics, economics, computer
            science, law, and other fields. Dario Amodei makes a similar
            admission near the beginning of{' '}
            <a
              className="citation-link"
              href="https://darioamodei.com/essay/machines-of-loving-grace"
              rel="noreferrer"
              target="_blank"
            >
              <em>Machines of Loving Grace</em>
            </a>
            : writing across so many domains made him realize how much better
            the exercise would be with experts from those fields involved. I
            think there is something important in
            that admission. No individual, and probably no single institution,
            is supposed to understand all of this on its own.
          </p>
          <p>
            I have found it helpful to think of these as three views of the same
            system. The Gap Matrix<FootnoteRef number={1} /> shows where
            technical knowledge and public authority separate. The Friction
            Index<FootnoteRef number={2} /> shows how that mismatch differs
            across fields. The Institutional Link Map<FootnoteRef number={3} />
            traces the dependencies and interfaces through which these
            institutions might be connected.
          </p>
          <p>
            In this essay, I try to illustrate that the central governance
            problem of frontier AI lies in the distance between those who
            understand it most deeply and those who decide how it should be
            managed. The greater that distance, the more likely AI policy is to
            become adversarial, or technically unworkable.
          </p>

          <h2 id="what-is-expected-of-us">
            {labels.expected}
            <FootnoteRef number={4} />
          </h2>
          <p>
            AI is often described as something that is simply happening to us,
            passively. Models will become more capable, competition will
            intensify, and governments will eventually have to adapt. This
            language captures the speed of change, but it can also make
            responsibility disappear. Before asking whether policy can keep up,
            we should ask a more basic question:{' '}
            <em>what is expected of us?</em>
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
            data-essay-visual="friction"
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
                For example, in cybersecurity, a government agency may issue
                guidance or investigate an attack, while private companies still
                control the affected networks and infrastructure. In military AI,
                elected governments and defence institutions hold authority over
                military operations, but contractors and AI companies may control
                the systems through which those decisions are carried out.
              </p>
              <p>
                Anthropic’s clash with the White House demonstrated what happens
                when a government becomes operationally interested in a system
                while the supplier retains control over important conditions of
                use.
              </p>
            </EssayDisclosure>
          </section>

          <p>
            I therefore do not think the central problem is a simple shortage of
            expertise, as specialization itself is not the problem. In fact, it
            is probably one of the main reasons humanity has become capable of
            doing extraordinarily difficult things.<FootnoteRef number={5} /> We
            spend years learning the language, methods, assumptions, and history
            of one field precisely because no person can know everything. But
            our institutions tend to preserve those divisions long after the
            problems themselves have stopped respecting them. We grow up moving
            between separate subjects in school, and eventually become very good
            at speaking to people who were trained to think about problems in
            roughly the same way we were. Universities certainly create
            interdisciplinary programs, laboratories, and research groups, but
            their basic architecture is still largely disciplinary.
          </p>
          <p>
            This becomes much more consequential as AI begins to increase the
            amount of intellectual work that specialized fields can produce. One
            way Dario describes this problem is to ask what becomes the limiting
            factor once intelligence itself becomes much more abundant. More
            intelligence does not make every other constraint disappear, as
            experiments still take time, institutions still have procedures, and
            human beings still have to decide whether something should actually
            be used.<FootnoteRef number={6} /> And there is another possible
            bottleneck that I think deserves much more attention:{' '}
            <strong>verification</strong>.
          </p>
          <p>
            Mathematics offers an unusually interesting example of what this can
            look like. In 1946, Paul Erdős posed a problem about something that
            sounds almost trivial: if you place a large number of points on a
            plane, how many pairs can be exactly one unit apart? Mathematicians
            worked on versions of this problem for nearly eighty years. Then, in
            May 2026, an internal OpenAI model produced a construction that
            disproved a longstanding conjecture about its answer. External
            mathematicians subsequently checked the argument and produced
            human-written papers explaining and verifying the result.
            <FootnoteRef number={7} />
          </p>
          <p>
            One of those tools is Lean, a formal proof system.<FootnoteRef number={8} /> In very simple
            terms, Lean allows mathematicians to express a mathematical statement
            with extraordinary precision and then check whether a proposed proof
            actually establishes it. It does not decide which theorem matters,
            nor does it magically tell us whether we have formalized the question
            we intended to ask. In fact, the Lean community explicitly warns that
            this distinction matters: a formally valid proof is not useful if the
            formal statement does not correspond to the mathematical claim we
            thought we were proving.
          </p>
          <p>
            This is becoming particularly interesting alongside AI. DeepMind's
            Formal Conjectures<FootnoteRef number={9} /> project is turning large collections of open
            mathematical problems—including hundreds drawn from Erdős's problem
            lists—into statements written in Lean. The point is partly to create
            problems against which automated theorem provers can work, but also
            to make the questions themselves precise enough that solutions can
            eventually be formally checked.
          </p>
          <p>
            I find this incredibly compelling,{' '}
            <strong>
              but also slightly frustrating as someone who works in global affairs,
              because our problems do not behave like this.
            </strong>{' '}
            We cannot place a statement such as{' '}
            <em>this institution has authority over this AI system</em> into Lean
            and expect it to tell us whether that statement is true. Even the
            word <em>authority</em> immediately creates more questions. Authority
            granted by what? A regulation? A procurement contract? Is the
            authority legally binding, politically asserted, or merely advisory?
            Does it apply to this particular institution, jurisdiction, or use?
            Two perfectly competent researchers can read the same material and
            still disagree about the answer. The disagreement here is not an
            error in the system, because sometimes, or most of the time, it is the
            system.
          </p>
          <p>
            That means I do not think policy needs, or could realistically have,
            some universal language that verifies political truth. But the
            benefit of formal systems points toward something smaller and much
            more achievable.{' '}
            <strong>
              We may not be able to formalize whether a political judgment is
              ultimately true, but we can become far better at formalizing what
              we are claiming, where the claim came from, what evidence supports
              it, what assumptions were required to reach it, and what we still
              do not know.
            </strong>
          </p>
          <p>
            This sounds rather obvious until you look at how much policy research
            is actually produced. A statute lives in one place, a policy analyst
            interprets it in a report and another researcher compresses the
            report into a spreadsheet. Eventually, a conclusion can become
            separated from the evidence it is based on, making provenance
            difficult to trace.
          </p>
          <p>
            People working between policy and technology have already encountered
            narrower versions of this problem.{' '}
            <a
              className="citation-link"
              href="https://www.digital.govt.nz/dmsdocument/95-better-zrules-for-government-discovery-report/html"
              rel="noreferrer"
              target="_blank"
            >
              New Zealand&apos;s Better Rules project
            </a>
            , for example, found what it called a translation gap between policy
            analysts and software developers. Each group had its own structured
            language and professional standards, but each subsequent group had
            to reinterpret what the previous one produced. There is now an
            entire Rules as Code movement built around related ideas.{' '}
            <a
              className="citation-link"
              href="https://catala-lang.org/"
              rel="noreferrer"
              target="_blank"
            >
              Catala
            </a>
            , a programming language designed specifically for statutory law,
            goes further by giving
            lawyers and programmers a shared medium through which certain
            computational parts of legislation can be represented and tested.
            None of these projects makes politics mathematically provable, nor
            should they. But they demonstrate something important: professional
            boundaries become less costly when the information crossing them has
            structure.
          </p>
          <p>
            What made this problem feel less abstract to me was realizing how
            often I encountered the same fragmentation simply by trying to
            understand AI governance.<FootnoteRef number={10} /> I would open one government report, which
            led me to another framework, then a paper, then a legal document<FootnoteRef number={11} />, and
            eventually to projects such as Catala or the OECD’s work on Rules as
            Code. Before long, I had ten tabs open, all describing parts of the
            same problem in completely different languages. In an era of abundant
            knowledge, the problem is often not that information does not exist,
            but that it is stored differently, described differently, and made
            legible to entirely different professional communities.
            <FootnoteRef number={12} />
          </p>
          <p>
            That is when I began thinking about{' '}
            <a
              className="citation-link"
              href="https://writewrit.vercel.app/"
              rel="noreferrer"
              target="_blank"
            >
              building Writ
            </a>
            . Writ is still a pilot, but the idea behind it is relatively
            simple: to turn political and global-affairs research into
            structured, traceable knowledge that both people and software can
            read. It is a domain-specific language and knowledge system, and
            what interests me most about it is what it might make possible
            between these two worlds.
          </p>
          <p>
            What I would like Writ to borrow from systems such as Lean is not
            mathematical certainty, but <strong>provenance and interoperability</strong>.
            {' '}Provenance means that a judgment should remain connected to the
            evidence and assumptions it is based on. Interoperability means
            that the same underlying piece of knowledge should be usable across
            different tools and professional communities without having to be
            continually translated and reconstructed. Someone working in policy
            should be able to read a claim, its evidence, and the reasoning
            behind it in ordinary language, while an engineer should be able to
            inspect that same material as structured data and build tools on top
            of it. They should, in other words, be looking at the same underlying
            object.
          </p>
          <p>
            The{' '}
            <a
              className="citation-link"
              href="https://writewrit.vercel.app/lab"
              rel="noreferrer"
              target="_blank"
            >
              current Writ pilot
            </a>
            {' '}begins to test this idea. It preserves sources, claims, and
            uncertainty in a structured form so that conclusions can still be
            traced back to the evidence behind them. I am cautiously optimistic that,
            if such systems like this become useful enough, policy knowledge
            could become easier to compare, update, inspect, and carry across
            institutional boundaries without pretending that political judgment
            can be reduced to code.
          </p>
          <p>
            That would not close the gap between policy and technology on its
            own. Nor is the goal to turn policymakers into programmers or
            engineers into policy analysts. The more realistic ambition is to
            make the knowledge in each world more legible to the other.
            {' '}<strong>The gap becomes harder to bridge when every transfer of
            knowledge also requires a new translation.</strong> Writ is currently
            in an experimental stage in asking whether some of that distance can
            instead be built into a shared structure from the beginning.
          </p>
          <h2 id="what-do-we-owe-to-each-other">
            {labels.owe}
          </h2>
          <p>
            Then, as people working in policy and technology, we have to ask
            ourselves: what is expected of us? More importantly, what do we owe
            one another<FootnoteRef number={13} />, and what should that require
            of us? I do not think the answer is that engineers should become
            policymakers, or that policymakers need to understand every
            technical detail. These fields exist separately for good reasons.
            But when different institutions each hold part of the knowledge
            needed to understand a serious risk, they have some responsibility
            to make those parts intelligible to one another.
          </p>
          <p>
            Thus, these relationships form something closer to an institutional
            system than a simple divide between government and industry. The
            map below is a preliminary picture of that system:
          </p>

          <section
            className="essay-visual-block"
            id="cepheus-map"
            data-essay-visual="link"
          >
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
                The Institutional Link Map tries to make these relationships
                visible because dependency can shape decisions as strongly as law
                does.
              </p>
            </EssayDisclosure>
          </section>

          <p>
            Alignment, then, is not a matter of policy catching up with
            technology, or technology simply submitting to policy. The goal is
            not to arrive at some perfect agreement as we try to close this
            gap.<FootnoteRef number={14} /> In regards to the aforementioned
            concept of Erdős problems and Lean, the lesson I take from mathematics
            is not that international affairs ought to become mathematics. It is
            almost the quite opposite. Mathematics can demand a degree of formal
            verification because it operates under conditions that political life
            rarely gives us. Global affairs contains ambiguity, incomplete
            evidence, competing interpretations, and legitimate disagreement. Any
            system that removed those things for the sake of producing a clean
            answer would probably make the analysis worse.
          </p>
          <p>
            But ambiguity does not require disorder: there is a difference
            between saying <em>we disagree about what this evidence means</em> and
            not being able to determine which evidence produced the disagreement
            in the first place. There is a difference between a government having
            legal authority, possessing technical capability, and depending on
            someone else to actually carry a decision out. And AI makes this
            increasingly important because it is not merely producing more text,
            as it is beginning to act across the same institutional boundaries
            that we already struggle to describe.
          </p>
          <p>
            The{' '}
            <a
              aria-label="OpenAI and Hugging Face partner to address security incident during model evaluation"
              className="citation-link"
              href="https://openai.com/index/hugging-face-model-evaluation-security-incident/"
              rel="noreferrer"
              target="_blank"
            >
              July 2026 Hugging Face incident
            </a>{' '}
            is a useful example. An AI agent being evaluated inside OpenAI's
            environment found a way out of its
            intended sandbox, moved through third-party infrastructure, and
            eventually compromised parts of Hugging Face's production environment
            while trying to obtain answers to the benchmark on which it was being
            tested. Hugging Face later reconstructed{' '}
            <a
              className="citation-link"
              href="https://huggingface.co/blog/agent-intrusion-technical-timeline"
              rel="noreferrer"
              target="_blank"
            >
              roughly 17,600 actions across the intrusion
            </a>
            . OpenAI and Hugging Face then had to work across organizational
            boundaries to understand what the system had actually done.
          </p>
          <p>
            The Hugging Face case is obviously a cybersecurity problem, but I
            think it is also an institutional one. A system developed by one
            organization and interacting with infrastructure operated by several
            others can create consequences that no single institution completely
            contains.{' '}
            <strong>
              That becomes even more complicated when control over the system
              itself is distributed.
            </strong>
          </p>
          <p>
            Even the debate over what should follow from incidents like this is
            divided. A July 2026 open-weights statement<FootnoteRef number={15} /> backed by NVIDIA, Hugging
            Face, Microsoft, Meta, and many other firms openly acknowledges that
            once model weights are released, the original developer loses
            substantial control, and modified versions become difficult to trace
            or reverse. Yet the same statement argues that distributing access
            can improve security because defenders, researchers, and smaller
            organizations can inspect models and develop protections themselves.
          </p>
          <p>
            I have not yet figured out how to answer the three questions<FootnoteRef number={16} /> I
            proposed at the beginning of this essay. But I do know that the
            answer is not to create one language in which everyone thinks. A
            better way forward is to find ways for our different languages to
            meet, and to make the distance between them easier to cross. Perhaps
            this is what the worlds of policy and technology owe one another: not
            to become the same, but to make a serious effort to render their
            knowledge understandable across the boundary between them.
          </p>

            <EssayEndnotes />
          </div>
        </EssayFootnoteProvider>
      </div>
    </article>
  )
}
