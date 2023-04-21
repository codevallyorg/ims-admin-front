import { Button, Form, Input, Select, Tag } from 'antd';
import {
  Dispatch,
  FC,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { RoleSelectOptions } from '@/types/entities/IRole';
import styles from './RoleForm.module.css';
import { CreateRolePayload, RoleActionsPayload } from '@/types/payloads/role';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import { useForm } from 'antd/lib/form/Form';
import Loader from '@/components/ui/loader/Loader';
import Action from '@/services/action';
import {
  getCategorisedActions,
  showErrorNotification,
  showNotification,
} from '@/utils/general';
import Role from '@/services/role';
import {
  defaultStyle,
  GENERAL,
  ROUTE_ROLE_MANAGEMENT,
  USERS,
} from '@/utils/constants';
import { CheckCircleOutlined } from '@ant-design/icons';
import { PRIMARY_BLUE } from '@/utils/colors';
import { useRouter } from 'next/router';
import { CategorisedActions } from '@/types/entities/IAction';
import Permissions from '../../components/permissions/Permissions';
import UsersTable from '../../components/users-table/UsersTable';

type RoleFormProps = {
  readOnly?: boolean;
  defaultValues?: CreateRolePayload;
};

const RoleForm: FC<RoleFormProps> = ({ readOnly, defaultValues }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [roleSelectOptions, setRoleSelectOptions] = useState<
    RoleSelectOptions[]
  >([]);
  const [roleData, setRoleData] = useState<CreateRolePayload | undefined>(
    defaultValues,
  );
  const [categorisedActions, setCategorisedActions] =
    useState<CategorisedActions>({});
  const [actionsPermitted, setActionsPermitted] = useState<
    Record<number, RoleActionsPayload | undefined>
  >({});

  const router = useRouter();
  const { id, tab, filterByRole } = router.query;

  const [form] = useForm();

  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  const { setRolePageHeaderBtnsClick } = usePageHeaderContext();

  const onSubmit = useCallback(
    async (data: CreateRolePayload) => {
      try {
        const actions: RoleActionsPayload[] = [];

        for (const key in actionsPermitted) {
          if (actionsPermitted[key] === undefined) return;

          // @ts-ignore
          actions.push(actionsPermitted[key]);
        }

        data.RoleActions = actions;

        const newRole = await Role.createRole(data);

        if (!newRole?.createdAt) {
          throw new Error(
            'We were unable to save your New Role. Please try again.',
          );
        }

        const message = 'New Role Created';
        const description = `${data.name} was successfully created!`;
        const icon = <CheckCircleOutlined style={{ color: PRIMARY_BLUE }} />;

        showNotification({ message, description, icon });
        router.push(ROUTE_ROLE_MANAGEMENT);
      } catch (err: any) {
        console.error(err);
        showErrorNotification(err);
      }
    },
    [router, actionsPermitted],
  );

  useEffect(() => {
    const resetFormData = () => {
      setRoleData(undefined);
      form.setFieldsValue(undefined);
    };

    const onSave = async () => {
      submitBtnRef.current?.click();

      await form.validateFields();

      roleData && onSubmit(roleData);
      resetFormData();
    };

    const onCancel = () => {
      cancelBtnRef.current?.click();
      resetFormData();
    };

    setRolePageHeaderBtnsClick({ onSave, onCancel });
  }, [onSubmit, form, roleData, setRoleData, setRolePageHeaderBtnsClick]);

  useEffect(() => {
    if (tab) return;

    router.replace({ query: { ...router.query, tab: GENERAL } });
  }, [tab, router]);

  useEffect(() => {
    if (!tab || tab !== USERS || filterByRole === id) return;

    router.replace({ query: { ...router.query, filterByRole: id } });
  }, [tab, id, filterByRole, router]);

  useEffect(() => {
    setRoleData(defaultValues);

    const actionsPermitted: Record<number, RoleActionsPayload | undefined> = {};

    defaultValues?.RoleActions?.map(
      (action) => (actionsPermitted[action.actionId] = action),
    );

    setActionsPermitted(actionsPermitted);

    form.setFieldsValue(defaultValues);
  }, [defaultValues, form]);

  useEffect(() => {
    const loadAllActions = async () => {
      try {
        setLoading(true);
        const actions = await Action.getAllActions();

        const categorisedActions = getCategorisedActions(actions);

        setCategorisedActions(categorisedActions);
      } catch (err: any) {
        console.error(err);
        showErrorNotification(err);
      } finally {
        setLoading(false);
      }
    };

    const loadRoleOptions = async () => {
      try {
        const roleOptions = await Role.getRoleSelectOptions();
        setRoleSelectOptions(roleOptions);
      } catch (err: any) {
        console.error(err);
      }
    };

    loadAllActions();
    loadRoleOptions();
  }, []);

  const formValuesChangeHandler = (changedValues: any) => {
    setRoleData((curData) => ({ ...curData, ...changedValues }));
  };

  if (loading) {
    return <Loader />;
  }

  return tab === GENERAL ? (
    <div style={defaultStyle}>
      <Form
        name="basic"
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={{
          remember: true,
          ...roleData,
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
            tagRender={
              readOnly
                ? (props) => <Tag closable={false}>{props.label}</Tag>
                : undefined
            }
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
    </div>
  ) : tab === USERS ? (
    <div style={defaultStyle}>
      <UsersTable isViewRole />
    </div>
  ) : (
    <Permissions
      readOnly={readOnly}
      categorisedActions={categorisedActions}
      actionsPermitted={actionsPermitted}
      setActionsPermitted={setActionsPermitted}
    />
  );
};

export default RoleForm;
