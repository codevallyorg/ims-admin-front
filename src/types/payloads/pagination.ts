import { UserStatus, UserType } from '../entities/IUser';

export enum OrderByEnum {
  createdAt = 'createdAt',
  updatedAt = 'updatedAt',
  email = 'email',
  firstName = 'firstName',
  lastName = 'lastName',
  idNumber = 'idNumber',
}

export enum OrderEnum {
  asc = 'asc',
  desc = 'desc',
}

export type PaginationOptions = {
  page?: number;
  take?: number;
  orderBy?: OrderByEnum;
  order?: OrderEnum;
  filterByType?: UserType;
  filterByStatus?: UserStatus[];
  filterByRole?: number;
  search?: string;
};

export type PageMeta = {
  page: number;
  take: number;
  itemCount: number;
  pageCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};
