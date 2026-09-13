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
      'Cepheus is a proposed platform. Its institutional map is a historical research pilot with sourced, provisional records and explicit limits.',
    dark: 'Switch to dark mode',
    light: 'Switch to light mode',
    language: 'Language',
    landingHint: 'Click anywhere to trace a connection',
    contents: 'Essay contents',
    sections: 'Sections',
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
      'Cepheus — предлагаемая платформа. Карта институциональных связей — пилотное исследование исторических данных с источниками, предварительными записями и явными ограничениями.',
    dark: 'Включить тёмную тему',
    light: 'Включить светлую тему',
    language: 'Язык',
    landingHint: 'Нажмите в любом месте, чтобы провести связь',
    contents: 'Содержание эссе',
    sections: 'Разделы',
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
      'Cepheus는 제안 단계의 플랫폼입니다. 제도 연결 지도는 출처와 한계를 명시한 잠정적 과거 기록을 사용하는 연구 시범 작업입니다.',
    dark: '어두운 모드로 전환',
    light: '밝은 모드로 전환',
    language: '언어',
    landingHint: '아무 곳이나 클릭해 연결을 그려 보세요',
    contents: '에세이 목차',
    sections: '섹션',
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
      'Cepheus est une plateforme proposée. Sa carte institutionnelle est une étude pilote historique, composée de liens provisoires accompagnés de sources et de limites explicites.',
    dark: 'Passer au thème sombre',
    light: 'Passer au thème clair',
    language: 'Langue',
    landingHint: 'Cliquez n’importe où pour tracer un lien',
    contents: 'Sommaire de l’essai',
    sections: 'Sections',
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
      'Cepheus 是一个拟议中的平台。制度连接图是一项历史研究试点，使用附有来源、明确局限且尚待复核的记录。',
    dark: '切换到深色模式',
    light: '切换到浅色模式',
    language: '语言',
    landingHint: '点击任意位置，描绘一条连接',
    contents: '文章目录',
    sections: '章节',
    download: '下载报告（PDF）',
    lastUpdated: '最近更新',
  },
}
