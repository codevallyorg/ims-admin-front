import { Form, Input, Select, Space } from 'antd';
import { FC, useEffect, useState } from 'react';
import { MaskedInput, IMask } from 'antd-mask-input';

import Button from '@/components/ui/button/Button';
import Role from '@/services/role';
import { RoleSelectOptions } from '@/types/entities/IRole';
import { IUser } from '@/types/entities/IUser';
import { InviteTDRUserPayload } from '@/types/payloads/user';
import styles from './TDRUserForm.module.css';

type TDRUserFormProps = {
  loading?: boolean;
  onSubmit?: (data: InviteTDRUserPayload) => void;
  readOnly?: boolean;
  defaultValues?: IUser;
};

const applyMask = (mobile: string = '') => {
  let maskedMobile = mobile;

  if (mobile.length === 4) {
    maskedMobile = mobile.substring(0, 3) + ' ' + mobile.charAt(3);
  }

  if (mobile.length === 8) {
    maskedMobile = mobile.substring(0, 7) + ' ' + mobile.charAt(7);
  }

  return maskedMobile;
};

const TDRUserForm: FC<TDRUserFormProps> = ({
  loading,
  readOnly,
  onSubmit,
  defaultValues,
}) => {
  const [roleSelectOptions, setRoleSelectOptions] = useState<
    RoleSelectOptions[]
  >([]);

  const tdrDefaultData = {
    ...defaultValues,
    idNumber: defaultValues?.tdrProfile?.idNumber,
    nationality: defaultValues?.tdrProfile?.nationality,
    location: defaultValues?.tdrProfile?.location,
    mobile: defaultValues?.tdrProfile?.mobile,
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
      initialValues={{
        remember: true,
        ...tdrDefaultData,
      }}
      onFinish={(data) => console.log(data)}
      autoComplete="off"
      className={styles.form}
    >
      <Form.Item
        label="First name"
        name="firstName"
        rules={[{ required: true, message: 'Please input your first name' }]}
      >
        <Input readOnly={readOnly} placeholder="Enter the user's first name" />
      </Form.Item>

      <Form.Item
        label="Last name"
        name="lastName"
        rules={[{ required: true, message: 'Please input your last name' }]}
      >
        <Input readOnly={readOnly} placeholder="Enter the user's last name" />
      </Form.Item>

      <Form.Item
        label="Mobile number"
        name="mobile"
        rules={[
          {
            required: true,
            message: 'Please enter a valid 10 digit mobile number',
          },
          () => ({
            validator(_, value) {
              const enteredNumber = value.split(' ').join('');

              if (
                !enteredNumber ||
                (!isNaN(enteredNumber) && `${enteredNumber}`.length === 10)
              ) {
                return Promise.resolve();
              }

              return Promise.reject(
                new Error('Please enter a valid 10 digit mobile number'),
              );
            },
          }),
        ]}
      >
        {/* <Input
          id="mobileInput"
          readOnly={readOnly}
          placeholder="012 345 6789"
        /> */}
        <MaskedInput
          id="mobileInput"
          readOnly={readOnly}
          mask={'000 000 0000'}
          placeholder="012 345 6789"
          maskOptions={{
            placeholderChar: ' ',
            // prepare: (value) => {
            //   console.log(value);
            //   return value;
            // },
            validate: (value, mask) => {
              return true;
            },
          }}
        />
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

      <Form.Item label="Location" name="location">
        <Input readOnly={readOnly} placeholder="Goodwood" />
      </Form.Item>

      <Form.Item label="Nationality" name="nationality">
        <Select
          open={readOnly ? false : undefined}
          placeholder="Select a country"
          options={[]}
        />
      </Form.Item>

      <Form.Item label="ID number" name="idNumber">
        <Input readOnly={readOnly} placeholder="A1098910092" />
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

export default TDRUserForm;
