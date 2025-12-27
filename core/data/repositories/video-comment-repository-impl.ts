// Video Comment Repository Implementation (Facebook-like pagination)

import type { VideoCommentRepository } from "../../domain/repositories/video-comment-repository";
import type {
      VideoComment,
      CreateVideoCommentRequest,
      UpdateVideoCommentRequest,
      PaginatedCommentsResponse,
} from "../../domain/models/video-comment";

const ACCESS_TOKEN_KEY = "client_access_token";

export class VideoCommentRepositoryImpl implements VideoCommentRepository {
      private baseUrl: string;
      private baseImageUrl: string;

      constructor() {
            this.baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";
            this.baseImageUrl = this.baseUrl.replace("/api", "");
      }

      private getAccessToken(): string | null {
            if (typeof window === "undefined") return null;
            return localStorage.getItem(ACCESS_TOKEN_KEY);
      }

      private async authenticatedFetch<T>(
            endpoint: string,
            options: RequestInit = {}
      ): Promise<T> {
            const token = this.getAccessToken();
            const headers: Record<string, string> = {
                  ...(options.headers as Record<string, string>),
            };

            if (token) {
                  headers["Authorization"] = `Bearer ${token}`;
            }

            if (!options.body || !(options.body instanceof FormData)) {
                  headers["Content-Type"] = "application/json";
            }

            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                  ...options,
                  headers,
            });

            if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            if (response.status === 204) {
                  return {} as T;
            }

            return response.json();
      }

      private transformComment(comment: VideoComment): VideoComment {
            return {
                  ...comment,
                  authorAvatar: comment.authorAvatar
                        ? `${this.baseImageUrl}${comment.authorAvatar}`
                        : null,
                  replies: comment.replies?.map((reply) => this.transformComment(reply)) || [],
            };
      }

      private transformPaginatedResponse(response: PaginatedCommentsResponse): PaginatedCommentsResponse {
            return {
                  data: response.data.map((c) => this.transformComment(c)),
                  pagination: response.pagination,
            };
      }

      async getByVideoId(
            videoId: string,
            page: number = 1,
            pageSize: number = 10
      ): Promise<PaginatedCommentsResponse> {
            const response = await fetch(
                  `${this.baseUrl}/Videos/${videoId}/Comments?page=${page}&pageSize=${pageSize}`
            );

            if (!response.ok) {
                  throw new Error(`Failed to fetch comments: ${response.status}`);
            }

            const data: PaginatedCommentsResponse = await response.json();
            return this.transformPaginatedResponse(data);
      }

      async getReplies(
            videoId: string,
            commentId: string,
            page: number = 1,
            pageSize: number = 5
      ): Promise<PaginatedCommentsResponse> {
            const response = await fetch(
                  `${this.baseUrl}/Videos/${videoId}/Comments/${commentId}/Replies?page=${page}&pageSize=${pageSize}`
            );

            if (!response.ok) {
                  throw new Error(`Failed to fetch replies: ${response.status}`);
            }

            const data: PaginatedCommentsResponse = await response.json();
            return this.transformPaginatedResponse(data);
      }

      async addComment(request: CreateVideoCommentRequest): Promise<VideoComment> {
            const comment = await this.authenticatedFetch<VideoComment>(
                  `/Videos/${request.videoId}/Comments`,
                  {
                        method: "POST",
                        body: JSON.stringify(request),
                  }
            );
            return this.transformComment(comment);
      }

      async updateComment(
            commentId: string,
            request: UpdateVideoCommentRequest
      ): Promise<VideoComment> {
            const comment = await this.authenticatedFetch<VideoComment>(
                  `/VideoComments/${commentId}`,
                  {
                        method: "PUT",
                        body: JSON.stringify(request),
                  }
            );
            return this.transformComment(comment);
      }

      async deleteComment(commentId: string): Promise<void> {
            await this.authenticatedFetch<void>(`/VideoComments/${commentId}`, {
                  method: "DELETE",
            });
      }
}

