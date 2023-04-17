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
