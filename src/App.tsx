import { FC, memo, useCallback } from 'react';
import { useGetDataQuery } from './store/api';
import { useAppDispatch, useAppSelector } from './store/store';
import type { TableColumnsType, TablePaginationConfig } from 'antd';
import { Button, Space, Table } from 'antd';
import {
  clearAll,
  clearFilters,
  clearSorters,
  getTableState,
  setFilters,
  setPagination,
  setSorters,
} from './store/slices/tableSlice';
import { Filters, Sorts, TableData } from './types.ts';
import type { SorterResult } from 'antd/es/table/interface';
import { FilterValue } from 'antd/lib/table/interface';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const { filtersState, sorterState, paginationState } =
    useAppSelector(getTableState);
  const { data, isLoading } = useGetDataQuery();

  // get unique options from data for filters
  const getUniqueOptions = (data: TableData[] | undefined, key: string) => {
    if (!data) return [];
    return Array.from(new Set(data.map((item) => item[key]))).map((value) => ({
      text: value,
      value,
    }));
  };

  const handleTableChange = useCallback(
    (
      _: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<TableData> | SorterResult<TableData>[]
    ) => {
      // Get the sorter state
      let sortedColumns:
        | SorterResult<TableData>
        | { [p: string]: 'descend' | 'ascend' | null | undefined };
      if (Array.isArray(sorter)) {
        sortedColumns = sorter.reduce(
          (acc, curr) => ({ ...acc, [curr.columnKey as string]: curr.order }),
          {}
        );
      } else {
        sortedColumns = sorter
          ? { [sorter.columnKey as string]: sorter.order }
          : {};
      }

      dispatch(setFilters(filters as Filters));
      dispatch(setSorters(sortedColumns as Sorts));
    },
    [dispatch]
  );

  const tableColumns: TableColumnsType<TableData> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
        multiple: 1,
      },
      sortOrder: sorterState['name'] ? sorterState['name'] : null,
      ellipsis: true,
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
      sorter: {
        compare: (a, b) => a.gender.localeCompare(b.gender),
        multiple: 2,
      },
      sortOrder: sorterState['gender'] ? sorterState['gender'] : null,
      filters: getUniqueOptions(data, 'gender'),
      filteredValue: filtersState.gender || null,
      onFilter: (value, record) =>
        value === 'male'
          ? record.gender === 'male'
          : record.gender === 'female',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => a.age - b.age,
        multiple: 3,
      },
      sortOrder: sorterState['age'] ? sorterState['age'] : null,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) =>
          a.email.replace(/\./g, '').localeCompare(b.email.replace(/\./g, '')),
        multiple: 3,
      },
      sortOrder: sorterState['email'] ? sorterState['email'] : null,
      ellipsis: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sortDirections: ['ascend', 'descend'],
      defaultSortOrder: 'ascend',
      filters: getUniqueOptions(data, 'address'),
      filteredValue: filtersState.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: {
        compare: (a, b) => a.address.localeCompare(b.address),
        multiple: 5,
      },
      sortOrder: sorterState['address'] ? sorterState['address'] : null,
      ellipsis: true,
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => dispatch(clearFilters())}>Clear filters</Button>
        <Button onClick={() => dispatch(clearSorters())}>Clear sorters</Button>
        <Button onClick={() => dispatch(clearAll())}>
          Clear filters and sorters
        </Button>
      </Space>
      <Table<TableData>
        loading={isLoading}
        columns={tableColumns}
        dataSource={data}
        onChange={handleTableChange}
        pagination={{
          pageSize: paginationState.pageSize,
          showTotal: (total) => `${total} rows`,
          onChange: (_, pageSize) => {
            dispatch(setPagination({ pageSize }));
          },
        }}
        size={'middle'}
        bordered
      />
    </>
  );
};

export default memo(App);
