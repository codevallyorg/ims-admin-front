import { Modal } from 'antd';
import { FC } from 'react';
import { useRouter } from 'next/router';
import Button from '@/components/ui/button/Button';
import styles from './ResetPasswordModal.module.css';
import { useBreadcrumbContext } from '@/contexts/BreadcrumbProvider';
import { ROUTE_DASHBOARD_PORTAL_USERS } from '@/utils/constants';
import { poppins } from '@/utils/general';

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
        <Button key="back" disabled={loading} onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="submit" type="primary" loading={loading} onClick={onSend}>
          Send
        </Button>,
      ]}
    >
      <div className={styles.body}>
        {/* TODO - show correct email id */}
        <p>
          You are about to reset {userName}&apos;s password, a reset password
          link will be sent to email@email.com
        </p>

        <span>Would you like to proceed?</span>
      </div>
    </Modal>
  );
};

export default ResetPasswordModal;
