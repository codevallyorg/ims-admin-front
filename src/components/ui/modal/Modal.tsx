import { FC, ReactNode } from 'react';
import { Modal as ModalAntd } from 'antd';
import { poppins } from '@/utils/general';
import Button from '../button/Button';

type ModalProps = {
  open: boolean;
  loading: boolean;
  title: JSX.Element;
  onCancel: () => void;
  onSubmit: () => void;
  okButtonLabel: string;
  children: ReactNode;
  width?: string | number;
};

const Modal: FC<ModalProps> = ({
  open,
  loading,
  title,
  onCancel,
  onSubmit,
  okButtonLabel,
  children,
  width,
}) => {
  return (
    <ModalAntd
      style={poppins.style}
      open={open}
      title={title}
      onCancel={onCancel}
      width={width}
      footer={[
        <Button key="back" disabled={loading} onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={onSubmit}
        >
          {okButtonLabel}
        </Button>,
      ]}
    >
      {children}
    </ModalAntd>
  );
};

export default Modal;
