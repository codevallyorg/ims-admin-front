import { Form, Input } from 'antd';
import { FC } from 'react';

import Public from '@/components/layout/Public';
import { withLayout } from '@/components/layout/utils';
import Button from '@/components/ui/button/Button';
import FairPayLogo from '@/icons/FairPayLogo';
import { classNames } from '@/utils/general';
import styles from './NewUserLogin.module.css';

const NewUserLogin: FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.logo}>
        <FairPayLogo height="66" width="220" />
      </div>

      <section className={styles.section}>
        <div className={classNames(styles.side, styles.leftSide)}>
          <span>Welcome,</span>
          <span className={styles.username}>Mpho Musa</span>
          <span>To the FairPay Admin Portal!</span>
        </div>

        <div className={classNames(styles.side, styles.rightSide)}>
          <span>
            To start your journey, we require to set up your password.
          </span>

          <Form
            labelCol={{ lg: { span: 12 }, sm: { span: 6 } }}
            wrapperCol={{ lg: { span: 24 }, sm: { span: 12 } }}
            initialValues={{ remember: true }}
            autoComplete="off"
            className={styles.form}
          >
            <Form.Item label="Password" name="password">
              <Input placeholder="Password" />
            </Form.Item>

            <Form.Item label="Confirm Password" name="confirmPassword">
              <Input placeholder="Confirm Password" />
            </Form.Item>

            <Form.Item>
              <Button type="primary">Continue</Button>
            </Form.Item>
          </Form>
        </div>
      </section>
    </div>
  );
};

export default withLayout(NewUserLogin, Public);
