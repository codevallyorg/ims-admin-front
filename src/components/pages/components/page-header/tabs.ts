import { RoleActionsMap } from '@/contexts/AuthProvider';
import {
  ActionCategory,
  ActionName,
  ActionSubject,
} from '@/types/entities/IAction';
import { IUser, UserType } from '@/types/entities/IUser';
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
  USERS,
} from '@/utils/constants';
import { ItemType } from 'antd/lib/menu/hooks/useItems';

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

export const viewRoleTabItems = [
  { label: GENERAL, key: GENERAL },
  { label: USERS, key: USERS },
  { label: PERMISSIONS, key: PERMISSIONS },
];

export const getDrowdownItems = (
  selectedUser: IUser | null,
  roleActionsMap: RoleActionsMap,
) => {
  const items = [];

  const lockKeyPrefix = `${ActionCategory.TDRUsers}${ActionSubject.Profile}`;

  const archiveActionCategory =
    selectedUser?.type === UserType.Portal
      ? ActionCategory.PortalUsers
      : ActionCategory.TDRUsers;

  const archiveKeyPrefix = `${archiveActionCategory}${ActionSubject.Profile}`;

  if (selectedUser?.locked) {
    const unlockActionKey = `${lockKeyPrefix}${ActionName.Unlock}`;

    items[0] = roleActionsMap[unlockActionKey]
      ? { label: UNLOCK_PROFILE, key: 0 }
      : undefined;
  } else {
    const lockActionKey = `${lockKeyPrefix}${ActionName.Lock}`;

    items[0] = roleActionsMap[lockActionKey]
      ? { label: LOCK_PROFILE, key: 0 }
      : undefined;
  }

  if (selectedUser?.archived) {
    const unarchiveActionKey = `${archiveKeyPrefix}${ActionName.UnArchive}`;

    items[1] = roleActionsMap[unarchiveActionKey]
      ? { label: UNARCHIVE, key: 1 }
      : undefined;
  } else {
    const archiveActionKey = `${archiveKeyPrefix}${ActionName.Archive}`;

    items[1] = roleActionsMap[archiveActionKey]
      ? { label: ARCHIVE, key: 1 }
      : undefined;
  }

  const filteredItems: ItemType[] = [];

  items.forEach((item) => item !== undefined && filteredItems.push(item));

  return filteredItems;
};
