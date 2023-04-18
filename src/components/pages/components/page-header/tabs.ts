import { IUser } from '@/types/entities/IUser';
import {
  ARCHIVE,
  ARCHIVED_USERS,
  ASSIGNED_AGENTS,
  CARD_STOCK,
  GENERAL,
  LOCK_PROFILE,
  PERMISSIONS,
  PORTAL_USERS,
  PROFILE,
  TDR_USERS,
  UNARCHIVE,
  UNLOCK_PROFILE,
} from '@/utils/constants';

export const usersTabItems = [
  { label: PORTAL_USERS, key: PORTAL_USERS },
  { label: TDR_USERS, key: TDR_USERS },
  { label: ARCHIVED_USERS, key: ARCHIVED_USERS },
];

export const tdrUserTabItems = [
  { label: PROFILE, key: PROFILE },
  { label: ASSIGNED_AGENTS, key: ASSIGNED_AGENTS },
  { label: CARD_STOCK, key: CARD_STOCK },
];

export const createRoleTabItems = [
  { label: GENERAL, key: GENERAL },
  { label: PERMISSIONS, key: PERMISSIONS },
];

export const getDrowdownItems = (selectedUser: IUser | null) => {
  const items = [
    { label: LOCK_PROFILE, key: 0 },
    { label: ARCHIVE, key: 1 },
  ];

  if (selectedUser?.locked) {
    items[0] = { label: UNLOCK_PROFILE, key: 0 };
  }

  if (selectedUser?.archived) {
    items[1] = { label: UNARCHIVE, key: 1 };
  }

  return items;
};
