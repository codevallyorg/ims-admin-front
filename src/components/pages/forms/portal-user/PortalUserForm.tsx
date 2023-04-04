import Button from '@/components/ui/button/Button';
import Role from '@/services/role';
import { RoleSelectOptions } from '@/types/entities/IRole';
import { IUser } from '@/types/entities/IUser';
import { InvitePortalUserPayload } from '@/types/payloads/user';
import { Form, Input, Select, Space } from 'antd';
import { FC, useEffect, useState } from 'react';

import styles from './PortalUserForm.module.css';

type PortalUserFormProps = {
  loading?: boolean;
  onSubmit?: (data: InvitePortalUserPayload) => void;
  readOnly?: boolean;
  defaultValues?: IUser;
};

const PortalUserForm: FC<PortalUserFormProps> = ({
  loading,
  readOnly,
  onSubmit,
  defaultValues,
}) => {
  const [roleSelectOptions, setRoleSelectOptions] = useState<
    RoleSelectOptions[]
  >([]);

  useEffect(() => {
    const loadRoleOptions = async () => {
      try {
        const roleOptions = await Role.getRoleSelectOptions();
        setRoleSelectOptions(roleOptions);
      } catch (err: any) {
        console.error(err);
      }
    };

    loadRoleOptions();
  }, []);

  return (
    <Form
      name="basic"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{
        remember: true,
        ...defaultValues,
      }}
      onFinish={onSubmit}
      autoComplete="off"
      className={styles.form}
    >
      <Form.Item
        label="First name"
        name="firstName"
        rules={[{ required: true, message: 'Please input your first name!' }]}
      >
        <Input readOnly={readOnly} placeholder="Enter the user's first name" />
      </Form.Item>

      <Form.Item
        label="Last name"
        name="lastName"
        rules={[{ required: true, message: 'Please input your last name!' }]}
      >
        <Input readOnly={readOnly} placeholder="Enter the user's last name" />
      </Form.Item>

      <Form.Item
        label="Email address"
        name="email"
        rules={[
          {
            required: true,
            message: 'Enter a valid IMS or FairPay email address',
          },
        ]}
      >
        <Input readOnly={readOnly} placeholder="sifiso@fairpay.co.za" />
      </Form.Item>

      <Form.Item
        label="Role"
        name="roleId"
        rules={[
          {
            required: true,
            message: 'Please assign a role for this user.',
          },
        ]}
      >
        <Select
          open={readOnly ? false : undefined}
          placeholder="Assign a role"
          options={roleSelectOptions}
        />
      </Form.Item>

      {!readOnly && (
        <Form.Item
          wrapperCol={{ sm: { offset: 8, span: 16 } }}
          className={styles.buttonsContainer}
        >
          <Space>
            <Button disabled={loading} htmlType="reset">
              Cancel
            </Button>

            <Button type="primary" htmlType="submit" loading={loading}>
              Save
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );
};

export default PortalUserForm;
