import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-2xl border p-6 shadow-lg backdrop-blur-sm transition-all duration-300 [&>svg~*]:pl-8 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-6 [&>svg]:top-6 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default: 
          "bg-white/80 dark:bg-slate-800/80 text-foreground border-blue-200/30 dark:border-blue-800/30 shadow-blue-500/10 dark:shadow-blue-500/20",
        destructive:
          "bg-red-50/80 dark:bg-red-950/80 text-red-800 dark:text-red-200 border-red-200/50 dark:border-red-800/50 shadow-red-500/10 dark:shadow-red-500/20 [&>svg]:text-red-600 dark:[&>svg]:text-red-400",
        warning:
          "bg-orange-50/80 dark:bg-orange-950/80 text-orange-800 dark:text-orange-200 border-orange-200/50 dark:border-orange-800/50 shadow-orange-500/10 dark:shadow-orange-500/20 [&>svg]:text-orange-600 dark:[&>svg]:text-orange-400",
        success:
          "bg-green-50/80 dark:bg-green-950/80 text-green-800 dark:text-green-200 border-green-200/50 dark:border-green-800/50 shadow-green-500/10 dark:shadow-green-500/20 [&>svg]:text-green-600 dark:[&>svg]:text-green-400",
        info:
          "bg-blue-50/80 dark:bg-blue-950/80 text-blue-800 dark:text-blue-200 border-blue-200/50 dark:border-blue-800/50 shadow-blue-500/10 dark:shadow-blue-500/20 [&>svg]:text-blue-600 dark:[&>svg]:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = "Alert"

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn("mb-2 font-bold leading-tight tracking-tight text-lg", className)}
    {...props}
  />
))
AlertTitle.displayName = "AlertTitle"

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm [&_p]:leading-relaxed", className)}
    {...props}
  />
))
AlertDescription.displayName = "AlertDescription"

export { Alert, AlertTitle, AlertDescription }
