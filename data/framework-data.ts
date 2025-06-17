export const frameworkData = {
  id: "nist-csf",
  title: {
    ar: "إطار عمل الأمن السيبراني",
    en: "Cybersecurity Framework",
  },
  description: {
    ar: "إطار عمل شامل لتحسين الأمن السيبراني وإدارة المخاطر في المؤسسات",
    en: "A comprehensive framework for improving cybersecurity and risk management in organizations",
  },
  version: "1.1",
};

export const frameworkFunctionsData = [
  {
    id: "identify",
    title: {
      ar: "تحديد",
      en: "Identify",
    },
    color: "bg-blue-500",
    textColor: "text-blue-500",
    borderColor: "border-blue-500",
    description: {
      ar: "تطوير فهم تنظيمي لإدارة مخاطر الأمن السيبراني للأنظمة والأصول والبيانات والقدرات.",
      en: "Develop organizational understanding to manage cybersecurity risks to systems, people, assets, data, and capabilities.",
    },
    categories: [
      {
        id: "asset-management",
        name: {
          ar: "إدارة الأصول",
          en: "Asset Management",
        },
        description: {
          ar: "البيانات والأجهزة والأنظمة والمرافق التي تمكن المؤسسة من تحقيق أهداف العمل يتم تحديدها وإدارتها بما يتناسب مع أهميتها النسبية للأهداف التنظيمية والاستراتيجية المخاطر للمؤسسة.",
          en: "The data, devices, systems, and facilities that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization's risk strategy.",
        },
      },
      {
        id: "business-environment",
        name: {
          ar: "بيئة العمل",
          en: "Business Environment",
        },
        description: {
          ar: "يتم فهم مهمة المؤسسة وأهدافها وأصحاب المصلحة والأنشطة وتحديد أولوياتها؛ تستخدم هذه المعلومات لإبلاغ أدوار الأمن السيبراني والمسؤوليات وقرارات إدارة مخاطر الأمن السيبراني.",
          en: "The organization's mission, objectives, stakeholders, and activities are understood and prioritized; this information is used to inform cybersecurity roles, responsibilities, and risk management decisions.",
        },
      },
      {
        id: "governance",
        name: {
          ar: "الحوكمة",
          en: "Governance",
        },
        description: {
          ar: "يتم فهم السياسات والإجراءات والعمليات لإدارة وتحديد المخاطر الأمنية السيبرانية وتوثيقها.",
          en: "The policies, procedures, and processes to manage and monitor the organization's regulatory, legal, risk, environmental, and operational requirements are understood and inform the management of cybersecurity risk.",
        },
      },
      {
        id: "risk-assessment",
        name: {
          ar: "تقييم المخاطر",
          en: "Risk Assessment",
        },
        description: {
          ar: "تفهم المؤسسة المخاطر السيبرانية على عملياتها (بما في ذلك المهمة والوظائف والصورة أو السمعة) وأصولها التنظيمية والأفراد.",
          en: "The organization understands the cybersecurity risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals.",
        },
      },
      {
        id: "risk-management-strategy",
        name: {
          ar: "استراتيجية إدارة المخاطر",
          en: "Risk Management Strategy",
        },
        description: {
          ar: "يتم تحديد أولويات المؤسسة وقيودها وتسامحها مع المخاطر وافتراضاتها وتستخدم لدعم قرارات المخاطر التشغيلية.",
          en: "The organization's priorities, constraints, risk tolerances, and assumptions are established and used to support operational risk decisions.",
        },
      },
    ],
  },
  {
    id: "protect",
    title: {
      ar: "حماية",
      en: "Protect",
    },
    color: "bg-purple-600",
    textColor: "text-purple-600",
    borderColor: "border-purple-600",
    description: {
      ar: "تطوير وتنفيذ الضمانات المناسبة لضمان تقديم الخدمات الحيوية.",
      en: "Develop and implement appropriate safeguards to ensure delivery of critical services.",
    },
    categories: [
      {
        id: "access-control",
        name: {
          ar: "التحكم في الوصول",
          en: "Access Control",
        },
        description: {
          ar: "يتم تقييد الوصول إلى الأصول والمرافق المرتبطة بها ويتم إدارته بما يتفق مع المخاطر المقبولة.",
          en: "Access to physical and logical assets and associated facilities is limited to authorized users, processes, and devices, and is managed consistent with the assessed risk of unauthorized access.",
        },
      },
      {
        id: "awareness-training",
        name: {
          ar: "التوعية والتدريب",
          en: "Awareness and Training",
        },
        description: {
          ar: "يتم توفير التعليم والتدريب للموظفين والشركاء لأداء واجباتهم ومسؤولياتهم المتعلقة بالأمن السيبراني بما يتماشى مع السياسات والإجراءات والاتفاقيات ذات الصلة.",
          en: "The organization's personnel and partners are provided cybersecurity awareness education and are trained to perform their cybersecurity-related duties and responsibilities consistent with related policies, procedures, and agreements.",
        },
      },
      {
        id: "data-security",
        name: {
          ar: "أمن البيانات",
          en: "Data Security",
        },
        description: {
          ar: "تتم إدارة المعلومات والسجلات (البيانات) بما يتفق مع استراتيجية المؤسسة لإدارة المخاطر لحماية سرية المعلومات وسلامتها وتوافرها.",
          en: "Information and records (data) are managed consistent with the organization's risk strategy to protect the confidentiality, integrity, and availability of information.",
        },
      },
      {
        id: "info-protection",
        name: {
          ar: "عمليات وإجراءات حماية المعلومات",
          en: "Info Protection Processes and Procedures",
        },
        description: {
          ar: "يتم الحفاظ على سياسات الأمن (تتناول الغرض والنطاق والأدوار والمسؤوليات والالتزام الإداري والتنسيق بين كيانات المؤسسة) والعمليات والإجراءات وتستخدم لإدارة حماية أنظمة المعلومات والأصول.",
          en: "Security policies (that address purpose, scope, roles, responsibilities, management commitment, and coordination among organizational entities), processes, and procedures are maintained and used to manage protection of information systems and assets.",
        },
      },
      {
        id: "maintenance",
        name: {
          ar: "الصيانة",
          en: "Maintenance",
        },
        description: {
          ar: "يتم إجراء صيانة وإصلاحات لمكونات نظام التحكم الصناعي والمعلومات بما يتفق مع السياسات والإجراءات.",
          en: "Maintenance and repairs of industrial control and information system components are performed consistent with policies and procedures.",
        },
      },
      {
        id: "protective-technology",
        name: {
          ar: "التكنولوجيا الوقائية",
          en: "Protective Technology",
        },
        description: {
          ar: "يتم تشغيل الحلول التقنية الأمنية وإدارتها لضمان أمن وصمود الأنظمة والأصول، بما يتفق مع السياسات والإجراءات والاتفاقيات ذات الصلة.",
          en: "Technical security solutions are managed to ensure the security and resilience of systems and assets, consistent with related policies, procedures, and agreements.",
        },
      },
    ],
  },
  {
    id: "detect",
    title: {
      ar: "كشف",
      en: "Detect",
    },
    color: "bg-yellow-500",
    textColor: "text-yellow-500",
    borderColor: "border-yellow-500",
    description: {
      ar: "تطوير وتنفيذ الأنشطة المناسبة للكشف عن وقوع حدث أمني سيبراني.",
      en: "Develop and implement appropriate activities to identify the occurrence of a cybersecurity event.",
    },
    categories: [
      {
        id: "anomalies-events",
        name: {
          ar: "الاحداث",
          en: "Events",
        },
        description: {
          ar: "يتم اكتشاف النشاط الشاذ في الوقت المناسب وفهم التأثير المحتمل للأحداث.",
          en: "Anomalous activity is detected and the potential impact of events is understood.",
        },
      },
      {
        id: "security-monitoring",
        name: {
          ar: "المراقبة الأمنية المستمرة",
          en: "Security Continuous Monitoring",
        },
        description: {
          ar: "تتم مراقبة نظام المعلومات والأصول في فترات زمنية محددة للتعرف على الأحداث الأمنية السيبرانية والتحقق من فعالية تدابير الحماية.",
          en: "The information system and assets are monitored to identify cybersecurity events and verify the effectiveness of protective measures.",
        },
      },
      {
        id: "detection-processes",
        name: {
          ar: "عمليات الكشف",
          en: "Detection Processes",
        },
        description: {
          ar: "يتم الحفاظ على عمليات وإجراءات الكشف واختبارها لضمان الوعي في الوقت المناسب بالأحداث الشاذة.",
          en: "Detection processes and procedures are maintained and tested to ensure awareness of anomalous events.",
        },
      },
    ],
  },
  {
    id: "respond",
    title: {
      ar: "استجابة",
      en: "Respond",
    },
    color: "bg-red-600",
    textColor: "text-red-600",
    borderColor: "border-red-600",
    description: {
      ar: "تطوير وتنفيذ الأنشطة المناسبة لاتخاذ إجراءات بشأن حدث أمني سيبراني تم اكتشافه.",
      en: "Develop and implement appropriate activities to take action regarding a detected cybersecurity incident.",
    },
    categories: [
      {
        id: "response-planning",
        name: {
          ar: "تخطيط الاستجابة",
          en: "Response Planning",
        },
        description: {
          ar: "يتم تنفيذ عمليات وإجراءات الاستجابة وصيانتها للتأكد من الاستجابة في الوقت المناسب للأحداث الأمنية السيبرانية المكتشفة.",
          en: "Response processes and procedures are executed and maintained, to ensure response to detected cybersecurity incidents.",
        },
      },
      {
        id: "communications",
        name: {
          ar: "الاتصالات",
          en: "Communications",
        },
        description: {
          ar: "يتم تنسيق أنشطة الاستجابة مع أصحاب المصلحة الداخليين والخارجيين (مثل الدعم الخارجي من وكالات إنفاذ القانون).",
          en: "Response activities are coordinated with internal and external stakeholders (e.g. external support from law enforcement agencies).",
        },
      },
      {
        id: "analysis",
        name: {
          ar: "التحليل",
          en: "Analysis",
        },
        description: {
          ar: "يتم إجراء التحليل لضمان استجابة فعالة واستعادة الدعم.",
          en: "Analysis is conducted to ensure effective response and support recovery activities.",
        },
      },
      {
        id: "mitigation",
        name: {
          ar: "التخفيف",
          en: "Mitigation",
        },
        description: {
          ar: "يتم تنفيذ الأنشطة لمنع توسع الحدث، وتخفيف آثاره، وحل الحادث.",
          en: "Activities are performed to prevent expansion of an event, mitigate its effects, and resolve the incident.",
        },
      },
      {
        id: "improvements",
        name: {
          ar: "التحسينات",
          en: "Improvements",
        },
        description: {
          ar: "يتم تحسين أنشطة استجابة المؤسسة من خلال دمج الدروس المستفادة من أنشطة الكشف/الاستجابة الحالية والسابقة.",
          en: "Organizational response activities are improved by incorporating lessons learned from current and previous detection/response activities.",
        },
      },
    ],
  },
  {
    id: "recover",
    title: {
      ar: "تعافي",
      en: "Recover",
    },
    color: "bg-green-500",
    textColor: "text-green-500",
    borderColor: "border-green-500",
    description: {
      ar: "تطوير وتنفيذ الأنشطة المناسبة للحفاظ على خطط المرونة واستعادة أي قدرات أو خدمات تضررت بسبب حدث أمني سيبراني.",
      en: "Develop and implement appropriate activities to maintain plans for resilience and to restore any capabilities or services that were impaired due to a cybersecurity incident.",
    },
    categories: [
      {
        id: "recovery-planning",
        name: {
          ar: "تخطيط التعافي",
          en: "Recovery Planning",
        },
        description: {
          ar: "يتم تنفيذ عمليات وإجراءات الاستعادة وصيانتها لضمان استعادة الأنظمة أو الأصول المتأثرة بحوادث الأمن السيبراني.",
          en: "Recovery processes and procedures are executed and maintained to ensure restoration of systems or assets affected by cybersecurity incidents.",
        },
      },
      {
        id: "recovery-improvements",
        name: {
          ar: "التحسينات",
          en: "Improvements",
        },
        description: {
          ar: "يتم تحسين تخطيط وعمليات الاستعادة من خلال دمج الدروس المستفادة في الأ��شطة المستقبلية.",
          en: "Recovery planning and processes are improved by incorporating lessons learned into future activities.",
        },
      },
      {
        id: "recovery-communications",
        name: {
          ar: "الاتصالات",
          en: "Communications",
        },
        description: {
          ar: "يتم تنسيق أنشطة الاستعادة مع الأطراف الداخلية والخارجية (مثل مراكز التنسيق وأصحاب الأنظمة المتأثرة والمالكين والموردين والشركاء).",
          en: "Recovery activities are coordinated with internal and external parties (e.g. coordinating centers, Internet Service Providers, owners of attacking systems, victims, other CSIRTs, and vendors).",
        },
      },
    ],
  },
];

export const frameworkCategoriesData = [
  {
    id: "asset-management",
    functionId: "identify",
    name: {
      ar: "إدارة الأصول",
      en: "Asset Management",
    },
    description: {
      ar: "البيانات والأجهزة والأنظمة والمرافق التي تمكن المؤسسة من تحقيق أهداف العمل يتم تحديدها وإدارتها بما يتناسب مع أهميتها النسبية للأهداف التنظيمية والاستراتيجية المخاطر للمؤسسة.",
      en: "The data, devices, systems, and facilities that enable the organization to achieve business purposes are identified and managed consistent with their relative importance to organizational objectives and the organization's risk strategy.",
    },
  },
  {
    id: "business-environment",
    functionId: "identify",
    name: {
      ar: "بيئة العمل",
      en: "Business Environment",
    },
    description: {
      ar: "يتم فهم مهمة المؤسسة وأهدافها وأصحاب المصلحة والأنشطة وتحديد أولوياتها؛ تستخدم هذه المعلومات لإبلاغ أدوار الأمن السيبراني والمسؤوليات وقرارات إدارة مخاطر الأمن السيبراني.",
      en: "The organization's mission, objectives, stakeholders, and activities are understood and prioritized; this information is used to inform cybersecurity roles, responsibilities, and risk management decisions.",
    },
  },
  {
    id: "governance",
    functionId: "identify",
    name: {
      ar: "الحوكمة",
      en: "Governance",
    },
    description: {
      ar: "يتم فهم السياسات والإجراءات والعمليات لإدارة وتحديد المخاطر الأمنية السيبرانية وتوثيقها.",
      en: "The policies, procedures, and processes to manage and monitor the organization's regulatory, legal, risk, environmental, and operational requirements are understood and inform the management of cybersecurity risk.",
    },
  },
  {
    id: "risk-assessment",
    functionId: "identify",
    name: {
      ar: "تقييم المخاطر",
      en: "Risk Assessment",
    },
    description: {
      ar: "تفهم المؤسسة المخاطر السيبرانية على عملياتها (بما في ذلك المهمة والوظائف والصورة أو السمعة) وأصولها التنظيمية ��الأفراد.",
      en: "The organization understands the cybersecurity risk to organizational operations (including mission, functions, image, or reputation), organizational assets, and individuals.",
    },
  },
  {
    id: "risk-management-strategy",
    functionId: "identify",
    name: {
      ar: "استراتيجية إدارة المخاطر",
      en: "Risk Management Strategy",
    },
    description: {
      ar: "يتم تحديد أولويات المؤسسة وقيودها وتسامحها مع المخاطر وافتراضاتها وتستخدم لدعم قرارات المخاطر التشغيلية.",
      en: "The organization's priorities, constraints, risk tolerances, and assumptions are established and used to support operational risk decisions.",
    },
  },
];

export const domainsData = [
  {
    id: "governance",
    title: {
      ar: "الحوكمة",
      en: "Governance",
    },
    description: {
      ar: "الإشراف على برنامج الأمن السيبراني وإدارة المخاطر",
      en: "Oversight of cybersecurity program and risk management",
    },
    components: [
      {
        id: "governance-structure",
        title: {
          ar: "هيكل الحوكمة",
          en: "Governance Structure",
        },
        description: {
          ar: "تحديد الأدوار والمسؤوليات والمساءلة لإدارة الأمن السيبراني على جميع المستويات.",
          en: "Defining roles, responsibilities, and accountability for cybersecurity management at all levels.",
        },
      },
      {
        id: "policy-framework",
        title: {
          ar: "إطار السياسات",
          en: "Policy Framework",
        },
        description: {
          ar: "تطوير وتنفيذ سياسات وإجراءات ومعايير الأمن السيبراني.",
          en: "Developing and implementing cybersecurity policies, procedures, and standards.",
        },
      },
      {
        id: "risk-management",
        title: {
          ar: "إدارة المخاطر",
          en: "Risk Management",
        },
        description: {
          ar: "تحديد وتقييم وإدارة مخاطر الأمن السيبراني بشكل منهجي.",
          en: "Systematically identifying, assessing, and managing cybersecurity risks.",
        },
      },
    ],
  },
  {
    id: "protection",
    title: {
      ar: "الحماية",
      en: "Protection",
    },
    description: {
      ar: "تنفيذ الضمانات المناسبة لحماية الأنظمة والبيانات",
      en: "Implementing appropriate safeguards to protect systems and data",
    },
    components: [
      {
        id: "access-control",
        title: {
          ar: "التحكم في الوصول",
          en: "Access Control",
        },
        description: {
          ar: "إدارة وتقييد الوصول إلى الأنظمة والبيانات بناءً على مبدأ الامتياز الأدنى.",
          en: "Managing and restricting access to systems and data based on the principle of least privilege.",
        },
      },
      {
        id: "data-protection",
        title: {
          ar: "حماية البيانات",
          en: "Data Protection",
        },
        description: {
          ar: "تأمين البيانات أثناء التخزين والنقل والمعالجة.",
          en: "Securing data at rest, in transit, and during processing.",
        },
      },
      {
        id: "network-security",
        title: {
          ar: "أمن الشبكات",
          en: "Network Security",
        },
        description: {
          ar: "حماية البنية التحتية للشبكة من الوصول غير المصرح به والهجمات.",
          en: "Protecting network infrastructure from unauthorized access and attacks.",
        },
      },
    ],
  },
  {
    id: "detection",
    title: {
      ar: "الكشف",
      en: "Detection",
    },
    description: {
      ar: "تحديد وكشف الأحداث الأمنية في الوقت المناسب",
      en: "Identifying and detecting security events in a timely manner",
    },
    components: [
      {
        id: "security-monitoring",
        title: {
          ar: "المراقبة الأمنية",
          en: "Security Monitoring",
        },
        description: {
          ar: "مراقبة مستمرة للأنظمة والشبكات للكشف عن الأنشطة المشبوهة.",
          en: "Continuous monitoring of systems and networks to detect suspicious activities.",
        },
      },
      {
        id: "threat-intelligence",
        title: {
          ar: "استخبارات التهديدات",
          en: "Threat Intelligence",
        },
        description: {
          ar: "جمع وتحليل واستخدام المعلومات حول التهديدات السيبرانية.",
          en: "Collecting, analyzing, and using information about cyber threats.",
        },
      },
      {
        id: "vulnerability-management",
        title: {
          ar: "إدارة الثغرات",
          en: "Vulnerability Management",
        },
        description: {
          ar: "تحديد وتقييم ومعالجة نقاط الضعف في الأنظمة والتطبيقات.",
          en: "Identifying, assessing, and addressing vulnerabilities in systems and applications.",
        },
      },
    ],
  },
  {
    id: "response",
    title: {
      ar: "الاستجابة",
      en: "Response",
    },
    description: {
      ar: "الاستجابة للحوادث الأمنية بطريقة فعالة",
      en: "Responding to security incidents effectively",
    },
    components: [
      {
        id: "incident-response",
        title: {
          ar: "الاستجابة للحوادث",
          en: "Incident Response",
        },
        description: {
          ar: "عمليات وإجراءات للاستجابة للحوادث الأمنية بطريقة منظمة.",
          en: "Processes and procedures for responding to security incidents in an organized manner.",
        },
      },
      {
        id: "business-continuity",
        title: {
          ar: "استمرارية الأعمال",
          en: "Business Continuity",
        },
        description: {
          ar: "خطط وإجراءات لضمان استمرار العمليات الحيوية أثناء وبعد الحوادث.",
          en: "Plans and procedures to ensure critical operations continue during and after incidents.",
        },
      },
      {
        id: "disaster-recovery",
        title: {
          ar: "التعافي من الكوارث",
          en: "Disaster Recovery",
        },
        description: {
          ar: "استراتيجيات وإجراءات لاستعادة الأنظمة والبيانات بعد حادث كبير.",
          en: "Strategies and procedures for restoring systems and data after a major incident.",
        },
      },
    ],
  },
  {
    id: "awareness",
    title: {
      ar: "التوعية",
      en: "Awareness",
    },
    description: {
      ar: "تعزيز الوعي الأمني بين الموظفين وأصحاب المصلحة",
      en: "Enhancing security awareness among employees and stakeholders",
    },
    components: [
      {
        id: "security-awareness",
        title: {
          ar: "التوعية الأمنية",
          en: "Security Awareness",
        },
        description: {
          ar: "زيادة وعي الموظفين بالتهديدات والممارسات الأمنية الجيدة.",
          en: "Increasing employee awareness of threats and good security practices.",
        },
      },
      {
        id: "technical-training",
        title: {
          ar: "التدريب التقني",
          en: "Technical Training",
        },
        description: {
          ar: "تطوير المهارات التقنية للموظفين المسؤولين عن تنفيذ وإدارة ضوابط الأمن.",
          en: "Developing technical skills for staff responsible for implementing and managing security controls.",
        },
      },
      {
        id: "security-culture",
        title: {
          ar: "ثقافة الأمن",
          en: "Security Culture",
        },
        description: {
          ar: "بناء ثقافة تنظيمية تقدر وتعزز الأمن السيبراني.",
          en: "Building an organizational culture that values and promotes cybersecurity.",
        },
      },
    ],
  },
];

export const componentsData = [
  {
    id: "governance-structure",
    domainId: "governance",
    title: {
      ar: "هيكل الحوكمة",
      en: "Governance Structure",
    },
    description: {
      ar: "تحديد الأدوار والمسؤوليات والمساءلة لإدارة الأمن السيبراني على جميع المستويات.",
      en: "Defining roles, responsibilities, and accountability for cybersecurity management at all levels.",
    },
  },
  {
    id: "policy-framework",
    domainId: "governance",
    title: {
      ar: "إطار السياسات",
      en: "Policy Framework",
    },
    description: {
      ar: "تطوير وتنفيذ سياسات وإجراءات ومعايير الأمن السيبراني.",
      en: "Developing and implementing cybersecurity policies, procedures, and standards.",
    },
  },
  {
    id: "risk-management",
    domainId: "governance",
    title: {
      ar: "إدارة المخاطر",
      en: "Risk Management",
    },
    description: {
      ar: "تحديد وتقييم وإدارة مخاطر الأمن السيبراني بشكل منهجي.",
      en: "Systematically identifying, assessing, and managing cybersecurity risks.",
    },
  },
  {
    id: "access-control",
    domainId: "protection",
    title: {
      ar: "التحكم في الوصول",
      en: "Access Control",
    },
    description: {
      ar: "إدارة وتقييد الوصول إلى الأنظمة والبيانات بناءً على مبدأ الامتياز الأدنى.",
      en: "Managing and restricting access to systems and data based on the principle of least privilege.",
    },
  },
  {
    id: "data-protection",
    domainId: "protection",
    title: {
      ar: "حماية البيانات",
      en: "Data Protection",
    },
    description: {
      ar: "تأمين البيانات أثناء التخزين والنقل والمعالجة.",
      en: "Securing data at rest, in transit, and during processing.",
    },
  },
  {
    id: "network-security",
    domainId: "protection",
    title: {
      ar: "أمن الشبكات",
      en: "Network Security",
    },
    description: {
      ar: "حماية البنية التحتية للشبكة من الوصول غير المصرح به والهجمات.",
      en: "Protecting network infrastructure from unauthorized access and attacks.",
    },
  },
  {
    id: "security-monitoring",
    domainId: "detection",
    title: {
      ar: "المراقبة الأمنية",
      en: "Security Monitoring",
    },
    description: {
      ar: "مراقبة مستمرة للأنظمة والشبكات للكشف عن الأنشطة المشبوهة.",
      en: "Continuous monitoring of systems and networks to detect suspicious activities.",
    },
  },
  {
    id: "threat-intelligence",
    domainId: "detection",
    title: {
      ar: "استخبارات التهديدات",
      en: "Threat Intelligence",
    },
    description: {
      ar: "جمع وتحليل واستخدام المعلومات حول التهديدات السيبرانية.",
      en: "Collecting, analyzing, and using information about cyber threats.",
    },
  },
  {
    id: "vulnerability-management",
    title: {
      ar: "إدارة الثغرات",
      en: "Vulnerability Management",
    },
    description: {
      ar: "تحديد وتقييم ومعالجة نقاط الضعف في الأنظمة والتطبيقات.",
      en: "Identifying, assessing, and addressing vulnerabilities in systems and applications.",
    },
  },
  {
    id: "incident-response",
    domainId: "response",
    title: {
      ar: "الاستجابة للحوادث",
      en: "Incident Response",
    },
    description: {
      ar: "عمليات وإجراءات للاستجابة للحوادث الأمنية بطريقة منظمة.",
      en: "Processes and procedures for responding to security incidents in an organized manner.",
    },
  },
  {
    id: "business-continuity",
    domainId: "response",
    title: {
      ar: "استمرارية الأعمال",
      en: "Business Continuity",
    },
    description: {
      ar: "خطط وإجراءات لضمان استمرار العمليات الحيوية أثناء وبعد الحوادث.",
      en: "Plans and procedures to ensure critical operations continue during and after incidents.",
    },
  },
  {
    id: "disaster-recovery",
    domainId: "response",
    title: {
      ar: "التعافي من الكوارث",
      en: "Disaster Recovery",
    },
    description: {
      ar: "استراتيجيات وإجراءات لاستعادة الأنظمة والبيانات بعد حادث كبير.",
      en: "Strategies and procedures for restoring systems and data after a major incident.",
    },
  },
  {
    id: "security-awareness",
    domainId: "awareness",
    title: {
      ar: "التوعية الأمنية",
      en: "Security Awareness",
    },
    description: {
      ar: "زيادة وعي الموظفين بالتهديدات والممارسات الأمنية الجيدة.",
      en: "Increasing employee awareness of threats and good security practices.",
    },
  },
  {
    id: "technical-training",
    domainId: "awareness",
    title: {
      ar: "التدريب التقني",
      en: "Technical Training",
    },
    description: {
      ar: "تطوير المهارات التقنية للموظفين المسؤولين عن تنفيذ وإدارة ضوابط الأمن.",
      en: "Developing technical skills for staff responsible for implementing and managing security controls.",
    },
  },
  {
    id: "security-culture",
    domainId: "awareness",
    title: {
      ar: "ثقافة الأمن",
      en: "Security Culture",
    },
    description: {
      ar: "بناء ثقافة تنظيمية تقدر وتعزز الأمن السيبراني.",
      en: "Building an organizational culture that values and promotes cybersecurity.",
    },
  },
  {
    id: "regulatory-compliance",
    domainId: "compliance",
    title: {
      ar: "الامتثال التنظيمي",
      en: "Regulatory Compliance",
    },
    description: {
      ar: "ضمان الامتثال للقوانين واللوائح المتعلقة بالأمن السيبراني.",
      en: "Ensuring compliance with laws and regulations related to cybersecurity.",
    },
  },
  {
    id: "security-assessment",
    domainId: "compliance",
    title: {
      ar: "تقييم الأمن",
      en: "Security Assessment",
    },
    description: {
      ar: "تقييم فعالية ضوابط الأمن السيبراني وتحديد مجالات التحسين.",
      en: "Evaluating the effectiveness of cybersecurity controls and identifying areas for improvement.",
    },
  },
  {
    id: "audit-management",
    domainId: "compliance",
    title: {
      ar: "إدارة التدقيق",
      en: "Audit Management",
    },
    description: {
      ar: "إجراء عمليات تدقيق منتظمة لضمان الامتثال للسياسات والمعايير.",
      en: "Conducting regular audits to ensure compliance with policies and standards.",
    },
  },
];

export const implementationStepsData = [
  {
    step: 1,
    title: {
      ar: "تحديد النطاق",
      en: "Determine Scope",
    },
    description: {
      ar: "تحديد الأنظمة والأصول الحرجة التي تحتاج إلى حماية",
      en: "Identify critical systems and assets that need protection",
    },
  },
  {
    step: 2,
    title: {
      ar: "تحديد الملف التعريفي المستهدف",
      en: "Define Target Profile",
    },
    description: {
      ar: "تحديد الأهداف الأمنية المرجوة والنتائج المطلوبة",
      en: "Define desired security outcomes and objectives",
    },
  },
  {
    step: 3,
    title: {
      ar: "إنشاء ملف تعريف حالي",
      en: "Create Current Profile",
    },
    description: {
      ar: "تقييم الوضع الحالي للأمن السيبراني في المؤسسة",
      en: "Assess the current state of cybersecurity in the organization",
    },
  },
  {
    step: 4,
    title: {
      ar: "تحليل الفجوات",
      en: "Conduct Gap Analysis",
    },
    description: {
      ar: "مقارنة الملف الحالي بالملف المستهدف لتحديد الفجوات",
      en: "Compare current profile to target profile to identify gaps",
    },
  },
  {
    step: 5,
    title: {
      ar: "تنفيذ خطة العمل",
      en: "Implement Action Plan",
    },
    description: {
      ar: "تطوير وتنفيذ خطة لمعالجة الفجوات المحددة",
      en: "Develop and implement a plan to address identified gaps",
    },
  },
];

export const frameworkBenefitsData = [
  {
    title: {
      ar: "إدارة المخاطر المحسنة",
      en: "Improved Risk Management",
    },
    description: {
      ar: "تحديد وتقييم وإدارة مخاطر الأمن السيبراني بشكل أكثر فعالية",
      en: "Identify, assess, and manage cybersecurity risks more effectively",
    },
  },
  {
    title: {
      ar: "تعزيز الأمن",
      en: "Enhanced Security",
    },
    description: {
      ar: "تحسين الموقف الأمني ��لعام للمؤسسة وحماية الأصول الحيوية",
      en: "Improve the overall security posture of the organization and protect critical assets",
    },
  },
  {
    title: {
      ar: "الامتثال التنظيمي",
      en: "Regulatory Compliance",
    },
    description: {
      ar: "المساعدة في تلبية متطلبات الامتثال التنظيمية والقانونية",
      en: "Help meet regulatory and legal compliance requirements",
    },
  },
  {
    title: {
      ar: "تحسين الاتصال",
      en: "Improved Communication",
    },
    description: {
      ar: "تعزيز التواصل حول مخاطر الأمن السيبراني داخل المؤسسة وخارجها",
      en: "Enhance communication about cybersecurity risks within and outside the organization",
    },
  },
  {
    title: {
      ar: "اتخاذ قرارات أفضل",
      en: "Better Decision Making",
    },
    description: {
      ar: "توفير معلومات لاتخاذ قرارات أفضل بشأن استثمارات الأمن السيبراني",
      en: "Inform better decisions about cybersecurity investments",
    },
  },
  {
    title: {
      ar: "المرونة التنظيمية",
      en: "Organizational Resilience",
    },
    description: {
      ar: "تعزيز قدرة المؤسسة على التعافي من الحوادث الأمنية",
      en: "Enhance the organization's ability to recover from security incidents",
    },
  },
];
