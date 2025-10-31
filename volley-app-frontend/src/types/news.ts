export interface News {
  readonly id: string;
  readonly title: string;
  readonly content: string;
  readonly excerpt?: string;
  readonly author: string;
  readonly isPublished: boolean;
  readonly publishedAt?: Date;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface NewsCreateData {
  readonly title: string;
  readonly content: string;
  readonly excerpt?: string;
  readonly isPublished?: boolean;
  readonly publishedAt?: Date;
}

export interface NewsUpdateData {
  readonly title?: string;
  readonly content?: string;
  readonly excerpt?: string;
  readonly isPublished?: boolean;
  readonly publishedAt?: Date;
}

export interface NewsFilters {
  readonly isPublished?: boolean;
  readonly author?: string;
  readonly dateFrom?: Date;
  readonly dateTo?: Date;
} 