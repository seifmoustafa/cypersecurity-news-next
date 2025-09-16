"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import UnifiedErrorPage from "./unified-error-page"

// Example component showing how to use UnifiedErrorPage in different scenarios
export default function ErrorExamples() {
  const [errorType, setErrorType] = useState<'not-found' | 'runtime' | 'critical' | 'network' | 'server' | null>(null)
  const [error, setError] = useState<Error | null>(null)

  const triggerError = (type: 'not-found' | 'runtime' | 'critical' | 'network' | 'server') => {
    setErrorType(type)
    
    // Create different types of errors for demonstration
    switch (type) {
      case 'runtime':
        setError(new Error("This is a runtime error example"))
        break
      case 'critical':
        setError(new Error("This is a critical error example"))
        break
      case 'network':
        setError(new Error("Network connection failed"))
        break
      case 'server':
        setError(new Error("Server returned 500 error"))
        break
      default:
        setError(null)
    }
  }

  const resetError = () => {
    setErrorType(null)
    setError(null)
  }

  // If there's an error type, show the unified error page
  if (errorType) {
    return (
      <UnifiedErrorPage
        type={errorType}
        error={error || undefined}
        onRetry={resetError}
        showErrorDetails={true}
      />
    )
  }

  // Otherwise show the demo interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Unified Error Page Examples
        </h1>
        
        <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl p-8 border border-blue-200/30 dark:border-blue-800/30 shadow-lg">
          <p className="text-lg text-muted-foreground mb-8">
            Click any button below to see different error page types in action:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button 
              onClick={() => triggerError('not-found')}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              404 Not Found
            </Button>
            
            <Button 
              onClick={() => triggerError('runtime')}
              className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Runtime Error
            </Button>
            
            <Button 
              onClick={() => triggerError('critical')}
              className="bg-gradient-to-r from-purple-600 to-red-600 hover:from-purple-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Critical Error
            </Button>
            
            <Button 
              onClick={() => triggerError('network')}
              className="bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Network Error
            </Button>
            
            <Button 
              onClick={() => triggerError('server')}
              className="bg-gradient-to-r from-gray-600 to-red-600 hover:from-gray-700 hover:to-red-700 text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              Server Error
            </Button>
          </div>
          
          <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">
              Features of the Unified Error Page:
            </h3>
            <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 text-left">
              <li>• Consistent design across all error types</li>
              <li>• RTL support for Arabic language</li>
              <li>• Animated transitions and modern UI</li>
              <li>• Contextual error messages and helpful tips</li>
              <li>• Development error details (when enabled)</li>
              <li>• Multiple action buttons (retry, home, search, back)</li>
              <li>• Responsive design for all screen sizes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
