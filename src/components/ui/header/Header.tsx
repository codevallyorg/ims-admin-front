import { Drawer, Layout } from 'antd';
import { FC, useState } from 'react';

import Badge from '../badge/Badge';
import UserProfile from '@/components/pages/components/user-profile/UserProfile';
import { PRIMARY_BLUE } from '@/utils/colors';
import { SettingOutlined, BellOutlined } from '@ant-design/icons';
import styles from './Header.module.css';
import Button from '../button/Button';
import NotificationsDrawer from '../notifications-drawer/NotificationsDrawer';

const { Header: Head } = Layout;

const Header: FC = () => {
  const [openNotificationDrawer, setOpenNotificationDrawer] =
    useState<boolean>(false);

  const onClickBellIcon = () => {
    setOpenNotificationDrawer((isOpen) => !isOpen);
  };

  const onCloseNotificationsDrawer = () => {
    setOpenNotificationDrawer(false);
  };

  return (
    <Head className={styles.head}>
      <SettingOutlined style={{ color: PRIMARY_BLUE }} />

      <div onClick={onClickBellIcon} className={styles.bellIconContainer}>
        <Badge count={2}>
          <BellOutlined style={{ color: PRIMARY_BLUE }} />
        </Badge>
      </div>

      <UserProfile />

      <NotificationsDrawer
        open={openNotificationDrawer}
        onClose={onCloseNotificationsDrawer}
      />
    </Head>
  );
};

export default Header;
