import { useAuthContext } from '@/contexts/AuthProvider';
import Auth from '@/services/auth';
import { CHARACTER_SECONDARY, PRIMARY_BLUE } from '@/utils/colors';
import { ROUTE_EXISTING_USER_LOGIN } from '@/utils/constants';
import {
  CaretDownOutlined,
  FileOutlined,
  LogoutOutlined,
  QuestionCircleOutlined,
  SettingOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Avatar, Dropdown, MenuProps } from 'antd';
import { FC, ReactNode } from 'react';
import styles from './UserProfile.module.css';

const UserProfile: FC = () => {
  const { getUser } = useAuthContext();

  const onItemClick = (title: string) => {
    switch (title) {
      case 'Logout':
        Auth.logout();
        getUser();
        break;
    }
  };

  const getLabel = (title: string, icon: ReactNode) => {
    return (
      <div className={styles.label} onClick={onItemClick.bind(this, title)}>
        {icon}
        <span>{title}</span>
      </div>
    );
  };

  const items: MenuProps['items'] = [
    {
      label: getLabel('Profile', <UserOutlined />),
      key: 'profile-0',
    },
    {
      label: getLabel('Settings', <SettingOutlined />),
      key: 'profile-1',
    },
    {
      label: getLabel('Guide', <FileOutlined />),
      key: 'profile-2',
    },
    {
      label: getLabel('Help Center', <QuestionCircleOutlined />),
      key: 'profile-3',
    },
    {
      label: getLabel('Logout', <LogoutOutlined />),
      key: 'profile-4',
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <div className={styles.userProfile}>
        <Avatar icon={<UserOutlined />} />

        <div className={styles.userInfo}>
          <span>Full Name</span>
          <span style={{ color: CHARACTER_SECONDARY, fontSize: 12 }}>Role</span>
        </div>

        <CaretDownOutlined style={{ color: PRIMARY_BLUE }} />
      </div>
    </Dropdown>
  );
};

export default UserProfile;
