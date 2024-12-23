import { executeQuery, getClient } from "../../helper/db";
import { PoolClient } from "pg";
import path from "path";

import { encrypt } from "../../helper/encrypt";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import {
  generateTokenWithExpire,
  generateTokenWithoutExpire,
} from "../../helper/token";
import { selectUserByUsername } from "./query";
import { CurrentTime } from "../../helper/common";

export class UserRepository {
  public async userLoginV1(user_data: any, domain_code?: any): Promise<any> {
    const params = [user_data.username];
    const users = await executeQuery(selectUserByUsername, params);

    if (users.length > 0) {
      const user = users[0];
      const validPassword = await bcrypt.compare(
        user_data.password,
        user.refCustHashedPassword
      );

      if (validPassword) {
        const history = [2, CurrentTime(), user.refStId, "User", "Login"];
      }
    }
  }
}
