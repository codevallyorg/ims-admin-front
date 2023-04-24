import { FC } from 'react';

import styles from './ArchiveRoleModal.module.css';
import Modal from '@/components/ui/modal/Modal';

export type ArchiveRoleModalProps = {
  open: boolean;
  loading: boolean;
  roleName: string;
  onCancel: () => void;
  onSubmit: () => void;
};

const modalTitle = <div>Archive Role</div>;

const ArchiveRoleModal: FC<ArchiveRoleModalProps> = ({
  open,
  loading,
  roleName,
  onCancel,
  onSubmit,
}) => {
  return (
    <Modal
      open={open}
      loading={loading}
      title={modalTitle}
      onCancel={onCancel}
      onSubmit={onSubmit}
      okButtonLabel="Archive"
      width={570}
    >
      <div className={styles.body}>
        <p>You are about to archive the role {roleName}</p>

        <p>Once the role has been archived, the process cannot be reversed.</p>

        <div>Would you like to proceed?</div>
      </div>
    </Modal>
  );
};

export default ArchiveRoleModal;
