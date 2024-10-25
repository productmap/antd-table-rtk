import { SortOrder } from 'antd/lib/table/interface';

interface DataType {
  name: {
    first: string;
    last: string;
  };
  gender: string;
  email: string;
  dob: {
    age: number;
  };
  location: {
    country: string;
  };
  login: {
    uuid: string;
  };
}

export interface apiResponse {
  results: DataType[];
}

export interface TableData {
  name: string;
  gender: string;
  age: number;
  email: string;
  address: string;
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
