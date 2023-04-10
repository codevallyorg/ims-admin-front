import { Breadcrumb as BreadcrumbAntd } from 'antd';
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { typeCastQuery } from '@/utils/general';
import { usePageHeaderContext } from '@/contexts/PageHeaderProvider';

const Breadcrumb = () => {
  const { breadcrumbNameMap } = usePageHeaderContext();
  const router = useRouter();
  const { id } = router.query;

  const pathSnippets = router.pathname.split('/').filter((i: any) => i);

  const breadcrumbItems = pathSnippets.map((_, index: number) => {
    if (pathSnippets[index] === '[id]') {
      pathSnippets[index] = typeCastQuery(id);
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
