import { Alert, Breadcrumb as BreadcrumbAntd } from 'antd';
import React from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

// const Apps = () => (
//   <ul className="app-list">
//     <li>
//       <Link href="/apps/1">Application1</Link>：
//       <Link href="/apps/1/detail">Detail</Link>
//     </li>
//     <li>
//       <Link href="/apps/2">Application2</Link>：
//       <Link href="/apps/2/detail">Detail</Link>
//     </li>
//   </ul>
// );

const breadcrumbNameMap: Record<string, string> = {
  '/apps': 'Application List',
  '/apps/1': 'Application1',
  '/apps/2': 'Application2',
  '/apps/1/detail': 'Detail',
  '/apps/2/detail': 'Detail',
};

const Home = () => {
  const router = useRouter();

  const pathSnippets = router.pathname.split('/').filter((i: any) => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index: number) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;
    return (
      <BreadcrumbAntd.Item key={url}>
        <Link href={url}>{breadcrumbNameMap[url]}</Link>
      </BreadcrumbAntd.Item>
    );
  });

  const breadcrumbItems = [
    <BreadcrumbAntd.Item key="home">
      <Link href="/">Home</Link>
    </BreadcrumbAntd.Item>,
  ].concat(extraBreadcrumbItems);

  return (
    <div className="demo">
      <BreadcrumbAntd>{breadcrumbItems}</BreadcrumbAntd>

      <div className="demo-nav">
        <div>
          <Link href="/">Home</Link>
        </div>
        <div>
          <Link href="/apps">Application List</Link>
        </div>
      </div>
    </div>
  );
};

const Breadcrumb: React.FC = () => (
  //   <HashRouter>
  <Home />
  //   </HashRouter>
);

export default Breadcrumb;
