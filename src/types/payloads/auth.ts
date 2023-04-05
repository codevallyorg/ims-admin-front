export type LoginPayload = {
  email: string;
  password: string;
};

export type NewUserLogin = {
  token: string;
  password: string;
  password_confirm: string;
};
