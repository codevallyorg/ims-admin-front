import { getInvitedUser, login, newUserLogin, whoAmI } from '@/apis/auth';
import { LoginPayload, NewUserLogin } from '@/types/payloads/auth';

const TOKEN = 'Token';

export default class Auth {
  static async login(payload: LoginPayload) {
    const { data } = await login(payload);
    this.setToken(data.access_token);
  }

  static async whoAmI() {
    const { data } = await whoAmI();
    return data;
  }

  static logout() {
    this.removeToken();
  }

  static async getInvitedUser(token: string) {
    const { data } = await getInvitedUser(token);
    return data;
  }

  static async newUserLogin(payload: NewUserLogin) {
    const { data } = await newUserLogin(payload);
    this.setToken(data.access_token);
  }

  static setToken(token: string) {
    localStorage.setItem(TOKEN, token);
  }

  static getToken() {
    return localStorage.getItem(TOKEN);
  }

  static removeToken() {
    localStorage.removeItem(TOKEN);
  }
}
