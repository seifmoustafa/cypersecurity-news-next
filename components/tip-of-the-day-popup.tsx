"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useLanguage } from "@/components/language-provider"
import { LightbulbIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

// Static tips examples until API is provided
const STATIC_TIPS = [
  {
    id: "tip1",
    title: {
      en: "Use Strong Passwords",
      ar: "استخدم كلمات مرور قوية",
    },
    content: {
      en: "Create passwords with at least 12 characters that include uppercase letters, lowercase letters, numbers, and special characters.",
      ar: "قم بإنشاء كلمات مرور تتكون من 12 حرفًا على الأقل وتتضمن أحرفًا كبيرة وصغيرة وأرقامًا ورموزًا خاصة.",
    },
  },
  {
    id: "tip2",
    title: {
      en: "Enable Two-Factor Authentication",
      ar: "تفعيل المصادقة الثنائية",
    },
    content: {
      en: "Add an extra layer of security to your accounts by enabling two-factor authentication whenever possible.",
      ar: "أضف طبقة إضافية من الأمان لحساباتك من خلال تفعيل المصادقة الثنائية كلما أمكن ذلك.",
    },
  },
  {
    id: "tip3",
    title: {
      en: "Beware of Phishing Attempts",
      ar: "احذر من محاولات التصيد الاحتيالي",
    },
    content: {
      en: "Always verify the sender's email address and don't click on suspicious links or download unexpected attachments.",
      ar: "تحقق دائمًا من عنوان البريد الإلكتروني للمرسل ولا تنقر على الروابط المشبوهة أو تقوم بتنزيل المرفقات غير المتوقعة.",
    },
  },
  {
    id: "tip4",
    title: {
      en: "Keep Software Updated",
      ar: "حافظ على تحديث البرامج",
    },
    content: {
      en: "Regularly update your operating system, applications, and antivirus software to protect against known vulnerabilities.",
      ar: "قم بتحديث نظام التشغيل والتطبيقات وبرامج مكافحة الفيروسات بانتظام للحماية من نقاط الضعف المعروفة.",
    },
  },
  {
    id: "tip5",
    title: {
      en: "Secure Your Wi-Fi Network",
      ar: "تأمين شبكة الواي فاي الخاصة بك",
    },
    content: {
      en: "Use WPA3 encryption, change default router passwords, and hide your network SSID for better Wi-Fi security.",
      ar: "استخدم تشفير WPA3، وغيّر كلمات مرور الراوتر الافتراضية، وأخفِ معرف شبكتك SSID لتحسين أمان الواي فاي.",
    },
  },
]

export default function TipOfTheDayPopup() {
  const [open, setOpen] = useState(false)
  const [tip, setTip] = useState<(typeof STATIC_TIPS)[0] | null>(null)
  const { language } = useLanguage()

  useEffect(() => {
    // Get a random tip from the static examples
    const randomIndex = Math.floor(Math.random() * STATIC_TIPS.length)
    const randomTip = STATIC_TIPS[randomIndex]
    setTip(randomTip)

    // Always show the popup after a short delay
    const timer = setTimeout(() => {
      setOpen(true)
    }, 1000)

    // Clean up the timer when component unmounts
    return () => clearTimeout(timer)
  }, [])

  if (!tip) return null

  const closePopup = () => {
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-2xl p-0 border-2 border-primary/20 rounded-xl overflow-hidden"
        hideCloseButton={true} // Hide the default X button
      >
        <div className="bg-primary/10 p-6">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-primary">
              <div className="bg-primary/20 p-2 rounded-full">
                <LightbulbIcon className="h-8 w-8 text-yellow-500" />
              </div>
              <span>{tip.title[language]}</span>
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className="p-6">
          <DialogDescription className="text-lg mb-6">{tip.content[language]}</DialogDescription>

          <div className="flex justify-center">
            <Button onClick={closePopup} className="px-8 py-2 text-lg font-medium">
              {language === "ar" ? "فهمت" : "I Understand"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
