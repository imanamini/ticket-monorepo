import { JobCategory } from './job-category';

export interface JobPostItem {
  id: string;
  jobCategory: JobCategory;
  jobPostId: string;
  location: string;
  title: string;
  workModel: string;
}
