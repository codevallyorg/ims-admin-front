import { PaginationOptions } from '@/types/payloads/pagination';
import localFont from 'next/font/local';

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export const endpointUrl = (url: string | undefined) => {
  return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${url}`;
};

export const typeCastQuery = (query?: string | string[] | number): string => {
  return typeof query === 'string' ? query : '';
};

export const getPaginatedUrl = (
  url: string,
  paginationOptions: PaginationOptions,
) => {
  let paginatedEndpoint = '';

  const {
    page,
    take,
    orderBy,
    order,
    filterByType,
    filterByStatus,
    filterByRole,
  } = paginationOptions;

  if (page) {
    paginatedEndpoint = paginatedEndpoint.concat(`page=${page}&`);
  }

  if (take) {
    paginatedEndpoint = paginatedEndpoint.concat(`take=${take}&`);
  }

  if (orderBy) {
    paginatedEndpoint = paginatedEndpoint.concat(`orderBy=${orderBy}&`);
  }

  if (order) {
    paginatedEndpoint = paginatedEndpoint.concat(`order=${order}&`);
  }

  if (filterByType) {
    paginatedEndpoint = paginatedEndpoint.concat(
      `filterByType=${filterByType}&`,
    );
  }

  if (filterByStatus) {
    paginatedEndpoint = paginatedEndpoint.concat(
      `filterByStatus=${filterByStatus}&`,
    );
  }

  if (filterByRole) {
    paginatedEndpoint = paginatedEndpoint.concat(
      `filterByRole=${filterByRole}&`,
    );
  }

  return endpointUrl(`${url}?${paginatedEndpoint}`);
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
