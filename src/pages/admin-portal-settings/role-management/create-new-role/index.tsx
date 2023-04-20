import { FC, useCallback, useEffect, useState } from 'react';
import Permissions from '@/components/pages/components/permissions/Permissions';
import RoleForm from '@/components/pages/forms/role/RoleForm';
import Action from '@/services/action';
import { CategorisedActions } from '@/types/entities/IAction';
import {
  getCategorisedActions,
  showErrorNotification,
  showNotification,
} from '@/utils/general';
import { CreateRolePayload, RoleActions } from '@/types/payloads/role';
import Role from '@/services/role';
import { useRouter } from 'next/router';
import {
  defaultStyle,
  GENERAL,
  ROUTE_ROLE_MANAGEMENT,
} from '@/utils/constants';
import { CheckCircleOutlined } from '@ant-design/icons';
import { PRIMARY_BLUE } from '@/utils/colors';
import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import Loader from '@/components/ui/loader/Loader';

export const initialRole = {
  name: '',
  needsApprovalFrom: [],
};

const CreateNewRole: FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [createRoleData, setCreateRoleData] =
    useState<CreateRolePayload>(initialRole);
  const [categorisedActions, setCategorisedActions] =
    useState<CategorisedActions>({});
  const [actionsPermitted, setActionsPermitted] = useState<
    Record<number, RoleActions | undefined>
  >({});

  const router = useRouter();
  const { tab } = router.query;

  const onSubmit = useCallback(
    async (data: CreateRolePayload) => {
      try {
        const actions: RoleActions[] = [];

        for (const key in actionsPermitted) {
          if (actionsPermitted[key] === undefined) return;

          // @ts-ignore
          actions.push(actionsPermitted[key]);
        }

        data.actions = actions;

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
    if (tab) return;

    router.replace({ query: { ...router.query, tab: GENERAL } });
  }, [tab, router]);

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

    loadAllActions();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return tab === GENERAL ? (
    <div style={defaultStyle}>
      <RoleForm
        onSubmit={onSubmit}
        defaultValues={createRoleData}
        setCreateRoleData={setCreateRoleData}
      />
    </div>
  ) : (
    <Permissions
      categorisedActions={categorisedActions}
      actionsPermitted={actionsPermitted}
      setActionsPermitted={setActionsPermitted}
    />
  );
};

export default withLayout(CreateNewRole, Private);
