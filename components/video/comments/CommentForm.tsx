"use client";

import { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Send, X, Smile } from "lucide-react";

// Common emojis organized by category
const EMOJI_CATEGORIES = [
      {
            name: "😊 المشاعر",
            emojis: ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "😉", "😌", "😍", "🥰", "😘", "😗", "😚", "😋", "😛", "😜", "🤪", "😝", "🤗", "🤭", "🤫", "🤔", "🤐", "🤨", "😐", "😑", "😶", "😏", "😒", "🙄", "😬", "😮‍💨", "🤥"]
      },
      {
            name: "👍 الإيماءات",
            emojis: ["👍", "👎", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💪", "🦾", "🖐️", "✋", "🤚", "👋", "🤙", "👆", "👇", "👈", "👉", "✌️", "🤞", "🤟", "🤘", "🤙", "👌", "🤌", "🤏", "👍", "👎"]
      },
      {
            name: "❤️ القلوب",
            emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❤️‍🔥", "❤️‍🩹", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "❣️", "💌"]
      },
      {
            name: "🎉 احتفال",
            emojis: ["🎉", "🎊", "🎈", "🎁", "🏆", "🥇", "🥈", "🥉", "🏅", "🎖️", "🌟", "⭐", "✨", "💫", "🔥", "💥", "💯", "✅", "❌", "⚡", "🚀", "💡", "🔔", "📢"]
      },
      {
            name: "🔒 أمن سيبراني",
            emojis: ["🔒", "🔓", "🔐", "🔑", "🗝️", "🛡️", "⚔️", "💻", "🖥️", "📱", "⌨️", "🖱️", "💾", "📀", "💿", "🔌", "🌐", "📡", "🛰️", "⚠️", "🚨", "🔍", "📊", "📈"]
      }
];

interface CommentFormProps {
      onSubmit: (content: string) => Promise<void>;
      onCancel?: () => void;
      initialContent?: string;
      placeholder?: string;
      submitLabel?: string;
      clientName?: string;
      clientAvatar?: string | null;
      isLoading?: boolean;
      autoFocus?: boolean;
}

export function CommentForm({
      onSubmit,
      onCancel,
      initialContent = "",
      placeholder = "اكتب تعليقك...",
      submitLabel = "إرسال",
      clientName,
      clientAvatar,
      isLoading = false,
      autoFocus = false,
}: CommentFormProps) {
      const [content, setContent] = useState(initialContent);
      const [isSubmitting, setIsSubmitting] = useState(false);
      const [showEmojiPicker, setShowEmojiPicker] = useState(false);
      const textareaRef = useRef<HTMLTextAreaElement>(null);

      useEffect(() => {
            if (autoFocus && textareaRef.current) {
                  textareaRef.current.focus();
            }
      }, [autoFocus]);

      const handleSubmit = async () => {
            if (!content.trim() || isSubmitting || isLoading) return;

            setIsSubmitting(true);
            try {
                  await onSubmit(content.trim());
                  setContent("");
            } catch (err) {
                  console.error("Failed to submit comment:", err);
            } finally {
                  setIsSubmitting(false);
            }
      };

      const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === "Enter" && e.ctrlKey) {
                  e.preventDefault();
                  handleSubmit();
            }
      };

      const insertEmoji = (emoji: string) => {
            const textarea = textareaRef.current;
            if (textarea) {
                  const start = textarea.selectionStart;
                  const end = textarea.selectionEnd;
                  const newContent = content.substring(0, start) + emoji + content.substring(end);
                  setContent(newContent);

                  // Set cursor position after emoji
                  setTimeout(() => {
                        textarea.focus();
                        textarea.setSelectionRange(start + emoji.length, start + emoji.length);
                  }, 0);
            } else {
                  setContent(content + emoji);
            }
      };

      const getInitials = (name: string) => {
            return name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
      };

      const loading = isSubmitting || isLoading;

      return (
            <div className="flex gap-3">
                  {clientName && (
                        <Avatar className="h-8 w-8 shrink-0">
                              <AvatarImage src={clientAvatar || undefined} />
                              <AvatarFallback className="text-xs">
                                    {getInitials(clientName)}
                              </AvatarFallback>
                        </Avatar>
                  )}

                  <div className="flex-1 space-y-2">
                        <div className="relative">
                              <Textarea
                                    ref={textareaRef}
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={placeholder}
                                    className="min-h-[80px] resize-none pr-10"
                                    disabled={loading}
                              />

                              {/* Emoji Picker Button */}
                              <Popover open={showEmojiPicker} onOpenChange={setShowEmojiPicker}>
                                    <PopoverTrigger asChild>
                                          <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute left-2 top-2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                                                disabled={loading}
                                          >
                                                <Smile className="h-5 w-5" />
                                          </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                          className="w-80 p-2"
                                          side="top"
                                          align="start"
                                    >
                                          <div className="space-y-3 max-h-64 overflow-y-auto">
                                                {EMOJI_CATEGORIES.map((category) => (
                                                      <div key={category.name}>
                                                            <p className="text-xs font-medium text-muted-foreground mb-1">
                                                                  {category.name}
                                                            </p>
                                                            <div className="flex flex-wrap gap-1">
                                                                  {category.emojis.map((emoji, i) => (
                                                                        <button
                                                                              key={`${emoji}-${i}`}
                                                                              type="button"
                                                                              onClick={() => {
                                                                                    insertEmoji(emoji);
                                                                                    setShowEmojiPicker(false);
                                                                              }}
                                                                              className="w-8 h-8 flex items-center justify-center text-lg hover:bg-muted rounded transition-colors"
                                                                        >
                                                                              {emoji}
                                                                        </button>
                                                                  ))}
                                                            </div>
                                                      </div>
                                                ))}
                                          </div>
                                    </PopoverContent>
                              </Popover>
                        </div>

                        <div className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">
                                    Ctrl+Enter للإرسال
                              </span>

                              <div className="flex gap-2">
                                    {onCancel && (
                                          <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={onCancel}
                                                disabled={loading}
                                          >
                                                <X className="ml-1 h-4 w-4" />
                                                إلغاء
                                          </Button>
                                    )}
                                    <Button
                                          type="button"
                                          size="sm"
                                          onClick={handleSubmit}
                                          disabled={!content.trim() || loading}
                                    >
                                          {loading ? (
                                                "جاري الإرسال..."
                                          ) : (
                                                <>
                                                      <Send className="ml-1 h-4 w-4" />
                                                      {submitLabel}
                                                </>
                                          )}
                                    </Button>
                              </div>
                        </div>
                  </div>
            </div>
      );
}

