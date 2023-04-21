import { WHITE } from './colors';

// Routes
export const ROUTE_EXISTING_USER_LOGIN = '/auth/existing-user-login';
export const ROUTE_NEW_USER_LOGIN = '/auth/new-user-login';
export const ROUTE_USERS = '/users';
export const ROUTE_DASHBOARD_PORTAL_USERS = '/users/portal-users';
export const ROUTE_DASHBOARD_TDR_USERS = '/users/tdr-users';
export const ROUTE_DASHBOARD_ARCHIVED_USERS = '/users/archived-users';
export const ROUTE_INVITE_NEW_PORTAL_USER =
  '/users/portal-users/invite-new-portal-user';
export const ROUTE_INVITE_NEW_TDR_USER = '/users/tdr-users/invite-new-tdr-user';
export const ROUTE_CREATE_NEW_ROLE =
  '/admin-portal-settings/role-management/create-new-role';
export const ROUTE_ROLE_MANAGEMENT = '/admin-portal-settings/role-management';

// Users
export const USERS = 'Users';
export const PORTAL_USERS = 'Portal Users';
export const TDR_USERS = 'TDR Users';
export const ARCHIVED_USERS = 'Archived Users';

export const INVITE_NEW_PORTAL_USER = 'Invite New Portal User';
export const INVITE_NEW_TDR_USER = 'Invite New TDR User';

export const EDIT_USER_PROFILE = 'Edit User Profile';

export const LOCK_PROFILE = 'Lock Profile';
export const UNLOCK_PROFILE = 'Unlock Profile';
export const ARCHIVE = 'Archive';
export const UNARCHIVE = 'Unarchive';

export const PROFILE = 'Profile';
export const ASSIGNED_AGENTS = 'Assigned Agents';
export const CARD_STOCK = 'Card Stock';

// Roles
export const CREATE_NEW_ROLE = 'Create a New Role';
export const ADMIN_PORTAL_SETTINGS = 'Admin Portal Settings';
export const ROLE_MANAGEMENT = 'Role Management';
export const GENERAL = 'General';
export const PERMISSIONS = 'Permissions';
export const EDIT_ROLE = 'Edit Role';

export const defaultStyle = {
  margin: '20px 24px',
  padding: 24,
  backgroundColor: WHITE,
};
