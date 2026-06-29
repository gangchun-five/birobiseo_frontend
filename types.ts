export type Paginated<T> = {
  content: T[];
  totalElements: number;
  totalPages?: number;
};

export type RouteParams<T extends Record<string, string>> = {
  params: Promise<T>;
};

export type PageSearchParams = Promise<Record<string, string | string[] | undefined>>;
