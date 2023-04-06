import { Modal } from 'antd';
import { FC } from 'react';

import { UserType } from '@/types/entities/IUser';
import { poppins } from '@/utils/general';
import Button from '@/components/ui/button/Button';
import styles from './ArchiveUserProfile.module.css';
import { useRouter } from 'next/router';
import { useBreadcrumbContext } from '@/contexts/BreadcrumbProvider';
import { ROUTE_DASHBOARD_PORTAL_USERS } from '@/utils/constants';

type ArchiveUserProfileProps = {
  open: boolean;
  loading: boolean;
  userType: UserType;
  onCancel: () => void;
  onArchive: () => void;
};

const modalTitle = <div>Archive User Profile</div>;

const ArchiveUserProfile: FC<ArchiveUserProfileProps> = ({
  open,
  loading,
  userType,
  onCancel,
  onArchive,
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
          onClick={onArchive}
        >
          Archive
        </Button>,
      ]}
    >
      <div className={styles.body}>
        <p>
          You are about to archive {userName}&apos;s {userType} User Profile.
        </p>

        <p>
          Once the profile has been archived, the process cannot be reversed and
          the user will be unable to access the FairPay admin portal.
        </p>

        <span>Would you like to proceed?</span>
      </div>
    </Modal>
  );
};

export default ArchiveUserProfile;