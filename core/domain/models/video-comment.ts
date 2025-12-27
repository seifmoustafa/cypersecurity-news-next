// Video Comment domain model (Facebook-like pagination)

export interface VideoComment {
      id: string;
      videoId: string;
      clientId: string;
      parentCommentId: string | null;
      content: string;
      depth: number;
      createdTimestamp: string;
      updatedTimestamp: string | null;
      isHidden: boolean;
      isActive: boolean;

      // Author info
      authorName: string;
      authorAvatar: string | null;
      authorRank: string;

      // For visual flattening when depth > 4
      replyingToUsername: string | null;

      // Reply counts for on-demand loading
      replyCount: number;
      totalReplies: number;

      // Loaded replies (populated on-demand)
      replies: VideoComment[];
}

export interface PaginationMetadata {
      itemsCount: number;
      pageSize: number;
      currentPage: number;
      pagesCount: number;
      hasMore: boolean;
}

export interface PaginatedCommentsResponse {
      data: VideoComment[];
      pagination: PaginationMetadata;
}

export interface CreateVideoCommentRequest {
      videoId: string;
      content: string;
      parentCommentId?: string | null;
}

export interface UpdateVideoCommentRequest {
      content: string;
}

