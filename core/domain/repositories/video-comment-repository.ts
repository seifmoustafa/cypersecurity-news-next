// Video Comment repository interface (Facebook-like pagination)

import type {
      VideoComment,
      CreateVideoCommentRequest,
      UpdateVideoCommentRequest,
      PaginatedCommentsResponse
} from "../models/video-comment";

export interface VideoCommentRepository {
      /**
       * Get paginated root-level comments for a video (public - no auth required)
       */
      getByVideoId(videoId: string, page?: number, pageSize?: number): Promise<PaginatedCommentsResponse>;

      /**
       * Get paginated replies for a comment (on-demand loading)
       */
      getReplies(videoId: string, commentId: string, page?: number, pageSize?: number): Promise<PaginatedCommentsResponse>;

      /**
       * Add a new comment (requires authentication)
       */
      addComment(request: CreateVideoCommentRequest): Promise<VideoComment>;

      /**
       * Update own comment
       */
      updateComment(commentId: string, request: UpdateVideoCommentRequest): Promise<VideoComment>;

      /**
       * Delete own comment
       */
      deleteComment(commentId: string): Promise<void>;
}

