"use client"
import Link from "next/link"
import { useInstructionCategories } from "@/core/hooks/use-instruction-categories"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useLanguage } from "@/components/language-provider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Shield, FileText } from "lucide-react"
import { slugify } from "@/lib/utils"
import { motion } from "framer-motion"

export default function SecurityInstructionsContent() {
  const { categories, loading, error, refetch } = useInstructionCategories()
  const { language } = useLanguage()

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, index) => (
          <Card key={index} className="overflow-hidden">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-8">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="flex items-center justify-between w-full">
          <div>
            <h3 className="font-semibold mb-2">
              {language === "ar" ? "حدث خطأ أثناء تحميل فئات التعليمات" : "Error loading instruction categories"}
            </h3>
            <p className="text-sm">{error.message}</p>
          </div>
          <Button variant="outline" size="sm" onClick={refetch}>
            {language === "ar" ? "إعادة المحاولة" : "Try Again"}
          </Button>
        </AlertDescription>
      </Alert>
    )
  }

  if (!Array.isArray(categories) || categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <h3 className="text-xl font-semibold mb-4">
          {language === "ar" ? "لا توجد فئات تعليمات متاحة" : "No instruction categories available"}
        </h3>
        <p className="text-gray-500 mb-4">
          {language === "ar" ? "يرجى التحقق مرة أخرى لاحقًا" : "Please check back later"}
        </p>
        <Button onClick={refetch}>{language === "ar" ? "إعادة المحاولة" : "Refresh"}</Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, index) => {
        // Create slug from category name
        const categorySlug = slugify(category.nameEn, category.id)

        // Choose icon based on category name
        const isGroup = category.nameEn.toLowerCase().includes("group") || category.name.includes("مجموعة")
        const icon = isGroup ? (
          <Shield className="h-10 w-10 text-primary" />
        ) : (
          <FileText className="h-10 w-10 text-primary" />
        )

        const title = language === "ar" ? category.name : category.nameEn
        const description =
          language === "ar"
            ? `تعليمات الأمن السيبراني ${category.name}`
            : `${category.nameEn} cybersecurity instructions`

        return (
          <Link key={category.id} href={`/instructions/category/${categorySlug}`} className="block">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-lg hover:border-primary/50 cursor-pointer group">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className="mb-4 p-4 rounded-full bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 dark:group-hover:bg-blue-800/30 transition-colors">
                    <div className="text-primary group-hover:scale-110 transition-transform duration-300">{icon}</div>
                  </div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{title}</h3>
                  <p className="text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        )
      })}
    </div>
  )
}
