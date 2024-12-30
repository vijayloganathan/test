import { UserRepository } from "./user/user-repository";
import { VendorRepository } from "./vendor/vendor-repository";

export class Resolver {
  public userRepository: any;
  constructor() {
    this.userRepository = new UserRepository();
  }
  public async userSignUpV1(user_data: any, domain_code: any): Promise<any> {
    return await this.userRepository.userSignUpV1(user_data, domain_code);
  }
  public async fetchDataV1(user_data: any, domain_code: any): Promise<any> {
    return await this.userRepository.fetchDataV1(user_data, domain_code);
  }
}

export class VendorResolver {
  public VendorRepository: any;
  constructor() {
    this.VendorRepository = new VendorRepository();
  }
  public async VendorProfileV1(user_data: any, domain_code: any): Promise<any> {
    return await this.VendorRepository.VendorProfileV1(user_data, domain_code);
  }
  public async VendorSLinksV1(user_data: any, domain_code: any): Promise<any> {
    return await this.VendorRepository.VendorSLinksV1(user_data, domain_code);
  }
  public async VendorBankDetailsV1(
    user_data: any,
    domain_code: any
  ): Promise<any> {
    return await this.VendorRepository.VendorBankDetailsV1(
      user_data,
      domain_code
    );
  }
}
