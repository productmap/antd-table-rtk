import { SortOrder } from 'antd/lib/table/interface';
import { Key } from 'react';

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

export type TableDataIndex = keyof TableData;

export interface Filters {
  [key: string]: string[] | [Key, Key] | [number, number] | number | null;
}

export interface Sorts {
  [key: string]: SortOrder;
}

export interface Pagination {
  pageSize: number;
}

export interface ColumnState {
  key: string;
  title: string;
  checked: boolean;
}

export interface TableState {
  filtersState: Filters;
  sorterState: Sorts;
  paginationState: Pagination;
  columnsState: ColumnState[];
}
