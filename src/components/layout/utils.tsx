import { FC, PropsWithChildren } from 'react';

export const withLayout = <T,>(
  Component: FC<T>,
  Layout: FC<PropsWithChildren<{}>>,
) => {
  const ComponentWithLayout = (props: any) => (
    <Layout>
      <Component {...props} />
    </Layout>
  );

  return ComponentWithLayout;
};
