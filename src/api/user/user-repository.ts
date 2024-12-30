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
import {
  checkQuery,
  getCustomerCount,
  insertUserQuery,
  insertUserDomainQuery,
  insertUserCommunicationQuery,
  updateHistoryQuery,
  fetchData,
} from "./query";
import { CurrentTime } from "../../helper/common";

export class UserRepository {
  public async userSignUpV1(userData: any, domain_code?: any): Promise<any> {
    const hashedPassword = await bcrypt.hash(userData.temp_password, 10);

    const check = [userData.temp_username];
    // const userCheck = await executeQuery(checkQuery, [userData.temp_username]);
    const userCheck = await executeQuery(checkQuery, check);
    const userFind = userCheck[0];

    if (userFind) {
      return encrypt(
        {
          message: "Already exit",
          success: true,
        },
        false
      );
    } else {
      // Generate newCustomerId in the format KC001, KC002, etc.
      const userCountResult = await executeQuery(getCustomerCount);
      const userCount = parseInt(userCountResult[0].count, 10); // Extract and convert count to a number

      let newCustomerId;
      if (userCount >= 0) {
        newCustomerId = `KC${(userCount + 1).toString().padStart(3, "0")}`; // Generate the ID in the format KCxxx
      }
      let userType = 1;

      const params = [
        userData.temp_fname, // refStFName
        userData.temp_lname, // refStLName
        newCustomerId,
        (userType = 1),
      ];

      const userResult = await executeQuery(insertUserQuery, params);
      const newUser = userResult[0];

      const domainParams = [
        newUser.refUserId, // refUserId from users table
        newUser.refUserCustId, // refCustId from users table
        userData.temp_username, // refcust Username
        userData.temp_password, // refCustPassword
        hashedPassword, // refCustHashedPassword
        userData.temp_email,
      ];

      const domainResult = await executeQuery(
        insertUserDomainQuery,
        domainParams
      );

      const communicationParams = [
        newUser.refUserId, // refUserId from users table
        userData.temp_phone,
        userData.temp_email,
      ];

      const communicationResult = await executeQuery(
        insertUserCommunicationQuery,
        communicationParams
      );

      if (
        userResult.length > 0 &&
        domainResult.length > 0 &&
        communicationResult.length > 0
      ) {
        return encrypt(
          {
            success: true,
            message: "User signup successful",
            user: newUser,
            // token: generateTokenWithExpire(tokenData, true),
          },
          false
        );
        // const history = [1, CurrentTime(), newUser.refUserId, "User SignUp"];
        // console.log("history", history);
        // const updateHistory = await executeQuery(updateHistoryQuery, history);
        // console.log("line ----- 113");
        // if (updateHistory && updateHistory.length > 0) {
        //   const tokenData = {
        //     id: newUser.refUserId, // refUserId from users table
        //     email: userData.temp_su_email,
        //     custId: newUser.refSCustId,
        //     status: newUser.refSUserStatus,
        //   };
        //   return encrypt(
        //     {
        //       success: true,
        //       message: "User signup successful",
        //       user: newUser,
        //       token: generateTokenWithExpire(tokenData, true),
        //     },
        //     false
        //   );
        // } else {
        //   return encrypt(
        //     {
        //       success: false,
        //       message: "Failed to update history",
        //     },
        //     false
        //   );
        // }
      } else {
        return encrypt(
          {
            success: false,
            message: "Signup failed",
          },
          false
        );
      }
    }
  }
  public async fetchDataV1(userData: any, domain_code?: any): Promise<any> {
    try {
      const data = await executeQuery(fetchData, []);
      return encrypt(
        {
          success: true,
          message: "UserData is Passed Successfully",
          data: data,
        },
        false
      );
    } catch (error) {
      console.log(error);
      return encrypt(
        {
          success: false,
          message: "Error in Passing The User Data",
        },
        false
      );
    }
  }
}
