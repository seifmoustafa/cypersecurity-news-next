import { Loader2 } from "lucide-react"

interface LoadingProps {
  size?: "sm" | "md" | "lg"
  text?: string
  fullPage?: boolean
}

export function Loading({ size = "md", text, fullPage = false }: LoadingProps) {
  const sizeClass = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  }

  const content = (
    <div className="flex flex-col items-center justify-center gap-2">
      <Loader2 className={`${sizeClass[size]} animate-spin text-primary`} />
      {text && <p className="text-muted-foreground text-sm">{text}</p>}
    </div>
  )

  if (fullPage) {
    return <div className="flex items-center justify-center min-h-[50vh]">{content}</div>
  }

  return content
}
