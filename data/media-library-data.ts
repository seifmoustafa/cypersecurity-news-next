export const mediaLibraryData = {
  videos: [
    {
      id: 1,
      title: {
        ar: "مقدمة في الأمن السيبراني",
        en: "Introduction to Cybersecurity",
      },
      description: {
        ar: "فيديو تعريفي يشرح المفاهيم الأساسية للأمن السيبراني والتهديدات الشائعة وطرق الحماية",
        en: "An introductory video explaining the basic concepts of cybersecurity, common threats, and protection methods",
      },
      thumbnailUrl: "/placeholder.svg?height=400&width=600",
      url: "https://www.youtube.com/embed/inWWhr5tnEA",
    },
    {
      id: 2,
      title: {
        ar: "كيفية اكتشاف هجمات التصيد الاحتيالي",
        en: "How to Detect Phishing Attacks",
      },
      description: {
        ar: "دليل مرئي لمساعدتك على التعرف على رسائل التصيد الاحتيالي وتجنب الوقوع ضحية لها",
        en: "A visual guide to help you identify phishing messages and avoid falling victim to them",
      },
      thumbnailUrl: "/placeholder.svg?height=400&width=600",
      url: "https://www.youtube.com/embed/XBkzBrXlle0",
    },
    {
      id: 3,
      title: {
        ar: "أساسيات تشفير البيانات",
        en: "Data Encryption Basics",
      },
      description: {
        ar: "شرح مبسط لمفاهيم وتقنيات تشفير البيانات وأهميتها في حماية المعلومات الحساس��",
        en: "A simplified explanation of data encryption concepts and techniques and their importance in protecting sensitive information",
      },
      thumbnailUrl: "/placeholder.svg?height=400&width=600",
      url: "https://www.youtube.com/embed/O4xNJsjtN6E",
    },
  ],
  lectures: [
    {
      id: 1,
      title: {
        ar: "تحليل التهديدات السيبرانية المتقدمة",
        en: "Advanced Cyber Threat Analysis",
      },
      description: {
        ar: "محاضرة متعمقة حول تقنيات تحليل التهديدات السيبرانية المتقدمة واستراتيجيات الكشف عنها",
        en: "An in-depth lecture on advanced cyber threat analysis techniques and detection strategies",
      },
      thumbnailUrl: "/placeholder.svg?height=400&width=600",
      content: {
        ar: `<h3>محتوى المحاضرة</h3>
        <p>تتناول هذه المحاضرة المتقدمة موضوع تحليل التهديدات السيبرانية المتطورة وكيفية الكشف عنها والتصدي لها. تغطي المحاضرة المواضيع التالية:</p>
        
        <ol>
          <li>مقدمة في التهديدات المتقدمة المستمرة (APT)</li>
          <li>تقنيات التحليل السلوكي للكشف عن التهديدات</li>
          <li>استخدام تحليلات البيانات الضخمة في اكتشاف الأنماط المشبوهة</li>
          <li>تحليل البرمجيات الخبيثة وهندستها العكسية</li>
          <li>استراتيجيات الاستجابة للحوادث المتقدمة</li>
          <li>دراسات حالة لهجمات متقدمة وكيفية التعامل ��عها</li>
        </ol>
        
        <p>قدم المحاضرة الدكتور أحمد الشمري، خبير الأمن الس��براني المتخصص في تحليل التهديدات المتقدمة، بتاريخ 15 يناير 2024.</p>`,
        en: `<h3>Lecture Content</h3>
        <p>This advanced lecture addresses the topic of analyzing sophisticated cyber threats and how to detect and counter them. The lecture covers the following topics:</p>
        
        <ol>
          <li>Introduction to Advanced Persistent Threats (APTs)</li>
          <li>Behavioral analysis techniques for threat detection</li>
          <li>Using big data analytics to discover suspicious patterns</li>
          <li>Malware analysis and reverse engineering</li>
          <li>Advanced incident response strategies</li>
          <li>Case studies of advanced attacks and how to deal with them</li>
        </ol>
        
        <p>The lecture was presented by Dr. Ahmed Al-Shamri, a cybersecurity expert specializing in advanced threat analysis, on January 15, 2024.</p>`,
      },
      url: "https://example.com/advanced/lectures/advanced-threat-analysis.pdf",
    },
    {
      id: 2,
      title: {
        ar: "استراتيجيات الدفاع السيبراني",
        en: "Cyber Defense Strategies",
      },
      description: {
        ar: "محاضرة حول استراتيجيات وتقنيات الدفاع السيبراني الفعالة للمؤسسات",
        en: "A lecture on effective cyber defense strategies and techniques for organizations",
      },
      thumbnailUrl: "/placeholder.svg?height=400&width=600",
      content: {
        ar: `<h3>محتوى المحاضرة</h3>
        <p>تقدم هذه المحاضرة نظرة شاملة على استراتيجيات الدفاع السيبراني الحديثة وكيفية تطبيقها في المؤسسات. تتضمن المحاضر�� المحاور التالية:</p>
        
        <ol>
          <li>مفهوم الدفاع العميق (Defense in Depth) وأهميته</li>
          <li>تقنيات الكشف والاستجابة المتقدمة</li>
          <li>استراتيجيات الخداع السيبراني (Cyber Deception)</li>
          <li>تحليل نقاط الضعف وإدارة الثغرات</li>
          <li>تأمين البنية التحتية الحرجة</li>
          <li>استراتيجيات التعافي من الكوارث السيبرانية</li>
        </ol>
        
        <p>قدمت المحاضرة المهندسة سارة العتيبي، مستشارة الأمن السيبراني، بتاريخ 20 فبراير 2024.</p>`,
        en: `<h3>Lecture Content</h3>
        <p>This lecture provides a comprehensive overview of modern cyber defense strategies and how to apply them in organizations. The lecture includes the following themes:</p>
        
        <ol>
          <li>The concept of Defense in Depth and its importance</li>
          <li>Advanced detection and response techniques</li>
          <li>Cyber Deception strategies</li>
          <li>Vulnerability analysis and management</li>
          <li>Securing critical infrastructure</li>
          <li>Cyber disaster recovery strategies</li>
        </ol>
        
        <p>The lecture was presented by Engineer Sarah Al-Otaibi, Cybersecurity Consultant, on February 20, 2024.</p>`,
      },
      url: "https://example.com/advanced/lectures/cyber-defense-strategies.pdf",
    },
    {
      id: 3,
      title: {
        ar: "الأمن السيبراني للبنية التحتية الحرجة",
        en: "Cybersecurity for Critical Infrastructure",
      },
      description: {
        ar: "محاضرة متخصصة حول حماية البنية التحتية الحرجة من التهديدات السيبرانية",
        en: "A specialized lecture on protecting critical infrastructure from cyber threats",
      },
      thumbnailUrl: "/placeholder.svg?height=400&width=600",
      content: {
        ar: `<h3>محتوى المحاضرة</h3>
        <p>تركز هذه المحاضرة على التحديات الفريدة التي تواجه أمن البنية التحتية الحرجة والحلول المناسبة لحمايتها. تغطي المحاضرة:</p>
        
        <ol>
          <li>خصائص وتحديات أمن البنية التحتية الحرجة</li>
          <li>التهديدات الموجهة ضد أنظمة التحكم الصناعية (ICS) وأنظمة سكادا (SCADA)</li>
          <li>معايير وأطر عمل حماية البنية التحتية الحرجة</li>
          <li>استراتيجيات الحماية والكشف والاستجابة</li>
          <li>التعاون بين القطاعين العام والخاص في حماية البنية التحتية الحرجة</li>
          <li>دراسات حالة لهجمات استهدفت البنية التحتية الحرجة والدروس المستفادة</li>
        </ol>
        
        <p>قدم المحاضرة الدكتور خالد المنصور، خبير أمن البنية التحتية الحرجة، بتاريخ 10 مارس 2024.</p>`,
        en: `<h3>Lecture Content</h3>
        <p>This lecture focuses on the unique challenges facing critical infrastructure security and appropriate solutions to protect it. The lecture covers:</p>
        
        <ol>
          <li>Characteristics and challenges of critical infrastructure security</li>
          <li>Threats targeting Industrial Control Systems (ICS) and SCADA systems</li>
          <li>Standards and frameworks for critical infrastructure protection</li>
          <li>Protection, detection, and response strategies</li>
          <li>Public-private collaboration in protecting critical infrastructure</li>
          <li>Case studies of attacks targeting critical infrastructure and lessons learned</li>
        </ol>
        
        <p>The lecture was presented by Dr. Khalid Al-Mansour, Critical Infrastructure Security Expert, on March 10, 2024.</p>`,
      },
      url: "https://example.com/advanced/lectures/critical-infrastructure-security.pdf",
    },
  ],
  presentations: [
    {
      id: 1,
      title: {
        ar: "اتجاهات الأمن السيبراني لعام 2024",
        en: "Cybersecurity Trends for 2024",
      },
      description: {
        ar: "عرض تقديمي يستعرض أبرز اتجاهات وتطورات الأمن السيبراني المتوقعة لعام 2024",
        en: "A presentation reviewing the most prominent cybersecurity trends and developments expected for 2024",
      },
      thumbnailUrl: "/placeholder.svg?height=400&width=600",
      url: "https://example.com/advanced/presentations/cybersecurity-trends-2024.pptx",
    },
    {
      id: 2,
      title: {
        ar: "إطار عمل إدارة المخاطر السيبرانية",
        en: "Cyber Risk Management Framework",
      },
      description: {
        ar: "عرض تقديمي يشرح إطار عمل شامل لإدارة المخاطر السيبرانية في المؤسسات",
        en: "A presentation explaining a comprehensive framework for managing cyber risks in organizations",
      },
      thumbnailUrl: "/placeholder.svg?height=400&width=600",
      url: "https://example.com/advanced/presentations/cyber-risk-management.pptx",
    },
    {
      id: 3,
      title: {
        ar: "استراتيجية الأمن السيبراني الوطنية",
        en: "National Cybersecurity Strategy",
      },
      description: {
        ar: "عرض تقديمي يستعرض عناصر ومحاور الاستراتيجية الوطنية للأمن السيبراني",
        en: "A presentation reviewing the elements and axes of the national cybersecurity strategy",
      },
      thumbnailUrl: "/placeholder.svg?height=400&width=600",
      url: "https://example.com/advanced/presentations/national-cybersecurity-strategy.pptx",
    },
  ],
}
