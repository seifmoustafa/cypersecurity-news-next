import type { Framework, FrameworkFunction, FrameworkCategory, Domain, Component } from "@/core/domain/models/framework"

export const frameworkData: Framework = {
  id: "nist-csf",
  nameAr: "إطار عمل الأمن السيبراني",
  nameEn: "Cybersecurity Framework",
  descriptionAr: "إطار عمل شامل لتحسين الأمن السيبراني وإدارة المخاطر في المؤسسات",
  descriptionEn: "A comprehensive framework for improving cybersecurity and risk management in organizations",
  version: "1.1",
}

export const frameworkFunctionsData: FrameworkFunction[] = [
  {
    id: "identify",
    nameAr: "تحديد",
    nameEn: "Identify",
    descriptionAr: "تطوير فهم تنظيمي لإدارة مخاطر الأمن السيبراني للأنظمة والأصول والبيانات والقدرات",
    descriptionEn:
      "Develop organizational understanding to manage cybersecurity risks to systems, assets, data, and capabilities",
    color: "#3b82f6", // blue-500
    order: 1,
  },
  {
    id: "protect",
    nameAr: "حماية",
    nameEn: "Protect",
    descriptionAr: "تطوير وتنفيذ الضمانات المناسبة لضمان تقديم الخدمات الحيوية",
    descriptionEn: "Develop and implement appropriate safeguards to ensure delivery of critical services",
    color: "#8b5cf6", // purple-500
    order: 2,
  },
  {
    id: "detect",
    nameAr: "كشف",
    nameEn: "Detect",
    descriptionAr: "تطوير وتنفيذ الأنشطة المناسبة للكشف عن وقوع حدث أمني",
    descriptionEn: "Develop and implement appropriate activities to identify the occurrence of a cybersecurity event",
    color: "#f59e0b", // amber-500
    order: 3,
  },
  {
    id: "respond",
    nameAr: "استجابة",
    nameEn: "Respond",
    descriptionAr: "تطوير وتنفيذ الأنشطة المناسبة للعمل فيما يتعلق بحدث أمني تم اكتشافه",
    descriptionEn:
      "Develop and implement appropriate activities to take action regarding a detected cybersecurity incident",
    color: "#ef4444", // red-500
    order: 4,
  },
  {
    id: "recover",
    nameAr: "تعافي",
    nameEn: "Recover",
    descriptionAr:
      "تطوير وتنفيذ الأنشطة المناسبة للحفاظ على خطط المرونة واستعادة أي قدرات أو خدمات تضررت بسبب حدث أمني",
    descriptionEn:
      "Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity incident",
    color: "#10b981", // emerald-500
    order: 5,
  },
]

export const frameworkCategoriesData: FrameworkCategory[] = [
  // Identify Categories
  {
    id: "asset-management",
    functionId: "identify",
    nameAr: "إدارة الأصول",
    nameEn: "Asset Management",
    descriptionAr:
      "البيانات والأجهزة والأنظمة والمرافق التي تمكن المؤسسة من تحقيق أهداف العمل يتم تحديدها وإدارتها بما يتناسب مع أهميتها النسبية للأهداف التنظيمية والاستراتيجية المخاطر",
    descriptionEn:
      "The data, personnel, devices, systems, and facilities that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization's risk strategy",
    order: 1,
  },
  {
    id: "business-environment",
    functionId: "identify",
    nameAr: "بيئة العمل",
    nameEn: "Business Environment",
    descriptionAr:
      "يتم فهم مهمة المؤسسة وأهدافها وأصحاب المصلحة والأنشطة وتحديد أولوياتها؛ تستخدم هذه المعلومات لإبلاغ أدوار الأمن السيبراني والمسؤوليات وقرارات إدارة المخاطر",
    descriptionEn:
      "The organization's mission, objectives, stakeholders, and activities are understood and prioritized; this information is used to inform cybersecurity roles, responsibilities, and risk management decisions",
    order: 2,
  },
  {
    id: "governance",
    functionId: "identify",
    nameAr: "الحوكمة",
    nameEn: "Governance",
    descriptionAr:
      "يتم فهم السياسات والإجراءات والعمليات لإدارة وتراقب المتطلبات التنظيمية والقانونية والمخاطر والبيئية والتشغيلية لإدارة مخاطر الأمن السيبراني",
    descriptionEn:
      "The policies, procedures, and processes to manage and monitor the organization's regulatory, legal, risk, environmental, and operational requirements are understood and inform the management of cybersecurity risk",
    order: 3,
  },
  {
    id: "risk-assessment",
    functionId: "identify",
    nameAr: "تقييم المخاطر",
    nameEn: "Risk Assessment",
    descriptionAr:
      "تفهم المؤسسة المخاطر السيبرانية على عملياتها (بما في ذلك مهمتها وظائفها وصورتها أو سمعتها) وأصولها التنظيمية والأفراد",
    descriptionEn:
      "The organization understands the cybersecurity risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals",
    order: 4,
  },
  {
    id: "risk-management-strategy",
    functionId: "identify",
    nameAr: "استراتيجية إدارة المخاطر",
    nameEn: "Risk Management Strategy",
    descriptionAr:
      "يتم تحديد أولويات المؤسسة وقيودها وتحملها للمخاطر وافتراضاتها واستخدامها لدعم قرارات المخاطر التشغيلية",
    descriptionEn:
      "The organization's priorities, constraints, risk tolerances, and assumptions are established and used to support operational risk decisions",
    order: 5,
  },

  // Protect Categories
  {
    id: "access-control",
    functionId: "protect",
    nameAr: "التحكم في الوصول",
    nameEn: "Access Control",
    descriptionAr: "يتم تقييد الوصول إلى الأصول والمرافق المرتبطة بها ومنعها وفقًا للسياسات المعتمدة",
    descriptionEn:
      "Access to physical and logical assets and associated facilities is limited to authorized users, processes, and devices, and is managed consistent with the assessed risk of unauthorized access",
    order: 1,
  },
  {
    id: "awareness-and-training",
    functionId: "protect",
    nameAr: "التوعية والتدريب",
    nameEn: "Awareness and Training",
    descriptionAr:
      "يتم توفير التعليم والتدريب على الأمن السيبراني للموظفين لأداء واجباتهم وفقًا للسياسات والإجراءات والاتفاقيات ذات الصلة",
    descriptionEn:
      "The organization's personnel and partners are provided cybersecurity awareness education and are trained to perform their cybersecurity-related duties and responsibilities consistent with related policies, procedures, and agreements",
    order: 2,
  },
  {
    id: "data-security",
    functionId: "protect",
    nameAr: "أمن البيانات",
    nameEn: "Data Security",
    descriptionAr:
      "تتم إدارة المعلومات والسجلات بما يتفق مع استراتيجية المؤسسة لإدارة المخاطر لحماية سرية وسلامة وتوافر المعلومات",
    descriptionEn:
      "Information and records (data) are managed consistent with the organization's risk strategy to protect the confidentiality, integrity, and availability of information",
    order: 3,
  },
  {
    id: "info-protection-processes",
    functionId: "protect",
    nameAr: "عمليات حماية المعلومات",
    nameEn: "Information Protection Processes and Procedures",
    descriptionAr: "يتم الحفاظ على سياسات الأمن وإجراءاته وعملياته واستخدامها لإدارة حماية أنظمة المعلومات والأصول",
    descriptionEn:
      "Security policies, processes, and procedures are maintained and used to manage protection of information systems and assets",
    order: 4,
  },
  {
    id: "maintenance",
    functionId: "protect",
    nameAr: "الصيانة",
    nameEn: "Maintenance",
    descriptionAr: "يتم إجراء صيانة وإصلاحات لمكونات نظام التحكم الصناعي وتكنولوجيا المعلومات وفقًا للسياسات والإجراءات",
    descriptionEn:
      "Maintenance and repairs of industrial control and information system components are performed consistent with policies and procedures",
    order: 5,
  },
  {
    id: "protective-technology",
    functionId: "protect",
    nameAr: "التكنولوجيا الوقائية",
    nameEn: "Protective Technology",
    descriptionAr:
      "يتم تشغيل وصيانة الحلول التقنية الأمنية لضمان أمن وصمود الأنظمة والأصول بما يتفق مع السياسات والإجراءات والاتفاقيات ذات الصلة",
    descriptionEn:
      "Technical security solutions are managed to ensure the security and resilience of systems and assets, consistent with related policies, procedures, and agreements",
    order: 6,
  },

  // Detect Categories
  {
    id: "anomalies-and-events",
    functionId: "detect",
    nameAr: "الشذوذ والأحداث",
    nameEn: "Anomalies and Events",
    descriptionAr: "يتم اكتشاف النشاط الشاذ في الوقت المناسب وفهم التأثير المحتمل للأحداث",
    descriptionEn: "Anomalous activity is detected and the potential impact of events is understood",
    order: 1,
  },
  {
    id: "security-continuous-monitoring",
    functionId: "detect",
    nameAr: "المراقبة الأمنية المستمرة",
    nameEn: "Security Continuous Monitoring",
    descriptionAr:
      "تتم مراقبة نظام المعلومات والأصول في فترات زمنية محددة للتعرف على الأحداث الأمنية والتحقق من فعالية تدابير الحماية",
    descriptionEn:
      "The information system and assets are monitored to identify cybersecurity events and verify the effectiveness of protective measures",
    order: 2,
  },
  {
    id: "detection-processes",
    functionId: "detect",
    nameAr: "عمليات الكشف",
    nameEn: "Detection Processes",
    descriptionAr: "يتم الحفاظ على عمليات وإجراءات الكشف واختبارها لضمان الوعي في الوقت المناسب بالأحداث الشاذة",
    descriptionEn:
      "Detection processes and procedures are maintained and tested to ensure awareness of anomalous events",
    order: 3,
  },

  // Respond Categories
  {
    id: "response-planning",
    functionId: "respond",
    nameAr: "تخطيط الاستجابة",
    nameEn: "Response Planning",
    descriptionAr:
      "يتم تنفيذ عمليات وإجراءات الاستجابة وصيانتها للتأكد من الاستجابة في الوقت المناسب للأحداث الأمنية المكتشفة",
    descriptionEn:
      "Response processes and procedures are executed and maintained, to ensure response to detected cybersecurity incidents",
    order: 1,
  },
  {
    id: "communications",
    functionId: "respond",
    nameAr: "الاتصالات",
    nameEn: "Communications",
    descriptionAr: "يتم تنسيق أنشطة الاستجابة مع أصحاب المصلحة الداخليين والخارجيين",
    descriptionEn: "Response activities are coordinated with internal and external stakeholders",
    order: 2,
  },
  {
    id: "analysis",
    functionId: "respond",
    nameAr: "التحليل",
    nameEn: "Analysis",
    descriptionAr: "يتم إجراء التحليل لضمان استجابة فعالة واستعادة الدعم",
    descriptionEn: "Analysis is conducted to ensure effective response and support recovery activities",
    order: 3,
  },
  {
    id: "mitigation",
    functionId: "respond",
    nameAr: "التخفيف",
    nameEn: "Mitigation",
    descriptionAr: "يتم تنفيذ الأنشطة لمنع توسع الحدث وتخفيف آثاره وحل الحادث",
    descriptionEn:
      "Activities are performed to prevent expansion of an event, mitigate its effects, and resolve the incident",
    order: 4,
  },
  {
    id: "improvements",
    functionId: "respond",
    nameAr: "التحسينات",
    nameEn: "Improvements",
    descriptionAr:
      "يتم تحسين أنشطة استجابة المؤسسة من خلال دمج الدروس المستفادة من أنشطة الكشف/الاستجابة الحالية والسابقة",
    descriptionEn:
      "Organizational response activities are improved by incorporating lessons learned from current and previous detection/response activities",
    order: 5,
  },

  // Recover Categories
  {
    id: "recovery-planning",
    functionId: "recover",
    nameAr: "تخطيط التعافي",
    nameEn: "Recovery Planning",
    descriptionAr:
      "يتم تنفيذ عمليات وإجراءات الاستعادة وصيانتها لضمان استعادة الأنظمة أو الأصول المتأثرة بحوادث الأمن السيبراني",
    descriptionEn:
      "Recovery processes and procedures are executed and maintained to ensure restoration of systems or assets affected by cybersecurity incidents",
    order: 1,
  },
  {
    id: "improvements-recover",
    functionId: "recover",
    nameAr: "التحسينات",
    nameEn: "Improvements",
    descriptionAr: "يتم تحسين تخطيط وعمليات الاستعادة من خلال دمج الدروس المستفادة في الأنشطة المستقبلية",
    descriptionEn:
      "Recovery planning and processes are improved by incorporating lessons learned into future activities",
    order: 2,
  },
  {
    id: "communications-recover",
    functionId: "recover",
    nameAr: "الاتصالات",
    nameEn: "Communications",
    descriptionAr: "يتم تنسيق أنشطة الاستعادة مع الأطراف الداخلية والخارجية",
    descriptionEn: "Restoration activities are coordinated with internal and external parties",
    order: 3,
  },
]

export const domainsData: Domain[] = [
  {
    id: "governance",
    nameAr: "الحوكمة",
    nameEn: "Governance",
    descriptionAr: "الإشراف على برنامج الأمن السيبراني وإدارة المخاطر",
    descriptionEn: "Oversight of cybersecurity program and risk management",
    order: 1,
  },
  {
    id: "risk-management",
    nameAr: "إدارة المخاطر",
    nameEn: "Risk Management",
    descriptionAr: "تحديد وتقييم وتخفيف المخاطر السيبرانية",
    descriptionEn: "Identifying, assessing, and mitigating cybersecurity risks",
    order: 2,
  },
  {
    id: "asset-management",
    nameAr: "إدارة الأصول",
    nameEn: "Asset Management",
    descriptionAr: "تحديد وتصنيف وحماية أصول المعلومات",
    descriptionEn: "Identifying, classifying, and protecting information assets",
    order: 3,
  },
  {
    id: "access-control",
    nameAr: "التحكم في الوصول",
    nameEn: "Access Control",
    descriptionAr: "إدارة الوصول إلى الأنظمة والبيانات",
    descriptionEn: "Managing access to systems and data",
    order: 4,
  },
  {
    id: "data-protection",
    nameAr: "حماية البيانات",
    nameEn: "Data Protection",
    descriptionAr: "حماية سرية وسلامة وتوافر البيانات",
    descriptionEn: "Protecting confidentiality, integrity, and availability of data",
    order: 5,
  },
]

export const componentsData: Component[] = [
  // Governance Components
  {
    id: "policies",
    domainId: "governance",
    nameAr: "السياسات والإجراءات",
    nameEn: "Policies and Procedures",
    descriptionAr: "تطوير وتنفيذ سياسات وإجراءات الأمن السيبراني",
    descriptionEn: "Developing and implementing cybersecurity policies and procedures",
    order: 1,
  },
  {
    id: "roles",
    domainId: "governance",
    nameAr: "الأدوار والمسؤوليات",
    nameEn: "Roles and Responsibilities",
    descriptionAr: "تحديد أدوار ومسؤوليات الأمن السيبراني",
    descriptionEn: "Defining cybersecurity roles and responsibilities",
    order: 2,
  },

  // Risk Management Components
  {
    id: "risk-assessment",
    domainId: "risk-management",
    nameAr: "تقييم المخاطر",
    nameEn: "Risk Assessment",
    descriptionAr: "تحديد وتقييم مخاطر الأمن السيبراني",
    descriptionEn: "Identifying and assessing cybersecurity risks",
    order: 1,
  },
  {
    id: "risk-treatment",
    domainId: "risk-management",
    nameAr: "معالجة المخاطر",
    nameEn: "Risk Treatment",
    descriptionAr: "تنفيذ ضوابط لتخفيف المخاطر المحددة",
    descriptionEn: "Implementing controls to mitigate identified risks",
    order: 2,
  },

  // Asset Management Components
  {
    id: "inventory",
    domainId: "asset-management",
    nameAr: "جرد الأصول",
    nameEn: "Asset Inventory",
    descriptionAr: "الحفاظ على جرد شامل لأصول المعلومات",
    descriptionEn: "Maintaining a comprehensive inventory of information assets",
    order: 1,
  },
  {
    id: "classification",
    domainId: "asset-management",
    nameAr: "تصنيف الأصول",
    nameEn: "Asset Classification",
    descriptionAr: "تصنيف الأصول وفقًا لحساسيتها وأهميتها",
    descriptionEn: "Classifying assets according to their sensitivity and importance",
    order: 2,
  },
]
