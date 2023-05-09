import { Form, Input } from 'antd';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import Public from '@/components/layout/Public';
import { withLayout } from '@/components/layout/utils';
import Button from '@/components/ui/button/Button';
import FairPayLogo from '@/icons/FairPayLogo';
import { classNames, showErrorNotification } from '@/utils/general';
import styles from './NewUserLogin.module.css';
import Loader from '@/components/ui/loader/Loader';
import { IUser } from '@/types/entities/IUser';
import { ROUTE_EXISTING_USER_LOGIN } from '@/utils/constants';
import Auth from '@/services/auth';
import { useAuthContext } from '@/contexts/AuthProvider';

type FormData = {
  password: string;
  confirmPassword: string;
};

type NewUserLoginProps = {
  isResetPassword?: boolean;
};

const NewUserLogin: FC<NewUserLoginProps> = ({ isResetPassword }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<IUser>();
  const [submitting, setSubmitting] = useState<boolean>(false);

  const { getUserWithRole } = useAuthContext();
  const router = useRouter();
  const { token } = router.query;

  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (!token || typeof token !== 'string') {
          router.replace(ROUTE_EXISTING_USER_LOGIN);
          return;
        }

        setLoading(true);

        const user = await Auth.getInvitedUser(token);

        setUser(user);
      } catch (err: any) {
        console.error(err);
        showErrorNotification(err);
        router.replace(ROUTE_EXISTING_USER_LOGIN);
      } finally {
        setLoading(false);
      }
    };

    router.isReady && loadUserData();
  }, [router, token]);

  const onSubmit = async (data: FormData) => {
    try {
      if (!user || !token || typeof token !== 'string') return;

      setSubmitting(true);

      const payload = {
        token,
        password: data.password,
        password_confirm: data.confirmPassword,
      };

      await Auth.newUserLogin(payload);
      getUserWithRole();
    } catch (err: any) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  let pageText = {
    greeting: 'Welcome,',
    bio: 'To the FairPay Admin Portal!',
    formTitle: 'To start your journey, we require to set up your password.',
  };

  if (isResetPassword) {
    pageText = {
      greeting: 'Hey,',
      bio: 'This is FairPay Admin Portal!',
      formTitle: 'To login, you are required to reset your password.',
    };
  }

  if (loading || !user) {
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
          <span>{pageText.greeting}</span>
          <span
            className={styles.username}
          >{`${user?.firstName} ${user?.lastName}`}</span>
          <span>{pageText.bio}</span>
        </div>

        <div className={classNames(styles.side, styles.rightSide)}>
          <span>{pageText.formTitle}</span>

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
                () => ({
                  validator(_, value) {
                    if (!value || value.length >= 8) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error('Password must have atleast 8 characters.'),
                    );
                  },
                }),
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

export default withLayout(NewUserLogin, Public);
