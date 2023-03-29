import { login, whoAmI } from '@/apis/auth';
import { LoginPayload } from '@/types/payloads/auth';

const TOKEN = 'Token';

export default class Auth {
  static async login(payload: LoginPayload) {
    const { data } = await login(payload);
    this.setToken(data.access_token);

    return data;
  }

  static async whoAmI() {
    const { data } = await whoAmI();
    return data;
  }

  //   static async signup(payload: any) {
  //     const { data } = await createUser(payload);
  //     return data;
  //   }

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
