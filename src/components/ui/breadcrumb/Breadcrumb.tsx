import { Breadcrumb as BreadcrumbAntd } from 'antd';
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  USERS,
  ARCHIVED_USERS,
  PORTAL_USERS,
  TDR_USERS,
  INVITE_NEW_PORTAL_USER,
} from '@/utils/constants';

const breadcrumbNameMap: Record<string, string> = {
  '/users': USERS,
  '/users/portal-users': PORTAL_USERS,
  '/users/portal-users/invite-new-portal-user': INVITE_NEW_PORTAL_USER,
  '/users/tdr-users': TDR_USERS,
  '/users/archived-users': ARCHIVED_USERS,
};

const Breadcrumb = () => {
  const router = useRouter();

  const pathSnippets = router.pathname.split('/').filter((i: any) => i);

  const breadcrumbItems = pathSnippets.map((_, index: number) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <BreadcrumbAntd.Item key={url}>
        <Link href={url}>{breadcrumbNameMap[url]}</Link>
      </BreadcrumbAntd.Item>
    );
  });

  return (
    <div className="demo">
      <BreadcrumbAntd>{breadcrumbItems}</BreadcrumbAntd>
    </div>
  );
};

export default Breadcrumb;
