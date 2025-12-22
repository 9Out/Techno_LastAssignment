import { db } from "../db/drizzleClient";
import { users } from "../db/schemas/users";
import bcrypt from "../lib/bcrypt";
import jwt from "../lib/jwt";
import { eq, or } from "drizzle-orm";

import {
  ILoginRequest,
  INewPasswordRequest,
  IRegisterRequest,
} from "../types/requests/auth-request";

import { AppError } from "../errors/app.error";
import { logSuccess, logError } from "../utils/logger.util";

export class AuthService {

  // REGISTER
  async register(data: IRegisterRequest) {
    const action = "REGISTER USER";

    try {
      const { username, fullName, email, password, createdBy } = data;

      const exist = await db.select().from(users).where(eq(users.email, email));
      if (exist.length > 0) {
        throw new AppError("EMAIL_ALREADY_REGISTERED", "Email is already registered.", 400);
      }

      const hashed = await bcrypt.hash(password);

      const [inserted] = await db
        .insert(users)
        .values({
          id: crypto.randomUUID(),
          username,
          fullName,
          email,
          passwordHash: hashed,
          active: true,
          createdBy,
        })
        .returning({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          email: users.email,
          active: users.active
        });

      logSuccess(action, inserted);
      return inserted;

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;
      throw new AppError("REGISTER_FAILED", "Failed to register user.", 500);
    }
  }

  // LOGIN
  async login(data: ILoginRequest) {
    const action = "LOGIN USER";

    try {
      const { identifier, password } = data;

      const result = await db
        .select()
        .from(users)
        .where(or(eq(users.email, identifier), eq(users.username, identifier)))
        .limit(1);

      if (!result.length) {
        throw new AppError("INVALID_CREDENTIALS", "Invalid email or password.", 401);
      }

      const user = result[0];
      const match = await bcrypt.compare(password, user.passwordHash);

      if (!match) {
        throw new AppError("INVALID_CREDENTIALS", "Invalid email or password.", 401);
      }

      if (!user.active) {
        throw new AppError("USER_INACTIVE", "Your account is inactive.", 403);
      }

      const token = jwt.sign({
        id: user.id,
        email: user.email,
      });

      logSuccess(action, user);
      return { 
              token, 
              user: { 
                id: user.id, 
                username: user.username, 
                fullName: user.fullName, 
                email: user.email, 
              } 
            };

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;
      throw new AppError("LOGIN_FAILED", "Failed to login.", 500);
    }
  }

  // SET NEW PASSWORD
  async setNewPassword(data: INewPasswordRequest) {
    const action = "SET NEW PASSWORD";

    try {
      const { email, newPassword, updatedBy } = data;

      const hashed = await bcrypt.hash(newPassword);

      const [updated] = await db
        .update(users)
        .set({
          passwordHash: hashed,
          updatedAt: new Date(),
          updatedBy,
        })
        .where(eq(users.email, email))
        .returning({
          id: users.id,
          username: users.username,
          fullName: users.fullName,
          email: users.email,
          active: users.active
        });

      if (!updated) {
        throw new AppError("PASSWORD_UPDATE_FAILED", "Failed to update password.", 400);
      }

      logSuccess(action, updated);
      return updated;

    } catch (err) {
      logError(action, err);
      if (err instanceof AppError) throw err;
      throw new AppError("NEW_PASSWORD_FAILED", "Failed to set new password.", 500);
    }
  }
}

export const authService = new AuthService();