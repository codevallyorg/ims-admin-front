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
  ARCHIVE,
  ARCHIVED_USERS,
  ASSIGNED_AGENTS,
  CARD_STOCK,
  INVITE_NEW_PORTAL_USER,
  INVITE_NEW_TDR_USER,
  LOCK_PROFILE,
  PORTAL_USERS,
  PROFILE,
  ROUTE_DASHBOARD_ARCHIVED_USERS,
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_DASHBOARD_TDR_USERS,
  ROUTE_INVITE_NEW_PORTAL_USER,
  ROUTE_INVITE_NEW_TDR_USER,
  TDR_USERS,
  UNARCHIVE,
  UNLOCK_PROFILE,
} from '@/utils/constants';
import {
  EllipsisOutlined,
  LockOutlined,
  MailOutlined,
  SyncOutlined,
  UnlockOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';
import Button from '@/components/ui/button/Button';
import styles from './PageHeader.module.css';
import User from '@/services/user';
import {
  preparePathname,
  showErrorNotification,
  showNotification,
  typeCastQueryToString,
} from '@/utils/general';
import ToggleArchiveUserProfileModal from '../../modals/toggle-archive-user-profile/ToggleArchiveUserProfileModal';
import ToggleUserProfileLockModal from '../../modals/toggle-user-profile-lock/ToggleUserProfileLockModal';
import ResetPasswordModal from '../../modals/reset-password/ResetPasswordModal';
import { NEUTRAL_5, PRIMARY_BLUE } from '@/utils/colors';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import { IUser } from '@/types/entities/IUser';

const usersTabItems = [
  { label: PORTAL_USERS, key: PORTAL_USERS },
  { label: TDR_USERS, key: TDR_USERS },
  { label: ARCHIVED_USERS, key: ARCHIVED_USERS },
];

const tdrUserTabItems = [
  { label: PROFILE, key: PROFILE },
  { label: ASSIGNED_AGENTS, key: ASSIGNED_AGENTS },
  { label: CARD_STOCK, key: CARD_STOCK },
];

const getDrowdownItems = (selectedUser: IUser | null) => {
  const items = [
    { label: LOCK_PROFILE, key: 0 },
    { label: ARCHIVE, key: 1 },
  ];

  if (selectedUser?.locked) {
    items[0] = { label: UNLOCK_PROFILE, key: 0 };
  }

  if (selectedUser?.archived) {
    items[1] = { label: UNARCHIVE, key: 1 };
  }

  return items;
};

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

  const { breadcrumbNameMap, selectedUser, getSelectedUser } =
    usePageHeaderContext();
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

  useEffect(() => {
    const preparedPath = id ? preparePathname(pathname, id) : pathname;

    const defaultUsersTab =
      pathname === ROUTE_DASHBOARD_ARCHIVED_USERS
        ? ARCHIVED_USERS
        : pathname === ROUTE_DASHBOARD_TDR_USERS
        ? TDR_USERS
        : PORTAL_USERS;

    const defaultTDRUserTab = typeCastQueryToString(tab) || PROFILE;

    setTitle(breadcrumbNameMap[preparedPath]);

    if (
      preparedPath === ROUTE_INVITE_NEW_PORTAL_USER ||
      preparedPath === ROUTE_INVITE_NEW_TDR_USER
    ) {
      setFooter(inviteFooter);
    } else if (preparedPath.includes('edit-user-profile')) {
      setFooter(<div style={{ paddingBottom: 1 }} />);
    } else if (id && !preparedPath.includes('edit-user-profile')) {
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
    } else {
      setFooter(
        <Tabs
          defaultActiveKey={defaultUsersTab}
          onChange={onUsersTabChange}
          items={usersTabItems}
        />,
      );
    }
  }, [
    id,
    pathname,
    tab,
    breadcrumbNameMap,
    onUsersTabChange,
    onTDRUserTabChange,
  ]);

  const onClickResetPassword = () => {
    setOpenResetPasswordModal(true);
  };

  const onClickEdit = () => {
    const preparedRoute = router.pathname
      .replace('[id]', typeCastQueryToString(router.query.id))
      .concat('/edit-user-profile');

    router.push(preparedRoute);
  };

  const onSendResetPassword = async () => {
    try {
      if (!id || isNaN(+id)) return;

      setLoading(true);

      const response = await User.resetPassword(+id);

      if (!response.success) {
        throw new Error('Something went wrong');
      }

      showNotification({
        message: 'Sent Successfully',
        description: `A password reset link has been sent to ${selectedUser?.email}`,
        icon: <MailOutlined style={{ color: PRIMARY_BLUE }} />,
      });
    } catch (err: any) {
      console.error(err);
    } finally {
      setOpenResetPasswordModal(false);
      setLoading(false);
    }
  };

  const onCancelResetPassword = () => {
    setOpenResetPasswordModal(false);
  };

  const resetPasswordModalProps = {
    loading,
    open: openResetPasswordModal,
    onSend: onSendResetPassword,
    onCancel: onCancelResetPassword,
  };

  const onClickDropdownItem = (info: any) => {
    if (+info.key === 0) {
      setOpenToggleUserProfileLockModal(true);
    } else {
      setOpenToggleArchiveUserModal(true);
    }
  };

  const onToggleArchiveUserProfile = async () => {
    try {
      if (!id || isNaN(+id)) return;

      setLoading(true);

      const response = await User.toggleArchiveUserProfile(+id);

      if (!response.success) {
        throw new Error('Something went wrong');
      }

      const message = `User ${
        selectedUser?.archived ? 'Unarchived' : 'Archived'
      } Successfully`;
      const description = `${selectedUser?.firstName} ${
        selectedUser?.lastName
      }'s profile has been ${
        selectedUser?.archived ? 'unarchived!' : 'archived!'
      }`;
      const icon = selectedUser?.archived ? (
        <SyncOutlined style={{ color: PRIMARY_BLUE }} />
      ) : (
        <UserDeleteOutlined style={{ color: PRIMARY_BLUE }} />
      );

      showNotification({
        message,
        description,
        icon,
      });

      getSelectedUser();
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err);
    } finally {
      setOpenToggleArchiveUserModal(false);
      setLoading(false);
    }
  };

  const onCancelArchiveUser = () => {
    setOpenToggleArchiveUserModal(false);
  };

  const toggleArchiveUserModalProps = {
    loading,
    open: openToggleArchiveUserModal,
    onArchive: onToggleArchiveUserProfile,
    onCancel: onCancelArchiveUser,
  };

  const onToggleUserProfileLock = async () => {
    try {
      if (!id || isNaN(+id)) return;

      setLoading(true);

      const response = await User.toggleUserProfileLock(+id);

      if (!response.success) {
        throw new Error('Something went wrong');
      }

      const message = `Profile ${
        selectedUser?.locked ? 'Unlocked' : 'Locked'
      } Successfully`;
      const description = `${selectedUser?.firstName} ${
        selectedUser?.lastName
      }'s profile has been ${selectedUser?.locked ? 'unlocked!' : 'locked!'}`;
      const icon = selectedUser?.locked ? (
        <UnlockOutlined style={{ color: PRIMARY_BLUE }} />
      ) : (
        <LockOutlined style={{ color: PRIMARY_BLUE }} />
      );

      showNotification({
        message,
        description,
        icon,
      });

      getSelectedUser();
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err);
    } finally {
      setOpenToggleUserProfileLockModal(false);
      setLoading(false);
    }
  };

  const onCancelUserProfileLock = () => {
    setOpenToggleUserProfileLockModal(false);
  };

  const toggleUserProfileLockModalProps = {
    loading,
    open: openToggleUserProfileLockModal,
    onSubmit: onToggleUserProfileLock,
    onCancel: onCancelUserProfileLock,
  };

  return (
    <PageHeaderAntd
      className="site-page-header-responsive"
      style={{ padding: 0, marginTop: 6 }}
      onBack={
        title === INVITE_NEW_PORTAL_USER || title === INVITE_NEW_TDR_USER
          ? undefined
          : onBackArrowClick
      }
      title={title}
      footer={footer}
      extra={
        router.pathname.includes('[id]') &&
        !router.pathname.includes('edit-user-profile') && [
          <Button key="0" onClick={onClickEdit}>
            Edit
          </Button>,
          <Button key="1" onClick={onClickResetPassword}>
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
