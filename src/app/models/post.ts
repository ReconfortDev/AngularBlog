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
  datePosted: number;
}

export interface Comments {
  postId: string;
  userId: string;
  content?: { comment: string };
  like: number;
  createdDate: Date;
}
