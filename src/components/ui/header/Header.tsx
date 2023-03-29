import UserProfile from '@/components/pages/user-profile/UserProfile';
import { PRIMARY_BLUE } from '@/utils/colors';
import { SettingOutlined, BellOutlined } from '@ant-design/icons';
import { Layout } from 'antd';
import { FC } from 'react';
import Badge from '../badge/Badge';

import styles from './Header.module.css';

const { Header: Head } = Layout;

const Header: FC = () => {
  return (
    <Head className={styles.head}>
      <SettingOutlined style={{ color: PRIMARY_BLUE }} />

      <Badge count={2}>
        <BellOutlined style={{ color: PRIMARY_BLUE }} />
      </Badge>

      <UserProfile />
    </Head>
  );
};

export default Header;
