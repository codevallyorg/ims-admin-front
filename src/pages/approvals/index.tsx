import { FC, Fragment, useCallback, useEffect, useState } from 'react';

import { PageMeta } from '@/types/payloads/pagination';
import Private from '@/components/layout/Private';
import { withLayout } from '@/components/layout/utils';
import Approval from '@/services/approval';
import {
  ApprovalStatus,
  IUserActionsApproval,
} from '@/types/entities/IUserActionsApproval';
import { showErrorNotification } from '@/utils/general';
import Loader from '@/components/ui/loader/Loader';
import User from '@/services/user';
import moment from 'moment';
import { defaultStyle } from '@/utils/constants';
import Button from '@/components/ui/button/Button';
import { Divider, Space } from 'antd';

const Approvals: FC = () => {
  const [loading, setLoading] = useState(true);
  const [approvalRequests, setApprovalRequests] = useState<
    IUserActionsApproval[]
  >([]);
  const [pageMeta, setPageMeta] = useState<PageMeta>();

  const loadAllPendingRequests = useCallback(async () => {
    try {
      setLoading(true);

      const { data, meta } = await Approval.getAllRequests(
        ApprovalStatus.Pending,
      );

      // await Promise.all(
      //   data.map(async (approvalRequest: IUserActionsApproval) =>
      //     approvalRequest.userAction.payload.id
      //       ? (approvalRequest.target = await User.getUser(
      //           approvalRequest.userAction.payload.id,
      //         ))
      //       : undefined,
      //   ),
      // );

      setApprovalRequests(data);
      setPageMeta(meta);
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllPendingRequests();
  }, [loadAllPendingRequests]);

  const onApproveRequest = async (requestId: number) => {
    try {
      const notes = 'Any reason';

      const response = await Approval.approveRequest(requestId, notes);

      console.log(response);

      if (!response.success || !response.actionProcessed) {
        throw new Error('Action not approved');
      }
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err);
    } finally {
      loadAllPendingRequests();
    }
  };

  const onRejectRequest = async (requestId: number) => {
    try {
      const notes = 'any reason';

      const response = await Approval.rejectRequest(requestId, notes);

      if (!response.success) {
        throw new Error('Action not rejected');
      }

      loadAllPendingRequests();
    } catch (err: any) {
      console.error(err);
      showErrorNotification(err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div style={{ ...defaultStyle, overflowY: 'auto' }}>
      {approvalRequests.map((approvalRequest) => (
        <Fragment key={approvalRequest.id}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <div>action: {approvalRequest.userAction.action.description}</div>
              <div>
                target: {approvalRequest.target?.firstName}{' '}
                {approvalRequest.target?.lastName}
              </div>
              <div>
                createdBy: {approvalRequest.userAction.createdByUser.firstName}{' '}
                {approvalRequest.userAction.createdByUser.lastName}
              </div>

              <div>
                createdAt:{' '}
                {moment(approvalRequest.createdAt).format('DD MMM YYYY')}
              </div>
            </div>

            <Space>
              <Button onClick={onRejectRequest.bind(this, approvalRequest.id)}>
                Reject
              </Button>
              <Button
                type="primary"
                onClick={onApproveRequest.bind(this, approvalRequest.id)}
              >
                Approve
              </Button>
            </Space>
          </div>
          <Divider />
        </Fragment>
      ))}
    </div>
  );
};

export default withLayout(Approvals, Private);
