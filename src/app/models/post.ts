export interface Post {
  id: string;
  title: string;
  shortDescription: string;
  imageUrl: string;
  description: string;
  authorId: string;
  likes: number;
  liked: boolean,
  share: number;
  likedBy: string[];
}
