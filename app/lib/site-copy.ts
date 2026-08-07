import type { Locale } from './i18n'

type SiteCopy = {
  essays: string
  essayTitle: string
  essayMenuTitle: string
  projects: string
  writDescription: string
  home: string
  footer: string
  backToTop: string
  tagline: string
  disclaimer: string
  dark: string
  light: string
  language: string
  landingHint: string
  contents: string
  sections: string
  sideNote: string
  download: string
  lastUpdated: string
}

export const siteCopy: Record<Locale, SiteCopy> = {
  en: {
    essays: 'essays',
    essayTitle: 'The Cepheus Link',
    essayMenuTitle: 'What We Owe to Each Other',
    projects: 'projects',
    writDescription: 'domain-specific language for global affairs',
    home: 'Home',
    footer: 'Footer',
    backToTop: 'Back to top',
    tagline: 'Bridging the gap between policy and technology.',
    disclaimer:
      'The instruments in this essay are illustrative. Cepheus is a proposed platform; the figures are synthetic and drawn from the cited sources to show how such a map might read.',
    dark: 'Switch to dark mode',
    light: 'Switch to light mode',
    language: 'Language',
    landingHint: 'Click anywhere to trace a connection',
    contents: 'Essay contents',
    sections: 'Sections',
    sideNote:
      'AI is often built in one world and governed in another. Cepheus is an AI-for-policy project that maps the gaps between technological innovation and institutional responsibility.',
    download: 'Download report (PDF)',
    lastUpdated: 'Last updated',
  },
  ru: {
    essays: 'эссе',
    essayTitle: 'Связь Cepheus',
    essayMenuTitle: 'Связь Cepheus',
    projects: 'Проекты',
    writDescription: 'Предметно-ориентированный язык для глобальных отношений',
    home: 'Главная',
    footer: 'Нижняя навигация',
    backToTop: 'Наверх',
    tagline: 'Преодолевая разрыв между политикой и технологиями.',
    disclaimer:
      'Инструменты в этом эссе носят иллюстративный характер. Cepheus — предлагаемая платформа; данные синтетические и основаны на указанных источниках, чтобы показать, как могла бы выглядеть такая карта.',
    dark: 'Включить тёмную тему',
    light: 'Включить светлую тему',
    language: 'Язык',
    landingHint: 'Нажмите в любом месте, чтобы провести связь',
    contents: 'Содержание эссе',
    sections: 'Разделы',
    sideNote:
      'Технологии часто создаются в одном мире, а регулируются в другом. Cepheus показывает расстояние между ними.',
    download: 'Скачать отчёт (PDF)',
    lastUpdated: 'Обновлено',
  },
  ko: {
    essays: '에세이',
    essayTitle: 'Cepheus 연결',
    essayMenuTitle: 'Cepheus 연결',
    projects: '프로젝트',
    writDescription: '국제 관계를 위한 도메인 특화 언어',
    home: '홈',
    footer: '하단 메뉴',
    backToTop: '맨 위로',
    tagline: '정책과 기술 사이의 간극을 잇습니다.',
    disclaimer:
      '이 에세이의 도구는 설명을 위한 것입니다. Cepheus는 제안 단계의 플랫폼이며, 수치는 인용 자료를 바탕으로 구성한 합성 데이터로서 이러한 지도가 어떻게 읽힐 수 있는지 보여 줍니다.',
    dark: '어두운 모드로 전환',
    light: '밝은 모드로 전환',
    language: '언어',
    landingHint: '아무 곳이나 클릭해 연결을 그려 보세요',
    contents: '에세이 목차',
    sections: '섹션',
    sideNote:
      '기술은 한 세계에서 만들어지고 다른 세계에서 통치되곤 합니다. Cepheus는 그 사이의 거리를 그립니다.',
    download: '보고서 다운로드(PDF)',
    lastUpdated: '최근 업데이트',
  },
  fr: {
    essays: 'essais',
    essayTitle: 'Le lien Cepheus',
    essayMenuTitle: 'Le lien Cepheus',
    projects: 'Projets',
    writDescription: 'Un langage spécialisé pour les affaires mondiales',
    home: 'Accueil',
    footer: 'Pied de page',
    backToTop: 'Haut de page',
    tagline: 'Rapprocher les politiques publiques et la technologie.',
    disclaimer:
      'Les instruments de cet essai sont illustratifs. Cepheus est une plateforme proposée ; les données sont synthétiques et tirées des sources citées afin de montrer à quoi une telle carte pourrait ressembler.',
    dark: 'Passer au thème sombre',
    light: 'Passer au thème clair',
    language: 'Langue',
    landingHint: 'Cliquez n’importe où pour tracer un lien',
    contents: 'Sommaire de l’essai',
    sections: 'Sections',
    sideNote:
      'La technologie est souvent conçue dans un monde et gouvernée dans un autre. Cepheus cartographie la distance entre les deux.',
    download: 'Télécharger le rapport (PDF)',
    lastUpdated: 'Dernière mise à jour',
  },
  'zh-CN': {
    essays: '文章',
    essayTitle: 'Cepheus 之链',
    essayMenuTitle: 'Cepheus 之链',
    projects: '项目',
    writDescription: '面向全球事务的领域专用语言',
    home: '首页',
    footer: '页脚',
    backToTop: '返回顶部',
    tagline: '弥合政策与技术之间的鸿沟。',
    disclaimer:
      '本文中的工具仅作说明之用。Cepheus 是一个拟议中的平台；数据为依据所引来源构造的合成数据，用于展示这类地图可能呈现的方式。',
    dark: '切换到深色模式',
    light: '切换到浅色模式',
    language: '语言',
    landingHint: '点击任意位置，描绘一条连接',
    contents: '文章目录',
    sections: '章节',
    sideNote:
      '技术往往诞生于一个世界，却由另一个世界治理。Cepheus 描绘两者之间的距离。',
    download: '下载报告（PDF）',
    lastUpdated: '最近更新',
  },
}
