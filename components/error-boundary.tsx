"use client"
import { Component, type ReactNode } from "react"
import { LanguageContext } from "@/components/language-provider"

interface Props { children: ReactNode }
interface State { hasError: boolean }

export default class ErrorBoundary extends Component<Props, State> {
  static contextType = LanguageContext
  declare context: React.ContextType<typeof LanguageContext>

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught", error)
  }

  render() {
    if (this.state.hasError) {
      const t = this.context?.t ?? ((k: string) => k)
      return (
        <div className="py-12 text-center text-muted-foreground">
          {t("common.somethingWrong")}
        </div>
      )
    }
    return this.props.children
  }
}
