import { Select } from 'antd';
import { FC, useState } from 'react';

import styles from './ReassignUsersRoleModal.module.css';
import Modal from '@/components/ui/modal/Modal';
import { IUser } from '@/types/entities/IUser';
import { RoleOption } from '@/components/ui/table-toolbar/TableToolbar';

export type ReassignUsersRoleModalProps = {
  open: boolean;
  loading: boolean;
  selectedUsers: IUser[];
  roleOptions?: RoleOption[];
  onCancel: () => void;
  onSubmit: (selectedRole: RoleOption) => void;
};

const modalTitle = <div>Re-assign users role</div>;

const ReassignUsersRoleModal: FC<ReassignUsersRoleModalProps> = ({
  open,
  loading,
  selectedUsers,
  roleOptions,
  onCancel,
  onSubmit,
}) => {
  const [selectedRole, setSelectedRole] = useState<RoleOption>();

  const submitHandler = () => {
    if (!selectedRole) return;

    onSubmit(selectedRole);
    setSelectedRole(undefined);
  };

  const cancelHandler = () => {
    onCancel();
    setSelectedRole(undefined);
  };

  return (
    <Modal
      open={open}
      loading={loading}
      title={modalTitle}
      onCancel={cancelHandler}
      onSubmit={submitHandler}
      okButtonLabel="Assign Role"
      width={570}
    >
      <div className={styles.body}>
        <span>
          The following user profiles have been selected for re-assignment:
        </span>

        {selectedUsers.map((user) => (
          <div key={user.id}>
            {user.firstName} {user.lastName} ({user.role.name})
          </div>
        ))}

        <div className={styles.middleLine}>
          Select a user role to assign to these users
        </div>

        <Select
          placeholder="Select a role"
          value={selectedRole}
          className={styles.select}
          options={roleOptions}
          onChange={(_, option) =>
            !Array.isArray(option) && setSelectedRole(option)
          }
        />
      </div>
    </Modal>
  );
};

export default ReassignUsersRoleModal;
