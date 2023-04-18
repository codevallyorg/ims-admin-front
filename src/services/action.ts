import { getAllActions } from '@/apis/action';

export default class Action {
  static async getAllActions() {
    const { data } = await getAllActions();
    return data;
  }
}
