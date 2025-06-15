import type { Law, LawCategory } from "@/core/domain/models/law"

export const lawCategories: LawCategory[] = [
  {
    id: "presidential-decrees",
    name: {
      ar: "القرارات الجمهورية",
      en: "Presidential Decrees",
    },
    description: {
      ar: "القرارات الجمهورية المتعلقة بالأمن السيبراني",
      en: "Presidential decrees related to cybersecurity",
    },
  },
  {
    id: "executive-regulations",
    name: {
      ar: "اللوائح التنفيذية",
      en: "Executive Regulations",
    },
    description: {
      ar: "اللوائح التنفيذية للأمن السيبراني",
      en: "Cybersecurity executive regulations",
    },
  },
  {
    id: "policies",
    name: {
      ar: "السياسات",
      en: "Policies",
    },
    description: {
      ar: "سياسات الأمن السيبراني",
      en: "Cybersecurity policies",
    },
  },
]

export const lawsData: Law[] = [
  {
    id: "1",
    title: {
      ar: "قرار جمهوري رقم (6) لسنة 2020",
      en: "Presidential Decree No. (6) of 2020",
    },
    category: "presidential-decrees",
    description: {
      ar: "قرار جمهوري بشأن تنظيم الهيئة الوطنية للأمن السيبراني",
      en: "Presidential decree regarding the organization of the National Cybersecurity Authority",
    },
    content: {
      ar: `<p>بعون الله تعالى</p>
      <p>رئيس الجمهورية</p>
      <p>بعد الاطلاع على الدستور،</p>
      <p>وعلى قانون تنظيم الاتصالات الصادر بالقانون رقم 10 لسنة 2003،</p>
      <p>وعلى قانون مكافحة جرائم تقنية المعلومات،</p>
      <p>وبناءً على ما عرضه رئيس مجلس الوزراء،</p>
      <p>وبعد موافقة مجلس الوزراء،</p>
      <p>قرر:</p>
      <p>المادة الأولى: إنشاء الهيئة الوطنية للأمن السيبراني، وتكون لها الشخصية الاعتبارية، وتتبع رئيس الجمهورية.</p>
      <p>المادة الثانية: على الجهات المختصة تنفيذ هذا القرار، ويعمل به من تاريخ نشره في الجريدة الرسمية.</p>`,
      en: `<p>With the help of Almighty Allah,</p>
      <p>The President of the Republic,</p>
      <p>After reviewing the Constitution,</p>
      <p>And the Telecommunications Regulation Law promulgated by Law No. 10 of 2003,</p>
      <p>And the Anti-Cybercrime Law,</p>
      <p>Based on what was presented by the Prime Minister,</p>
      <p>And after the approval of the Council of Ministers,</p>
      <p>Decided:</p>
      <p>Article One: Establishing the National Cybersecurity Authority, which shall have legal personality and report to the President of the Republic.</p>
      <p>Article Two: The competent authorities shall implement this decree, and it shall come into effect from the date of its publication in the Official Gazette.</p>`,
    },
    publishDate: "2020-08-28",
    documentUrl: "https://example.com/presidential-decree-6.pdf",
  },
  {
    id: "2",
    title: {
      ar: "اللائحة التنفيذية للأمن السيبراني",
      en: "Cybersecurity Executive Regulation",
    },
    category: "executive-regulations",
    description: {
      ar: "اللائحة التنفيذية للأمن السيبراني الصادرة عن الهيئة الوطنية للأمن السيبراني",
      en: "Cybersecurity Executive Regulation issued by the National Cybersecurity Authority",
    },
    content: {
      ar: `<p>المادة الأولى: التعريفات</p>
      <p>يقصد بالألفاظ والعبارات الآتية -أينما وردت في هذه اللائحة- المعاني المبينة أمام كل منها، ما لم يقتض السياق خلاف ذلك:</p>
      <p>الأمن السيبراني: حماية الشبكات وأنظمة تقنية المعلومات وأنظمة التقنيات التشغيلية ومكوناتها من أجهزة وبرمجيات، وما تقدمه من خدمات، وما تحويه من بيانات، من أي اختراق أو تعطيل أو تعديل أو دخول أو استخدام أو استغلال غير مشروع.</p>
      <p>المخاطر السيبرانية: احتمالية تعرض الأصول السيبرانية للتهديدات السيبرانية، وما ينتج عن ذلك من آثار.</p>
      <p>الحوادث السيبرانية: حدث أو سلسلة أحداث غير مت��قعة أو غير مرغوب فيها تهدد الأمن السيبراني.</p>`,
      en: `<p>Article One: Definitions</p>
      <p>The following terms and phrases - wherever mentioned in this regulation - shall have the meanings indicated next to each of them, unless the context requires otherwise:</p>
      <p>Cybersecurity: Protection of networks, information technology systems, operational technology systems and their components of hardware and software, and the services they provide, and the data they contain, from any breach, disruption, modification, entry, use or illegal exploitation.</p>
      <p>Cyber Risks: The probability of cyber assets being exposed to cyber threats, and the resulting effects.</p>
      <p>Cyber Incidents: An unexpected or unwanted event or series of events that threaten cybersecurity.</p>`,
    },
    publishDate: "2022-03-15",
    documentUrl: "https://example.com/cybersecurity-executive-regulation.pdf",
  },
  {
    id: "3",
    title: {
      ar: "السياسة الوطنية للأمن السيبراني",
      en: "National Cybersecurity Policy",
    },
    category: "policies",
    description: {
      ar: "السياسة الوطنية للأمن السيبراني في المملكة العربية السعودية",
      en: "National Cybersecurity Policy in the Kingdom of Saudi Arabia",
    },
    content: {
      ar: `<p>أولاً: المقدمة</p>
      <p>تهدف السياسة الوطنية للأمن السيبراني إلى تعزيز الأمن السيبراني في المملكة العربية السعودية، وحماية مصالحها الحيوية وأمنها الوطني والبنى التحتية الحساسة فيها، وتقليل المخاطر السيبرانية.</p>
      <p>ثانياً: الأهداف</p>
      <p>1. حماية الشبكات وأنظمة تقنية المعلومات وأنظمة التقنيات التشغيلية ومكوناتها.</p>
      <p>2. تحسين وحماية الأمن السيبراني للمملكة.</p>
      <p>3. حماية المصالح الحيوية للدولة والبنى التحتية الحساسة والقطاعات ذات الأولوية.</p>
      <p>4. تقليل المخاطر السيبرانية.</p>
      <p>5. تعزيز الأمن الوطني.</p>`,
      en: `<p>First: Introduction</p>
      <p>The National Cybersecurity Policy aims to enhance cybersecurity in the Kingdom of Saudi Arabia, protect its vital interests, national security and critical infrastructure, and reduce cyber risks.</p>
      <p>Second: Objectives</p>
      <p>1. Protect networks, information technology systems, operational technology systems and their components.</p>
      <p>2. Improve and protect the Kingdom's cybersecurity.</p>
      <p>3. Protect the state's vital interests, critical infrastructure and priority sectors.</p>
      <p>4. Reduce cyber risks.</p>
      <p>5. Enhance national security.</p>`,
    },
    publishDate: "2021-06-20",
    documentUrl: "https://example.com/national-cybersecurity-policy.pdf",
  },
  {
    id: "4",
    title: {
      ar: "الضوابط الأساسية للأمن السيبراني",
      en: "Essential Cybersecurity Controls",
    },
    category: "executive-regulations",
    description: {
      ar: "الضوابط الأساسية للأمن السيبراني الصادرة عن الهيئة الوطنية للأمن السيبراني",
      en: "Essential Cybersecurity Controls issued by the National Cybersecurity Authority",
    },
    content: {
      ar: `<p>المجال الأول: حوكمة الأمن السيبراني</p>
      <p>الضابط 1-1: استراتيجية الأمن السيبراني</p>
      <p>يجب تطوير وتوثيق واعتماد استراتيجية للأمن السيبراني متوافقة مع استراتيجية الجهة وأهدافها.</p>
      <p>الضابط 1-2: سياسات وإجراءات الأمن السيبراني</p>
      <p>يجب تطوير وتوثيق واعتماد سياسات وإجراءات للأمن السيبراني تغطي جميع مجالات الأمن السيبراني.</p>
      <p>الضابط 1-3: أدوار ومسؤوليات الأمن السيبراني</p>
      <p>يجب تحديد وتوثيق واعتماد أدوار ومسؤوليات الأمن السيبراني داخل الجهة.</p>`,
      en: `<p>Domain 1: Cybersecurity Governance</p>
      <p>Control 1-1: Cybersecurity Strategy</p>
      <p>A cybersecurity strategy aligned with the entity's strategy and objectives must be developed, documented and approved.</p>
      <p>Control 1-2: Cybersecurity Policies and Procedures</p>
      <p>Cybersecurity policies and procedures covering all areas of cybersecurity must be developed, documented and approved.</p>
      <p>Control 1-3: Cybersecurity Roles and Responsibilities</p>
      <p>Cybersecurity roles and responsibilities within the entity must be defined, documented and approved.</p>`,
    },
    publishDate: "2022-01-10",
    documentUrl: "https://example.com/essential-cybersecurity-controls.pdf",
  },
  {
    id: "5",
    title: {
      ar: "الإطار التنظيمي للأمن السيبراني للأنظمة الحساسة",
      en: "Regulatory Framework for Cybersecurity of Critical Systems",
    },
    category: "policies",
    description: {
      ar: "الإطار التنظيمي للأمن السيبراني للأنظمة الحساسة في القطاعات الحيوية",
      en: "Regulatory Framework for Cybersecurity of Critical Systems in Vital Sectors",
    },
    content: {
      ar: `<p>المقدمة</p>
      <p>يهدف هذا الإطار إلى تحديد المتطلبات التنظيمية للأمن السيبراني للأنظمة الحساسة في القطاعات الحيوية، وذلك لضمان استمرارية الأعمال وحماية المصالح الوطنية.</p>
      <p>نطاق التطبيق</p>
      <p>يطبق هذا الإطار على جميع الجهات التي تمتلك أو تشغل أنظمة حساسة في القطاعات الحيوية، بما في ذلك:</p>
      <p>1. قطاع الطاقة</p>
      <p>2. قطاع الاتصالات وتقنية المعلومات</p>
      <p>3. قطاع المياه</p>
      <p>4. قطاع الصحة</p>
      <p>5. قطاع النقل</p>
      <p>6. قطاع الخدمات المالية</p>`,
      en: `<p>Introduction</p>
      <p>This framework aims to define the regulatory requirements for cybersecurity of critical systems in vital sectors, in order to ensure business continuity and protect national interests.</p>
      <p>Scope of Application</p>
      <p>This framework applies to all entities that own or operate critical systems in vital sectors, including:</p>
      <p>1. Energy sector</p>
      <p>2. Communications and information technology sector</p>
      <p>3. Water sector</p>
      <p>4. Health sector</p>
      <p>5. Transportation sector</p>
      <p>6. Financial services sector</p>`,
    },
    publishDate: "2021-09-05",
    documentUrl: "https://example.com/regulatory-framework-critical-systems.pdf",
  },
]
