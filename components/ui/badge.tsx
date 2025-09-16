import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 shadow-sm hover:shadow-md transform hover:scale-105",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:from-blue-700 hover:to-cyan-700 shadow-blue-500/30 dark:shadow-blue-500/40",
        secondary:
          "border-transparent bg-gradient-to-r from-slate-600 to-slate-700 text-white hover:from-slate-700 hover:to-slate-800 shadow-slate-500/30 dark:shadow-slate-500/40",
        destructive:
          "border-transparent bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-red-500/30 dark:shadow-red-500/40",
        outline: 
          "border-blue-200/50 dark:border-blue-800/50 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-foreground hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:border-blue-300 dark:hover:border-blue-700",
        success:
          "border-transparent bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-green-500/30 dark:shadow-green-500/40",
        warning:
          "border-transparent bg-gradient-to-r from-orange-600 to-amber-600 text-white hover:from-orange-700 hover:to-amber-700 shadow-orange-500/30 dark:shadow-orange-500/40",
        info:
          "border-transparent bg-gradient-to-r from-cyan-600 to-blue-600 text-white hover:from-cyan-700 hover:to-blue-700 shadow-cyan-500/30 dark:shadow-cyan-500/40",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
