"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Video, 
  BookOpen, 
  ShieldCheck,
  Clock, 
  Eye, 
  Star,
  ArrowRight,
  ArrowLeft,
  X,
  Tag,
  Calendar,
  User,
  FileText,
  Play,
  Download
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BeginnersSearchPage() {
  const { language, t } = useLanguage()
  const isRtl = language === "ar"
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [isSearching, setIsSearching] = useState(false)

  const categories = [
    { id: "all", title: language === "ar" ? "الكل" : "All" },
    { id: "videos", title: language === "ar" ? "الفيديوهات" : "Videos" },
    { id: "articles", title: language === "ar" ? "المقالات" : "Articles" },
    { id: "definitions", title: language === "ar" ? "التعريفات" : "Definitions" },
    { id: "tools", title: language === "ar" ? "الأدوات" : "Tools" }
  ]

  const contentTypes = [
    { id: "all", title: language === "ar" ? "الكل" : "All" },
    { id: "beginner", title: language === "ar" ? "مبتدئ" : "Beginner" },
    { id: "intermediate", title: language === "ar" ? "متوسط" : "Intermediate" },
    { id: "advanced", title: language === "ar" ? "متقدم" : "Advanced" }
  ]

  // Mock search results
  const mockResults = [
    {
      id: 1,
      type: "video",
      title: language === "ar" ? "مقدمة في الأمن السيبراني" : "Introduction to Cybersecurity",
      description: language === "ar" ? "تعلم أساسيات الأمن السيبراني وأهميته" : "Learn cybersecurity fundamentals and its importance",
      category: "videos",
      level: "beginner",
      duration: "15:30",
      views: "2.5K",
      rating: 4.8,
      thumbnail: "/placeholder.jpg",
      instructor: language === "ar" ? "أحمد محمد" : "Ahmed Mohammed",
      date: "2024-01-15"
    },
    {
      id: 2,
      type: "article",
      title: language === "ar" ? "كيفية إنشاء كلمة مرور قوية" : "How to Create Strong Passwords",
      description: language === "ar" ? "دليل شامل لإنشاء كلمات مرور آمنة" : "Comprehensive guide to creating secure passwords",
      category: "articles",
      level: "beginner",
      readTime: "5 min",
      views: "1.8K",
      rating: 4.9,
      thumbnail: "/placeholder.jpg",
      author: language === "ar" ? "فاطمة أحمد" : "Fatima Ahmed",
      date: "2024-01-12"
    },
    {
      id: 3,
      type: "definition",
      title: language === "ar" ? "التصيد الاحتيالي" : "Phishing",
      description: language === "ar" ? "تعريف التصيد الاحتيالي وطرق الوقاية منه" : "Definition of phishing and prevention methods",
      category: "definitions",
      level: "beginner",
      views: "3.2K",
      rating: 4.7,
      thumbnail: "/placeholder.jpg",
      author: language === "ar" ? "محمد علي" : "Mohammed Ali",
      date: "2024-01-10"
    },
    {
      id: 4,
      type: "tool",
      title: language === "ar" ? "مولد كلمات المرور" : "Password Generator",
      description: language === "ar" ? "أداة لإنشاء كلمات مرور قوية وآمنة" : "Tool for generating strong and secure passwords",
      category: "tools",
      level: "beginner",
      views: "2.1K",
      rating: 4.6,
      thumbnail: "/placeholder.jpg",
      author: language === "ar" ? "سارة حسن" : "Sara Hassan",
      date: "2024-01-08"
    }
  ]

  const handleSearch = () => {
    if (!searchQuery.trim()) return
    
    setIsSearching(true)
    // Simulate search delay
    setTimeout(() => {
      setSearchResults(mockResults.filter(item => 
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      ))
      setIsSearching(false)
    }, 1000)
  }

  const clearSearch = () => {
    setSearchQuery("")
    setSearchResults([])
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video
      case "article": return FileText
      case "definition": return BookOpen
      case "tool": return ShieldCheck
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "video": return "from-red-500 to-pink-600"
      case "article": return "from-blue-500 to-cyan-600"
      case "definition": return "from-green-500 to-emerald-600"
      case "tool": return "from-purple-500 to-indigo-600"
      default: return "from-gray-500 to-slate-600"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-slate-100 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900">
      {/* Cybersecurity Pattern Background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(34,197,94,0.1)_50%,transparent_75%)] bg-[length:20px_20px]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(147,51,234,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_25%,rgba(34,197,94,0.05)_50%,transparent_75%)] bg-[length:40px_40px]"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 bg-gradient-to-r from-slate-900 via-gray-900 to-slate-800 dark:from-slate-950 dark:via-gray-950 dark:to-slate-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="inline-flex items-center justify-center mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl blur-lg opacity-30"></div>
                <div className="relative bg-gradient-to-r from-green-500 to-blue-500 p-4 rounded-xl">
                  <Search className="h-8 w-8 text-white" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              {language === "ar" ? "البحث المتقدم" : "Advanced Search"}
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              {language === "ar" 
                ? "ابحث في جميع محتويات الأمن السيبراني بسهولة وسرعة"
                : "Search through all cybersecurity content easily and quickly"
              }
            </p>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Search Section */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder={language === "ar" ? "ابحث في المحتوى..." : "Search content..."}
                className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
            <Button 
              onClick={handleSearch}
              disabled={!searchQuery.trim() || isSearching}
              className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white px-8 py-3"
            >
              {isSearching ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {language === "ar" ? "جاري البحث..." : "Searching..."}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  {language === "ar" ? "بحث" : "Search"}
                </div>
              )}
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border border-slate-200 dark:border-slate-700 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {language === "ar" ? "التصنيف" : "Category"}
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className={selectedCategory === category.id ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                  >
                    {category.title}
                  </Button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                {language === "ar" ? "المستوى" : "Level"}
              </label>
              <div className="flex flex-wrap gap-2">
                {contentTypes.map((type) => (
                  <Button
                    key={type.id}
                    variant={selectedType === type.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedType(type.id)}
                    className={selectedType === type.id ? "bg-green-500 hover:bg-green-600 text-white" : ""}
                  >
                    {type.title}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {language === "ar" ? "نتائج البحث" : "Search Results"}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  {language === "ar" ? "شبكة" : "Grid"}
                </Button>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <List className="h-4 w-4" />
                  {language === "ar" ? "قائمة" : "List"}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((result) => {
                const IconComponent = getTypeIcon(result.type)
                const colorClass = getTypeColor(result.type)
                
                return (
                  <div key={result.id} className="group bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden hover:shadow-2xl hover:shadow-green-500/10 transition-all duration-500 hover:scale-105">
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className={`bg-gradient-to-r ${colorClass} p-4 rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      {result.duration && (
                        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {result.duration}
                        </div>
                      )}
                      {result.readTime && (
                        <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {result.readTime}
                        </div>
                      )}
                      <div className="absolute bottom-3 left-3 bg-black/50 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {result.views}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`bg-gradient-to-r ${colorClass} text-white text-xs px-2 py-1 rounded-full`}>
                          {result.type}
                        </span>
                        <span className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs px-2 py-1 rounded-full">
                          {result.level}
                        </span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-300 line-clamp-2">
                        {result.title}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {result.description}
                      </p>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-gray-600 dark:text-gray-300">
                            {result.rating}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
                          <Calendar className="h-4 w-4" />
                          {result.date}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white group/btn">
                          <span className="mr-2 rtl:mr-0 rtl:ml-2">
                            {language === "ar" ? "عرض" : "View"}
                          </span>
                          {isRtl ? (
                            <ArrowLeft className="h-4 w-4 group-hover/btn:-translate-x-1 transition-transform duration-300" />
                          ) : (
                            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm" className="px-3">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* No Results */}
        {searchQuery && searchResults.length === 0 && !isSearching && (
          <div className="text-center py-12">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
              <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {language === "ar" ? "لا توجد نتائج" : "No Results Found"}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {language === "ar" 
                  ? "لم نتمكن من العثور على أي محتوى يطابق بحثك"
                  : "We couldn't find any content matching your search"
                }
              </p>
              <Button 
                onClick={clearSearch}
                variant="outline"
                className="flex items-center gap-2 mx-auto"
              >
                <X className="h-4 w-4" />
                {language === "ar" ? "مسح البحث" : "Clear Search"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
