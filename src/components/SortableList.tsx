import { FC, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/store.js';
import { getTableState, setColumns } from '../store/slices/tableSlice.js';
import { Checkbox, Flex, List } from 'antd';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableItem } from './SortableItem';
import { HolderOutlined } from '@ant-design/icons';
import styles from './SortableList.module.scss';

const SortableList: FC = () => {
  const dispatch = useAppDispatch();
  const { columnsState } = useAppSelector(getTableState);

  useEffect(() => {
    dispatch(setColumns(columnsState));
  }, [columnsState, dispatch]);

  const sensors = useSensors(
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 50,
        tolerance: 3,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
        delay: 0,
        tolerance: 0,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active && over && active.id !== over.id) {
      const newItems = arrayMove(
        columnsState,
        columnsState.findIndex((item) => item.key === active.id),
        columnsState.findIndex((item) => item.key === over.id)
      );
      dispatch(setColumns(newItems));
    }
  };

  const toggleItemChecked = (id: string) => {
    const newItems = columnsState.map((i) =>
      i.key === id ? { ...i, checked: !i.checked } : i
    );
    dispatch(setColumns(newItems));
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={columnsState.map((item) => item.key)}
        strategy={verticalListSortingStrategy}
      >
        <List
          className={styles.list}
          dataSource={columnsState}
          bordered
          renderItem={(item) => (
            <SortableItem key={item.key} id={item.key}>
              <List.Item
                className={styles.item}
                style={{
                  backgroundColor: item.checked ? 'white' : '#f1f1f1',
                }}
              >
                <Flex justify="space-between" style={{ width: '100%' }}>
                  <HolderOutlined />
                  {item.title}
                  <div
                    style={{
                      display: 'flex',
                      padding: '2px 6px',
                    }}
                    onMouseDown={(e) => {
                      e.stopPropagation();
                    }}
                    onTouchStart={() => toggleItemChecked(item.key)}
                    onTouchEnd={(e) => {
                      e.stopPropagation();
                    }}
                    onClick={() => toggleItemChecked(item.key)}
                  >
                    <Checkbox
                      checked={item.checked}
                      style={{ touchAction: 'manipulation' }}
                    />
                  </div>
                </Flex>
              </List.Item>
            </SortableItem>
          )}
        />
      </SortableContext>
    </DndContext>
  );
};

export default SortableList;
