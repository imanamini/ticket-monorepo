export class PageList<T> {
  pageIndex?: number;
  pageSize?: number;
  totalCount?: number;
  totalPages?: number;
  details: T[];
  sessionId?: string;
  total?: number;
  offset?: number;
}
