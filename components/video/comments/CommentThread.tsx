"use client";

import { useState } from "react";
import type { VideoComment } from "@/core/domain/models/video-comment";
import { container } from "@/core/di/container";
import { CommentItem } from "./CommentItem";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, MessageSquare, Loader2 } from "lucide-react";

const MAX_VISUAL_DEPTH = 4;

interface CommentThreadProps {
      videoId: string;
      comment: VideoComment;
      currentClientId?: string;
      isAuthenticated: boolean;
      onAddReply: (content: string, parentId: string) => Promise<void>;
      onUpdate: (commentId: string, content: string) => Promise<void>;
      onDelete: (commentId: string) => Promise<void>;
      visualDepth?: number;
}

export function CommentThread({
      videoId,
      comment,
      currentClientId,
      isAuthenticated,
      onAddReply,
      onUpdate,
      onDelete,
      visualDepth = 0,
}: CommentThreadProps) {
      // State for on-demand reply loading
      const [replies, setReplies] = useState<VideoComment[]>(comment.replies || []);
      const [repliesLoaded, setRepliesLoaded] = useState(comment.replies?.length > 0);
      const [isLoadingReplies, setIsLoadingReplies] = useState(false);
      const [isExpanded, setIsExpanded] = useState(visualDepth < 5);
      const [currentPage, setCurrentPage] = useState(1);
      const [hasMoreReplies, setHasMoreReplies] = useState(false);

      const service = container.services.videoComments;

      // Cap visual indentation at MAX_VISUAL_DEPTH
      const currentVisualDepth = Math.min(visualDepth, MAX_VISUAL_DEPTH);
      const isFlattened = visualDepth > MAX_VISUAL_DEPTH;

      // Use replyCount from comment (not loaded replies)
      const replyCount = comment.replyCount || 0;
      const totalReplies = comment.totalReplies || 0;

      // Load replies on-demand
      const loadReplies = async (page: number = 1, append: boolean = false) => {
            setIsLoadingReplies(true);
            try {
                  const result = await service.getReplies(videoId, comment.id, page, 5);
                  if (append) {
                        setReplies(prev => [...prev, ...result.data]);
                  } else {
                        setReplies(result.data);
                  }
                  setHasMoreReplies(result.pagination.hasMore);
                  setCurrentPage(page);
                  setRepliesLoaded(true);
                  setIsExpanded(true);
            } catch (err) {
                  console.error("Failed to load replies:", err);
            } finally {
                  setIsLoadingReplies(false);
            }
      };

      const handleViewReplies = () => {
            if (!repliesLoaded) {
                  loadReplies(1, false);
            } else {
                  setIsExpanded(!isExpanded);
            }
      };

      const handleLoadMoreReplies = () => {
            loadReplies(currentPage + 1, true);
      };

      // Handle reply added - increment count and potentially add to loaded replies
      const handleReplyAdded = async (content: string, parentId: string) => {
            await onAddReply(content, parentId);
            // If replying to this comment and replies are loaded, reload them
            if (parentId === comment.id && repliesLoaded) {
                  loadReplies(1, false);
            }
      };

      return (
            <div
                  style={{
                        marginRight: `${currentVisualDepth * 24}px`,
                  }}
                  className="relative"
            >
                  {/* Threading line for nested replies */}
                  {visualDepth > 0 && (
                        <div className="absolute right-[-12px] top-0 h-full w-[2px] bg-border" />
                  )}

                  <CommentItem
                        comment={comment}
                        isOwner={currentClientId === comment.clientId}
                        isAuthenticated={isAuthenticated}
                        isFlattened={isFlattened}
                        onReply={(content) => handleReplyAdded(content, comment.id)}
                        onUpdate={(content) => onUpdate(comment.id, content)}
                        onDelete={() => onDelete(comment.id)}
                  />

                  {/* View replies button */}
                  {replyCount > 0 && (
                        <div className="mt-2">
                              <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleViewReplies}
                                    disabled={isLoadingReplies}
                                    className="text-xs text-muted-foreground hover:text-foreground gap-1 h-7 px-2"
                              >
                                    {isLoadingReplies ? (
                                          <>
                                                <Loader2 className="h-3 w-3 animate-spin" />
                                                جاري التحميل...
                                          </>
                                    ) : isExpanded && repliesLoaded ? (
                                          <>
                                                <ChevronUp className="h-3 w-3" />
                                                إخفاء الردود
                                          </>
                                    ) : (
                                          <>
                                                <MessageSquare className="h-3 w-3" />
                                                <ChevronDown className="h-3 w-3" />
                                                عرض {totalReplies > replyCount ? totalReplies : replyCount} {replyCount === 1 ? "رد" : "ردود"}
                                          </>
                                    )}
                              </Button>
                        </div>
                  )}

                  {/* Loaded replies */}
                  {isExpanded && repliesLoaded && replies.length > 0 && (
                        <div className="mt-3 space-y-3">
                              {replies.map((reply) => (
                                    <CommentThread
                                          key={reply.id}
                                          videoId={videoId}
                                          comment={reply}
                                          currentClientId={currentClientId}
                                          isAuthenticated={isAuthenticated}
                                          onAddReply={handleReplyAdded}
                                          onUpdate={onUpdate}
                                          onDelete={onDelete}
                                          visualDepth={visualDepth + 1}
                                    />
                              ))}

                              {/* Load more replies button */}
                              {hasMoreReplies && (
                                    <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={handleLoadMoreReplies}
                                          disabled={isLoadingReplies}
                                          className="text-xs text-muted-foreground hover:text-foreground gap-1 h-7"
                                    >
                                          {isLoadingReplies ? (
                                                <>
                                                      <Loader2 className="h-3 w-3 animate-spin" />
                                                      جاري التحميل...
                                                </>
                                          ) : (
                                                <>
                                                      <ChevronDown className="h-3 w-3" />
                                                      عرض المزيد من الردود
                                                </>
                                          )}
                                    </Button>
                              )}
                        </div>
                  )}
            </div>
      );
}
