import { Button, Form, Input, Select } from 'antd';
import {
  Dispatch,
  FC,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from 'react';

import Role from '@/services/role';
import { RoleSelectOptions } from '@/types/entities/IRole';
import styles from './RoleForm.module.css';
import { CreateRolePayload } from '@/types/payloads/role';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import { useForm } from 'antd/lib/form/Form';
import { initialRole } from '@/pages/admin-portal-settings/role-management/create-new-role';

type RoleFormProps = {
  onSubmit?: (data: CreateRolePayload) => void;
  readOnly?: boolean;
  defaultValues: CreateRolePayload;
  setCreateRoleData?: Dispatch<SetStateAction<CreateRolePayload>>;
};

const RoleForm: FC<RoleFormProps> = ({
  readOnly,
  onSubmit,
  defaultValues,
  setCreateRoleData,
}) => {
  const [roleSelectOptions, setRoleSelectOptions] = useState<
    RoleSelectOptions[]
  >([]);

  const [form] = useForm();

  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  const { setRolePageHeaderBtnsClick } = usePageHeaderContext();

  useEffect(() => {
    const resetFormData = () => {
      setCreateRoleData && setCreateRoleData(initialRole);
      form.setFieldsValue(initialRole);
    };

    const onSave = async () => {
      submitBtnRef.current?.click();

      await form.validateFields();

      onSubmit && onSubmit(defaultValues);
      resetFormData();
    };

    const onCancel = () => {
      cancelBtnRef.current?.click();
      resetFormData();
    };

    setRolePageHeaderBtnsClick({ onSave, onCancel });
  }, [
    onSubmit,
    form,
    defaultValues,
    setCreateRoleData,
    setRolePageHeaderBtnsClick,
  ]);

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

  const formValuesChangeHandler = (changedValues: any) => {
    setCreateRoleData &&
      setCreateRoleData((curData) => ({ ...curData, ...changedValues }));
  };

  return (
    <Form
      name="basic"
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{
        remember: true,
        ...defaultValues,
      }}
      autoComplete="off"
      className={styles.form}
      onValuesChange={formValuesChangeHandler}
    >
      <Form.Item
        label="Set your Role name"
        name="name"
        rules={[{ required: true, message: 'Please input your role name!' }]}
      >
        <Input readOnly={readOnly} placeholder="Enter a name" />
      </Form.Item>

      <Form.Item label="Description" name="description">
        <Input readOnly={readOnly} placeholder="Enter a description" />
      </Form.Item>

      <Form.Item
        label="This Role needs approval from"
        name="needsApprovalFrom"
        rules={[
          {
            required: true,
            message: 'Select atleast one role',
          },
        ]}
      >
        <Select
          mode="multiple"
          maxTagCount="responsive"
          open={readOnly ? false : undefined}
          placeholder="Select a role"
          options={roleSelectOptions}
        />
      </Form.Item>

      <Form.Item
        wrapperCol={{ sm: { offset: 8, span: 16 } }}
        className={styles.buttonsContainer}
        style={{ display: 'none' }}
      >
        <Button ref={cancelBtnRef} htmlType="reset">
          Cancel
        </Button>

        <Button ref={submitBtnRef} htmlType="submit">
          Save
        </Button>
      </Form.Item>
    </Form>
  );
};

export default RoleForm;
