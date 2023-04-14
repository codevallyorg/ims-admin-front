import { FC } from 'react';

import styles from './ToggleArchiveUserProfileModal.module.css';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import Modal from '@/components/ui/modal/Modal';
import { ARCHIVE, UNARCHIVE } from '@/utils/constants';

type ToggleArchiveUserProfileModalProps = {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onArchive: () => void;
};

const ToggleArchiveUserProfileModal: FC<ToggleArchiveUserProfileModalProps> = ({
  open,
  loading,
  onCancel,
  onArchive,
}) => {
  const { selectedUser } = usePageHeaderContext();

  const actionType = selectedUser?.archived ? UNARCHIVE : ARCHIVE;

  const modalTitle = (
    <div>{selectedUser?.archived ? UNARCHIVE : ARCHIVE} User Profile</div>
  );

  return (
    <Modal
      open={open}
      title={modalTitle}
      onCancel={onCancel}
      loading={loading}
      onSubmit={onArchive}
      okButtonLabel={actionType}
    >
      <div className={styles.body}>
        <p>
          You are about to {selectedUser?.archived ? 'unarchive' : 'archive'}{' '}
          {selectedUser?.firstName} {selectedUser?.lastName}&apos;s{' '}
          {selectedUser?.type} User Profile.
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

export default ToggleArchiveUserProfileModal;
