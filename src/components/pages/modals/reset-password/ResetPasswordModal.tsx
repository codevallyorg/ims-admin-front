import { FC } from 'react';
import Button from '@/components/ui/button/Button';
import styles from './ResetPasswordModal.module.css';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import Modal from '@/components/ui/modal/Modal';

type ResetPasswordModalProps = {
  open: boolean;
  loading: boolean;
  onCancel: () => void;
  onSend: () => void;
};

const modalTitle = <div>Reset Password</div>;

const ResetPasswordModal: FC<ResetPasswordModalProps> = ({
  open,
  loading,
  onCancel,
  onSend,
}) => {
  const { selectedUser } = usePageHeaderContext();

  return (
    <Modal
      open={open}
      loading={loading}
      title={modalTitle}
      onCancel={onCancel}
      onSubmit={onSend}
      okButtonLabel="Send"
    >
      <div className={styles.body}>
        <p>
          You are about to reset {selectedUser?.firstName}{' '}
          {selectedUser?.lastName}&apos;s password, a reset password link will
          be sent to {selectedUser?.email}
        </p>

        <span>Would you like to proceed?</span>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
