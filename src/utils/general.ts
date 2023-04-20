import { notification } from 'antd';
import { IconType } from 'antd/lib/notification';
import localFont from 'next/font/local';
import { ReactNode } from 'react';
import { PaginationOptions } from '@/types/payloads/pagination';
import { CategorisedActions, IAction } from '@/types/entities/IAction';

type NotificationProps = {
  message: string;
  description: string;
  icon?: ReactNode;
  type?: IconType;
};

export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export const endpointUrl = (url: string | undefined) => {
  return `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${url}`;
};

export const getArray = (query?: string | string[] | number): string[] => {
  if (!query) return [];

  return typeof query === 'string' || typeof query === 'number'
    ? [`${query}`]
    : query;
};

export const typeCastQueryToString = (
  query?: string | string[] | number,
): string => {
  return typeof query === 'string' || typeof query === 'number'
    ? `${query}`
    : '';
};

export const preparePathname = (
  pathname: string,
  id: string | string[] | number,
) => {
  return pathname.replace('[id]', typeCastQueryToString(id));
};

export const showNotification = (notificationData: NotificationProps) => {
  const { message, description, icon } = notificationData;

  notification.open({
    message,
    description,
    icon,
    style: poppins.style,
  });
};

export const showErrorNotification = (error: any) => {
  showNotification({
    type: 'error',
    message: 'Error',
    description: error.message,
  });
};

const splitBySpace = (text: string) => {
  return text
    .replace(/([A-Z]+)([A-Z][a-z])/g, ' $1 $2')
    .replace(/([a-z\d])([A-Z])/g, '$1 $2')
    .replace(/\ +/g, ' ')
    .trim();
};

export const getCategorisedActions = (
  actions: IAction[],
): CategorisedActions => {
  const categorisedActions: any = {};

  for (const action of actions) {
    const { category: categoryCamelCase, subject: subjectCamelCase } = action;
    const [category, subject] = [
      splitBySpace(categoryCamelCase),
      `${splitBySpace(subjectCamelCase)} Actions`,
    ];

    if (!categorisedActions[category]) {
      categorisedActions[category] = {};
    }

    if (!categorisedActions[category][subject]) {
      categorisedActions[category][subject] = [action];
      continue;
    }

    categorisedActions[category][subject].push(action);
  }

  return categorisedActions;
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
    search,
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

  if (search) {
    paginatedEndpoint = paginatedEndpoint.concat(`search=${search}`);
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
