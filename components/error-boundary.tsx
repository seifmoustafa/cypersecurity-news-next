"use client"
import { Component, type ReactNode } from "react"
import { LanguageContext } from "@/components/language-provider"
import UnifiedErrorPage from "./unified-error-page"

interface Props { children: ReactNode }
interface State { hasError: boolean; error?: Error }

export default class ErrorBoundary extends Component<Props, State> {
  static contextType = LanguageContext
  declare context: React.ContextType<typeof LanguageContext>

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught", error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <UnifiedErrorPage
          type="runtime"
          error={this.state.error}
          onRetry={() => {
            this.setState({ hasError: false, error: undefined })
          }}
          showErrorDetails={process.env.NODE_ENV === 'development'}
        />
      )
    }
    return this.props.children
  }
}
