import { redirect } from "next/navigation"

export default function AwarenessPage() {
  // Get current year and redirect to it
  const currentYear = new Date().getFullYear()
  redirect(`/advanced/awareness/${currentYear}`)
}
