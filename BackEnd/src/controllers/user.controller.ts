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

  getUserById = async (c: Context) => {
    try {

      const uid = c.req.param('id');
      const response = await this.userServices.getUserById(uid);
      return c.json(response, 200)

    } catch (error: any) {

      return c.json({ message: error.message }, 400)

    }
  }
  getUserBookmarks = async (c: Context) => {
    try {
      const uid = c.req.param('id');
      const response = await this.userServices.getUserBookmarks(uid);
      return c.json(response, 200)
    } catch (error: any) {
      return c.json({ message: error.message }, 400)
    }
  }
  createUserBookmark = async (c: Context) => {
    try {
      const { bookmarkId } = await c.req.json();
      const user = await c.get('user')
      const response = await this.userServices.createUserBookmark(user.uid, bookmarkId);
      return c.json({ message: response }, 201)
    } catch (error: any) {
      return c.json({ message: error.message }, 400)
    }
  }
  deleteUserBookmark = async (c: Context) => {
    try {
      const user = await c.get('user')
      const bookmarkId = c.req.param('id');
      const response = await this.userServices.deleteUserBookmark(user.uid, bookmarkId);
      return c.json({ message: response }, 200)
    } catch (error: any) {
      return c.json({ message: error.message }, 400)
    }
  }

}