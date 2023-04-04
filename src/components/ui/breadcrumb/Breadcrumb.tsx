import { Breadcrumb as BreadcrumbAntd } from 'antd';
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useBreadcrumbContext } from '@/contexts/BreadcrumbProvider';

const Breadcrumb = () => {
  const { breadcrumbNameMap } = useBreadcrumbContext();
  const router = useRouter();
  const { id } = router.query;

  const pathSnippets = router.pathname.split('/').filter((i: any) => i);

  const breadcrumbItems = pathSnippets.map((_, index: number) => {
    if (pathSnippets[index] === '[id]' && typeof id === 'string') {
      pathSnippets[index] = id;
    }

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
