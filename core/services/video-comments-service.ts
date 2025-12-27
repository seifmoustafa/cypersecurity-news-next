// Video Comments Service (Facebook-like pagination)

import type { VideoCommentRepository } from "../domain/repositories/video-comment-repository";
import type {
      VideoComment,
      CreateVideoCommentRequest,
      PaginatedCommentsResponse,
} from "../domain/models/video-comment";

export class VideoCommentsService {
      private repository: VideoCommentRepository;

      constructor(repository: VideoCommentRepository) {
            this.repository = repository;
      }

      /**
       * Get paginated root-level comments for a video
       */
      async getCommentsForVideo(
            videoId: string,
            page: number = 1,
            pageSize: number = 10
      ): Promise<PaginatedCommentsResponse> {
            return this.repository.getByVideoId(videoId, page, pageSize);
      }

      /**
       * Get paginated replies for a comment (on-demand loading)
       */
      async getReplies(
            videoId: string,
            commentId: string,
            page: number = 1,
            pageSize: number = 5
      ): Promise<PaginatedCommentsResponse> {
            return this.repository.getReplies(videoId, commentId, page, pageSize);
      }

      /**
       * Add a new comment
       */
      async addComment(
            videoId: string,
            content: string,
            parentCommentId?: string
      ): Promise<VideoComment> {
            const request: CreateVideoCommentRequest = {
                  videoId,
                  content,
                  parentCommentId: parentCommentId || null,
            };
            return this.repository.addComment(request);
      }

      /**
       * Update existing comment
       */
      async updateComment(commentId: string, content: string): Promise<VideoComment> {
            return this.repository.updateComment(commentId, { content });
      }

      /**
       * Delete comment
       */
      async deleteComment(commentId: string): Promise<void> {
            return this.repository.deleteComment(commentId);
      }
}

