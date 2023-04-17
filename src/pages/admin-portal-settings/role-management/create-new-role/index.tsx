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

const CreateNewRole: FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
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

      await Role.createRole(data);

      showNotification({ description: 'done', message: 'don' });
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
