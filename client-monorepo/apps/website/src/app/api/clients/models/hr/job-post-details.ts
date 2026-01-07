import { JobCategory } from './job-category';

export interface JobPostDetails {
  additionalDescription: string;
  description: string;
  id: string;
  importantPoints: string;
  jobCategory: JobCategory;
  jobPostId: string;
  location: string;
  language: string;
  requirements: string;
  responsibilities: string;
  workModel: string;
  title: string;
}
