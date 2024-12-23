import * as Hapi from "@hapi/hapi";

import IRoute from "../helper/routes";

import { Logger } from "winston";
import { decodeToken, validateToken } from "../helper/token";
import { UserController } from "./controller";

export class UserRouters implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new UserController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/users/login",
          config: {
            handler: controller.userLogin,
            description: "Login Checking Validation",
            tags: ["api", "users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
