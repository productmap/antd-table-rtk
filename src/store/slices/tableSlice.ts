import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  ColumnState,
  Filters,
  Pagination,
  Sorts,
  TableState,
} from '../../types/types.ts';

const initialState: TableState = {
  filtersState: {},
  sorterState: {},
  paginationState: {
    pageSize: 10,
  },
  columnsState: [],
};

const tableSlice = createSlice({
  name: 'table',
  initialState,
  reducers: {
    setFilters(state: TableState, action: PayloadAction<Filters>) {
      state.filtersState = action.payload;
    },
    setSorters(state: TableState, action: PayloadAction<Sorts>) {
      state.sorterState = action.payload;
    },
    setPagination(state, action: PayloadAction<Pagination>) {
      state.paginationState = action.payload;
    },
    setColumns(state, action: PayloadAction<ColumnState[]>) {
      state.columnsState = action.payload;
    },
    clearFilters(state) {
      state.filtersState = {};
    },
    clearSorters(state) {
      state.sorterState = {};
    },
    clearAll(state) {
      state.filtersState = {};
      state.sorterState = {};
    },
  },
  selectors: {
    getTableState: (state) => state,
  },
});

export const {
  setFilters,
  setSorters,
  setPagination,
  setColumns,
  clearSorters,
  clearFilters,
  clearAll,
} = tableSlice.actions;

export const { getTableState } = tableSlice.selectors;

export default tableSlice.reducer;
