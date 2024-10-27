import { FC, memo, useState } from 'react';
import { useAppDispatch } from '../store/store';
import { useGetDataQuery } from '../store/api';
import {
  clearAll,
  clearFilters,
  clearSorters,
} from '../store/slices/tableSlice';
import { Button, Popover, Space } from 'antd';
import DataTable from './DataTable';
import SortableList from './SortableList';
import { SettingOutlined } from '@ant-design/icons';
import styles from './App.module.scss';

const App: FC = () => {
  const { data, isLoading, refetch, isFetching } = useGetDataQuery();
  const dispatch = useAppDispatch();
  const [open, setOpen] = useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };

  return (
    <div className={styles.app}>
      <Space direction="vertical" size="small">
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={() => dispatch(refetch)}>Refetch data</Button>
          <Button onClick={() => dispatch(clearFilters())}>
            Clear filters
          </Button>
          <Button onClick={() => dispatch(clearSorters())}>
            Clear sorters
          </Button>
          <Button onClick={() => dispatch(clearAll())}>
            Clear filters and sorters
          </Button>
          <Popover
            title="Column settings"
            content={<SortableList />}
            trigger="click"
            open={open}
            onOpenChange={handleOpenChange}
            style={{ backgroundColor: '#edf2f7', padding: 0, margin: 0 }}
          >
            <Button color="default" type="link" size="large">
              <SettingOutlined style={{ fontSize: 20 }} />
            </Button>
          </Popover>
        </Space>
        <DataTable data={data} isLoading={isLoading} isFetching={isFetching} />
      </Space>
    </div>
  );
};

export default memo(App);
