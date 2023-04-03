import { Form, Input, Select, Space } from 'antd';
import { FC, useEffect, useState } from 'react';

import { RoleSelectOptions } from '@/types/entities/IRole';
import Button from '@/components/ui/button/Button';
import styles from './InviteNewPortalUser.module.css';
import Role from '@/services/role';
import { InvitePortalUserPayload } from '@/types/payloads/user';
import User from '@/services/user';
import { useRouter } from 'next/router';
import { ROUTE_DASHBOARD_PORTAL_USERS } from '@/utils/constants';
import { withLayout } from '@/components/layout/utils';
import Private from '@/components/layout/Private';

const InviteNewPortalUser: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [roleSelectOptions, setRoleSelectOptions] = useState<
    RoleSelectOptions[]
  >([]);

  const router = useRouter();

  const onSubmit = async (data: InvitePortalUserPayload) => {
    try {
      setLoading(true);

      await User.invitePortalUser(data);

      router.push(ROUTE_DASHBOARD_PORTAL_USERS);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
      initialValues={{ remember: true }}
      onFinish={onSubmit}
      autoComplete="off"
      className={styles.form}
    >
      <Form.Item
        label="First name"
        name="firstName"
        rules={[{ required: true, message: 'Please input your first name!' }]}
      >
        <Input placeholder="Enter the user's first name" />
      </Form.Item>

      <Form.Item
        label="Last name"
        name="lastName"
        rules={[{ required: true, message: 'Please input your last name!' }]}
      >
        <Input placeholder="Enter the user's last name" />
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
        <Input placeholder="sifiso@fairpay.co.za" />
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
        <Select placeholder="Assign a role" options={roleSelectOptions} />
      </Form.Item>

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
    </Form>
  );
};

export default withLayout(InviteNewPortalUser, Private);
