// International Standards Data
export const internationalStandardsData = [
  {
    id: "iso-27001",
    title: {
      ar: "ISO/IEC 27001",
      en: "ISO/IEC 27001",
    },
    description: {
      ar: "معيار دولي لأنظمة إدارة أمن المعلومات (ISMS) يوفر إطارًا منهجيًا لإدارة المخاطر المتعلقة بأمن المعلومات.",
      en: "International standard for information security management systems (ISMS) that provides a systematic framework for managing information security risks.",
    },
    organization: {
      ar: "المنظمة الدولية للمعايير (ISO) واللجنة الكهروتقنية الدولية (IEC)",
      en: "International Organization for Standardization (ISO) and International Electrotechnical Commission (IEC)",
    },
    year: "2013 (تحديث 2022)",
    imageUrl: "/placeholder.svg?height=400&width=600",
    documentUrl: "https://example.com/iso-27001",
  },
  {
    id: "nist-csf",
    title: {
      ar: "إطار الأمن السيبراني NIST",
      en: "NIST Cybersecurity Framework",
    },
    description: {
      ar: "إطار عمل طوره المعهد الوطني الأمريكي للمعايير والتكنولوجيا لمساعدة المؤسسات على إدارة وتقليل المخاطر السيبرانية.",
      en: "Framework developed by the US National Institute of Standards and Technology to help organizations manage and reduce cybersecurity risk.",
    },
    organization: {
      ar: "المعهد الوطني الأمريكي للمعايير والتكنولوجيا (NIST)",
      en: "National Institute of Standards and Technology (NIST)",
    },
    year: "2014 (تحديث 2023)",
    imageUrl: "/placeholder.svg?height=400&width=600",
    documentUrl: "https://example.com/nist-csf",
  },
  {
    id: "pci-dss",
    title: {
      ar: "معيار أمن بيانات صناعة بطاقات الدفع (PCI DSS)",
      en: "Payment Card Industry Data Security Standard (PCI DSS)",
    },
    description: {
      ar: "معيار أمني لحماية بيانات حاملي البطاقات وتأمين معاملات بطاقات الائتمان.",
      en: "Security standard for protecting cardholder data and securing credit card transactions.",
    },
    organization: {
      ar: "مجلس معايير أمن صناعة بطاقات الدفع (PCI SSC)",
      en: "Payment Card Industry Security Standards Council (PCI SSC)",
    },
    year: "2004 (تحديث 2022)",
    imageUrl: "/placeholder.svg?height=400&width=600",
    documentUrl: "https://example.com/pci-dss",
  },
  {
    id: "soc-2",
    title: {
      ar: "SOC 2",
      en: "SOC 2",
    },
    description: {
      ar: "إطار تدقيق يضمن أن مقدمي الخدمات يديرون بيانات العملاء بطريقة تحمي خصوصية وأمن المعلومات.",
      en: "Auditing framework that ensures service providers manage customer data in a way that protects the privacy and security of information.",
    },
    organization: {
      ar: "المعهد الأمريكي للمحاسبين القانونيين المعتمدين (AICPA)",
      en: "American Institute of Certified Public Accountants (AICPA)",
    },
    year: "2010 (تحديث 2018)",
    imageUrl: "/placeholder.svg?height=400&width=600",
    documentUrl: "https://example.com/soc-2",
  },
]

// ISO 27001 Controls
export const iso27001Controls = [
  {
    id: "a5",
    code: "A.5",
    title: {
      ar: "سياسات أمن المعلومات",
      en: "Information Security Policies",
    },
    description: {
      ar: "توجيه وإرشادات الإدارة لأمن المعلومات وفقًا لمتطلبات العمل والقوانين واللوائح ذات الصلة.",
      en: "Management direction and support for information security in accordance with business requirements and relevant laws and regulations.",
    },
  },
  {
    id: "a6",
    code: "A.6",
    title: {
      ar: "تنظيم أمن المعلومات",
      en: "Organization of Information Security",
    },
    description: {
      ar: "إطار عمل لبدء وتنفيذ ومراقبة أمن المعلومات داخل المؤسسة.",
      en: "Framework for initiating, implementing, and controlling information security within the organization.",
    },
  },
  {
    id: "a7",
    code: "A.7",
    title: {
      ar: "أمن الموارد البشرية",
      en: "Human Resource Security",
    },
    description: {
      ar: "ضمان فهم الموظفين والمتعاقدين لمسؤولياتهم وملاءمتهم للأدوار التي يتم النظر فيها.",
      en: "Ensuring that employees and contractors understand their responsibilities and are suitable for the roles for which they are considered.",
    },
  },
  {
    id: "a8",
    code: "A.8",
    title: {
      ar: "إدارة الأصول",
      en: "Asset Management",
    },
    description: {
      ar: "تحديد أصول المؤسسة وتعريف مسؤوليات الحماية المناسبة.",
      en: "Identifying organizational assets and defining appropriate protection responsibilities.",
    },
  },
  {
    id: "a9",
    code: "A.9",
    title: {
      ar: "التحكم في الوصول",
      en: "Access Control",
    },
    description: {
      ar: "تقييد الوصول إلى المعلومات ومرافق معالجة المعلومات.",
      en: "Limiting access to information and information processing facilities.",
    },
  },
]

// Safeguards for Access Control (A.9)
export const accessControlSafeguards = [
  {
    id: "a9-1",
    code: "A.9.1",
    title: {
      ar: "متطلبات العمل للتحكم في الوصول",
      en: "Business Requirements for Access Control",
    },
    description: {
      ar: "تقييد الوصول إلى المعلومات ومرافق معالجة المعلومات وفقًا لمتطلبات العمل والأمن.",
      en: "Limiting access to information and information processing facilities in accordance with business and security requirements.",
    },
  },
  {
    id: "a9-2",
    code: "A.9.2",
    title: {
      ar: "إدارة وصول المستخدم",
      en: "User Access Management",
    },
    description: {
      ar: "ضمان الوصول المصرح به للمستخدمين ومنع الوصول غير المصرح به إلى الأنظمة والخدمات.",
      en: "Ensuring authorized user access and preventing unauthorized access to systems and services.",
    },
  },
  {
    id: "a9-3",
    code: "A.9.3",
    title: {
      ar: "مسؤوليات المستخدم",
      en: "User Responsibilities",
    },
    description: {
      ar: "جعل المستخدمين مسؤولين عن حماية معلومات المصادقة الخاصة بهم.",
      en: "Making users accountable for safeguarding their authentication information.",
    },
  },
  {
    id: "a9-4",
    code: "A.9.4",
    title: {
      ar: "التحكم في وصول النظام والتطبيق",
      en: "System and Application Access Control",
    },
    description: {
      ar: "منع الوصول غير المصرح به إلى الأنظمة والتطبيقات.",
      en: "Preventing unauthorized access to systems and applications.",
    },
  },
]

// Techniques for User Access Management (A.9.2)
export const userAccessManagementTechniques = [
  {
    id: "a9-2-1",
    code: "A.9.2.1",
    title: {
      ar: "تسجيل المستخدم وإلغاء التسجيل",
      en: "User Registration and De-registration",
    },
    description: {
      ar: "تنفيذ عملية رسمية لتسجيل المستخدمين وإلغاء تسجيلهم لتمكين تعيين حقوق الوصول.",
      en: "Implementing a formal user registration and de-registration process to enable assignment of access rights.",
    },
  },
  {
    id: "a9-2-2",
    code: "A.9.2.2",
    title: {
      ar: "توفير وصول المستخدم",
      en: "User Access Provisioning",
    },
    description: {
      ar: "تنفيذ عملية رسمية لتوفير وصول المستخدم لتعيين أو إلغاء حقوق الوصول لجميع أنواع المستخدمين لجميع الأنظمة والخدمات.",
      en: "Implementing a formal user access provisioning process to assign or revoke access rights for all user types to all systems and services.",
    },
  },
  {
    id: "a9-2-3",
    code: "A.9.2.3",
    title: {
      ar: "إدارة حقوق الوصول المميزة",
      en: "Management of Privileged Access Rights",
    },
    description: {
      ar: "تقييد وتحكم تخصيص واستخدام حقوق الوصول المميزة.",
      en: "Restricting and controlling the allocation and use of privileged access rights.",
    },
  },
  {
    id: "a9-2-4",
    code: "A.9.2.4",
    title: {
      ar: "إدارة معلومات المصادقة السرية للمستخدمين",
      en: "Management of Secret Authentication Information of Users",
    },
    description: {
      ar: "التحكم في تخصيص معلومات المصادقة السرية من خلال عملية إدارة رسمية.",
      en: "Controlling the allocation of secret authentication information through a formal management process.",
    },
  },
]

// Implementation Steps for Management of Privileged Access Rights (A.9.2.3)
export const privilegedAccessImplementation = [
  {
    id: "a9-2-3-1",
    code: "A.9.2.3.1",
    title: {
      ar: "تحديد الأدوار المميزة",
      en: "Identify Privileged Roles",
    },
    description: {
      ar: "تحديد وتوثيق جميع الأدوار التي تتطلب امتيازات مرتفعة في الأنظمة والتطبيقات.",
      en: "Identify and document all roles that require elevated privileges in systems and applications.",
    },
    steps: [
      {
        ar: "إنشاء قائمة بجميع الأنظمة والتطبيقات في المؤسسة.",
        en: "Create a list of all systems and applications in the organization.",
      },
      {
        ar: "تحديد الأدوار التي تتطلب وصولاً مميزًا لكل نظام.",
        en: "Identify roles that require privileged access for each system.",
      },
      {
        ar: "توثيق مستوى الامتيازات المطلوبة لكل دور.",
        en: "Document the level of privileges required for each role.",
      },
      {
        ar: "مراجعة واعتماد قائمة الأدوار المميزة من قبل الإدارة.",
        en: "Review and approve the list of privileged roles by management.",
      },
    ],
  },
  {
    id: "a9-2-3-2",
    code: "A.9.2.3.2",
    title: {
      ar: "تنفيذ عملية الموافقة",
      en: "Implement Approval Process",
    },
    description: {
      ar: "إنشاء عملية رسمية للموافقة على منح حقوق الوصول المميزة.",
      en: "Establish a formal process for approving the granting of privileged access rights.",
    },
    steps: [
      {
        ar: "تطوير نموذج طلب للوصول المميز.",
        en: "Develop a request form for privileged access.",
      },
      {
        ar: "تحديد المسؤولين عن الموافقة لكل نوع من أنواع الوصول المميز.",
        en: "Define approvers for each type of privileged access.",
      },
      {
        ar: "إنشاء مسار تدقيق للموافقات.",
        en: "Establish an audit trail for approvals.",
      },
      {
        ar: "تنفيذ مراجعات دورية للموافقات.",
        en: "Implement periodic reviews of approvals.",
      },
    ],
  },
  {
    id: "a9-2-3-3",
    code: "A.9.2.3.3",
    title: {
      ar: "تقييد استخدام الحسابات المميزة",
      en: "Restrict Use of Privileged Accounts",
    },
    description: {
      ar: "تنفيذ ضوابط للحد من استخدام الحسابات المميزة للمهام التي تتطلب امتيازات فقط.",
      en: "Implement controls to limit the use of privileged accounts to tasks that require privileges only.",
    },
    steps: [
      {
        ar: "فصل الحسابات العادية عن الحسابات المميزة.",
        en: "Separate regular accounts from privileged accounts.",
      },
      {
        ar: "تنفيذ تسجيل الدخول المزدوج للوصول المميز.",
        en: "Implement dual login for privileged access.",
      },
      {
        ar: "تقييد استخدام الحسابات المميزة للمهام الإدارية فقط.",
        en: "Restrict privileged accounts to administrative tasks only.",
      },
      {
        ar: "تنفيذ المراقبة المستمرة لاستخدام الحسابات المميزة.",
        en: "Implement continuous monitoring of privileged account usage.",
      },
    ],
  },
  {
    id: "a9-2-3-4",
    code: "A.9.2.3.4",
    title: {
      ar: "تنفيذ المراقبة والتسجيل",
      en: "Implement Monitoring and Logging",
    },
    description: {
      ar: "إعداد آليات مراقبة وتسجيل لتتبع استخدام الحسابات المميزة.",
      en: "Set up monitoring and logging mechanisms to track the use of privileged accounts.",
    },
    steps: [
      {
        ar: "تكوين تسجيل الأحداث لجميع أنشطة الحسابات المميزة.",
        en: "Configure event logging for all privileged account activities.",
      },
      {
        ar: "تنفيذ حلول مراقبة الوقت الفعلي للأنشطة المشبوهة.",
        en: "Implement real-time monitoring solutions for suspicious activities.",
      },
      {
        ar: "إعداد تنبيهات للأنشطة غير العادية.",
        en: "Set up alerts for unusual activities.",
      },
      {
        ar: "الاحتفاظ بسجلات المراقبة لفترة زمنية محددة وفقًا للمتطلبات التنظيمية.",
        en: "Retain monitoring logs for a specified period according to regulatory requirements.",
      },
    ],
  },
]

// Detailed implementation for a specific step
export const privilegedAccountSeparationDetails = {
  id: "a9-2-3-3-1",
  title: {
    ar: "فصل الحسابات العادية عن الحسابات المميزة",
    en: "Separate Regular Accounts from Privileged Accounts",
  },
  description: {
    ar: "إجراءات تفصيلية لضمان الفصل الفعال بين الحسابات العادية والحسابات المميزة للمستخدمين الذين يحتاجون إلى كلا النوعين من الوصول.",
    en: "Detailed procedures to ensure effective separation between regular and privileged accounts for users who need both types of access.",
  },
  content: {
    ar: `<h3>الغرض</h3>
    <p>يهدف هذا الإجراء إلى تقليل مخاطر الأمن السيبراني من خلال ضمان عدم استخدام الحسابات ذات الامتيازات العالية للأنشطة اليومية العادية، مما يقلل من فرص الاستغلال والوصول غير المصرح به.</p>
    
    <h3>النطاق</h3>
    <p>ينطبق هذا الإجراء على جميع الموظفين والمتعاقدين الذين يحتاجون إلى وصول مميز إلى أنظمة تكنولوجيا المعلومات والشبكات والتطبيقات.</p>
    
    <h3>الإجراءات التفصيلية</h3>
    <ol>
      <li><strong>تحديد المستخدمين الذين يحتا��ون إلى حسابات مميزة:</strong>
        <ul>
          <li>مراجعة قوائم الموظفين والأدوار الوظيفية.</li>
          <li>تحديد المستخدمين الذين يحتاجون إلى وصول مميز بناءً على مسؤولياتهم الوظيفية.</li>
          <li>توثيق متطلبات الوصول المميز لكل دور.</li>
        </ul>
      </li>
      <li><strong>إنشاء حسابات منفصلة:</strong>
        <ul>
          <li>إنشاء حساب مستخدم قياسي لكل مستخدم للأنشطة اليومية العادية.</li>
          <li>إنشاء حساب مميز منفصل للمهام التي تتطلب امتيازات مرتفعة.</li>
          <li>استخدام اتفاقية تسمية متسقة لتمييز الحسابات المميزة (مثل إضافة بادئة "admin_" أو "priv_").</li>
        </ul>
      </li>
      <li><strong>تكوين سياسات كلمة المرور:</strong>
        <ul>
          <li>تطبيق سياسات كلمة مرور أكثر صرامة للحسابات المميزة.</li>
          <li>طلب كلمات مرور أطول وأكثر تعقيدًا للحسابات المميزة.</li>
          <li>تنفيذ تغيير إلزامي لكلمة المرور بشكل متكرر للحسابات المميزة.</li>
          <li>منع إعادة استخدام كلمات المرور السابقة.</li>
        </ul>
      </li>
      <li><strong>تنفيذ المصادقة متعددة العوامل:</strong>
        <ul>
          <li>تطبيق المصادقة متعددة العوامل (MFA) لجميع الحسابات المميزة.</li>
          <li>اختيار حل MFA مناسب (مثل الرموز المستندة إلى الوقت، أو تطبيقات المصادقة، أو المفاتيح الأمنية المادية).</li>
          <li>تكوين MFA لجميع نقاط الوصول إلى الحسابات المميزة.</li>
        </ul>
      </li>
      <li><strong>تقييد استخدام الحسابات المميزة:</strong>
        <ul>
          <li>تكوين الأنظمة لمنع استخدام الحسابات المميزة لتصفح الويب أو قراءة البريد الإلكتروني.</li>
          <li>تقييد تسجيل الدخول باستخدام الحسابات المميزة إلى أجهزة أو شبكات محددة.</li>
          <li>تنفيذ حلول رفع الامتيازات عند الحاجة بدلاً من تسجيل الدخول المباشر باستخدام حسابات مميزة.</li>
        </ul>
      </li>
      <li><strong>تنفيذ المراقبة والتدقيق:</strong>
        <ul>
          <li>تكوين تسجيل مفصل لجميع أنشطة الحسابات المميزة.</li>
          <li>مراقبة استخدام الحسابات المميزة في الوقت الفعلي.</li>
          <li>إعداد تنبيهات للأنشطة غير العادية أو المشبوهة.</li>
          <li>إجراء مراجعات دورية لسجلات استخدام الحسابات المميزة.</li>
        </ul>
      </li>
      <li><strong>التدريب والتوعية:</strong>
        <ul>
          <li>تدريب المستخدمين على الاستخدام المناسب للحسابات المميزة.</li>
          <li>توثيق وتوزيع سياسات وإجراءات استخدام الحسابات المميزة.</li>
          <li>تقديم تذكيرات دورية حول أفضل الممارسات.</li>
        </ul>
      </li>
      <li><strong>المراجعة الدورية:</strong>
        <ul>
          <li>مراجعة قوائم الحسابات المميزة بشكل دوري (ربع سنوي على الأقل).</li>
          <li>إلغاء الحسابات المميزة غير المستخدمة أو غير الضرورية.</li>
          <li>تحديث الإجراءات بناءً على التغييرات في البيئة التقنية أو متطلبات العمل.</li>
        </ul>
      </li>
    </ol>
    
    <h3>المسؤوليات</h3>
    <ul>
      <li><strong>مدير تكنولوجيا المعلومات:</strong> الإشراف العام على تنفيذ وصيانة فصل الحسابات.</li>
      <li><strong>مسؤول أمن المعلومات:</strong> تطوير وصيانة السياسات والإجراءات المتعلقة بالحسابات المميزة.</li>
      <li><strong>مسؤولو النظام:</strong> تنفيذ الضوابط التقنية وإدارة الحسابات المميزة.</li>
      <li><strong>المستخدمون:</strong> الالتزام بالسياسات والإجراءات المتعلقة باستخدام الحسابات المميزة.</li>
    </ul>
    
    <h3>القياس والمراقبة</h3>
    <ul>
      <li>عدد حوادث الأمن المتعلقة بسوء استخدام الحسابات المميزة.</li>
      <li>نسبة المستخدمين الذين لديهم حسابات منفصلة للوصول المميز.</li>
      <li>متوسط وقت استخدام الحسابات المميزة.</li>
      <li>عدد الاستثناءات من السياسة.</li>
    </ul>`,
    en: `<h3>Purpose</h3>
    <p>This procedure aims to reduce cybersecurity risks by ensuring that highly privileged accounts are not used for regular daily activities, thus reducing opportunities for exploitation and unauthorized access.</p>
    
    <h3>Scope</h3>
    <p>This procedure applies to all employees and contractors who require privileged access to IT systems, networks, and applications.</p>
    
    <h3>Detailed Procedures</h3>
    <ol>
      <li><strong>Identify Users Requiring Privileged Accounts:</strong>
        <ul>
          <li>Review employee lists and job roles.</li>
          <li>Identify users who need privileged access based on their job responsibilities.</li>
          <li>Document privileged access requirements for each role.</li>
        </ul>
      </li>
      <li><strong>Create Separate Accounts:</strong>
        <ul>
          <li>Create a standard user account for each user for regular daily activities.</li>
          <li>Create a separate privileged account for tasks requiring elevated privileges.</li>
          <li>Use a consistent naming convention to distinguish privileged accounts (e.g., adding a prefix "admin_" or "priv_").</li>
        </ul>
      </li>
      <li><strong>Configure Password Policies:</strong>
        <ul>
          <li>Apply stricter password policies for privileged accounts.</li>
          <li>Require longer and more complex passwords for privileged accounts.</li>
          <li>Implement mandatory password changes more frequently for privileged accounts.</li>
          <li>Prevent reuse of previous passwords.</li>
        </ul>
      </li>
      <li><strong>Implement Multi-Factor Authentication:</strong>
        <ul>
          <li>Apply multi-factor authentication (MFA) for all privileged accounts.</li>
          <li>Select an appropriate MFA solution (e.g., time-based tokens, authenticator apps, or physical security keys).</li>
          <li>Configure MFA for all access points to privileged accounts.</li>
        </ul>
      </li>
      <li><strong>Restrict Use of Privileged Accounts:</strong>
        <ul>
          <li>Configure systems to prevent privileged accounts from being used for web browsing or reading email.</li>
          <li>Restrict privileged account logins to specific devices or networks.</li>
          <li>Implement privilege elevation solutions when needed instead of direct login with privileged accounts.</li>
        </ul>
      </li>
      <li><strong>Implement Monitoring and Auditing:</strong>
        <ul>
          <li>Configure detailed logging for all privileged account activities.</li>
          <li>Monitor privileged account usage in real-time.</li>
          <li>Set up alerts for unusual or suspicious activities.</li>
          <li>Conduct periodic reviews of privileged account usage logs.</li>
        </ul>
      </li>
      <li><strong>Training and Awareness:</strong>
        <ul>
          <li>Train users on the appropriate use of privileged accounts.</li>
          <li>Document and distribute policies and procedures for privileged account usage.</li>
          <li>Provide periodic reminders about best practices.</li>
        </ul>
      </li>
      <li><strong>Periodic Review:</strong>
        <ul>
          <li>Review privileged account lists periodically (at least quarterly).</li>
          <li>Revoke unused or unnecessary privileged accounts.</li>
          <li>Update procedures based on changes in the technical environment or business requirements.</li>
        </ul>
      </li>
    </ol>
    
    <h3>Responsibilities</h3>
    <ul>
      <li><strong>IT Manager:</strong> Overall oversight of the implementation and maintenance of account separation.</li>
      <li><strong>Information Security Officer:</strong> Development and maintenance of policies and procedures related to privileged accounts.</li>
      <li><strong>System Administrators:</strong> Implementation of technical controls and management of privileged accounts.</li>
      <li><strong>Users:</strong> Compliance with policies and procedures regarding the use of privileged accounts.</li>
    </ul>
    
    <h3>Measurement and Monitoring</h3>
    <ul>
      <li>Number of security incidents related to privileged account misuse.</li>
      <li>Percentage of users with separate accounts for privileged access.</li>
      <li>Average duration of privileged account usage.</li>
      <li>Number of policy exceptions.</li>
    </ul>`,
  },
}

// Framework data
export const frameworkData = {
  domains: [
    {
      id: "gov",
      title: {
        ar: "الحوكمة والقيادة",
        en: "Governance and Leadership",
      },
      description: {
        ar: "إطار لتوجيه ودعم أنشطة الأمن السيبراني على مستوى المؤسسة، بما في ذلك الاستراتيجيات والسياسات والمسؤوليات.",
        en: "Framework for directing and supporting cybersecurity activities at the organizational level, including strategies, policies, and responsibilities.",
      },
      components: [
        {
          id: "gov-1",
          title: {
            ar: "استراتيجية الأمن السيبراني",
            en: "Cybersecurity Strategy",
          },
          description: {
            ar: "تطوير وتنفيذ استراتيجية أمن سيبراني تتوافق مع أهداف العمل.",
            en: "Developing and implementing a cybersecurity strategy aligned with business objectives.",
          },
        },
        {
          id: "gov-2",
          title: {
            ar: "سياسات وإجراءات الأمن السيبراني",
            en: "Cybersecurity Policies and Procedures",
          },
          description: {
            ar: "إنشاء وصيانة ��ياسات وإجراءات الأمن السيبراني.",
            en: "Establishing and maintaining cybersecurity policies and procedures.",
          },
        },
        {
          id: "gov-3",
          title: {
            ar: "الأدوار والمسؤوليات",
            en: "Roles and Responsibilities",
          },
          description: {
            ar: "تحديد وتوثيق أدوار ومسؤوليات الأمن السيبراني.",
            en: "Defining and documenting cybersecurity roles and responsibilities.",
          },
        },
      ],
    },
    {
      id: "risk",
      title: {
        ar: "إدارة المخاطر",
        en: "Risk Management",
      },
      description: {
        ar: "عمليات تحديد وتقييم وإدارة المخاطر السيبرانية التي تواجه المؤسسة.",
        en: "Processes for identifying, assessing, and managing cybersecurity risks facing the organization.",
      },
      components: [
        {
          id: "risk-1",
          title: {
            ar: "تقييم المخاطر",
            en: "Risk Assessment",
          },
          description: {
            ar: "تحديد وتقييم المخاطر السيبرانية التي تواجه المؤسسة.",
            en: "Identifying and evaluating cybersecurity risks facing the organization.",
          },
        },
        {
          id: "risk-2",
          title: {
            ar: "معالجة المخاطر",
            en: "Risk Treatment",
          },
          description: {
            ar: "تنفيذ ضوابط لمعالجة المخاطر السيبرانية المحددة.",
            en: "Implementing controls to address identified cybersecurity risks.",
          },
        },
        {
          id: "risk-3",
          title: {
            ar: "مراقبة المخاطر",
            en: "Risk Monitoring",
          },
          description: {
            ar: "مراقبة وتقييم فعالية ضوابط المخاطر بشكل مستمر.",
            en: "Continuously monitoring and evaluating the effectiveness of risk controls.",
          },
        },
      ],
    },
    {
      id: "asset",
      title: {
        ar: "إدارة الأصول",
        en: "Asset Management",
      },
      description: {
        ar: "عمليات تحديد وتصنيف وحماية أصول المعلومات في المؤسسة.",
        en: "Processes for identifying, classifying, and protecting information assets in the organization.",
      },
      components: [
        {
          id: "asset-1",
          title: {
            ar: "جرد الأصول",
            en: "Asset Inventory",
          },
          description: {
            ar: "تحديد وتوثيق جميع أصول المعلومات في المؤسسة.",
            en: "Identifying and documenting all information assets in the organization.",
          },
        },
        {
          id: "asset-2",
          title: {
            ar: "تصنيف الأصول",
            en: "Asset Classification",
          },
          description: {
            ar: "تصنيف الأصول وفقًا لقيمتها وحساسيتها.",
            en: "Classifying assets according to their value and sensitivity.",
          },
        },
        {
          id: "asset-3",
          title: {
            ar: "إدارة دورة حياة الأصول",
            en: "Asset Lifecycle Management",
          },
          description: {
            ar: "إدارة الأصول من الاكتساب إلى التخلص منها.",
            en: "Managing assets from acquisition to disposal.",
          },
        },
      ],
    },
  ],
}

// Definitions data
export const definitionsData = {
  general: [
    {
      id: "def-001",
      term: {
        ar: "الأمن السيبراني",
        en: "Cybersecurity",
      },
      definition: {
        ar: "مجموعة من الوسائل التقنية والتنظيمية والإدارية التي تُستخدم لمنع الاستخدام غير المصرح به أو سوء الاستخدام أو استعادة المعلومات الإلكترونية ونظم الاتصالات والمعلومات التي تحتويها.",
        en: "The collection of tools, policies, security concepts, security safeguards, guidelines, risk management approaches, actions, training, best practices, assurance, and technologies that can be used to protect the cyber environment and organization and user's assets.",
      },
    },
    {
      id: "def-002",
      term: {
        ar: "الفضاء السيبراني",
        en: "Cyberspace",
      },
      definition: {
        ar: "البيئة الافتراضية التي تتصل فيها شبكات الحاسوب وأنظمة المعلومات والبنى التحتية الرقمية، وتتفاعل فيها الأشخاص والبرمجيات والخدمات.",
        en: "The environment formed by physical and non-physical components to store, modify, and exchange data using computer networks.",
      },
    },
    {
      id: "def-003",
      term: {
        ar: "حوكمة الأمن السيبراني",
        en: "Cybersecurity Governance",
      },
      definition: {
        ar: "نظام يتكون من مجموعة من السياسات والإجراءات والعمليات التي تحدد كيفية إدارة المخاطر السيبرانية وحماية الأصول المعلوماتية في المؤسسة.",
        en: "The system by which an organization directs and controls cybersecurity, including the policies, processes, procedures, and structures used to manage cybersecurity risks and protect information assets.",
      },
    },
  ],
  technical: [
    {
      id: "def-004",
      term: {
        ar: "التشفير",
        en: "Encryption",
      },
      definition: {
        ar: "عملية تحويل المعلومات إلى شكل غير مفهوم (مشفر) باستخدام خوارزميات وأساليب رياضية، بحيث لا يمكن قراءتها إلا من قبل الأشخاص المصرح لهم باستخدام مفتاح فك التشفير.",
        en: "The process of converting information into a form that unauthorized persons cannot understand, using mathematical algorithms and keys, so that only authorized persons with the decryption key can access the original information.",
      },
    },
    {
      id: "def-005",
      term: {
        ar: "جدار الحماية",
        en: "Firewall",
      },
      definition: {
        ar: "نظام أمني يراقب ويتحكم في حركة مرور الشبكة الداخلة والخارجة وفقًا لمجموعة محددة من قواعد الأمان، ويعمل كحاجز بين الشبكات الموثوقة وغير الموثوقة.",
        en: "A network security system that monitors and controls incoming and outgoing network traffic based on predetermined security rules, acting as a barrier between trusted and untrusted networks.",
      },
    },
    {
      id: "def-006",
      term: {
        ar: "المصادقة متعددة العوامل",
        en: "Multi-Factor Authentication (MFA)",
      },
      definition: {
        ar: "طريقة للتحقق من هوية المستخدم تتطلب تقديم دليلين أو أكثر للتحقق من الهوية من فئات مختلفة: شيء يعرفه المستخدم (مثل كلمة المرور)، شيء يملكه المستخدم (مثل رمز أمان)، وشيء هو المستخدم (مثل بصمة الإصبع).",
        en: "An authentication method that requires the user to provide two or more verification factors from different categories: something the user knows (like a password), something the user has (like a security token), and something the user is (like a fingerprint).",
      },
    },
  ],
  legal: [
    {
      id: "def-007",
      term: {
        ar: "الجريمة السيبرانية",
        en: "Cybercrime",
      },
      definition: {
        ar: "نشاط إجرامي يستهدف أو يستخدم أجهزة الحاسوب أو الشبكات أو الأنظمة المعلوماتية، ويشمل ذلك الاحتيال الإلكتروني، وسرقة الهوية، وانتهاك الخصوصية، والقرصنة، ونشر البرمجيات الخبيثة.",
        en: "Criminal activity that targets or uses computers, computer networks, or information systems, including electronic fraud, identity theft, privacy violations, hacking, and malware distribution.",
      },
    },
    {
      id: "def-008",
      term: {
        ar: "حماية البيانات",
        en: "Data Protection",
      },
      definition: {
        ar: "القوانين والسياسات والإجراءات التي تهدف إلى ضمان خصوصية وسلامة البيانات الشخصية، وتنظيم كيفية جمعها واستخدامها وتخزينها ومشاركتها.",
        en: "Laws, policies, and procedures aimed at ensuring the privacy and integrity of personal data, and regulating how it is collected, used, stored, and shared.",
      },
    },
    {
      id: "def-009",
      term: {
        ar: "الامتثال السيبراني",
        en: "Cyber Compliance",
      },
      definition: {
        ar: "عملية ضمان التزام المؤسسة بالمعايير والقوانين واللوائح المتعلقة بالأمن السيبراني وحماية البيانات، مثل GDPR و HIPAA و PCI DSS وغيرها.",
        en: "The process of ensuring an organization's adherence to cybersecurity and data protection standards, laws, and regulations, such as GDPR, HIPAA, PCI DSS, and others.",
      },
    },
  ],
  threats: [
    {
      id: "def-010",
      term: {
        ar: "التصيد الاحتيالي",
        en: "Phishing",
      },
      definition: {
        ar: "هجوم يستخدم رسائل بريد إلكتروني أو رسائل نصية أو مواقع ويب مزيفة ت��دو وكأنها من مصادر موثوقة، بهدف خداع المستخدمين للكشف عن معلومات حساسة ��ثل كلمات المرور أو بيانات بطاقات الائتمان.",
        en: "An attack that uses fraudulent emails, text messages, or websites that appear to be from trusted sources, designed to trick users into revealing sensitive information such as passwords or credit card details.",
      },
    },
    {
      id: "def-011",
      term: {
        ar: "برامج الفدية",
        en: "Ransomware",
      },
      definition: {
        ar: "نوع من البرمجيات الخبيثة التي تشفر ملفات الضحية وتطالب بفدية مقابل مفتاح فك التشفير، مما يمنع الوصول إلى البيانات حتى يتم دفع الفدية.",
        en: "A type of malicious software that encrypts a victim's files and demands a ransom in exchange for the decryption key, preventing access to data until the ransom is paid.",
      },
    },
    {
      id: "def-012",
      term: {
        ar: "هجوم الحرمان من الخدمة الموزع",
        en: "Distributed Denial of Service (DDoS)",
      },
      definition: {
        ar: "هجوم يهدف إلى تعطيل توفر خدمة أو موقع ويب عن طريق إغراقه بحركة مرور زائفة من مصادر متعددة، مما يؤدي إلى استنفاد موارد النظام وجعله غير قادر على خدمة المستخدمين الشرعيين.",
        en: "An attack that aims to disrupt the availability of a service or website by flooding it with fake traffic from multiple sources, exhausting system resources and making it unable to serve legitimate users.",
      },
    },
  ],
}
