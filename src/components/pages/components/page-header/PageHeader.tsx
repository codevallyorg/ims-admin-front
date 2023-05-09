import {
  Badge,
  Dropdown,
  PageHeader as PageHeaderAntd,
  Space,
  Tabs,
} from 'antd';
import { useRouter } from 'next/router';
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';

import {
  ARCHIVED_USERS,
  ASSIGNED_AGENTS,
  CARD_STOCK,
  CREATE_NEW_ROLE,
  EDIT_ROLE,
  EDIT_USER_PROFILE,
  GENERAL,
  INVITE_NEW_PORTAL_USER,
  INVITE_NEW_TDR_USER,
  PERMISSIONS,
  PORTAL_USERS,
  PROFILE,
  ROLE_MANAGEMENT,
  ROUTE_DASHBOARD_ARCHIVED_USERS,
  ROUTE_DASHBOARD_PORTAL_USERS,
  ROUTE_DASHBOARD_TDR_USERS,
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
  onArchiveRole,
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
import ArchiveRoleModal from '../../modals/archive-role/ArchiveRoleModal';
import { UserType } from '@/types/entities/IUser';
import { useAuthContext } from '@/contexts/AuthProvider';
import {
  ActionCategory,
  ActionName,
  ActionSubject,
} from '@/types/entities/IAction';
import { RoleEnum } from '@/types/entities/IRole';

const inviteFooter = (
  <div style={{ paddingBottom: 14 }}>
    The new user will receive an invitation email with instructions on how to
    create their account and access the portal.
  </div>
);

const PageHeader: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [footer, setFooter] = useState<ReactNode>();
  const [buttonsOnRight, setButtonsOnRight] = useState<ReactNode[]>();

  const [loading, setLoading] = useState<boolean>(false);
  const [openResetPasswordModal, setOpenResetPasswordModal] =
    useState<boolean>(false);
  const [openToggleArchiveUserModal, setOpenToggleArchiveUserModal] =
    useState<boolean>(false);
  const [openToggleUserProfileLockModal, setOpenToggleUserProfileLockModal] =
    useState<boolean>(false);
  const [openArchiveRoleModal, setOpenArchiveRoleModal] =
    useState<boolean>(false);

  const {
    breadcrumbNameMap,
    selectedUser,
    getSelectedUser,
    selectedRole,
    rolePageHeaderBtnsClick,
  } = usePageHeaderContext();
  const { roleActionsMap } = useAuthContext();
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

  const onClickEdit = useCallback(() => {
    const preparedRoute = router.pathname.replace(
      '[id]',
      typeCastQueryToString(router.query.id),
    );

    const endpoint = preparedRoute.includes(ROUTE_ROLE_MANAGEMENT)
      ? 'edit-role'
      : 'edit-user-profile';

    router.push(`${preparedRoute}/${endpoint}`);
  }, [router]);

  const onClickDropdownItem = (info: any) => {
    if (+info.key === 0) {
      setOpenToggleUserProfileLockModal(true);
    } else {
      setOpenToggleArchiveUserModal(true);
    }
  };

  const commonArgs = useMemo(
    () => ({
      id,
      selectedUser,
      selectedRole,
      router,
      setLoading,
      setOpenResetPasswordModal,
      getSelectedUser,
      setOpenToggleArchiveUserModal,
      setOpenToggleUserProfileLockModal,
      setOpenArchiveRoleModal,
    }),
    [id, selectedUser, selectedRole, router, getSelectedUser],
  );

  const resetPasswordModalProps = useMemo(
    () => ({
      loading,
      open: openResetPasswordModal,
      onSend: onSendResetPassword.bind(this, commonArgs),
      onCancel: () => setOpenResetPasswordModal(false),
    }),
    [commonArgs, loading, openResetPasswordModal],
  );

  const toggleArchiveUserModalProps = useMemo(
    () => ({
      loading,
      open: openToggleArchiveUserModal,
      onArchive: onToggleArchiveUserProfile.bind(this, commonArgs),
      onCancel: () => setOpenToggleArchiveUserModal(false),
    }),
    [commonArgs, loading, openToggleArchiveUserModal],
  );

  const toggleUserProfileLockModalProps = useMemo(
    () => ({
      loading,
      open: openToggleUserProfileLockModal,
      onSubmit: onToggleUserProfileLock.bind(this, commonArgs),
      onCancel: () => setOpenToggleUserProfileLockModal(false),
    }),
    [commonArgs, loading, openToggleUserProfileLockModal],
  );

  const archiveRoleModalProps = useMemo(
    () => ({
      loading,
      roleName: selectedRole ? selectedRole.name : '',
      open: openArchiveRoleModal,
      onSubmit: onArchiveRole.bind(this, commonArgs),
      onCancel: () => setOpenArchiveRoleModal(false),
    }),
    [commonArgs, loading, selectedRole, openArchiveRoleModal],
  );

  useEffect(() => {
    const preparedPath = id ? preparePathname(pathname, id) : pathname;

    const title = breadcrumbNameMap[preparedPath];

    setTitle(title);
  }, [id, breadcrumbNameMap, pathname]);

  useEffect(() => {
    const isUsersDashboardPage = [
      PORTAL_USERS,
      TDR_USERS,
      ARCHIVED_USERS,
    ].includes(title);
    const isInviteNewUserPage = [
      INVITE_NEW_TDR_USER,
      INVITE_NEW_PORTAL_USER,
    ].includes(title);
    const isEditUserPage = title === EDIT_USER_PROFILE;
    const isViewUserPage =
      title === `${selectedUser?.firstName} ${selectedUser?.lastName}`;
    const isRoleManagementPage = title === ROLE_MANAGEMENT;
    const isCreateNewRolePage = title === CREATE_NEW_ROLE;
    const isViewRolePage = title === selectedRole?.name;
    const isEditRolePage = title === EDIT_ROLE;

    const defaultUsersTab = title;
    const defaultTDRUserTab = typeCastQueryToString(tab) || PROFILE;

    let buttonsOnRight;
    let footer;

    if (isUsersDashboardPage) {
      footer = (
        <Tabs
          activeKey={defaultUsersTab}
          onChange={onUsersTabChange}
          items={usersTabItems}
        />
      );
    } else if (isInviteNewUserPage) {
      footer = inviteFooter;
    } else if (isEditUserPage || isRoleManagementPage) {
      footer = <div style={{ paddingBottom: 1 }} />;
    } else if (isViewUserPage) {
      const actionCategory =
        selectedUser?.type === UserType.Portal
          ? ActionCategory.PortalUsers
          : ActionCategory.TDRUsers;

      const resetPasswordActionKey = `${actionCategory}${ActionSubject.Profile}${ActionName.ResetPassword}`;
      const editActionKey = `${actionCategory}${ActionSubject.Profile}${ActionName.Update}`;

      const dropdownMenuItems = getDrowdownItems(selectedUser, roleActionsMap);

      buttonsOnRight = [
        roleActionsMap[editActionKey] ? (
          <Button key="0" onClick={onClickEdit}>
            Edit
          </Button>
        ) : undefined,
        roleActionsMap[resetPasswordActionKey] ? (
          <Button key="1" onClick={() => setOpenResetPasswordModal(true)}>
            Reset Password
          </Button>
        ) : undefined,
        dropdownMenuItems.length ? (
          <Dropdown
            key="2"
            menu={{
              items: dropdownMenuItems,
              onClick: onClickDropdownItem,
            }}
            placement="bottomRight"
            trigger={['click']}
            overlayStyle={{ width: 120 }}
          >
            <Button className={styles.ellipsisButton}>
              <EllipsisOutlined />
            </Button>
          </Dropdown>
        ) : undefined,
        <ResetPasswordModal key="3" {...resetPasswordModalProps} />,
        <ToggleArchiveUserProfileModal
          key="4"
          {...toggleArchiveUserModalProps}
        />,
        <ToggleUserProfileLockModal
          key="5"
          {...toggleUserProfileLockModalProps}
        />,
      ];
      // TODO - add last audit log of the selected user
      footer = (
        <>
          <div style={{ paddingBottom: 12 }}>
            <Space>
              <Badge color={NEUTRAL_5} />
              <span>Logged out</span>
            </Space>
          </div>

          {selectedUser?.type === UserType.TDR ? (
            <Tabs
              activeKey={defaultTDRUserTab}
              onChange={onTDRUserTabChange}
              items={tdrUserTabItems}
            />
          ) : (
            <div style={{ paddingBottom: 4 }} />
          )}
        </>
      );
    } else if (isViewRolePage) {
      if (selectedRole?.name !== RoleEnum.SuperAdmin)
        buttonsOnRight = [
          <Button key="0" onClick={onClickEdit}>
            Edit
          </Button>,
          <Button key="1" onClick={() => setOpenArchiveRoleModal(true)}>
            Archive
          </Button>,
          <ArchiveRoleModal key="2" {...archiveRoleModalProps} />,
        ];
      footer = (
        <Tabs
          activeKey={typeCastQueryToString(tab)}
          items={viewRoleTabItems}
          onChange={onRoleTabChange}
        />
      );
    } else if (isCreateNewRolePage || isEditRolePage) {
      buttonsOnRight = [
        <Button key="0" onClick={rolePageHeaderBtnsClick.onCancel}>
          Cancel
        </Button>,
        <Button key="1" type="primary" onClick={rolePageHeaderBtnsClick.onSave}>
          Save
        </Button>,
      ];
      footer = (
        <Tabs
          activeKey={typeCastQueryToString(tab)}
          items={[viewRoleTabItems[0], viewRoleTabItems[2]]}
          onChange={onRoleTabChange}
        />
      );
    }

    setButtonsOnRight(buttonsOnRight);
    setFooter(footer);
  }, [
    tab,
    selectedUser,
    selectedRole,
    title,
    onUsersTabChange,
    onTDRUserTabChange,
    onRoleTabChange,
    archiveRoleModalProps,
    resetPasswordModalProps,
    toggleArchiveUserModalProps,
    toggleUserProfileLockModalProps,
    onClickEdit,
    rolePageHeaderBtnsClick,
    roleActionsMap,
  ]);

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
      extra={buttonsOnRight}
    ></PageHeaderAntd>
  );
};

export default PageHeader;
