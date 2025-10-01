import type { Context, Next } from "hono";
import admin from "../libs/firebase.js";

export const authMiddleware = async (c: Context, next: Next) => {
  const header = c.req.header("authorization");
  if (!header?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = header.split(" ")[1];
  try {
    const decoded = await admin.auth().verifyIdToken(token);
    c.set('user', decoded);
    await next();
  } catch (err) {
    return c.json({ error: "Invalid token" }, 403);
  }
};

