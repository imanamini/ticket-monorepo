export interface UserComment {
  authorName: string;
  text: string;
  id: string;
  time: string;
  replies: UserComment[];
}
