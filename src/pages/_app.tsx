import SiderLayout from '@/components/layout/sider/Sider';
import { AuthProvider } from '@/contexts/AuthProvider';
import { BreadcrumbProvider } from '@/contexts/BreadcrumbProvider';
import '@/styles/globals.css';
// import '@/styles/variables.less';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <BreadcrumbProvider>
        <SiderLayout>
          <Component {...pageProps} />
        </SiderLayout>
      </BreadcrumbProvider>
    </AuthProvider>
  );
}
