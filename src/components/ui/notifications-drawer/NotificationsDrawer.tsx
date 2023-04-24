import { Drawer, Space, Tabs } from 'antd';
import { FC } from 'react';
import {
  PRIMARY_BLUE,
  CHARACTER_SECONDARY,
  NEUTRAL_GRAY_LIGHT,
} from '@/utils/colors';
import { ALL_UNREAD, READ } from '@/utils/constants';
import { UserAddOutlined } from '@ant-design/icons';
import Button from '../button/Button';
import styles from './NotificationsDrawer.module.css';

type NotificationsDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const notification = (
  <div className={styles.notificationContainer}>
    <div>
      <UserAddOutlined style={{ color: PRIMARY_BLUE, fontSize: 28 }} />
    </div>

    <div>
      <Space className={styles.message}>
        <span style={{ color: CHARACTER_SECONDARY }}>
          New Portal User Created
        </span>
        <span style={{ color: NEUTRAL_GRAY_LIGHT }}>1 Day ago</span>
      </Space>

      <div>
        Lynn Jacobs was added as a new portal user by Steve Permento on the 23
        Jan, 2023 at 12:34:56
      </div>
    </div>
  </div>
);

const tabs = [
  { label: ALL_UNREAD, key: ALL_UNREAD, children: notification },
  { label: READ, key: READ },
];

const NotificationsDrawer: FC<NotificationsDrawerProps> = ({
  open,
  onClose,
}) => {
  return (
    <Drawer
      title="Notifications"
      placement="right"
      onClose={onClose}
      open={open}
      extra={
        <Button type="primary" onClick={onClose}>
          Settings
        </Button>
      }
    >
      <Tabs items={tabs} />
    </Drawer>
  );
};

export default NotificationsDrawer;
