import { FC, useEffect, useState } from 'react';
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
import { GENERAL } from '@/utils/constants';
import { CheckCircleOutlined } from '@ant-design/icons';
import { PRIMARY_BLUE } from '@/utils/colors';

const CreateNewRole: FC = () => {
  const [categorisedActions, setCategorisedActions] =
    useState<CategorisedActions>({});
  const [actionsPermitted, setActionsPermitted] = useState<
    Record<number, RoleActions | undefined>
  >({});

  const router = useRouter();
  const { tab } = router.query;

  const onSubmit = async (data: CreateRolePayload) => {
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
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err);
    }
  };

  useEffect(() => {
    if (tab) return;

    router.replace({ query: { ...router.query, tab: GENERAL } });
  }, [tab, router]);

  useEffect(() => {
    const loadAllActions = async () => {
      try {
        const actions = await Action.getAllActions();

        const categorisedActions = getCategorisedActions(actions);

        setCategorisedActions(categorisedActions);
      } catch (err: any) {
        console.error(err);
        showErrorNotification(err);
      }
    };

    loadAllActions();
  }, []);

  return tab === GENERAL ? (
    <RoleForm onSubmit={onSubmit} />
  ) : (
    <Permissions
      categorisedActions={categorisedActions}
      actionsPermitted={actionsPermitted}
      setActionsPermitted={setActionsPermitted}
    />
  );
};

export default CreateNewRole;
