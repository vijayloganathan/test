import * as Hapi from "@hapi/hapi";

import IRoute from "../helper/routes";

// import { Logger } from "winston";
import { decodeToken, validateToken } from "../helper/token";
import { UserController } from "./controller";
import { VendorProfile } from "./controller";

export class UserRouters implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new UserController();
      server.route([
        {
          method: "POST",
          path: "/api/v1/users/Signup",
          config: {
            handler: controller.userSignUp,
            description: "Signup Checking Validation",
            tags: ["api", "users"],
            auth: false,
          },
        },
        {
          method: "GET",
          path: "/api/v1/users/fetchData",
          config: {
            handler: controller.fetchData,
            description: "User Fetch Data Passing",
            auth: false,
          },
        },
      ]);

      // Logger.info("API created successfully");
      resolve(true);
    });
  }
}

export class vendorRoutes implements IRoute {
  public async register(server: any): Promise<any> {
    return new Promise((resolve) => {
      const controller = new VendorProfile();
      server.route([
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/BasicDetals",
          config: {
            handler: controller.Vendorprofile,
            description: "Store BasicDetals",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/SocialLinks",
          config: {
            handler: controller.VendorSLinks,
            description: "Store SocialLinks",
            tags: ["api", "Users"],
            auth: false,
          },
        },
        {
          method: "POST",
          path: "/api/v1/vendorRoutes/BankDetails",
          config: {
            handler: controller.VendorBankDetails,
            description: "Store VendorBankDetails",
            tags: ["api", "Users"],
            auth: false,
          },
        },
      ]);
      resolve(true);
    });
  }
}
