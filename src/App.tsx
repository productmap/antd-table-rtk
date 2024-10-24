import { FC, memo, useCallback } from 'react';
import { useGetDataQuery } from './store/api';
import { RootState, useAppDispatch, useAppSelector } from './store/store';
import type { TableColumnsType, TablePaginationConfig } from 'antd';
import { Button, Space, Table } from 'antd';
import {
  clearAll,
  clearFilters,
  clearSorters,
  setFilters,
  setPagination,
  setSorters,
} from './store/slices/tableSlice';
import { DataType, Filters, Sorts } from './types.ts';
import type { SorterResult } from 'antd/es/table/interface';
import { FilterValue } from 'antd/lib/table/interface';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const { filtersState, sorterState, paginationState } = useAppSelector(
    (state: RootState) => state.table
  );
  const { data, isLoading } = useGetDataQuery();

  const handleTableChange = useCallback(
    (
      _: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<DataType> | SorterResult<DataType>[]
    ) => {
      const sortedColumns = Array.isArray(sorter)
        ? sorter.reduce(
            (acc, curr) => ({ ...acc, [curr.columnKey as string]: curr.order }),
            {}
          )
        : sorter
        ? { [sorter.columnKey as string]: sorter.order }
        : {};

      dispatch(setFilters(filters as Filters));
      dispatch(setSorters(sortedColumns as Sorts));
    },
    [dispatch]
  );

  const tableColumns: TableColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      filters: [
        { text: 'Joe', value: 'Joe' },
        { text: 'Jim', value: 'Jim' },
      ],
      filteredValue: filtersState.name || null,
      onFilter: (value, record) => record.name.includes(value as string),
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
      sorter: {
        compare: (a, b) =>
          a.name.localeCompare(b.name, undefined, { sensitivity: 'base' }),
        multiple: 1,
      },
      sortOrder: sorterState['name'] ? sorterState['name'] : null,
      ellipsis: true,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
      sorter: {
        compare: (a, b) => a.age - b.age,
        multiple: 2,
      },
      sortOrder: sorterState['age'] ? sorterState['age'] : null,
      ellipsis: true,
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
      filters: [
        { text: 'London', value: 'London' },
        { text: 'New York', value: 'New York' },
      ],
      filteredValue: filtersState.address || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: {
        compare: (a, b) => a.address.length - b.address.length,
        multiple: 3,
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
      <Table<DataType>
        loading={isLoading}
        columns={tableColumns}
        dataSource={data || []}
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
