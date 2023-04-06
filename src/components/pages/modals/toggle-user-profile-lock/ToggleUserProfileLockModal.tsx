import { Modal, Select } from 'antd';
import { FC } from 'react';
import { useRouter } from 'next/router';

import { poppins } from '@/utils/general';
import Button from '@/components/ui/button/Button';
import styles from './ToggleUserProfileLockModal.module.css';
import { useBreadcrumbContext } from '@/contexts/BreadcrumbProvider';
import { ROUTE_DASHBOARD_PORTAL_USERS } from '@/utils/constants';

export enum UserProfileLockType {
  LOCK = 'Lock',
  UNLOCK = 'Unlock',
}

type ToggleUserProfileLockModalProps = {
  open: boolean;
  loading: boolean;
  actionType: UserProfileLockType;
  onCancel: () => void;
  onSubmit: () => void;
};

const modalTitle = <div>Archive User Profile</div>;

const ToggleUserProfileLockModal: FC<ToggleUserProfileLockModalProps> = ({
  open,
  loading,
  actionType,
  onCancel,
  onSubmit,
}) => {
  const router = useRouter();
  const { breadcrumbNameMap } = useBreadcrumbContext();

  // TODO - include ROUTE for TDR USERS
  const userName =
    breadcrumbNameMap[`${ROUTE_DASHBOARD_PORTAL_USERS}/${router.query.id}`];

  return (
    <Modal
      style={poppins.style}
      open={open}
      title={modalTitle}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onSubmit}
        >
          {actionType}
        </Button>,
      ]}
    >
      <div className={styles.body}>
        <p>
          Please select a reason for{' '}
          {actionType === UserProfileLockType.LOCK ? 'locking' : 'unlocking'}{' '}
          {userName}&apos;s profile.
        </p>

        <p>
          <Select placeholder="Select a reason" />
        </p>

        <span>
          Once the profile has been archived, the user will be unable to access
          the FairPay Admin Portal.
        </span>
      </div>
    </Modal>
  );
};

export default ToggleUserProfileLockModal;
