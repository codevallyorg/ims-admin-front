import { Form, Input } from 'antd';
import { FC, useEffect, useState } from 'react';

import Button from '@/components/ui/button/Button';
import FairPayLogo from '@/icons/FairPayLogo';
import styles from './UpdatePassword.module.css';
import { classNames } from '@/utils/general';
import { withLayout } from '@/components/layout/utils';
import Public from '@/components/layout/Public';
import { IUser } from '@/types/entities/IUser';
import Loader from '@/components/ui/loader/Loader';
import { useRouter } from 'next/router';
import User from '@/services/user';

type FormData = {
  password: string;
  confirmPassword: string;
};

const UpdatePassword: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUser>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!id || isNaN(+id)) return;

        setLoading(true);

        const user = await User.getUser(+id);

        setUser(user);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [id]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!user) return;

      setSubmitting(true);

      await User.updatePassword(user.id, data.password);
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.pageContainer}>
        <Loader />
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <div className={styles.logo}>
        <FairPayLogo height="66" width="220" />
      </div>

      <section className={styles.section}>
        <div className={classNames(styles.side, styles.leftSide)}>
          <span>Hey,</span>
          <span className={styles.username}>
            {`${user?.firstName} ${user?.lastName}`}
          </span>
          <span>This is FairPay Admin Portal!</span>
        </div>

        <div className={classNames(styles.side, styles.rightSide)}>
          <span>To login, you are required to reset your password.</span>

          <Form
            labelCol={{ lg: { span: 12 }, sm: { span: 6 } }}
            wrapperCol={{ lg: { span: 24 }, sm: { span: 12 } }}
            initialValues={{ remember: true }}
            autoComplete="off"
            onFinish={onSubmit}
            className={styles.form}
          >
            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please input your password!' },
              ]}
            >
              <Input.Password placeholder="Password" />
            </Form.Item>

            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: 'Please confirm your password!',
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords are not same!'));
                  },
                }),
              ]}
            >
              <Input.Password placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item className={styles.buttonContainer}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                Continue
              </Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </div>
  );
};

export default withLayout(UpdatePassword, Public);
