import { FC, memo, useCallback } from 'react';
import { useGetDataQuery } from '../store/api.ts';
import { useAppDispatch, useAppSelector } from '../store/store.ts';
import {
  Button,
  Col,
  Flex,
  InputNumber,
  Row,
  Slider,
  Space,
  Table,
  TableColumnsType,
  TableColumnType,
  TablePaginationConfig,
} from 'antd';
import {
  clearAll,
  clearFilters,
  clearSorters,
  getTableState,
  setFilters,
  setPagination,
  setSorters,
} from '../store/slices/tableSlice.ts';
import _ from 'lodash';
import { Filters, Sorts, TableData, TableDataIndex } from '../types/types.ts';
import type { SorterResult } from 'antd/es/table/interface';
import styles from './App.module.scss';
import { FilterValue } from 'antd/lib/table/interface';

const App: FC = () => {
  const dispatch = useAppDispatch();
  const { filtersState, sorterState, paginationState } =
    useAppSelector(getTableState);
  const { data, isLoading } = useGetDataQuery();

  // get unique options from data for filters
  const getUniqueOptions = _.memoize(
    (data: TableData[] | undefined, key: string) => {
      if (!data) return [];
      return Array.from(new Set(data.map((item) => item[key]))).map(
        (value) => ({
          text: value,
          value,
        })
      );
    }
  );

  const getRangeOptions = _.memoize(
    (data: TableData[] | undefined, key: string) => {
      if (!data) return [];
      const min = Math.min(...data.map((item) => item[key]));
      const max = Math.max(...data.map((item) => item[key]));
      return [min, max];
    }
  );

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

  const getRangeFilterProps = (
    dataIndex: TableDataIndex
  ): TableColumnType<TableData> => ({
    filters: getUniqueOptions(data, dataIndex),
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
      const [min, max] = getRangeOptions(data, dataIndex);
      const [minValue, maxValue] =
        selectedKeys.length === 2 ? selectedKeys : [min, max];

      return (
        <Space direction={'vertical'} style={{ padding: 16 }}>
          <Flex justify="space-between">
            <InputNumber
              type="number"
              min={min}
              max={max}
              prefix="from"
              value={minValue || min}
              onChange={(value) => setSelectedKeys([value, maxValue])}
            />
            <InputNumber
              type="number"
              min={min}
              max={max}
              prefix="to"
              value={maxValue || max}
              onChange={(value) => setSelectedKeys([minValue, value])}
            />
          </Flex>
          <Row>
            <Col span={24}>
              <Slider
                range
                min={min}
                max={max}
                defaultValue={[min, max]}
                value={[minValue, maxValue]}
                onChange={(value) => setSelectedKeys(value)}
              />
            </Col>
          </Row>
          <Flex vertical={false} justify="space-between">
            <Button
              onClick={() => {
                setSelectedKeys([]);
                dispatch(setFilters({ ...filtersState, [dataIndex]: null }));
                confirm();
              }}
            >
              Reset
            </Button>
            <Button
              type="primary"
              onClick={() => {
                dispatch(
                  setFilters({
                    ...filtersState,
                    [dataIndex]: [minValue, maxValue],
                  })
                );
                confirm();
              }}
            >
              OK
            </Button>
          </Flex>
        </Space>
      );
    },
    onFilter: (_, record) => {
      const [min, max] = (filtersState[dataIndex] as FilterValue) ?? [];
      if (min !== undefined && max !== undefined) {
        return record[dataIndex] >= min && record[dataIndex] <= max;
      }
      return true;
    },
    filteredValue: filtersState[dataIndex]
      ? (filtersState[dataIndex] as FilterValue)
      : null,
  });

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
      width: 120,
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'descend',
      sorter: {
        compare: (a, b) => a.gender.localeCompare(b.gender),
        multiple: 2,
      },
      sortOrder: sorterState['gender'] ? sorterState['gender'] : null,
      filters: getUniqueOptions(data, 'gender'),
      filteredValue: (filtersState.gender as FilterValue) || null,
      onFilter: (value, record) => record.gender === value,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      width: 100,
      align: 'center',
      sortDirections: ['descend', 'ascend'],
      defaultSortOrder: 'ascend',
      sorter: {
        compare: (a, b) => a.age - b.age,
        multiple: 3,
      },
      sortOrder: sorterState['age'] ? sorterState['age'] : null,
      ...getRangeFilterProps('age'),
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
      filteredValue: (filtersState.address as FilterValue) || null,
      onFilter: (value, record) => record.address.includes(value as string),
      sorter: {
        compare: (a, b) => a.address.localeCompare(b.address),
        multiple: 5,
      },
      sortOrder: sorterState['address'] ? sorterState['address'] : null,
      ellipsis: true,
    },
  ];

  return (
    <div className={styles.app}>
      <Space direction="vertical" size="small">
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={() => dispatch(clearFilters())}>
            Clear filters
          </Button>
          <Button onClick={() => dispatch(clearSorters())}>
            Clear sorters
          </Button>
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
            showSizeChanger: true,
            rootClassName: styles.table__pagination,
            showTotal: (total) => `${total} rows`,
            onChange: (_, pageSize) => {
              dispatch(setPagination({ pageSize }));
            },
          }}
          size="large"
          className={styles.table}
        />
      </Space>
    </div>
  );
};

export default memo(App);
