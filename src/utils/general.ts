import localFont from 'next/font/local';

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export const endpointUrl = (url: string | undefined) => {
  return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${url}`;
};

export const poppins = localFont({
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
