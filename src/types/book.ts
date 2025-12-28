// src/types/book.ts
export interface Books {
  id: number;
  title: string;
  copies: number;
  author?: string;
  genre?: string;
  year?: number;
  image: string;
}
