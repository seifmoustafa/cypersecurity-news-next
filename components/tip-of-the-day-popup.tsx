"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LightbulbIcon } from "lucide-react";
import { useLanguage } from "@/components/language-provider";

// Static tips data until API is provided
const staticTips = [
  {
    id: 1,
    title: {
      en: "Use Strong Passwords",
      ar: "استخدم كلمات مرور قوية",
    },
    content: {
      en: "Create passwords that are at least 12 characters long and include a mix of uppercase letters, lowercase letters, numbers, and special characters. Avoid using easily guessable information like birthdays or names.",
      ar: "قم بإنشاء كلمات مرور لا تقل عن 12 حرفًا وتتضمن مزيجًا من الأحرف الكبيرة والصغيرة والأرقام والرموز الخاصة. تجنب استخدام معلومات يسهل تخمينها مثل تواريخ الميلاد أو الأسماء.",
    },
  },
  {
    id: 2,
    title: {
      en: "Enable Two-Factor Authentication",
      ar: "فعّل المصادقة الثنائية",
    },
    content: {
      en: "Add an extra layer of security to your accounts by enabling two-factor authentication (2FA). This requires both your password and a second form of verification, such as a code sent to your phone.",
      ar: "أضف طبقة إضافية من الأمان لحساباتك من خلال تفعيل المصادقة الثنائية. يتطلب ذلك كلمة المرور الخاصة بك بالإضافة إلى شكل ثانٍ من التحقق، مثل رمز يتم إرساله إلى هاتفك.",
    },
  },
  {
    id: 3,
    title: {
      en: "Keep Software Updated",
      ar: "حافظ على تحديث البرامج",
    },
    content: {
      en: "Regularly update your operating system, applications, and antivirus software. Updates often include security patches that protect against newly discovered vulnerabilities.",
      ar: "قم بتحديث نظام التشغيل والتطبيقات وبرامج مكافحة الفيروسات بانتظام. غالبًا ما تتضمن التحديثات إصلاحات أمنية تحمي من الثغرات المكتشفة حديثًا.",
    },
  },
  {
    id: 4,
    title: {
      en: "Be Cautious with Email Attachments",
      ar: "كن حذرًا مع مرفقات البريد الإلكتروني",
    },
    content: {
      en: "Never open email attachments from unknown senders. Even if the sender appears familiar, be suspicious of unexpected attachments, as email addresses can be spoofed.",
      ar: "لا تفتح أبدًا مرفقات البريد الإلكتروني من مرسلين غير معروفين. حتى إذا بدا المرسل مألوفًا، كن مشككًا في المرفقات غير المتوقعة، حيث يمكن تزوير عناوين البريد الإلكتروني.",
    },
  },
  {
    id: 5,
    title: {
      en: "Use a VPN on Public Wi-Fi",
      ar: "استخدم شبكة VPN على شبكات Wi-Fi العامة",
    },
    content: {
      en: "When connecting to public Wi-Fi networks, use a Virtual Private Network (VPN) to encrypt your internet traffic and protect your data from potential eavesdroppers.",
      ar: "عند الاتصال بشبكات Wi-Fi العامة، استخدم شبكة خاصة افتراضية (VPN) لتشفير حركة الإنترنت الخاصة بك وحماية بياناتك من المتطفلين المحتملين.",
    },
  },
];

export default function TipOfTheDayPopup() {
  const [open, setOpen] = useState(false);
  const [tip, setTip] = useState<(typeof staticTips)[0] | null>(null);
  const { language } = useLanguage();

  useEffect(() => {
    // Select a random tip
    const randomIndex = Math.floor(Math.random() * staticTips.length);
    setTip(staticTips[randomIndex]);

    // Show the tip after a short delay
    const timer = setTimeout(() => {
      setOpen(true);
    }, 1000);

    // Cleanup function
    return () => clearTimeout(timer);
  }, []);

  if (!tip) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-2xl p-0 overflow-hidden border-primary/20"
        hideCloseButton
      >
        {/* Header section with colored background */}
        <div className="bg-primary/10 dark:bg-primary/20 p-6 flex items-center gap-4 border-b border-primary/20">
          <div className="bg-primary/20 dark:bg-primary/30 p-3 rounded-full">
            <LightbulbIcon className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-primary">
              {language === "ar" ? "نصيحة اليوم" : "Tip of the Day"}
            </h2>
            <p className="text-lg font-medium">{tip.title[language]}</p>
          </div>
        </div>

        {/* Content section */}
        <div className="p-6">
          <p className="text-base leading-relaxed">{tip.content[language]}</p>

          {/* Custom close button */}
          <div className="mt-6 flex justify-center">
            <Button
              className="px-8 py-2 bg-primary hover:bg-primary/90 text-white"
              onClick={() => setOpen(false)}
            >
              {language === "ar" ? "فهمت" : "I Understand"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
