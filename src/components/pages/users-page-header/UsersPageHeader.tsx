import { Dropdown, PageHeader, Tabs } from 'antd';
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
  ROUTE_USERS,
  TDR_USERS,
  USERS,
} from '@/utils/constants';
import { EllipsisOutlined } from '@ant-design/icons';
import Button from '@/components/ui/button/Button';
import styles from './UsersPageHeader.module.css';
import ResetPasswordModal from '../modals/reset-password/ResetPasswordModal';
import User from '@/services/user';
import { showErrorNotification, typeCastQuery } from '@/utils/general';
import { UserType } from '@/types/entities/IUser';
import ArchiveUserProfileModal from '../modals/archive-user-profile/ArchiveUserProfileModal';
import ToggleUserProfileLockModal, {
  UserProfileLockType,
} from '../modals/toggle-user-profile-lock/ToggleUserProfileLockModal';

const tabItems = [
  { label: PORTAL_USERS, key: PORTAL_USERS },
  { label: TDR_USERS, key: TDR_USERS },
  { label: ARCHIVED_USERS, key: ARCHIVED_USERS },
];

const dropdownItems = [
  { label: LOCK_PROFILE, key: LOCK_PROFILE },
  { label: ARCHIVE, key: ARCHIVE },
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

  const [loading, setLoading] = useState<boolean>(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] =
    useState<boolean>(false);
  const [openArchiveUserModal, setOpenArchiveUserModal] =
    useState<boolean>(false);
  const [openToggleUserProfileLockModal, setOpenToggleUserProfileLockModal] =
    useState<boolean>(false);

  const router = useRouter();
  const { id } = router.query;

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
        setFooter(<Tabs onChange={onTabChange} items={tabItems} />);
    }
  }, [router, onTabChange]);

  const onClickResetPassword = () => {
    setOpenResetPasswordModal(true);
  };

  const onClickEdit = () => {
    const preparedRoute = router.pathname
      .replace('[id]', typeCastQuery(router.query.id))
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
    userType: UserType.Portal,
    onArchive: onArchiveUserProfile,
    onCancel: onCancelArchiveUser,
  };

  const onToggleUserProfileLock = async () => {
    try {
      if (!id || isNaN(+id)) return;

      setLoading(true);

      const response = await User.toggleUserProfileLock(+id);
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
    actionType: UserProfileLockType.LOCK,
    onSubmit: onToggleUserProfileLock,
    onCancel: onCancelUserProfileLock,
  };

  return (
    <PageHeader
      className="site-page-header-responsive"
      style={{ padding: 0, marginTop: 6 }}
      onBack={title === USERS ? onBackArrowClick : undefined}
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
              items: dropdownItems,
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
    ></PageHeader>
  );
};

export default UsersPageHeader;
