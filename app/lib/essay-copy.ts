import type { Locale } from './i18n'

type EssayLabels = {
  kicker: string
  titleLineOne: string
  titleLineTwo: string
  subtitle: string
  firstCollision: string
  gap: string
  expected: string
  friction: string
  owe: string
  link: string
  updated: string
}

export const essayLabels: Record<Locale, EssayLabels> = {
  en: {
    kicker: 'The Cepheus Link',
    titleLineOne: 'What We Owe',
    titleLineTwo: 'to Each Other',
    subtitle: 'What Technology and Policy Can Offer to Humanity',
    firstCollision: 'The First Collision',
    gap: 'The Gap',
    expected: 'What’s Expected of Us',
    friction: 'The Friction',
    owe: 'What Do We Owe to Each Other?',
    link: 'The Link',
    updated: 'August 2026',
  },
  ru: {
    kicker: 'Связь Cepheus',
    titleLineOne: 'Что мы должны',
    titleLineTwo: 'друг другу',
    subtitle: 'Что технологии и политика могут дать человечеству',
    firstCollision: 'Первое столкновение',
    gap: 'Разрыв',
    expected: 'Что от нас требуется',
    friction: 'Трение',
    owe: 'Что мы должны друг другу?',
    link: 'Связь',
    updated: 'Август 2026',
  },
  ko: {
    kicker: 'Cepheus 연결',
    titleLineOne: '우리는 서로에게',
    titleLineTwo: '무엇을 빚지고 있는가',
    subtitle: '기술과 정책이 인류에게 제공할 수 있는 것',
    firstCollision: '첫 번째 충돌',
    gap: '간극',
    expected: '우리에게 요구되는 것',
    friction: '마찰',
    owe: '우리는 서로에게 무엇을 빚지고 있는가?',
    link: '연결',
    updated: '2026년 8월',
  },
  fr: {
    kicker: 'Le lien Cepheus',
    titleLineOne: 'Ce que nous nous',
    titleLineTwo: 'devons les uns aux autres',
    subtitle: 'Ce que la technologie et les politiques peuvent offrir à l’humanité',
    firstCollision: 'La première collision',
    gap: 'L’écart',
    expected: 'Ce qui est attendu de nous',
    friction: 'La friction',
    owe: 'Que nous devons-nous les uns aux autres ?',
    link: 'Le lien',
    updated: 'Août 2026',
  },
  'zh-CN': {
    kicker: 'Cepheus 之链',
    titleLineOne: '我们彼此',
    titleLineTwo: '负有什么责任',
    subtitle: '技术与政策能够为人类提供什么',
    firstCollision: '第一次碰撞',
    gap: '鸿沟',
    expected: '我们应当承担什么',
    friction: '摩擦',
    owe: '我们彼此负有什么责任？',
    link: '连接',
    updated: '2026年8月',
  },
}
