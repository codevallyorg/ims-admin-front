import {
  ARCHIVED_USERS,
  INVITE_NEW_PORTAL_USER,
  INVITE_NEW_TDR_USER,
  PORTAL_USERS,
  ROUTE_DASHBOARD_ARCHIVED_USERS,
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_DASHBOARD_TDR_USERS,
  ROUTE_INVITE_NEW_PORTAL_USER,
  ROUTE_INVITE_NEW_TDR_USER,
  ROUTE_USERS,
  TDR_USERS,
  USERS,
} from '@/utils/constants';
import { PageHeader, Tabs } from 'antd';
import { useRouter } from 'next/router';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';

const items = [
  { label: PORTAL_USERS, key: PORTAL_USERS },
  { label: TDR_USERS, key: TDR_USERS },
  { label: ARCHIVED_USERS, key: ARCHIVED_USERS },
];

const inviteFooter = (
  <div style={{ paddingBottom: 14 }}>
    The new user will receive an invitation email with instructions on how to
    create their account and access the portal.
  </div>
);

const UsersPageHeader: React.FC = () => {
  const [title, setTitle] = useState<string>();
  const [footer, setFooter] = useState<ReactNode>();

  const router = useRouter();

  const onBackArrowClick = () => {
    router.push(ROUTE_USERS);
  };

  const onTabChange = useCallback(
    (activeKey: string) => {
      switch (activeKey) {
        case PORTAL_USERS:
          router.push(ROUTE_DASHBOARD_PORTAL_USERS);
          break;

        case TDR_USERS:
          router.push(ROUTE_DASHBOARD_TDR_USERS);
          break;

        case ARCHIVED_USERS:
          router.push(ROUTE_DASHBOARD_ARCHIVED_USERS);
          break;
      }
    },
    [router],
  );

  useEffect(() => {
    const { pathname } = router;

    switch (pathname) {
      case ROUTE_INVITE_NEW_PORTAL_USER:
        setTitle(INVITE_NEW_PORTAL_USER);
        setFooter(inviteFooter);
        break;

      case ROUTE_INVITE_NEW_TDR_USER:
        setTitle(INVITE_NEW_TDR_USER);
        setFooter(inviteFooter);
        break;

      default:
        setTitle(USERS);
        setFooter(<Tabs onChange={onTabChange} items={items} />);
    }
  }, [router, onTabChange]);

  return (
    <PageHeader
      className="site-page-header-responsive"
      style={{ padding: 0, marginTop: 6 }}
      onBack={title === USERS ? onBackArrowClick : undefined}
      title={title}
      footer={footer}
    ></PageHeader>
  );
};

export default UsersPageHeader;
