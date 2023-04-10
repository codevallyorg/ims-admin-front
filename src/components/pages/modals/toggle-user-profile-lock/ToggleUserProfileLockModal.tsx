import { Select } from 'antd';
import { FC } from 'react';

import styles from './ToggleUserProfileLockModal.module.css';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import Modal from '@/components/ui/modal/Modal';

export enum UserProfileLockType {
  LOCK = 'Lock',
  UNLOCK = 'Unlock',
}

type ToggleUserProfileLockModalProps = {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onSubmit: () => void;
};

const ToggleUserProfileLockModal: FC<ToggleUserProfileLockModalProps> = ({
  open,
  loading,
  onCancel,
  onSubmit,
}) => {
  const { selectedUser } = usePageHeaderContext();

  const actionType = selectedUser?.locked
    ? UserProfileLockType.UNLOCK
    : UserProfileLockType.LOCK;

  const modalTitle = <div>{actionType} User Profile</div>;

  return (
    <Modal
      open={open}
      loading={loading}
      title={modalTitle}
      onCancel={onCancel}
      onSubmit={onSubmit}
      okButtonLabel={actionType}
    >
      <div className={styles.body}>
        <p>
          Please select a reason for{' '}
          {selectedUser?.locked ? 'unlocking' : 'locking'}{' '}
          {selectedUser?.firstName} {selectedUser?.lastName}&apos;s profile.
        </p>

        <p>
          <Select placeholder="Select a reason" className={styles.select} />
        </p>

        <span>
          Once the profile has been locked, the user will be unable to access
          the FairPay Admin Portal.
        </span>
      </div>
    </Modal>
  );
};

export default ToggleUserProfileLockModal;
