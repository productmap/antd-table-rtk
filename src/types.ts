import { SortOrder } from 'antd/lib/table/interface';

export interface DataType {
  key: string;
  name: string;
  age: number;
  address: string;
}

export interface apiResponse {
  data: DataType[];
}

export interface Filters {
  [key: string]: string[];
}

export interface Sorts {
  [key: string]: SortOrder;
}

export interface Pagination {
  pageSize: number;
}

export interface TableState {
  filtersState: Filters;
  sorterState: Sorts;
  paginationState: Pagination;
}
