import type { Context } from "hono";
import UserServices from "../services/user.service.js";
import { getFirestore } from "firebase-admin/firestore";

export class UserController {
  private userServices = new UserServices();

  register = async (c: Context) => {

    const user = await c.get('user')
    const response = await this.userServices.register(user.uid);

    if (!response) {
      return c.json({ message: "Register failed!" }, 400)
    }

    return c.json({ message: "Register Success!", response: response }, 201)

  };
}