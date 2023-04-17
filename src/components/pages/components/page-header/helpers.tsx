import { Dispatch, SetStateAction } from 'react';
import User from '@/services/user';
import { IUser } from '@/types/entities/IUser';
import { showErrorNotification, showNotification } from '@/utils/general';
import { PRIMARY_BLUE } from '@/utils/colors';
import {
  LockOutlined,
  MailOutlined,
  SyncOutlined,
  UnlockOutlined,
  UserDeleteOutlined,
} from '@ant-design/icons';

type commonProps = {
  id: string | string[] | undefined;
  selectedUser: IUser | null;
  setLoading: Dispatch<SetStateAction<boolean>>;
  setOpenResetPasswordModal: Dispatch<SetStateAction<boolean>>;
  getSelectedUser: () => void;
  setOpenToggleArchiveUserModal: Dispatch<SetStateAction<boolean>>;
  setOpenToggleUserProfileLockModal: Dispatch<SetStateAction<boolean>>;
};

export const onSendResetPassword = async ({
  id,
  selectedUser,
  setLoading,
  setOpenResetPasswordModal,
}: commonProps) => {
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

export const onToggleArchiveUserProfile = async ({
  id,
  selectedUser,
  setLoading,
  getSelectedUser,
  setOpenToggleArchiveUserModal,
}: commonProps) => {
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

export const onToggleUserProfileLock = async ({
  id,
  selectedUser,
  setLoading,
  getSelectedUser,
  setOpenToggleUserProfileLockModal,
}: commonProps) => {
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
