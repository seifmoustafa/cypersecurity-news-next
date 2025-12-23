"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  Eye, 
  Share2, 
  Bookmark,
  User,
  Tag,
  ChevronRight,
  Facebook,
  Twitter,
  Linkedin,
  Copy,
  Check,
  Heart,
  MessageCircle,
  TrendingUp,
  Globe,
  Shield,
  AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/components/language-provider";
import { useLatestNews } from "@/core/hooks/use-news";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface ModernNewsDetailClientProps {
  slug: string;
}

export default function ModernNewsDetailClient({ slug }: ModernNewsDetailClientProps) {
  const { language, t, isRtl } = useLanguage();
  const router = useRouter();
  const { news, loading } = useLatestNews(20);
  const [currentNews, setCurrentNews] = useState<any>(null);
  const [relatedNews, setRelatedNews] = useState<any[]>([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [copied, setCopied] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    // Find the current news item by ID
    const foundNews = news.find(item => item.id === slug);
    if (foundNews) {
      setCurrentNews(foundNews);
      setLikes(foundNews.likes || Math.floor(Math.random() * 100));
      
      // Find related news (same category or random)
      const related = news
        .filter(item => item.id !== foundNews.id)
        .slice(0, 3);
      setRelatedNews(related);
    }
  }, [news, slug]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getTimeAgo = (date: string) => {
    const now = new Date();
    const newsDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - newsDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return language === "ar" ? "الآن" : "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const title = currentNews?.title || "";
    
    switch (platform) {
      case "facebook":
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, "_blank");
        break;
      case "twitter":
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, "_blank");
        break;
      case "linkedin":
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, "_blank");
        break;
      case "copy":
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
    setShareOpen(false);
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  if (loading || !currentNews) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-slate-900">
        <div className="container mx-auto px-4 py-20 max-w-full 2xl:max-w-[1600px]">
          <div className="space-y-8">
            {/* Loading Header */}
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded-lg w-1/4"></div>
              <div className="h-4 bg-muted animate-pulse rounded-lg w-1/2"></div>
            </div>
            
            {/* Loading Content */}
            <div className="space-y-6">
              <div className="h-96 bg-muted animate-pulse rounded-xl"></div>
              <div className="space-y-4">
                <div className="h-6 bg-muted animate-pulse rounded-lg"></div>
                <div className="h-6 bg-muted animate-pulse rounded-lg w-3/4"></div>
                <div className="h-6 bg-muted animate-pulse rounded-lg w-1/2"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 dark:from-slate-900 dark:via-blue-900/20 dark:to-slate-900">
      <div className="container mx-auto px-4 py-20 max-w-full 2xl:max-w-[1600px]">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="glass border-white/20 dark:border-white/10 hover:shadow-modern transition-all duration-300"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {language === "ar" ? "العودة" : "Back"}
          </Button>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-8">
            {/* Article Header */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Category and Actions */}
              <div className="flex items-center justify-between">
                <Badge variant="default" className="glass">
                  {currentNews.category || "News"}
                </Badge>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleBookmark}
                    className={`glass border-white/20 dark:border-white/10 transition-all duration-300 ${
                      isBookmarked ? "text-yellow-500" : "text-muted-foreground"
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? "fill-current" : ""}`} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShareOpen(!shareOpen)}
                    className="glass border-white/20 dark:border-white/10 hover:shadow-modern transition-all duration-300"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                {currentNews.title}
              </h1>

              {/* Meta Information */}
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{currentNews.author || "Admin"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(currentNews.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{getTimeAgo(currentNews.date)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{currentNews.views || 0} views</span>
                </div>
              </div>

              {/* Featured Image */}
              <div className="relative h-96 lg:h-[500px] rounded-2xl overflow-hidden glass border border-white/20 dark:border-white/10">
                <Image
                  src={currentNews.imageUrl || "/placeholder.svg"}
                  alt={currentNews.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Article Content */}
              <div className="prose prose-lg max-w-none">
                <div className="space-y-6 text-foreground leading-relaxed">
                  <p className="text-xl text-muted-foreground font-medium">
                    {currentNews.summary}
                  </p>
                  
                  {/* Simulated article content */}
                  <div className="space-y-4">
                    <p>
                      {language === "ar" 
                        ? "في عالم يتطور فيه التهديدات السيبرانية بسرعة، أصبح من الضروري أن تبقى المنظمات والحكومات في حالة تأهب مستمر. هذا المقال يسلط الضوء على أحدث التطورات في مجال الأمن السيبراني والاستراتيجيات المتبعة لحماية البنية التحتية الرقمية."
                        : "In a world where cyber threats evolve rapidly, it has become essential for organizations and governments to remain in a state of constant vigilance. This article highlights the latest developments in cybersecurity and the strategies adopted to protect digital infrastructure."
                      }
                    </p>
                    
                    <p>
                      {language === "ar"
                        ? "تشير الإحصائيات الحديثة إلى زيادة ملحوظة في عدد الهجمات السيبرانية الموجهة ضد المؤسسات الحكومية والخاصة. هذه الهجمات تتراوح من محاولات الاختراق البسيطة إلى الهجمات المعقدة التي تستهدف البنية التحتية الحيوية."
                        : "Recent statistics indicate a noticeable increase in the number of cyber attacks targeting government and private institutions. These attacks range from simple intrusion attempts to complex attacks targeting critical infrastructure."
                      }
                    </p>

                    <div className="glass border border-white/20 dark:border-white/10 rounded-xl p-6 my-8">
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                          <Shield className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-2">
                            {language === "ar" ? "نصيحة أمنية مهمة" : "Important Security Tip"}
                          </h3>
                          <p className="text-muted-foreground">
                            {language === "ar"
                              ? "تأكد من تحديث جميع أنظمتك وبرامجك بانتظام، واستخدم كلمات مرور قوية ومختلفة لكل حساب."
                              : "Make sure to regularly update all your systems and software, and use strong and different passwords for each account."
                            }
                          </p>
                        </div>
                      </div>
                    </div>

                    <p>
                      {language === "ar"
                        ? "لذلك، يجب على جميع المؤسسات أن تتبنى نهجاً شاملاً للأمن السيبراني يشمل التدريب المستمر للموظفين، وتطبيق أفضل الممارسات الأمنية، والاستثمار في التقنيات المتقدمة للحماية."
                        : "Therefore, all institutions must adopt a comprehensive approach to cybersecurity that includes continuous employee training, implementation of security best practices, and investment in advanced protection technologies."
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Article Actions */}
              <div className="flex items-center justify-between pt-8 border-t border-white/20 dark:border-white/10">
                <div className="flex items-center gap-4">
                  <Button
                    variant="outline"
                    onClick={handleLike}
                    className={`glass border-white/20 dark:border-white/10 transition-all duration-300 ${
                      isLiked ? "text-red-500 border-red-500/50" : ""
                    }`}
                  >
                    <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                    {likes}
                  </Button>
                  <Button
                    variant="outline"
                    className="glass border-white/20 dark:border-white/10 hover:shadow-modern transition-all duration-300"
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    {language === "ar" ? "تعليق" : "Comment"}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {language === "ar" ? "شارك هذا المقال:" : "Share this article:"}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare("facebook")}
                      className="glass border-white/20 dark:border-white/10 hover:bg-blue-500 hover:text-white transition-all duration-300"
                    >
                      <Facebook className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare("twitter")}
                      className="glass border-white/20 dark:border-white/10 hover:bg-blue-400 hover:text-white transition-all duration-300"
                    >
                      <Twitter className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare("linkedin")}
                      className="glass border-white/20 dark:border-white/10 hover:bg-blue-600 hover:text-white transition-all duration-300"
                    >
                      <Linkedin className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleShare("copy")}
                      className="glass border-white/20 dark:border-white/10 hover:bg-green-500 hover:text-white transition-all duration-300"
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.article>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Related News */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card className="glass border-white/20 dark:border-white/10">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    {language === "ar" ? "مقالات ذات صلة" : "Related Articles"}
                  </h3>
                  <div className="space-y-4">
                    {relatedNews.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <Link
                          href={`/advanced/news/${item.id}`}
                          className="group block"
                        >
                          <div className="flex gap-3">
                            <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.imageUrl || "/placeholder.svg"}
                                alt={item.title}
                                width={64}
                                height={64}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-300">
                                {item.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {getTimeAgo(item.date)}
                              </div>
                            </div>
                          </div>
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Security Alert */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <Card className="glass border-red-200/50 dark:border-red-800/50 bg-red-50/20 dark:bg-red-900/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-500 rounded-lg">
                      <AlertTriangle className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {language === "ar" ? "تنبيه أمني" : "Security Alert"}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {language === "ar"
                          ? "احرص على التحقق من مصادر الأخبار والتأكد من صحتها قبل مشاركتها."
                          : "Make sure to verify news sources and ensure their accuracy before sharing."
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}