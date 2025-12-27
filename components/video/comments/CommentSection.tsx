"use client";

import { useState, useEffect, useCallback } from "react";
import { useClientAuth } from "@/contexts/client-auth-context";
import { container } from "@/core/di/container";
import type { VideoComment, PaginationMetadata } from "@/core/domain/models/video-comment";

import { MessageSquare, LogIn, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommentForm } from "./CommentForm";
import { CommentThread } from "./CommentThread";

interface CommentSectionProps {
      videoId: string;
}

export function CommentSection({ videoId }: CommentSectionProps) {
      const [comments, setComments] = useState<VideoComment[]>([]);
      const [pagination, setPagination] = useState<PaginationMetadata | null>(null);
      const [isLoading, setIsLoading] = useState(true);
      const [isLoadingMore, setIsLoadingMore] = useState(false);
      const [error, setError] = useState<string | null>(null);
      const { isAuthenticated, client } = useClientAuth();

      const service = container.services.videoComments;

      const loadComments = useCallback(async (page: number = 1, append: boolean = false) => {
            try {
                  if (page === 1) {
                        setIsLoading(true);
                  } else {
                        setIsLoadingMore(true);
                  }
                  setError(null);

                  const result = await service.getCommentsForVideo(videoId, page, 10);

                  if (append) {
                        setComments(prev => [...prev, ...result.data]);
                  } else {
                        setComments(result.data);
                  }
                  setPagination(result.pagination);
            } catch (err) {
                  console.error("Failed to load comments:", err);
                  setError("Failed to load comments");
            } finally {
                  setIsLoading(false);
                  setIsLoadingMore(false);
            }
      }, [videoId, service]);

      useEffect(() => {
            loadComments(1, false);
      }, [loadComments]);

      const handleLoadMore = () => {
            if (pagination && pagination.hasMore) {
                  loadComments(pagination.currentPage + 1, true);
            }
      };

      const handleAddComment = async (content: string, parentId?: string) => {
            try {
                  const newComment = await service.addComment(videoId, content, parentId);

                  if (parentId) {
                        // For replies, update the parent's replyCount locally
                        // The actual reply will be shown when user clicks "View replies"
                        setComments(prev => prev.map(c =>
                              c.id === parentId
                                    ? { ...c, replyCount: c.replyCount + 1, totalReplies: c.totalReplies + 1 }
                                    : c
                        ));
                  } else {
                        // For root comments, add to the beginning
                        setComments(prev => [newComment, ...prev]);
                        if (pagination) {
                              setPagination({
                                    ...pagination,
                                    itemsCount: pagination.itemsCount + 1
                              });
                        }
                  }
            } catch (err) {
                  console.error("Failed to add comment:", err);
                  throw err;
            }
      };

      const handleUpdateComment = async (commentId: string, content: string) => {
            try {
                  const updated = await service.updateComment(commentId, content);
                  setComments(prev => prev.map(c => c.id === commentId ? updated : c));
            } catch (err) {
                  console.error("Failed to update comment:", err);
                  throw err;
            }
      };

      const handleDeleteComment = async (commentId: string) => {
            try {
                  await service.deleteComment(commentId);
                  setComments(prev => prev.filter(c => c.id !== commentId));
                  if (pagination) {
                        setPagination({
                              ...pagination,
                              itemsCount: pagination.itemsCount - 1
                        });
                  }
            } catch (err) {
                  console.error("Failed to delete comment:", err);
                  throw err;
            }
      };

      // Total comments from pagination
      const totalComments = pagination?.itemsCount || 0;

      if (isLoading) {
            return (
                  <div className="space-y-4 p-4">
                        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
                        <div className="h-24 animate-pulse rounded bg-muted" />
                        <div className="h-24 animate-pulse rounded bg-muted" />
                  </div>
            );
      }

      return (
            <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center gap-2">
                        <MessageSquare className="h-5 w-5" />
                        <h3 className="text-lg font-semibold">
                              {totalComments} {totalComments === 1 ? "تعليق" : "تعليقات"}
                        </h3>
                  </div>

                  {/* Add comment form or login prompt */}
                  {isAuthenticated ? (
                        <CommentForm
                              onSubmit={(content) => handleAddComment(content)}
                              placeholder="اكتب تعليقك..."
                              submitLabel="إضافة تعليق"
                              clientName={client?.firstName || ""}
                              clientAvatar={client?.avatar}
                        />
                  ) : (
                        <div className="flex items-center justify-center gap-4 rounded-lg border border-dashed p-6 text-muted-foreground">
                              <LogIn className="h-5 w-5" />
                              <span>يجب تسجيل الدخول لإضافة تعليق</span>
                              <Button size="sm" onClick={() => {
                                    const returnUrl = encodeURIComponent(window.location.pathname + window.location.search);
                                    window.location.href = `/login?returnUrl=${returnUrl}`;
                              }}>
                                    تسجيل الدخول
                              </Button>
                        </div>
                  )}

                  {/* Error state */}
                  {error && (
                        <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
                              {error}
                        </div>
                  )}

                  {/* Comments list */}
                  {comments.length === 0 ? (
                        <div className="py-8 text-center text-muted-foreground">
                              لا توجد تعليقات بعد. كن أول من يعلق!
                        </div>
                  ) : (
                        <div className="space-y-4">
                              {comments.map((comment) => (
                                    <CommentThread
                                          key={comment.id}
                                          videoId={videoId}
                                          comment={comment}
                                          currentClientId={client?.id}
                                          isAuthenticated={isAuthenticated}
                                          onAddReply={handleAddComment}
                                          onUpdate={handleUpdateComment}
                                          onDelete={handleDeleteComment}
                                    />
                              ))}

                              {/* Load more comments button */}
                              {pagination?.hasMore && (
                                    <div className="flex justify-center pt-4">
                                          <Button
                                                variant="outline"
                                                onClick={handleLoadMore}
                                                disabled={isLoadingMore}
                                                className="gap-2"
                                          >
                                                {isLoadingMore ? (
                                                      <>
                                                            <Loader2 className="h-4 w-4 animate-spin" />
                                                            جاري التحميل...
                                                      </>
                                                ) : (
                                                      <>
                                                            <MessageSquare className="h-4 w-4" />
                                                            عرض المزيد من التعليقات ({pagination.itemsCount - comments.length} متبقي)
                                                      </>
                                                )}
                                          </Button>
                                    </div>
                              )}
                        </div>
                  )}
            </div>
      );
}

