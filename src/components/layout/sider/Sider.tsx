import {
  DashboardOutlined,
  WalletOutlined,
  TeamOutlined,
  BarChartOutlined,
  CheckSquareOutlined,
  OrderedListOutlined,
  SettingOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { Divider, MenuProps } from 'antd';
import { Layout, Menu } from 'antd';
import React, { useEffect, useState } from 'react';

import FairPayLogo from '@/icons/FairPayLogo';
import styles from './Sider.module.css';
import { PRIMARY_BLUE, WHITE } from '@/utils/colors';
import Header from '@/components/ui/header/Header';
import Breadcrumb from '@/components/ui/breadcrumb/Breadcrumb';
import { useRouter } from 'next/router';
import {
  ROUTE_APPROVALS,
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_ROLE_MANAGEMENT,
  ROUTE_USERS,
} from '@/utils/constants';
import { useAuthContext } from '@/contexts/AuthProvider';
import PageHeader from '@/components/pages/components/page-header/PageHeader';
import Loader from '@/components/ui/loader/Loader';

const { Content, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const items: MenuItem[] = [
  getItem(
    'Dashboard',
    '1',
    <DashboardOutlined style={{ color: PRIMARY_BLUE }} />,
  ),
  getItem('Users', '2', <TeamOutlined style={{ color: PRIMARY_BLUE }} />),

  getItem(
    'FairPay Wallets',
    'sub1',
    <WalletOutlined style={{ color: PRIMARY_BLUE }} />,
    [getItem('Commuter Wallets', '5'), getItem('Agent Wallets', '6')],
  ),

  getItem(
    'Reports',
    '13',
    <BarChartOutlined style={{ color: PRIMARY_BLUE }} />,
  ),
  getItem(
    'Approvals',
    '22',
    <CheckSquareOutlined style={{ color: PRIMARY_BLUE }} />,
  ),
  getItem(
    'Audit logs',
    '33',
    <OrderedListOutlined style={{ color: PRIMARY_BLUE }} />,
  ),

  getItem(
    'Settings',
    'sub2',
    <SettingOutlined style={{ color: PRIMARY_BLUE }} />,
    [
      getItem('My Settings', '9'),
      getItem('Role Management', '10'),
      getItem('Wallet Configuration', '11'),
      getItem('Mobile App CMS', '12'),
    ],
  ),
];

const SiderLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [defaultSelectedItemKey, setDefaultSelectedItemKey] = useState(['1']);

  const router = useRouter();
  const { user, authLoading } = useAuthContext();

  const breakpointHandler = (broken: boolean) => {
    if (broken) setCollapsed(true);
  };

  const onSelectMenuItem = (key: string) => {
    switch (key) {
      case '2':
        router.push(ROUTE_DASHBOARD_PORTAL_USERS);
        break;

      case '22':
        router.push(ROUTE_APPROVALS);
        break;

      case '10':
        router.push(ROUTE_ROLE_MANAGEMENT);
        break;
    }
  };

  useEffect(() => {
    const { pathname } = router;

    if (pathname.includes('users')) {
      setDefaultSelectedItemKey(['2']);
      return;
    }

    if (pathname.includes('approvals')) {
      setDefaultSelectedItemKey(['22']);
      return;
    }

    if (pathname.includes('role-management')) {
      setDefaultSelectedItemKey(['10']);
      return;
    }
  }, [router]);

  if (!user) {
    if (authLoading) {
      return <Loader />;
    }
    return <>{children}</>;
  }

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        theme="light"
        trigger={null}
        className={styles.sider}
        breakpoint="sm"
        onBreakpoint={breakpointHandler}
      >
        <div className={styles.logoContainer}>
          <FairPayLogo />
        </div>

        <Menu
          defaultSelectedKeys={defaultSelectedItemKey}
          mode="inline"
          items={items}
          onSelect={({ key }) => onSelectMenuItem(key)}
        />

        <Divider className={styles.divider} />
        {React.createElement(
          collapsed ? MenuUnfoldOutlined : MenuFoldOutlined,
          {
            className: styles.customTrigger,
            style: collapsed ? { padding: '0 31.5px' } : undefined,
            onClick: () => setCollapsed(!collapsed),
          },
        )}
      </Sider>

      <Layout className="site-layout">
        <Header />

        <Divider style={{ margin: 0 }} />

        {router.pathname !== ROUTE_USERS && (
          <Content>
            <div style={{ padding: '16px 24px 0', backgroundColor: WHITE }}>
              <Breadcrumb />

              <PageHeader />
            </div>

            {children}
          </Content>
        )}
      </Layout>
    </Layout>
  );
};

export default SiderLayout;
