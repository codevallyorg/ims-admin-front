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
  INVITE_NEW_PORTAL_USER,
  INVITE_NEW_TDR_USER,
  LOCK_PROFILE,
  PORTAL_USERS,
  ROUTE_DASHBOARD_ARCHIVED_USERS,
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_DASHBOARD_TDR_USERS,
  ROUTE_INVITE_NEW_PORTAL_USER,
  ROUTE_INVITE_NEW_TDR_USER,
  TDR_USERS,
  UNLOCK_PROFILE,
} from '@/utils/constants';
import { EllipsisOutlined } from '@ant-design/icons';
import Button from '@/components/ui/button/Button';
import styles from './PageHeader.module.css';
import User from '@/services/user';
import {
  preparePathname,
  showErrorNotification,
  typeCastQueryToString,
} from '@/utils/general';
import ArchiveUserProfileModal from '../../modals/archive-user-profile/ArchiveUserProfileModal';
import ToggleUserProfileLockModal from '../../modals/toggle-user-profile-lock/ToggleUserProfileLockModal';
import ResetPasswordModal from '../../modals/reset-password/ResetPasswordModal';
import { NEUTRAL_5 } from '@/utils/colors';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';

const tabItems = [
  { label: PORTAL_USERS, key: PORTAL_USERS },
  { label: TDR_USERS, key: TDR_USERS },
  { label: ARCHIVED_USERS, key: ARCHIVED_USERS },
];

const getDrowdownItems = (lokedUser?: boolean) => {
  const items = [
    { label: LOCK_PROFILE, key: LOCK_PROFILE },
    { label: ARCHIVE, key: ARCHIVE },
  ];

  if (lokedUser) {
    items[0] = { label: UNLOCK_PROFILE, key: UNLOCK_PROFILE };
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
  const [openArchiveUserModal, setOpenArchiveUserModal] =
    useState<boolean>(false);
  const [openToggleUserProfileLockModal, setOpenToggleUserProfileLockModal] =
    useState<boolean>(false);

  const { breadcrumbNameMap, selectedUser, getSelectedUser } =
    usePageHeaderContext();
  const router = useRouter();
  const { pathname } = router;
  const { id } = router.query;

  const onBackArrowClick = () => {
    const preparedPath = !id ? pathname : preparePathname(pathname, id);

    const pathSnippets = preparedPath.split('/').filter((i: string) => i);
    const url = `/${pathSnippets.slice(0, pathSnippets.length - 1).join('/')}`;

    router.push(url);
  };

  const onTabChange = useCallback(
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

  useEffect(() => {
    const preparedPath = id ? preparePathname(pathname, id) : pathname;

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
        <div style={{ paddingBottom: 16 }}>
          <Space>
            <Badge color={NEUTRAL_5} />
            <span>Logged out</span>
          </Space>
        </div>,
      );
    } else {
      setFooter(<Tabs onChange={onTabChange} items={tabItems} />);
    }
  }, [id, pathname, breadcrumbNameMap, onTabChange]);

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
    if (info.key === ARCHIVE) {
      setOpenArchiveUserModal(true);
    } else {
      setOpenToggleUserProfileLockModal(true);
    }
  };

  const onArchiveUserProfile = async () => {
    try {
      if (!id || isNaN(+id)) return;

      setLoading(true);

      const response = await User.archiveUserProfile(+id);
      getSelectedUser();
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err);
    } finally {
      setOpenArchiveUserModal(false);
      setLoading(false);
    }
  };

  const onCancelArchiveUser = () => {
    setOpenArchiveUserModal(false);
  };

  const archiveUserModalProps = {
    loading,
    open: openArchiveUserModal,
    onArchive: onArchiveUserProfile,
    onCancel: onCancelArchiveUser,
  };

  const onToggleUserProfileLock = async () => {
    try {
      if (!id || isNaN(+id)) return;

      setLoading(true);

      const response = await User.toggleUserProfileLock(+id);
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
              items: getDrowdownItems(selectedUser?.locked),
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
          <ArchiveUserProfileModal key="4" {...archiveUserModalProps} />,
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
