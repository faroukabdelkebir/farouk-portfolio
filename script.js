const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

$('#year').textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $('.menu-toggle');
const nav = $('.nav');
menuToggle.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
});
$$('.nav a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Progressive reveal animations
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
$$('.reveal').forEach(el => revealObserver.observe(el));

// Cursor light effect (disabled on touch devices)
if (window.matchMedia('(pointer: fine)').matches) {
  const glow = $('.cursor-glow');
  window.addEventListener('pointermove', event => {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }, { passive: true });
}

// Subtle 3D tilt on project cards
if (window.matchMedia('(pointer: fine) and (prefers-reduced-motion: no-preference)').matches) {
  $$('[data-tilt]').forEach(card => {
    card.addEventListener('pointermove', event => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${y * -2.2}deg) rotateY(${x * 2.2}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });
}

// Project modal content — only facts present in the provided CV are included.
const projects = {
  databridge: {
    kicker: 'PFE · WEVIOO',
    title: 'DataBridge Banking',
    description: 'Development and deployment of a platform for extracting and migrating Temenos T24 banking data. A microservices ETL platform with full and incremental idempotent loads, data integrity and traceability, OAuth2 security through Kong Gateway, real-time monitoring and alerts, dashboards, two AI agents for scheduling recommendations and data-quality auditing, and CI/CD deployment on AWS.',
    tags: ['Java 21', 'Spring Boot', 'Spring Batch', 'Spring Security / OAuth2', 'Angular', 'Django', 'Kong Gateway', 'Eureka', 'Oracle', 'SQL Server', 'Ollama / Qwen2.5', 'Docker', 'GitHub Actions', 'SonarQube', 'Nexus', 'Prometheus', 'Grafana', 'AWS'],
    fr: {
      description: 'Développement et déploiement d’une plateforme d’extraction et de migration des données bancaires Temenos T24. Une plateforme ETL en microservices avec des chargements complets et incrémentaux idempotents, l’intégrité et la traçabilité des données, une sécurité OAuth2 via Kong Gateway, une supervision et des alertes en temps réel, des tableaux de bord, deux agents IA pour la recommandation de planification et l’audit de la qualité des données, ainsi qu’un déploiement CI/CD sur AWS.'
    }
  },
  flowsigna: {
    kicker: 'ENGINEERING INTERNSHIP · ALMA TECHNOLOGIES',
    title: 'FlowSigna',
    description: 'An electronic document workflow that centralizes document deposit, validation, signature, and archiving. The project uses a Flowable BPMN workflow and a secured Angular interface with Spring Security and JWT.',
    tags: ['Spring Boot', 'Spring Security', 'Flowable BPMN', 'Angular', 'REST', 'JWT'],
    fr: {
      kicker: 'STAGE D’INGÉNIEUR · ALMA TECHNOLOGIES',
      description: 'Un workflow de documents électroniques qui centralise le dépôt, la validation, la signature et l’archivage des documents. Le projet s’appuie sur un workflow BPMN Flowable et une interface Angular sécurisée avec Spring Security et JWT.'
    }
  },
  devops: {
    kicker: 'DEVOPS PROJECT',
    title: 'CI/CD & Kubernetes',
    description: 'Implementation of CI/CD pipelines for a Spring Boot and Angular application, including build, tests, code-quality analysis and vulnerability scanning with SonarQube, packaging with Nexus, Docker images, automated Kubernetes deployment, and monitoring with Prometheus and Grafana.',
    tags: ['Jenkins', 'GitLab', 'Maven', 'Vagrant', 'Docker', 'Kubernetes', 'Nexus', 'SonarQube', 'Prometheus', 'Grafana', 'Spring Boot', 'Angular', 'MySQL'],
    fr: {
      kicker: 'PROJET DEVOPS',
      description: 'Mise en place de pipelines CI/CD pour une application Spring Boot et Angular : build, tests, analyse de la qualité du code et détection des vulnérabilités avec SonarQube, packaging avec Nexus, images Docker, déploiement automatisé sur Kubernetes et supervision avec Prometheus et Grafana.'
    }
  },
  skillup: {
    kicker: 'FULL-STACK PROJECT',
    title: 'SkillUp',
    description: 'An online learning platform designed with a microservices architecture using Spring Cloud Config Server, Eureka, and API Gateway. It is secured with Keycloak, uses Docker containers, and includes a user microservice in Python.',
    tags: ['Java 17', 'Python', 'Spring Boot', 'Spring Cloud', 'Angular', 'Keycloak', 'Docker', 'MySQL', 'PostgreSQL', 'H2'],
    fr: {
      kicker: 'PROJET FULL-STACK',
      description: 'Une plateforme d’apprentissage en ligne conçue selon une architecture microservices avec Spring Cloud Config Server, Eureka et API Gateway. Elle est sécurisée avec Keycloak, conteneurisée avec Docker et inclut un microservice utilisateurs en Python.'
    }
  },
  rssport: {
    kicker: 'SPORTS ANALYTICS PROJECT',
    title: 'RS SPORT',
    description: 'A Spring Boot and Angular platform featuring an interactive tactical board for creation, animation and simulation, real-time secured chat, medical tracking for injuries and recovery indicators, and a RAG-based AI feature for personalized recovery plans.',
    tags: ['Spring Boot', 'Angular', 'Maven', 'MySQL', 'AI / RAG', 'WebSocket'],
    fr: {
      kicker: 'PROJET D’ANALYSE SPORTIVE',
      description: 'Une plateforme Spring Boot et Angular proposant un tableau tactique interactif (création, animation et simulation), un chat sécurisé en temps réel, un suivi médical des blessures et des indicateurs de récupération, ainsi qu’une fonctionnalité d’IA basée sur le RAG pour des plans de récupération personnalisés.'
    }
  }
};
const dialog = $('#project-dialog');
$$('.project-details').forEach(button => {
  button.addEventListener('click', () => {
    const project = projects[button.dataset.project];
    if (!project) return;
    const text = { ...project, ...project[currentLang] };
    $('#dialog-kicker').textContent = text.kicker;
    $('#dialog-title').textContent = text.title;
    $('#dialog-description').textContent = text.description;
    const tags = $('#dialog-tags');
    tags.replaceChildren(...project.tags.map(tag => {
      const span = document.createElement('span');
      span.textContent = tag;
      return span;
    }));
    dialog.showModal();
  });
});
$('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

// Language switch — English lives in the HTML; French strings are keyed by data-i18n / data-i18n-attr.
const translations = {
  en: {},
  fr: {
    'meta.title': 'Farouk Abdelkebir | Ingénieur logiciel',
    'meta.description': 'Farouk Abdelkebir — Ingénieur logiciel full stack qui développe des applications frontend et backend avec des technologies web modernes, le cloud, le DevOps et l’IA.',
    'brand.label': 'Accueil Farouk Abdelkebir',
    'nav.label': 'Navigation principale',
    'nav.toggle': 'Ouvrir ou fermer la navigation',
    'nav.work': 'Projets',
    'nav.about': 'À propos',
    'nav.stack': 'Compétences',
    'nav.experience': 'Parcours',
    'nav.contact': 'Discutons <span>↗</span>',
    'lang.switch': 'Passer en anglais',

    'hero.eyebrow': '<span class="status-dot"></span> INGÉNIEUR LOGICIEL FULL STACK <span class="eyebrow-divider">/</span> TUNISIE',
    'hero.title': 'Transformer les idées en<br><span class="gradient-text">solutions full-stack.</span>',
    'hero.description': 'Je développe des applications web de bout en bout, des interfaces Angular intuitives aux services Java et Spring sécurisés, avec du cloud, du DevOps, des bases de données et de l’IA là où ils apportent de la valeur.',
    'hero.explore': 'Découvrir mes projets <span>↘</span>',
    'hero.cv': 'Télécharger le CV <span>↓</span>',
    'hero.cvFile': 'assets/Farouk-Abdelkebir-CV.pdf',
    'hero.meta': '<i class="meta-line"></i> Angular · Spring · Cloud · IA',
    'hero.open': 'OUVERT AUX OPPORTUNITÉS',
    'hero.artLabel': 'Illustration 3D d’un développeur full-stack travaillant sur un poste multi-écrans',
    'hero.artAlt': 'Un développeur travaillant sur un poste entouré de code, de tableaux de bord applicatifs et de panneaux technologiques',
    'hero.artTag': '<span class="status-dot"></span> CONCEVOIR · DÉVELOPPER · DÉPLOYER',
    'hero.scroll': '<span class="scroll-line"></span> DÉFILER POUR EXPLORER',

    'work.eyebrow': '01 / PROJETS SÉLECTIONNÉS',
    'work.title': 'Conçus pour résoudre<br><span class="muted">de vrais problèmes.</span>',
    'work.intro': 'Une sélection de projets d’ingénierie couvrant les données bancaires, l’automatisation de workflows, l’infrastructure et les applications intelligentes.',
    'work.case1': 'ÉTUDE DE CAS / 01',
    'work.case2': 'ÉTUDE DE CAS / 02',
    'work.case3': 'ÉTUDE DE CAS / 03',
    'work.case4': 'ÉTUDE DE CAS / 04',
    'work.case5': 'ÉTUDE DE CAS / 05',
    'work.chip1': 'DONNÉES BANCAIRES',
    'work.chip3': 'PLATEFORME',
    'work.chip5': 'TECH SPORTIVE',
    'work.stepDeposit': 'Dépôt',
    'work.stepValidate': 'Validation',
    'work.stepSign': 'Signature',
    'work.stepArchive': 'Archivage',
    'work.kicker3': 'PROJET DEVOPS',
    'work.kicker4': 'PLATEFORME FULL-STACK',
    'work.kicker5': 'ANALYSE SPORTIVE',
    'work.databridge': 'Une plateforme microservices conçue pour industrialiser les flux ETL des données bancaires Temenos T24, avec des chargements complets et incrémentaux, la traçabilité, la supervision et des opérations assistées par l’IA.',
    'work.flowsigna': 'Un workflow de documents électroniques pour le dépôt, la validation, la signature et l’archivage, orchestré en BPMN avec une interface Angular sécurisée.',
    'work.devops': 'Un pipeline de livraison pour une application full-stack Spring Boot et Angular, couvrant le build, les tests, l’analyse de qualité, le packaging, la conteneurisation, le déploiement et la supervision.',
    'work.skillup': 'Une plateforme d’apprentissage en ligne bâtie sur des microservices Spring Cloud, avec découverte de services, configuration centralisée, routage via API Gateway et authentification Keycloak.',
    'work.rssport': 'Une plateforme sportive qui combine un tableau tactique interactif, un chat en temps réel, le suivi des blessures des joueurs, des indicateurs de récupération et des plans de récupération assistés par l’IA grâce au RAG.',
    'work.overview': 'Aperçu du projet <span>↗</span>',
    'work.demo': '<span class="watch-demo-icon" aria-hidden="true">▶</span> Voir la démo vidéo <span class="watch-demo-arrow" aria-hidden="true">↗</span>',
    'work.demoDatabridge': 'Voir la démo vidéo de DataBridge',
    'work.demoFlowsigna': 'Voir la démo vidéo de FlowSigna',
    'work.demoRssport': 'Voir la démo vidéo de RS SPORT',
    'work.note': 'Cliquez sur un projet pour voir ses détails.',

    'about.eyebrow': '02 / À PROPOS',
    'about.title': 'Une ingénierie<br><span class="gradient-text">qui a du sens.</span>',
    'about.stamp': '<span>INGÉNIERIE</span><b>✳</b><span>LOGICIELLE</span>',
    'about.lead': 'Je suis Farouk, ingénieur logiciel passionné par la conception d’applications robustes et des systèmes qui les rendent fiables.',
    'about.p1': 'Mon travail couvre le développement backend, les microservices, l’automatisation de workflows, le CI/CD, les bases de données et les fonctionnalités basées sur l’IA. J’aime transformer des besoins complexes en logiciels maintenables, avec une architecture claire et une vraie valeur pratique.',
    'about.p2': 'Mon expérience comprend un projet de fin d’études chez Wevioo, consacré à l’extraction et à la migration de données bancaires, ainsi qu’un stage d’ingénieur chez Alma Technologies sur un workflow de documents électroniques.',
    'about.fact1': 'Frontend &<br>expérience utilisateur',
    'about.fact2': 'Backend &<br>ingénierie d’API',
    'about.fact3': 'Cloud, DevOps &<br>IA appliquée',
    'about.journey': 'Découvrir mon parcours <span>↘</span>',

    'stack.eyebrow': '03 / BOÎTE À OUTILS',
    'stack.title': 'Les outils au service<br><span class="muted">de mon travail.</span>',
    'stack.intro': 'Une boîte à outils pratique pour concevoir, sécuriser, livrer et superviser des systèmes logiciels.',
    'stack.label1': '01 / LANGAGES',
    'stack.title1': 'Langages',
    'stack.responsive': 'UI responsive',
    'stack.title3': 'Backend & API',
    'stack.rest': 'API REST',
    'stack.label4': '04 / LIVRAISON',
    'stack.label5': '05 / DONNÉES & SÉCURITÉ',
    'stack.title5': 'Données, sécurité & IA',

    'exp.eyebrow': '04 / EXPÉRIENCE & FORMATION',
    'exp.title': 'Mon parcours.',
    'exp.intro': 'Apprendre à travers des projets réels, des équipes d’ingénierie et une pratique continue.',
    'exp.date1': 'FÉV. 2026 — AOÛT 2026',
    'exp.date2': 'JUIL. 2025 — SEPT. 2025',
    'exp.date3': 'FÉV. 2023 — JUIN 2023',
    'exp.type1': 'STAGE DE PROJET DE FIN D’ÉTUDES',
    'exp.type2': 'STAGE D’INGÉNIEUR',
    'exp.type3': 'STAGE DE FIN D’ÉTUDES',
    'exp.type4': 'DIPLÔME D’INGÉNIEUR',
    'exp.type5': 'DIPLÔME TECHNIQUE',
    'exp.place4': '· Ariana, Tunisie',
    'exp.desc1': 'Développement et déploiement d’une plateforme d’extraction et de migration des données bancaires Temenos T24.',
    'exp.desc2': 'Conception et développement d’un workflow de signature électronique de documents.',
    'exp.desc3': 'Automatisation d’un système d’espacement de cylindres.',
    'exp.desc4': 'Diplôme national d’ingénieur en informatique — Génie logiciel.',
    'exp.desc5': 'Diplôme de technicien supérieur en informatique industrielle.',
    'exp.certNvidia': 'NVIDIA · novembre 2025',
    'exp.certTcf': 'décembre 2024',

    'contact.title': 'Un défi<br>à <span class="gradient-text">relever&nbsp;?</span>',
    'contact.copy': 'Je recherche des projets d’ingénierie porteurs de sens, des collaborations et des opportunités pour continuer à construire.',
    'contact.location': 'Ariana, Tunisie',
    'footer.tagline': 'Conçu et développé avec intention.',
    'dialog.close': 'Fermer les détails du projet',
    'dialog.note': 'Pour plus de détails, consultez mon compte GitHub.'
  }
};

const metaDescription = $('meta[name="description"]');
const i18nElements = $$('[data-i18n]');
const i18nAttrElements = $$('[data-i18n-attr]').map(el => {
  const [attr, key] = el.dataset.i18nAttr.split(':');
  return { el, attr, key };
});

// Capture the English originals from the page so they only exist in one place.
translations.en['meta.title'] = document.title;
translations.en['meta.description'] = metaDescription.content;
i18nElements.forEach(el => { translations.en[el.dataset.i18n] ??= el.innerHTML; });
i18nAttrElements.forEach(({ el, attr, key }) => { translations.en[key] ??= el.getAttribute(attr); });

let currentLang = 'en';
const langSwitch = $('.lang-switch');

function setLanguage(lang) {
  currentLang = lang in translations ? lang : 'en';
  const t = key => translations[currentLang][key] ?? translations.en[key];
  document.documentElement.lang = currentLang;
  document.title = t('meta.title');
  metaDescription.content = t('meta.description');
  i18nElements.forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  i18nAttrElements.forEach(({ el, attr, key }) => el.setAttribute(attr, t(key)));
  $$('span', langSwitch).forEach(span => span.classList.toggle('active', span.dataset.lang === currentLang));
}

langSwitch.addEventListener('click', () => {
  setLanguage(currentLang === 'en' ? 'fr' : 'en');
  try { localStorage.setItem('lang', currentLang); } catch {}
});

let savedLang = null;
try { savedLang = localStorage.getItem('lang'); } catch {}
setLanguage(savedLang ?? (navigator.language.startsWith('fr') ? 'fr' : 'en'));
