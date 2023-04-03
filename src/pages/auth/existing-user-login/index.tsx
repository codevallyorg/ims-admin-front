import { Form, Input, Space } from 'antd';
import { useRouter } from 'next/router';
import { FC, useState } from 'react';

import Public from '@/components/layout/Public';
import { withLayout } from '@/components/layout/utils';
import Button from '@/components/ui/button/Button';
import FairPayLogo from '@/icons/FairPayLogo';
import Auth from '@/services/auth';
import { LoginPayload } from '@/types/payloads/auth';
import { PRIMARY_BLUE } from '@/utils/colors';
import styles from './ExistingUserLogin.module.css';
import { useAuthContext } from '@/contexts/AuthProvider';

const ExistingUserLogin: FC = () => {
  const [loading, setLoading] = useState(false);

  const { getUser } = useAuthContext();

  const onSubmit = async (data: LoginPayload) => {
    try {
      setLoading(true);

      await Auth.login(data);

      getUser();
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.logo}>
        <FairPayLogo height="66" width="220" />
      </div>

      <section className={styles.section}>
        <div className={styles.infoText}>
          <span>Some more information about FairPay.</span>
        </div>

        <Form
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 14 }}
          initialValues={{ remember: true }}
          autoComplete="off"
          onFinish={onSubmit}
          className={styles.form}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Email is required!' }]}
          >
            <Input placeholder="Email" type="email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Password is required!' }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Form.Item
            wrapperCol={{ sm: { offset: 6, span: 14 } }}
            className={styles.buttonsContainer}
          >
            <Space>
              <Button disabled={loading}>Forgot Password</Button>

              <Button type="primary" htmlType="submit" loading={loading}>
                Login
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <div className={styles.footer}>
          <span style={{ color: PRIMARY_BLUE }}>
            Unable to login? Contact Support
          </span>
        </div>
      </section>
    </div>
  );
};

export default withLayout(ExistingUserLogin, Public);
