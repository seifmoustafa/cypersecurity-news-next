"use client"
import { useLanguage } from "@/components/language-provider"
import SectionHeader from "@/components/ui/section-header"
import SectionContainer from "@/components/ui/section-container"
import SecurityInstructionsContent from "./security-instructions-content"

export default function SecurityInstructionsSection() {
  const { t } = useLanguage()

  return (
    <SectionContainer id="instructions">
      <SectionHeader title={t("section.instructions")} subtitle={t("instructions.subtitle")} />
      <SecurityInstructionsContent />
    </SectionContainer>
  )
}
