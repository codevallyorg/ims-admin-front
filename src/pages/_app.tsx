import SiderLayout from '@/components/layout/sider/Sider';
import { AuthProvider } from '@/contexts/AuthProvider';
import { PageHeaderProvider } from '@/contexts/PageHeaderProvider';
import '@/styles/globals.css';
import { poppins } from '@/utils/general';
// import '@/styles/variables.less';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <main id="__next" style={poppins.style}>
      <AuthProvider>
        <PageHeaderProvider>
          <SiderLayout>
            <Component {...pageProps} />
          </SiderLayout>
        </PageHeaderProvider>
      </AuthProvider>
    </main>
  );
}
