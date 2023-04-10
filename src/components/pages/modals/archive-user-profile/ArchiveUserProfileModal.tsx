import { FC } from 'react';

import { poppins } from '@/utils/general';
import Button from '@/components/ui/button/Button';
import styles from './ArchiveUserProfileModal.module.css';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import Modal from '@/components/ui/modal/Modal';

type ArchiveUserProfileModalProps = {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onArchive: () => void;
};

const modalTitle = <div>Archive User Profile</div>;

const ArchiveUserProfileModal: FC<ArchiveUserProfileModalProps> = ({
  open,
  loading,
  onCancel,
  onArchive,
}) => {
  const { selectedUser } = usePageHeaderContext();

  return (
    <Modal
      open={open}
      title={modalTitle}
      onCancel={onCancel}
      loading={loading}
      onSubmit={onArchive}
      okButtonLabel="Archive"
    >
      <div className={styles.body}>
        <p>
          You are about to archive {selectedUser?.firstName}{' '}
          {selectedUser?.lastName}&apos;s {selectedUser?.type} User Profile.
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

export default ArchiveUserProfileModal;
