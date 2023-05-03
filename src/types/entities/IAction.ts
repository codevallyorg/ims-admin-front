export type IAction = {
  id: number;
  name: string;
  description: string;
  category: string;
  subject: string;
  createdAt: string;
  updatedAt: string;
};

export type CategorisedActions = {
  [key: string]: {
    [key: string]: IAction[];
  };
};

export enum ActionCategory {
  PortalUsers = 'PortalUsers',
  TDRUsers = 'TDRUsers',
  AgentWallets = 'AgentWallets',
  CommuterWallets = 'CommuterWallets',
  Reporting = 'Reporting',
  Settings = 'Settings',
}

export enum ActionSubject {
  Profile = 'Profile',
  TransportStock = 'TransportStock',
  Wallet = 'Wallet',
  Reporting = 'Reporting',
  GeneralSettings = 'GeneralSettings',
  WalletConfiguration = 'WalletConfiguration',
  MobileAppConfiguration = 'MobileAppConfiguration',
}

export enum ActionName {
  Create = 'Create',
  Read = 'Read',
  Update = 'Update',
  Delete = 'Delete',
  Archive = 'Archive',
  UnArchive = 'UnArchive',
  ReadAll = 'ReadAll',
  ResetPassword = 'ResetPassword',
  ResetPin = 'ResetPin',
  Lock = 'Lock',
  Unlock = 'Unlock',
  Return = 'Return',
  ReadAssigned = 'ReadAssigned',
  ReadWalletSummary = 'ReadWalletSummary',
  ReadWalletDetails = 'ReadWalletDetails',
  ReadTransactionHistory = 'ReadTransactionHistory',
  UpdateTransaction = 'UpdateTransaction',
  DownloadTransactionHistory = 'DownloadTransactionHistory',
  ReadDeposits = 'ReadDeposits',
  UpdateDeposits = 'UpdateDeposits',
  UpdateWalletType = 'UpdateWalletType',
  TopupWallet = 'TopupWallet',
  ReadPortalUserReport = 'ReadPortalUserReport',
  ReadTDRUserReport = 'ReadTDRUserReport',
  ReadCommuterWalletReport = 'ReadCommuterWalletReport',
  ReadAgentWalletReport = 'ReadAgentWalletReport',
  DownloadPortalUserReport = 'DownloadPortalUserReport',
  DownloadTDRUserReport = 'DownloadTDRUserReport',
  DownloadCommuterWalletReport = 'DownloadCommuterWalletReport',
  DownloadAgentWalletReport = 'DownloadAgentWalletReport',
  UpdateProfileDetails = 'UpdateProfileDetails',
  UpdateNotificationSettings = 'UpdateNotificationSettings',
  CreateAgentWalletType = 'CreateAgentWalletType',
  CreateCommuterWalletType = 'CreateCommuterWalletType',
  ReadAllAgentWalletType = 'ReadAllAgentWalletType',
  ReadAllCommuterWalletType = 'ReadAllCommuterWalletType',
  UpdateAgentWalletType = 'UpdateAgentWalletType',
  UpdateCommuterWalletType = 'UpdateCommuterWalletType',
  CreateKYCLevel = 'CreateKYCLevel',
  ReadAllKYCLevel = 'ReadAllKYCLevel',
  UpdateKYCLevel = 'UpdateKYCLevel',
  CreateSecurityQuestion = 'CreateSecurityQuestion',
  ReadAllSecurityQuestion = 'ReadAllSecurityQuestion',
  UpdateSecurityQuestion = 'UpdateSecurityQuestion',
}
