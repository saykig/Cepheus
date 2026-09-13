import type { Locale } from './i18n'

export type EssayDraft = {
  opening: string[]
  questions: string[]
  bridge: string[]
  expected: string[]
  owe: string[]
  gapCaption: string
  frictionCaption: string
  linkCaption: string
}

export const essayDrafts: Record<Exclude<Locale, 'en'>, EssayDraft> = {
  ru: {
    opening: [
      'В феврале 2026 года, сидя в своём кабинете, я открыла уведомление Flipboard о противостоянии Anthropic и Пентагона.',
      'Спор касался условий, на которых Министерство обороны могло использовать Claude. Anthropic отказалась снимать ограничения, связанные с массовой внутренней слежкой и полностью автономным оружием, утверждая, что современные передовые системы всё ещё недостаточно надёжны для некоторых решений с высокой ценой ошибки. Представители Пентагона отвечали, что частная компания не должна определять, как вооружённые силы могут законно применять купленную технологию. Обе стороны говорили о защите национальной безопасности. У каждой было то, чего другая не могла легко заменить: у государства — публичные полномочия, у Anthropic — техническая экспертиза и контроль над системой.',
      'Сначала я восприняла это как спор об одном государственном контракте, но он высветил гораздо более крупную институциональную проблему. ИИ создаётся в одном мире, а управляется в другом. Люди, разрабатывающие системы, люди, наделённые законом принимать публичные решения, и люди, которые понесут последствия ошибки, часто не совпадают.',
      'Столкновение придало институциональную форму проблеме, которую прежде я понимала лишь абстрактно. Государство не может управлять передовым ИИ без доступа к техническим знаниям. Компании не могут самостоятельно устанавливать общественные правила для обороны, безопасности, наблюдения или биологических рисков. Ни одна сторона не может заменить другую, однако связывающие их институты остаются разрозненными, временными и часто враждебными.',
      'Как студентка, я наблюдала, как ChatGPT и Claude развиваются со скоростью, которую трудно согласовать с более медленным миром законов, публичных институтов и университетских дисциплин. Вопрос не в том, существует ли политика в области ИИ. Она существует. Труднее понять, у кого есть юридическая и политическая власть, кто контролирует технологию и инфраструктуру и почему между этими группами нет надёжного института.',
    ],
    questions: ['У кого есть юридические или политические полномочия?', 'Кто контролирует технологию или инфраструктуру?', 'Почему нет надёжного института, соединяющего эти группы?'],
    bridge: [
      'Третий вопрос — ключевой. От нас требуется не идеальная координация и не единый институт, способный видеть всё. Реалистичнее сначала сделать отношения видимыми: кто понимает технологию, кто может принимать решения и на ком лежит ответственность.',
      'Карта институциональных связей показывает конкретные организации и документированные механизмы их взаимодействия. У каждой связи есть источник, дата и ограничения того, что она позволяет утверждать.',
      'В этом суть связи Cepheus. Проблема управления передовым ИИ заключается в расстоянии между теми, кто знает, теми, кто решает, и теми, кто несёт риск. Чем больше это расстояние, тем вероятнее, что политика окажется запоздалой, конфликтной или технически невыполнимой. Поэтому Cepheus предлагается как платформа политической аналитики, отображающая это расстояние между публичными и частными институтами.',
    ],
    expected: [
      'Об ИИ часто говорят как о процессе, который просто происходит с нами: модели станут сильнее, конкуренция усилится, а государствам придётся приспособиться. Такое описание передаёт скорость перемен, но может растворить ответственность. Прежде чем спрашивать, успевает ли политика, нужно спросить: что от нас требуется? Проще говоря, у нас есть комнаты, полные экспертов, но слишком мало коридоров между ними.',
      'Большая часть передового ИИ создаётся внутри небольшого числа частных компаний. Они нанимают специалистов, управляют вычислительной инфраструктурой, оценивают модели и контролируют их выпуск. При этом государственные учреждения испытывают серьёзный дефицит экспертизы. Люди, ближе всего стоящие к технологии, отделены от институтов, которые должны управлять её общественными последствиями.',
      'Полномочия разделены иначе. Государства распределяют ответственность между законодателями, судами, оборонными ведомствами, регуляторами и международными организациями. Один институт пишет правила, другой закупает систему, третий подключается лишь после сбоя. Ответственность существует, но рассеяна между организациями с разной информацией и разным пониманием проблемы.',
      'Разрыв существует и в языке. Инженеры спрашивают, работает ли система и насколько надёжно. Политики спрашивают, кто вправе её использовать и кто ответит за ошибку. Компании учитывают развёртывание, конкуренцию и обязательства перед клиентами и инвесторами. Все обсуждают одну модель, но видят в ней разные проблемы.',
      'Не совпадают и временные горизонты: модели меняются за недели, а закон, судебный контроль и международные договорённости требуют лет. Сводить это к медлительности политики ошибочно: осторожность и процедура — часть назначения публичных институтов. Частные компании движутся быстрее, но скорость сама по себе не даёт общественной легитимности.',
      'Несоответствие становится опаснее, когда частные технические решения начинают формировать общественную жизнь. Компания может определить доступ к модели или её ограничения, хотя последствия затронут безопасность, гражданские свободы и критическую инфраструктуру. Государство обладает полномочиями, но может не иметь знаний для их разумного применения; компания понимает систему, но не имеет права решать каждый вопрос публичного использования.',
      'Поэтому центральная проблема — не просто нехватка экспертов. Экспертиза уже существует, но распределена между институтами, которые по-разному организуют знания и власть. Специализация необходима, однако она становится препятствием, когда служит главным способом понимать вопросы, уже пересекающие её границы.',
    ],
    owe: [
      'Работая в политике и технологиях, мы должны спросить не только, что от нас ожидается, но и что мы должны друг другу. Инженерам не нужно становиться политиками, а политикам — знать каждую техническую деталь. Эти области разделены не случайно. Но когда одни системы начинают определять общественную жизнь, это разделение больше не оправдывает дистанцию.',
      'Если разные институты владеют разными частями знания о серьёзном риске, они обязаны сделать эти части понятными друг другу. Провал состоит в том, чтобы оставить разрывы нетронутыми даже после того, как их последствия стали видимы.',
      'Согласование — не погоня политики за технологией и не простое подчинение технологии политике. Нужен общий уровень понимания, при котором каждая сторона видит, что знает другая, чего она знать не может и где ответственность нельзя передать дальше. Цель не в идеальном согласии, а в способности объяснить решения друг другу и людям, которым жить с их последствиями.',
      'Cepheus — моя попытка сделать эти отношения более заметными. Платформа не будет говорить институтам, что решать, и не устранит разногласия. Она покажет, где находятся знания, где лежат полномочия и где один институт зависит от другого. Хорошее суждение требует честной картины системы, в которой принимаются решения.',
      'Таким образом, эти отношения образуют скорее институциональную систему, чем простой раскол между государством и индустрией. Карта ниже — предварительное изображение этой системы:',
      'Ни одна карта не может решить, как должны поступить институты. Но она может затруднить утверждение, будто нужные знания или ответственность целиком принадлежали кому-то другому.',
      'Возможно, именно это миры политики и технологий должны друг другу: не становиться одинаковыми, а всерьёз стараться делать свои знания понятными по обе стороны границы.',
    ],
    gapCaption: 'Точки ниже диагонали имеют более высокую концентрацию знаний, чем уровень публичных полномочий. Поля без оценки помечаются как ожидающие кодирования доказательств.',
    frictionCaption: 'Меняйте веса, чтобы проверить, как знания, полномочия, зависимость и координация влияют на рейтинг.',
    linkCaption: 'Выберите точку, чтобы увидеть движение влияния, информации и финансирования. Фильтры показывают, кто удерживает систему вместе.',
  },
  ko: {
    opening: [
      '2026년 2월, 사무실에 앉아 있던 나는 Anthropic과 미 국방부의 충돌을 다룬 AP 기사 알림을 Flipboard에서 열었다.',
      '쟁점은 국방부가 Claude를 어떤 조건으로 사용할 수 있는가였다. Anthropic은 대규모 국내 감시와 완전 자율무기에 관한 안전장치를 없애기를 거부했다. 현재의 프런티어 시스템은 일부 고위험 용도에 충분히 신뢰할 수 없다는 이유였다. 국방부는 민간 기업이 군이 구매한 기술의 합법적 사용을 결정해서는 안 된다고 맞섰다. 양측 모두 국가안보를 보호한다고 주장했다. 정부는 공적 권한을, Anthropic은 기술적 전문성과 시스템 통제권을 갖고 있었다.',
      '처음에는 하나의 정부 계약을 둘러싼 분쟁으로 보였지만, 더 큰 제도적 문제가 드러났다. AI는 한 세계에서 만들어지고 다른 세계에서 통치된다. 시스템을 만드는 사람, 법적으로 공적 결정을 내릴 수 있는 사람, 실패의 결과를 감당할 사람은 대개 서로 다르다.',
      '이 충돌은 내가 추상적으로만 이해하던 문제에 제도적 형태를 부여했다. 정부는 기술 지식 없이 첨단 AI를 통치할 수 없고, AI 기업은 국방·안보·감시·생물학적 위험에 관한 공적 규칙을 독자적으로 정할 수 없다. 어느 쪽도 다른 쪽을 대체할 수 없지만, 둘을 잇는 제도는 여전히 파편적이고 임시적이며 자주 적대적이다.',
      '학생으로서 나는 ChatGPT와 Claude의 발전 속도가 법과 공공기관, 대학 학문의 느린 속도와 맞지 않는 모습을 보아 왔다. 중요한 질문은 AI 정책이 존재하는지가 아니다. 누가 법적·정치적 권한을 갖는가, 누가 기술과 인프라를 통제하는가, 그리고 왜 이 집단들을 안정적으로 잇는 제도가 없는가이다.',
    ],
    questions: ['누가 법적 또는 정치적 권한을 갖는가?', '누가 기술 또는 인프라를 통제하는가?', '왜 이 집단들을 잇는 신뢰할 만한 제도가 없는가?'],
    bridge: [
      '세 번째 질문이 핵심이다. 우리에게 요구되는 것은 완벽한 조정도, 모든 것을 보는 단일 기관도 아니다. 현실적인 출발점은 누가 기술을 이해하고, 누가 결정을 내리며, 책임이 어디에 놓이는지를 보이게 만드는 것이다.',
      '제도 연결 지도는 구체적인 기관과 문서로 확인된 연결 방식을 보여 준다. 각 연결에는 출처와 날짜, 그리고 그 자료로 확인할 수 있는 범위의 한계가 있다.',
      '이것이 Cepheus 연결의 핵심이다. 프런티어 AI 거버넌스의 문제는 아는 사람, 결정하는 사람, 위험을 감당하는 사람 사이의 거리에 있다. 거리가 멀수록 정책은 늦고 적대적이며 기술적으로 실행 불가능해질 가능성이 높다. Cepheus는 공공·민간 기관 사이의 거리를 그리는 정책 인텔리전스 플랫폼으로 제안된다.',
    ],
    expected: [
      'AI는 종종 우리에게 그저 일어나는 일처럼 묘사된다. 모델은 더 강력해지고 경쟁은 심화되며 정부는 결국 적응해야 한다는 식이다. 이런 언어는 변화의 속도를 포착하지만 책임을 지울 수도 있다. 정책이 따라갈 수 있는지 묻기 전에 무엇이 우리에게 요구되는지 물어야 한다. 전문가가 가득한 방은 많지만 그 사이의 복도는 너무 적다.',
      '프런티어 AI의 대부분은 소수 민간 기업 안에서 개발된다. 이들은 인재를 채용하고 컴퓨팅 인프라를 운영하며 모델을 평가하고 출시를 통제한다. 반면 공공부문은 AI 전문성 부족을 겪는다. 기술에 가장 가까운 이들이 그 공적 결과를 통치해야 하는 기관과 분리되어 있다.',
      '권한은 다른 방식으로 나뉜다. 정부는 입법부, 법원, 국방기관, 규제기관, 국제기구에 책임을 분산한다. 한 곳은 규칙을 만들고 다른 곳은 시스템을 구매하며 또 다른 곳은 문제가 생긴 뒤에야 관여한다. 책임은 존재하지만 같은 정보를 공유하지 않는 기관들 사이에 흩어져 있다.',
      '언어도 다르다. 엔지니어는 시스템이 작동하는지와 신뢰성을 묻고, 정책 담당자는 누가 사용할 권한을 가지며 실패 시 누가 책임지는지 묻는다. 기업은 배포, 경쟁, 고객과 투자자에 대한 의무도 고려한다. 같은 모델을 말하면서 서로 다른 종류의 문제로 접근한다.',
      '시간표 역시 맞지 않는다. 모델은 몇 주 안에 바뀌지만 입법, 사법 심사, 국제 협력에는 수년이 걸린다. 이를 정책의 느림으로만 보는 것은 부정확하다. 신중함과 절차는 공공기관의 역할이다. 민간 기업은 더 빨리 움직일 수 있지만 속도만으로 공적 정당성을 얻지는 못한다.',
      '민간의 기술적 선택이 공공생활을 형성할 때 불일치는 더 심각해진다. 기업 내부의 접근·안전장치 결정이 국가안보와 시민의 자유, 핵심 인프라에 영향을 미친다. 정부는 권한이 있지만 그것을 잘 행사할 지식이 부족할 수 있고, 기업은 기술을 이해하지만 모든 공적 사용을 결정할 권한은 없다.',
      '따라서 중심 문제는 단순한 전문성 부족이 아니다. 전문성은 이미 존재하지만 지식과 권한을 따로 조직하는 기관들에 분산되어 있다. 전문화는 깊이를 가능하게 하지만, 경계를 넘는 문제를 이해하는 주된 방식이 될 때 장벽이 된다.',
    ],
    owe: [
      '정책과 기술에서 일하는 우리는 무엇이 기대되는지뿐 아니라 서로에게 무엇을 빚지고 있는지 물어야 한다. 엔지니어가 정책 담당자가 되거나 정책 담당자가 모든 기술 세부사항을 알 필요는 없다. 그러나 같은 시스템이 공공생활을 좌우하기 시작하면 분리는 더 이상 거리를 정당화할 수 없다.',
      '서로 다른 기관이 중대한 위험을 이해하는 데 필요한 지식의 일부씩을 갖고 있다면, 그 조각을 서로 이해할 수 있게 만들 책임이 있다. 결과가 드러난 뒤에도 간극을 그대로 두는 것이 실패다.',
      '정렬은 정책이 기술을 뒤쫓거나 기술이 정책에 단순히 복종하는 일이 아니다. 서로 무엇을 알고 무엇을 알 수 없는지, 책임을 어디에서 넘길 수 없는지를 볼 수 있는 공동 이해가 필요하다. 완벽한 합의보다 중요한 것은 결정과 그 결과를 서로와 시민에게 설명하는 능력이다.',
      'Cepheus는 이러한 관계를 더 쉽게 보이게 하려는 나의 시도다. 무엇을 결정하라고 명령하거나 갈등을 없애는 대신, 지식과 권한의 위치와 기관 간 의존성을 보여 준다. 좋은 판단에는 결정이 이루어지는 시스템에 대한 정직한 그림이 필요하다.',
      '따라서 이 관계들은 정부와 산업의 단순한 구분보다 제도적 시스템에 가깝다. 아래 지도는 그 시스템의 예비 그림이다:',
      '어떤 지도도 기관이 무엇을 해야 하는지 결정할 수는 없다. 그러나 관련 지식이나 책임이 전적으로 다른 누군가의 것이었다고 주장하기는 더 어렵게 만들 수 있다.',
      '아마 정책과 기술의 세계가 서로에게 빚진 것은 같아지는 일이 아니라, 경계 너머에서 각자의 지식을 이해할 수 있도록 진지하게 노력하는 일일 것이다.',
    ],
    gapCaption: '대각선 아래의 점은 지식 집중도가 공적 권한보다 높습니다. 점수가 없는 분야는 근거 코딩이 완료될 때까지 평가 대기 상태로 표시됩니다.',
    frictionCaption: '가중치를 조정해 지식, 권한, 의존성, 조정이 순위를 어떻게 바꾸는지 확인하세요.',
    linkCaption: '점을 선택하면 영향력, 정보, 자금의 흐름을 볼 수 있습니다. 필터를 사용해 시스템을 잇는 주체를 살펴보세요.',
  },
  fr: {
    opening: [
      'En février 2026, assise dans mon bureau, j’ai ouvert une notification Flipboard consacrée à une confrontation entre Anthropic et le Pentagone.',
      'Le désaccord portait sur les conditions d’utilisation de Claude par le département de la Défense. Anthropic refusait de retirer les garde-fous concernant la surveillance intérieure de masse et les armes entièrement autonomes, estimant que les systèmes de pointe restaient trop peu fiables pour certains usages critiques. Le Pentagone répondait qu’une entreprise privée ne devait pas décider de l’usage légal d’une technologie achetée par l’armée. Les deux camps invoquaient la sécurité nationale. L’État détenait l’autorité publique ; Anthropic, l’expertise technique et le contrôle du système.',
      'J’y ai d’abord vu un différend contractuel, mais il révélait un problème institutionnel bien plus vaste. L’IA est conçue dans un monde et gouvernée dans un autre. Les personnes qui développent les systèmes, celles qui ont le pouvoir légal de décider et celles qui supporteront les conséquences d’un échec ne sont souvent pas les mêmes.',
      'La confrontation donnait une forme institutionnelle à un problème jusque-là abstrait. Les gouvernements ne peuvent gouverner l’IA avancée sans savoir technique. Les entreprises ne peuvent fixer seules les règles publiques relatives à la défense, la sécurité, la surveillance ou les risques biologiques. Aucun camp ne peut remplacer l’autre, mais les institutions qui les relient restent fragmentaires, temporaires et souvent adversariales.',
      'Comme étudiante, j’avais vu ChatGPT et Claude progresser à un rythme difficile à concilier avec celui des lois, des institutions publiques et des disciplines universitaires. La question n’est pas de savoir si une politique de l’IA existe. Il faut demander qui possède l’autorité juridique et politique, qui contrôle la technologie et l’infrastructure, et pourquoi aucun dispositif fiable ne relie ces groupes.',
    ],
    questions: ['Qui détient l’autorité juridique ou politique ?', 'Qui contrôle la technologie ou l’infrastructure ?', 'Pourquoi aucune institution fiable ne relie-t-elle ces groupes ?'],
    bridge: [
      'La troisième question est décisive. On ne nous demande ni une coordination parfaite ni une institution unique capable de tout voir. Un point de départ réaliste consiste à rendre les relations visibles : qui comprend la technologie, qui peut décider et où repose la responsabilité.',
      'La carte des liens institutionnels présente des organisations précises et les mécanismes documentés qui les relient. Chaque lien possède une source, une date et des limites quant à ce que les données permettent d’établir.',
      'C’est le cœur du lien Cepheus. Le problème de gouvernance de l’IA de pointe réside dans la distance entre ceux qui savent, ceux qui décident et ceux qui supportent le risque. Plus elle est grande, plus la politique risque d’être tardive, conflictuelle ou techniquement impraticable. Cepheus est donc proposé comme plateforme d’intelligence publique cartographiant cette distance entre institutions publiques et privées.',
    ],
    expected: [
      'L’IA est souvent décrite comme une chose qui nous arrive : les modèles gagneront en puissance, la concurrence s’intensifiera et les gouvernements finiront par s’adapter. Ce langage traduit la vitesse du changement, mais il peut faire disparaître la responsabilité. Avant de demander si la politique suivra, demandons ce qui est attendu de nous : des salles pleines d’experts, mais trop peu de couloirs entre elles.',
      'L’essentiel de l’IA de pointe est développé par quelques entreprises privées. Elles recrutent les talents, exploitent l’infrastructure de calcul, évaluent les modèles et contrôlent leur diffusion. Dans le même temps, le secteur public manque d’expertise. Les personnes les plus proches de la technologie sont séparées des institutions chargées d’en gouverner les conséquences collectives.',
      'L’autorité se répartit autrement. Les États distribuent les responsabilités entre législateurs, tribunaux, ministères de la Défense, régulateurs et organisations internationales. Une institution écrit les règles, une autre achète le système, une troisième n’intervient qu’après l’incident. La responsabilité demeure, mais elle est dispersée entre des organisations qui ne partagent ni les mêmes informations ni la même définition du problème.',
      'La fracture est aussi linguistique. Les ingénieurs demandent si le système fonctionne et avec quelle fiabilité. Les responsables publics demandent qui peut l’utiliser et qui répondra de l’échec. Les entreprises considèrent aussi le déploiement, la concurrence et leurs obligations envers clients et investisseurs. Tous parlent du même modèle comme s’il s’agissait de problèmes différents.',
      'Leurs calendriers ne coïncident pas davantage. Un modèle change en quelques semaines, tandis que la loi, le contrôle judiciaire et l’action internationale prennent des années. Réduire cela à la lenteur des politiques serait trompeur : la prudence et la procédure font partie de la mission publique. Les entreprises avancent plus vite, mais la vitesse ne confère pas de légitimité publique.',
      'Le décalage devient plus grave lorsque des choix techniques privés façonnent la vie publique. Une décision interne sur l’accès ou les garde-fous peut toucher la sécurité nationale, les libertés civiles et les infrastructures critiques. L’État a l’autorité mais peut manquer du savoir nécessaire ; l’entreprise comprend la technologie mais n’a pas le mandat de décider de tous ses usages publics.',
      'Le problème central n’est donc pas une simple pénurie d’expertise. Celle-ci existe, mais elle est distribuée entre des institutions qui organisent séparément le savoir et l’autorité. La spécialisation reste nécessaire, mais devient un obstacle lorsqu’elle structure notre compréhension de questions qui traversent déjà ses frontières.',
    ],
    owe: [
      'Dans les politiques publiques et la technologie, nous devons demander non seulement ce qui est attendu de nous, mais ce que nous nous devons. Les ingénieurs n’ont pas à devenir décideurs, ni les décideurs à maîtriser chaque détail technique. Pourtant, lorsque les mêmes systèmes façonnent la vie collective, cette séparation ne peut plus justifier la distance.',
      'Lorsque plusieurs institutions détiennent chacune une partie du savoir nécessaire pour comprendre un risque grave, elles ont la responsabilité de rendre ces parties intelligibles entre elles. L’échec consiste à laisser les écarts intacts après que leurs conséquences sont devenues visibles.',
      'L’alignement ne signifie ni que la politique rattrape la technologie, ni que la technologie se soumet simplement à la politique. Il faut une compréhension commune suffisante pour que chacun voie ce que l’autre sait, ce qu’il ne peut savoir et où la responsabilité ne peut être transférée. L’accord parfait importe moins que la capacité d’expliquer les décisions et leurs conséquences.',
      'Cepheus est ma tentative de rendre ces relations plus faciles à voir. La plateforme ne dicterait pas les décisions et n’effacerait pas les désaccords. Elle montrerait où se trouvent le savoir et l’autorité, et où une institution dépend d’une autre. Un bon jugement suppose une image honnête du système dans lequel la décision est prise.',
      'Ainsi, ces relations forment davantage un système institutionnel qu’une simple opposition entre État et industrie. La carte ci-dessous en propose une première représentation :',
      'Aucune carte ne peut décider de ce que les institutions doivent faire. Elle peut toutefois rendre plus difficile l’affirmation selon laquelle le savoir ou la responsabilité appartenait entièrement à quelqu’un d’autre.',
      'Voilà peut-être ce que les mondes de la politique et de la technologie se doivent : non pas devenir identiques, mais faire l’effort sérieux de rendre leurs savoirs compréhensibles de part et d’autre de leur frontière.',
    ],
    gapCaption: 'Les points sous la diagonale ont une concentration des connaissances supérieure à l’autorité publique. Les domaines non notés restent marqués comme étant en attente d’évaluation.',
    frictionCaption: 'Modifiez les poids pour voir comment savoir, autorité, dépendance et coordination changent le classement.',
    linkCaption: 'Sélectionnez un point pour suivre l’influence, l’information et le financement. Les filtres montrent qui tient le système ensemble.',
  },
  'zh-CN': {
    opening: [
      '2026年2月，我坐在办公室里，打开了 Flipboard 的一条通知；美联社的报道讲述了 Anthropic 与美国国防部之间的一场对峙。',
      '争议涉及国防部可以在什么条件下使用 Claude。Anthropic 拒绝取消与大规模国内监控和完全自主武器有关的安全限制，理由是当前前沿系统对某些高风险用途仍不够可靠。国防部则认为，私人公司不应决定军方如何合法使用已经购买的技术。双方都声称是在保护国家安全。政府掌握公共权力，Anthropic 掌握技术专长和系统控制权；彼此都拥有对方无法轻易替代的东西。',
      '起初，我把它当作一项政府合同的纠纷，但它揭示了更大的制度问题：AI 在一个世界里被创造，却在另一个世界里被治理。开发系统的人、依法作出公共决定的人，以及承担失败后果的人，往往并非同一群人。',
      '这场冲突把我原本只在抽象层面理解的问题变成了制度现实。政府无法在缺少技术知识的情况下治理先进 AI；AI 公司也不能独自决定国防、安全、监控或生物风险的公共规则。任何一方都无法替代另一方，但连接双方的制度仍然破碎、临时，而且经常充满对抗。',
      '作为学生，我看到 ChatGPT 和 Claude 的发展速度很难与法律、公共机构和大学学科的慢节奏协调。真正的问题不是 AI 政策是否存在，而是谁拥有法律或政治权力，谁控制技术或基础设施，以及为什么没有一个可靠机构把这些群体连接起来。',
    ],
    questions: ['谁拥有法律或政治权力？', '谁控制技术或基础设施？', '为什么没有可靠的机构连接这些群体？'],
    bridge: [
      '第三个问题最为关键。我们需要的不是完美协调，也不是一个能够看见一切的单一机构。更现实的起点是让关系变得可见：谁理解技术，谁能够作出决定，责任又落在哪里。',
      '制度连接图展示具体机构及有文献记录的连接机制。每条连接都附有来源、日期，以及现有证据能够支持的结论范围。',
      '这就是 Cepheus 之链的核心。前沿 AI 的治理问题，在于知道的人、决定的人和承担风险的人之间的距离。距离越大，政策就越可能迟到、对抗或在技术上无法执行。因此，Cepheus 被设想为一个政策情报平台，用来描绘公共与私人机构之间的这种距离。',
    ],
    expected: [
      'AI 常被描述为只是发生在我们身上的事情：模型会更强，竞争会加剧，政府最终不得不适应。这种说法捕捉了变化的速度，却也可能让责任消失。在问政策能否跟上之前，我们应先问：我们应当承担什么？简单说，我们有许多坐满专家的房间，却没有足够的走廊把它们连起来。',
      '大部分前沿 AI 由少数私人公司开发。它们招募技术人才、运营算力基础设施、评估模型并控制模型发布。与此同时，公共部门面临严重的 AI 专业能力短缺。最接近技术的人因此与负责治理其公共后果的机构分离。',
      '权力以另一种方式被分割。政府把责任分配给立法机构、法院、国防部门、监管机构和国际组织。一个机构制定规则，另一个采购系统，还有一个可能只在出事后介入。责任仍然存在，却散落在不共享同样信息、甚至不同意问题定义的机构之间。',
      '分歧也体现在语言上。工程师倾向于问系统是否工作、表现是否可靠；政策制定者更关心谁获准使用、失败时谁负责；公司还必须考虑部署、竞争以及对客户或投资者的义务。大家讨论的是同一个模型，却把它看成不同种类的问题。',
      '时间表也很少一致。模型可能在几周内改变，而立法、司法审查和国际合作需要数年。把这一切简化为政策行动太慢并不准确：谨慎与程序正是公共机构的职责。私人公司通常可以更快行动，但速度本身并不会赋予公共合法性。',
      '当私人的技术选择开始塑造公共生活时，这种错位会更加严重。公司内部关于模型访问或安全限制的决定，可能影响国家安全、公民自由和关键基础设施。政府拥有权力，却可能缺少妥善行使权力所需的知识；公司理解技术，却没有决定所有公共用途的权力。',
      '因此，核心问题并非简单缺少专家。专业知识已经存在，只是分散在以不同方式组织知识与权力的机构中。专业化让复杂工作成为可能，但当问题已经跨越边界时，它也可能成为我们理解问题的障碍。',
    ],
    owe: [
      '从事政策和技术工作的人不仅要问社会对我们有什么期待，更要问我们彼此负有什么责任。工程师不必成为政策制定者，政策制定者也不必掌握每个技术细节。但当同一套系统开始塑造公共生活时，领域分工不再能为彼此的距离辩护。',
      '当不同机构各自掌握理解重大风险所需的一部分知识时，它们有责任让这些知识能够彼此理解。真正的失败，是在后果已经清晰之后仍允许鸿沟原样存在。',
      '协调并不是让政策追赶技术，也不是让技术简单服从政策。它应创造足够的共同理解，使各方看见对方知道什么、无法知道什么，以及责任不能继续转移的地方。目标不是完美一致，而是能够向彼此和承担后果的人解释决定。',
      'Cepheus 是我让这些关系更容易被看见的尝试。它不会告诉机构该作什么决定，也不会消除分歧；它会展示知识在哪里、权力在哪里，以及一个机构在哪里依赖另一个机构。良好的判断至少需要一幅诚实的系统图景。',
      '因此，这些关系构成的更像一个制度系统，而不是政府与产业之间的简单分界。下图是这一系统的初步图景：',
      '任何地图都不能决定机构应该做什么。但它可以让任何机构更难声称相关知识或责任完全属于别人。',
      '也许这正是政策与技术两个世界彼此负有的责任：不是变得相同，而是认真努力，让自己的知识能够跨越边界被理解。',
    ],
    gapCaption: '对角线下方的点表示知识集中度高于公共权力。尚未评分的领域在证据编码完成前标记为“评估待定”。',
    frictionCaption: '调整权重，测试知识、权力、依赖与协调如何改变排名。',
    linkCaption: '选择任意点，查看影响、信息和资金如何流动。使用筛选器观察谁把整个系统连接在一起。',
  },
}
