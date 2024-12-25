import * as Hapi from "@hapi/hapi";

import { UserRouters } from "./api/routes";

export default class Router {
  public static async loadRoutes(server: Hapi.Server): Promise<any> {
    await new UserRouters().register(server);
  }
}
