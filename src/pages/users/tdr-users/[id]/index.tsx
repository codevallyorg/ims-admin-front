import { FC, useEffect } from 'react';
import Loader from '@/components/ui/loader/Loader';
import { withLayout } from '@/components/layout/utils';
import Private from '@/components/layout/Private';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';
import TDRUserForm from '@/components/pages/forms/tdr-user/TDRUserForm';
import { useRouter } from 'next/router';
import { ASSIGNED_AGENTS, CARD_STOCK, PROFILE } from '@/utils/constants';
import AssignedAgents from '@/components/pages/components/assigned-agents/AssignedAgents';
import CardStock from '@/components/pages/components/card-stock/CardStock';

const ViewUserProfile: FC = () => {
  const { loadingPageHeader, selectedUser } = usePageHeaderContext();

  const router = useRouter();
  const { tab } = router.query;

  useEffect(() => {
    if (tab) return;

    router.replace({ query: { ...router.query, tab: PROFILE } });
  }, [tab, router]);

  if (loadingPageHeader) {
    return <Loader />;
  }

  let Component = null;

  switch (tab) {
    case PROFILE:
      Component = (
        <TDRUserForm readOnly defaultValues={selectedUser || undefined} />
      );
      break;

    case ASSIGNED_AGENTS:
      Component = <AssignedAgents />;
      break;

    case CARD_STOCK:
      Component = <CardStock />;
      break;
  }

  return Component;
};

export default withLayout(ViewUserProfile, Private);
