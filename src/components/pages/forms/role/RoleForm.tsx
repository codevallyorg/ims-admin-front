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
import {
  CreateRolePayload,
  EditRolePayload,
  RoleActionsPayload,
} from '@/types/payloads/role';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import { useForm } from 'antd/lib/form/Form';
import Loader from '@/components/ui/loader/Loader';
import Action from '@/services/action';
import {
  getCategorisedActions,
  showErrorNotification,
  showNotification,
  typeCastQueryToString,
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
};

const RoleForm: FC<RoleFormProps> = ({ readOnly }) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [roleSelectOptions, setRoleSelectOptions] = useState<
    RoleSelectOptions[]
  >([]);
  const [roleData, setRoleData] = useState<CreateRolePayload>();
  const [categorisedActions, setCategorisedActions] =
    useState<CategorisedActions>({});
  const [actionsPermitted, setActionsPermitted] = useState<
    Record<number, RoleActionsPayload | undefined>
  >({});

  const { selectedRole } = usePageHeaderContext();
  const router = useRouter();
  const { id, tab, filterByRole } = router.query;

  const [form] = useForm();

  const submitBtnRef = useRef<HTMLButtonElement>(null);
  const cancelBtnRef = useRef<HTMLButtonElement>(null);

  const { setRolePageHeaderBtnsClick } = usePageHeaderContext();

  const onSubmitCreate = useCallback(
    async (data: CreateRolePayload) => {
      try {
        const actions: RoleActionsPayload[] = [];

        for (const key in actionsPermitted) {
          if (actionsPermitted[key] === undefined) continue;

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
        router.push(ROUTE_ROLE_MANAGEMENT);

        const message = 'New Role Created';
        const description = `${data.name} was successfully created!`;
        const icon = <CheckCircleOutlined style={{ color: PRIMARY_BLUE }} />;

        showNotification({ message, description, icon });
      } catch (err: any) {
        console.error(err);
        showErrorNotification(err);
      }
    },
    [router, actionsPermitted],
  );

  const onSubmitEdit = useCallback(
    async (data: EditRolePayload) => {
      try {
        const actions: RoleActionsPayload[] = [];

        for (const key in actionsPermitted) {
          if (actionsPermitted[key] === undefined) continue;

          // @ts-ignore
          actions.push(actionsPermitted[key]);
        }

        data.RoleActions = actions;

        const roleId = typeCastQueryToString(id);

        const updatedRole = await Role.editRole(+roleId, data);

        if (!updatedRole?.createdAt) {
          throw new Error(
            'We were unable to save your New Role. Please try again.',
          );
        }
        router.push(ROUTE_ROLE_MANAGEMENT);

        const message = 'Role Updated';
        const description = `${data.name} was successfully updated!`;
        const icon = <CheckCircleOutlined style={{ color: PRIMARY_BLUE }} />;

        showNotification({ message, description, icon });
      } catch (err: any) {
        console.error(err);
        showErrorNotification(err);
      }
    },
    [router, id, actionsPermitted],
  );

  useEffect(() => {
    const resetFormData = () => {
      setRoleData(undefined);
      form.setFieldsValue({
        name: undefined,
        description: undefined,
        needsApprovalFrom: undefined,
      });
    };

    const onSave = async () => {
      setLoading(true);
      submitBtnRef.current?.click();

      await form.validateFields();

      if (roleData) {
        selectedRole ? onSubmitEdit(roleData) : onSubmitCreate(roleData);
      }

      setLoading(false);
    };

    const onCancel = () => {
      cancelBtnRef.current?.click();
      resetFormData();
    };

    setRolePageHeaderBtnsClick({ onSave, onCancel });
  }, [
    onSubmitCreate,
    onSubmitEdit,
    form,
    roleData,
    selectedRole,
    setRoleData,
    setRolePageHeaderBtnsClick,
  ]);

  useEffect(() => {
    if (tab) return;

    router.replace({ query: { ...router.query, tab: GENERAL } });
  }, [tab, router]);

  useEffect(() => {
    if (!tab || tab !== USERS || filterByRole === id) return;

    router.replace({ query: { ...router.query, filterByRole: id } });
  }, [tab, id, filterByRole, router]);

  useEffect(() => {
    if (!selectedRole || roleData) return;

    const { name, description, needsApprovalFrom, RoleActions } = selectedRole;

    const curRoleData: CreateRolePayload = {
      name,
      description,
      needsApprovalFrom,
    };

    const actionsPermitted: Record<number, RoleActionsPayload | undefined> = {};

    RoleActions?.forEach((action) => {
      actionsPermitted[action.actionId] = {
        actionId: action.actionId,
        needsApproval: action.needsApproval,
      };
    });

    setRoleData(curRoleData);
    setActionsPermitted(actionsPermitted);
    form.setFieldsValue(curRoleData);
  }, [selectedRole, roleData, form]);

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
        setLoading(true);

        const roleOptions = await Role.getRoleSelectOptions();
        setRoleSelectOptions(roleOptions);
      } catch (err: any) {
        console.error(err);
      } finally {
        setLoading(false);
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
