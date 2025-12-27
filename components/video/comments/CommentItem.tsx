"use client";

import { useState } from "react";
import type { VideoComment } from "@/core/domain/models/video-comment";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Reply, MoreVertical, Pencil, Trash2, AtSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { CommentForm } from "./CommentForm";

interface CommentItemProps {
      comment: VideoComment;
      isOwner: boolean;
      isAuthenticated: boolean;
      isFlattened: boolean;
      onReply: (content: string) => Promise<void>;
      onUpdate: (content: string) => Promise<void>;
      onDelete: () => Promise<void>;
}

export function CommentItem({
      comment,
      isOwner,
      isAuthenticated,
      isFlattened,
      onReply,
      onUpdate,
      onDelete,
}: CommentItemProps) {
      const [isReplying, setIsReplying] = useState(false);
      const [isEditing, setIsEditing] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);
      const [isLoading, setIsLoading] = useState(false);

      const handleReply = async (content: string) => {
            setIsLoading(true);
            try {
                  await onReply(content);
                  setIsReplying(false);
            } finally {
                  setIsLoading(false);
            }
      };

      const handleUpdate = async (content: string) => {
            setIsLoading(true);
            try {
                  await onUpdate(content);
                  setIsEditing(false);
            } finally {
                  setIsLoading(false);
            }
      };

      const handleDelete = async () => {
            setIsLoading(true);
            try {
                  await onDelete();
            } finally {
                  setIsLoading(false);
                  setIsDeleting(false);
            }
      };

      const timeAgo = formatDistanceToNow(new Date(comment.createdTimestamp), {
            addSuffix: true,
            locale: ar,
      });

      const getInitials = (name: string) => {
            return name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2);
      };

      if (isEditing) {
            return (
                  <div className="rounded-lg border bg-card p-4">
                        <CommentForm
                              onSubmit={handleUpdate}
                              onCancel={() => setIsEditing(false)}
                              initialContent={comment.content}
                              placeholder="تعديل التعليق..."
                              submitLabel="حفظ التعديل"
                              isLoading={isLoading}
                        />
                  </div>
            );
      }

      return (
            <>
                  <div className="rounded-lg border bg-card p-4 transition-colors hover:bg-accent/5">
                        {/* Flattened reply indicator */}
                        {isFlattened && comment.replyingToUsername && (
                              <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                                    <AtSign className="h-3 w-3" />
                                    <span>رداً على {comment.replyingToUsername}</span>
                              </div>
                        )}

                        {/* Header */}
                        <div className="mb-2 flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                          <AvatarImage src={comment.authorAvatar || undefined} />
                                          <AvatarFallback className="text-xs">
                                                {getInitials(comment.authorName)}
                                          </AvatarFallback>
                                    </Avatar>
                                    <div>
                                          <div className="flex items-center gap-2">
                                                <span className="font-medium">{comment.authorName}</span>
                                                {comment.authorRank && (
                                                      <span className="rounded bg-primary/10 px-1.5 py-0.5 text-xs text-primary">
                                                            {comment.authorRank}
                                                      </span>
                                                )}
                                          </div>
                                          <span className="text-xs text-muted-foreground">
                                                {timeAgo}
                                                {comment.updatedTimestamp && " (تم التعديل)"}
                                          </span>
                                    </div>
                              </div>

                              {/* Owner actions menu */}
                              {isOwner && (
                                    <DropdownMenu>
                                          <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-8 w-8">
                                                      <MoreVertical className="h-4 w-4" />
                                                </Button>
                                          </DropdownMenuTrigger>
                                          <DropdownMenuContent align="end">
                                                <DropdownMenuItem onClick={() => setIsEditing(true)}>
                                                      <Pencil className="ml-2 h-4 w-4" />
                                                      تعديل
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                      onClick={() => setIsDeleting(true)}
                                                      className="text-destructive"
                                                >
                                                      <Trash2 className="ml-2 h-4 w-4" />
                                                      حذف
                                                </DropdownMenuItem>
                                          </DropdownMenuContent>
                                    </DropdownMenu>
                              )}
                        </div>

                        {/* Content */}
                        <p className="mb-3 whitespace-pre-wrap text-sm">{comment.content}</p>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                              {isAuthenticated && (
                                    <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-7 text-xs"
                                          onClick={() => setIsReplying(!isReplying)}
                                    >
                                          <Reply className="ml-1 h-3 w-3" />
                                          رد
                                    </Button>
                              )}
                        </div>

                        {/* Reply form */}
                        {isReplying && (
                              <div className="mt-3 border-t pt-3">
                                    <CommentForm
                                          onSubmit={handleReply}
                                          onCancel={() => setIsReplying(false)}
                                          placeholder={`رد على ${comment.authorName}...`}
                                          submitLabel="إرسال الرد"
                                          isLoading={isLoading}
                                          autoFocus
                                    />
                              </div>
                        )}
                  </div>

                  {/* Delete confirmation dialog */}
                  <AlertDialog open={isDeleting} onOpenChange={setIsDeleting}>
                        <AlertDialogContent>
                              <AlertDialogHeader>
                                    <AlertDialogTitle>حذف التعليق</AlertDialogTitle>
                                    <AlertDialogDescription>
                                          هل أنت متأكد أنك تريد حذف هذا التعليق؟ لا يمكن التراجع عن هذا الإجراء.
                                    </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="gap-2">
                                    <AlertDialogCancel disabled={isLoading}>إلغاء</AlertDialogCancel>
                                    <AlertDialogAction
                                          onClick={handleDelete}
                                          disabled={isLoading}
                                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                          {isLoading ? "جاري الحذف..." : "حذف"}
                                    </AlertDialogAction>
                              </AlertDialogFooter>
                        </AlertDialogContent>
                  </AlertDialog>
            </>
      );
}
