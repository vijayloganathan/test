import { UserRepository } from "./user/user-repository";

export class Resolver {
  public userRepository: any;
  constructor() {
    this.userRepository = new UserRepository();
  }
  public async userLoginV1(user_data: any, domain_code: any): Promise<any> {
    return await this.userRepository.userLoginV1(user_data, domain_code);
  }
}
