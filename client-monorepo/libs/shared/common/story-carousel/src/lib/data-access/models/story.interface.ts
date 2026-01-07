export interface StoryInterface {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  backgroundColor: Array<{ color: string; stop: string }>;
  backgroundImage: string;
  duration: number;
}
