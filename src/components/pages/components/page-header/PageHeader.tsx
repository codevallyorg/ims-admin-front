import {
  Badge,
  Dropdown,
  PageHeader as PageHeaderAntd,
  Space,
  Tabs,
} from 'antd';
import { useRouter } from 'next/router';
import React, { ReactNode, useCallback, useEffect, useState } from 'react';

import {
  ARCHIVED_USERS,
  ASSIGNED_AGENTS,
  CARD_STOCK,
  GENERAL,
  INVITE_NEW_PORTAL_USER,
  INVITE_NEW_TDR_USER,
  PERMISSIONS,
  PORTAL_USERS,
  PROFILE,
  ROUTE_CREATE_NEW_ROLE,
  ROUTE_DASHBOARD_ARCHIVED_USERS,
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_DASHBOARD_TDR_USERS,
  ROUTE_INVITE_NEW_PORTAL_USER,
  ROUTE_INVITE_NEW_TDR_USER,
  ROUTE_ROLE_MANAGEMENT,
  TDR_USERS,
  USERS,
} from '@/utils/constants';
import { EllipsisOutlined } from '@ant-design/icons';
import Button from '@/components/ui/button/Button';
import styles from './PageHeader.module.css';
import { preparePathname, typeCastQueryToString } from '@/utils/general';
import ToggleArchiveUserProfileModal from '../../modals/toggle-archive-user-profile/ToggleArchiveUserProfileModal';
import ToggleUserProfileLockModal from '../../modals/toggle-user-profile-lock/ToggleUserProfileLockModal';
import ResetPasswordModal from '../../modals/reset-password/ResetPasswordModal';
import { NEUTRAL_5 } from '@/utils/colors';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import {
  onSendResetPassword,
  onToggleArchiveUserProfile,
  onToggleUserProfileLock,
} from './helpers';
import {
  getDrowdownItems,
  tdrUserTabItems,
  usersTabItems,
  viewRoleTabItems,
} from './tabs';

const inviteFooter = (
  <div style={{ paddingBottom: 14 }}>
    The new user will receive an invitation email with instructions on how to
    create their account and access the portal.
  </div>
);

const PageHeader: React.FC = () => {
  const [title, setTitle] = useState<string>();
  const [footer, setFooter] = useState<ReactNode>();

  const [loading, setLoading] = useState<boolean>(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] =
    useState<boolean>(false);
  const [openToggleArchiveUserModal, setOpenToggleArchiveUserModal] =
    useState<boolean>(false);
  const [openToggleUserProfileLockModal, setOpenToggleUserProfileLockModal] =
    useState<boolean>(false);

  const {
    breadcrumbNameMap,
    selectedUser,
    getSelectedUser,
    selectedRole,
    rolePageHeaderBtnsClick,
  } = usePageHeaderContext();
  const router = useRouter();
  const { pathname } = router;
  const { id, tab } = router.query;

  const onBackArrowClick = () => {
    const preparedPath = !id ? pathname : preparePathname(pathname, id);

    const pathSnippets = preparedPath.split('/').filter((i: string) => i);
    const url = `/${pathSnippets.slice(0, pathSnippets.length - 1).join('/')}`;

    router.push(url);
  };

  const onUsersTabChange = useCallback(
    (activeKey: string) => {
      switch (activeKey) {
        case PORTAL_USERS:
          router.push(ROUTE_DASHBOARD_PORTAL_USERS);
          setTitle(PORTAL_USERS);
          break;

        case TDR_USERS:
          router.push(ROUTE_DASHBOARD_TDR_USERS);
          setTitle(TDR_USERS);
          break;

        case ARCHIVED_USERS:
          router.push(ROUTE_DASHBOARD_ARCHIVED_USERS);
          setTitle(ARCHIVED_USERS);
          break;
      }
    },
    [router],
  );

  const onTDRUserTabChange = useCallback(
    (activeKey: string) => {
      switch (activeKey) {
        case PROFILE:
          router.replace({ query: { ...router.query, tab: PROFILE } });
          break;

        case ASSIGNED_AGENTS:
          router.replace({ query: { ...router.query, tab: ASSIGNED_AGENTS } });
          break;

        case CARD_STOCK:
          router.replace({ query: { ...router.query, tab: CARD_STOCK } });
          break;
      }
    },
    [router],
  );

  const onRoleTabChange = useCallback(
    (activeKey: string) => {
      switch (activeKey) {
        case GENERAL:
          router.replace({ query: { ...router.query, tab: GENERAL } });
          break;

        case USERS:
          router.replace({ query: { ...router.query, tab: USERS } });
          break;

        case PERMISSIONS:
          router.replace({ query: { ...router.query, tab: PERMISSIONS } });
          break;
      }
    },
    [router],
  );

  useEffect(() => {
    const preparedPath = id ? preparePathname(pathname, id) : pathname;

    const defaultUsersTab =
      pathname === ROUTE_DASHBOARD_ARCHIVED_USERS
        ? ARCHIVED_USERS
        : pathname === ROUTE_DASHBOARD_TDR_USERS
        ? TDR_USERS
        : PORTAL_USERS;

    const defaultTDRUserTab = typeCastQueryToString(tab) || PROFILE;

    const title = breadcrumbNameMap[preparedPath];

    setTitle(title);

    if (preparedPath.includes('invite-new')) {
      setFooter(inviteFooter);
      return;
    }

    if (
      preparedPath.includes('edit-user-profile') ||
      preparedPath === ROUTE_ROLE_MANAGEMENT
    ) {
      setFooter(<div style={{ paddingBottom: 1 }} />);
      return;
    }
    if (
      id &&
      preparedPath.includes('users') &&
      !preparedPath.includes('edit-user-profile')
    ) {
      // TODO - add last audit log of the selected user
      setFooter(
        <>
          <div style={{ paddingBottom: 12 }}>
            <Space>
              <Badge color={NEUTRAL_5} />
              <span>Logged out</span>
            </Space>
          </div>

          {preparedPath.includes(ROUTE_DASHBOARD_TDR_USERS) ? (
            <Tabs
              defaultActiveKey={defaultTDRUserTab}
              onChange={onTDRUserTabChange}
              items={tdrUserTabItems}
            />
          ) : (
            <div style={{ paddingBottom: 4 }} />
          )}
        </>,
      );

      return;
    }

    if (
      preparedPath === ROUTE_CREATE_NEW_ROLE ||
      preparedPath.includes(ROUTE_ROLE_MANAGEMENT)
    ) {
      setFooter(
        <Tabs
          defaultActiveKey={typeCastQueryToString(tab)}
          items={
            selectedRole
              ? viewRoleTabItems
              : [viewRoleTabItems[0], viewRoleTabItems[2]]
          }
          onChange={onRoleTabChange}
        />,
      );
      return;
    }

    setFooter(
      <Tabs
        defaultActiveKey={defaultUsersTab}
        onChange={onUsersTabChange}
        items={usersTabItems}
      />,
    );
  }, [
    id,
    pathname,
    selectedRole,
    tab,
    breadcrumbNameMap,
    onUsersTabChange,
    onTDRUserTabChange,
    onRoleTabChange,
  ]);

  const onClickEdit = () => {
    const preparedRoute = router.pathname
      .replace('[id]', typeCastQueryToString(router.query.id))
      .concat('/edit-user-profile');

    router.push(preparedRoute);
  };

  const onClickDropdownItem = (info: any) => {
    if (+info.key === 0) {
      setOpenToggleUserProfileLockModal(true);
    } else {
      setOpenToggleArchiveUserModal(true);
    }
  };

  const commonArgs = {
    id,
    selectedUser,
    setLoading,
    setOpenResetPasswordModal,
    getSelectedUser,
    setOpenToggleArchiveUserModal,
    setOpenToggleUserProfileLockModal,
  };

  const resetPasswordModalProps = {
    loading,
    open: openResetPasswordModal,
    onSend: onSendResetPassword.bind(this, commonArgs),
    onCancel: () => setOpenResetPasswordModal(false),
  };

  const toggleArchiveUserModalProps = {
    loading,
    open: openToggleArchiveUserModal,
    onArchive: onToggleArchiveUserProfile.bind(this, commonArgs),
    onCancel: () => setOpenToggleArchiveUserModal(false),
  };

  const toggleUserProfileLockModalProps = {
    loading,
    open: openToggleUserProfileLockModal,
    onSubmit: onToggleUserProfileLock.bind(this, commonArgs),
    onCancel: () => setOpenToggleUserProfileLockModal(false),
  };

  return (
    <PageHeaderAntd
      className="site-page-header-responsive"
      style={{ padding: 0, marginTop: 6 }}
      onBack={
        title?.includes('Invite') || title?.includes('Create')
          ? undefined
          : onBackArrowClick
      }
      title={title}
      footer={footer}
      extra={
        router.pathname === ROUTE_CREATE_NEW_ROLE
          ? [
              <Button key="0" onClick={rolePageHeaderBtnsClick.onCancel}>
                Cancel
              </Button>,
              <Button
                key="1"
                type="primary"
                onClick={rolePageHeaderBtnsClick.onSave}
              >
                Save
              </Button>,
            ]
          : router.pathname.includes('[id]') &&
            !router.pathname.includes('edit-user-profile') && [
              <Button key="0" onClick={onClickEdit}>
                Edit
              </Button>,
              <Button key="1" onClick={() => setOpenResetPasswordModal(true)}>
                Reset Password
              </Button>,
              <Dropdown
                key="2"
                menu={{
                  items: getDrowdownItems(selectedUser),
                  onClick: onClickDropdownItem,
                }}
                placement="bottomRight"
                trigger={['click']}
                overlayStyle={{ width: 120 }}
              >
                <Button className={styles.ellipsisButton}>
                  <EllipsisOutlined />
                </Button>
              </Dropdown>,
              <ResetPasswordModal key="3" {...resetPasswordModalProps} />,
              <ToggleArchiveUserProfileModal
                key="4"
                {...toggleArchiveUserModalProps}
              />,
              <ToggleUserProfileLockModal
                key="5"
                {...toggleUserProfileLockModalProps}
              />,
            ]
      }
    ></PageHeaderAntd>
  );
};

export default PageHeader;
