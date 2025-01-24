export interface SearchParameter {
  name: string;
  value: string;
  type: string;
  modifier?: string;
  prefix?: string;
}

export interface Include {
  resource: string;
  searchParam: string;
}

export interface RevInclude extends Include {}

export interface SortOption {
  parameter: string;
  order: 'asc' | 'desc';
}

export interface PaginationConfig {
  _count?: number;
  _offset?: number;
}

export interface QueryConfig {
  resourceType: string;
  parameters: SearchParameter[];
  includes: Include[];
  revIncludes: RevInclude[];
  modifiers: string[];
  sorting: SortOption[];
  pagination: PaginationConfig;
}
