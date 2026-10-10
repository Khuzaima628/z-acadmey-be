import { UserType } from "@src/models/userModel";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}
