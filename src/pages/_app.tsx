import SiderLayout from '@/components/layout/sider/Sider';
import { AuthProvider } from '@/contexts/AuthProvider';
import { BreadcrumbProvider } from '@/contexts/BreadcrumbProvider';
import '@/styles/globals.css';
// import '@/styles/variables.less';
import type { AppProps } from 'next/app';
import localFont from 'next/font/local';

const poppins = localFont({
  src: [
    {
      path: '../assets/fonts/Poppins-Thin.ttf',
      weight: '100',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Poppins-ExtraLight.ttf',
      weight: '200',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Poppins-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Poppins-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Poppins-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Poppins-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Poppins-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Poppins-ExtraBold.ttf',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../assets/fonts/Poppins-Black.ttf',
      weight: '900',
      style: 'normal',
    },
  ],
});

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
