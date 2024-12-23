import * as Hapi from "@hapi/hapi";
import * as Boom from "@hapi/boom";

import logger from "../helper/logger";

import { decodeToken } from "../helper/token";
import { Resolver } from "./resolver";

export class UserController {
  public resolver: any;

  constructor() {
    this.resolver = new Resolver();
  }

  public userLogin = async (
    request: Hapi.Request,
    response: Hapi.ResponseToolkit
  ): Promise<any> => {
    logger.info("Router ------------");
    try {
      const domainCode = request.headers.domain_code || "";
      let entity;

      entity = await this.resolver.userLoginV1(request.payload);

      if (entity.success) {
        return response.response(entity).code(200);
      }
    } catch (error) {
      logger.error("Error in user login : ", error);
      return response
        .response({
          success: false,
          message:
            error instanceof Error ? error.message : "An Unknown error occured",
        })
        .code(500);
    }
  };
}
