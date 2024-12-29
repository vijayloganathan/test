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
    getVendorCountQuery,
    insertVendorQuery,
    insertUserQuery,
    insertCommunicationQuery,
    insertUserAddressQuery ,
    insertVendorSocialLinksQuery ,
    updateHistoryQuery,
    getPaymentTypeIdQuery,
    insertVendorBankDetailsQuery
} from './query';
import { CurrentTime } from "../../helper/common";


export class VendorRepository {
  public async VendorProfileV1(user_data: any, domain_code?: any): Promise<any> {
    try {
      const VendorCountResult = await executeQuery(getVendorCountQuery);
      console.log('VendorCountResult', VendorCountResult);

      const VendorCount = parseInt(VendorCountResult[0].count, 10);

      let newVendorId = `VD${(VendorCount + 1).toString().padStart(3, '0')}`;

      // Insert Vendor with three parameters
      const vendorParams = [newVendorId, user_data.vendorName, user_data.vendordesgination];

      const vendorResult = await executeQuery(insertVendorQuery, vendorParams);
      console.log('vendorResult', vendorResult);

      if (!vendorResult || vendorResult.length === 0) {
        throw new Error('Failed to insert vendor');
      }
      const vendorId = vendorResult[0].refvendorId;

      // Insert User with VendorId (refUserCustId in the correct format)
      const userParams = [user_data.user.refUserFname, user_data.user.refUserLname, newVendorId, user_data.user.refRoleId];
      console.log('userParams', userParams);
      console.log('result 2');

      const userResult = await executeQuery(insertUserQuery, userParams);
      console.log('userResult', userResult);
      console.log('Success 2');

      if (!userResult || userResult.length === 0) {
        throw new Error('Failed to insert user');
      }
      const userId = userResult[0].refUserId;

      // Insert Communication with refUserId
      const communicationParams = [userId, user_data.communication.refMobileno, user_data.communication.refEmail];
      console.log('result 3');

      const result = await executeQuery(insertCommunicationQuery, communicationParams);
      console.log('result', result);
      console.log('Success 3');

      // Insert User Address
      const userAddressParams = [user_data.address.refAddress, newVendorId];
      console.log('result 4');

      const result1 = await executeQuery(insertUserAddressQuery, userAddressParams);
      console.log('result1', result1);
      console.log('Success 4');

      // Insert transaction history
      const txnHistoryParams = [
        // null, // TransId will be auto-generated
        22, // TransTypeID
        JSON.stringify("vendor profile" ), // transData
        new Date(), // TransTime
        userId, // refUserId
        userId // UpdatedBy
      ];
      await executeQuery(updateHistoryQuery, txnHistoryParams);

      // Return Success Response with refUserCustId instead of vendorId
      return {
        success: true,
        message: 'Vendor and user data inserted successfully',
        refUserCustId: newVendorId, // Return the generated vendorId as refUserCustId
        userId: userId
      };
    } catch (error) {
      let errorMessage;
      if (error instanceof Error) {
        errorMessage = error.message;
      } else {
        errorMessage = 'An unknown error occurred';
      }

      console.error('Error during data insertion:', error);
      return {
        success: false,
        message: 'Data insertion failed',
        error: errorMessage
      };
    }
  }

  public async VendorSLinksV1(socialLinks: any): Promise<any> {
    try {
      const VendorCountResult = await executeQuery(getVendorCountQuery);
      console.log('VendorCountResult', VendorCountResult);
      
      const VendorCount = parseInt(VendorCountResult[0].count, 10); // Extract and convert count to a number
      console.log('Vendor Count:', VendorCount);
  
      const newVendorId = `VD${(VendorCount + 1).toString().padStart(3, '0')}`;
      console.log('Generated VendorId:', newVendorId);
  
      const socialLinksParams = [
        newVendorId,
        socialLinks.websiteUrl,
        socialLinks.facebookUrl,
        socialLinks.instagramUrl,
        socialLinks.twitterUrl
      ];
      const result = await executeQuery(insertVendorSocialLinksQuery, socialLinksParams);
  
      const txnHistoryParams = [
        22, // TransTypeID
        JSON.stringify(socialLinks), // transData
        new Date(), // TransTime
        socialLinks.refUserId, // refUserId
        socialLinks.refUserId // UpdatedBy
      ];
      await executeQuery(updateHistoryQuery, txnHistoryParams);
  
      // Log the result of the insert operation
      console.log('Insert Result:', result);
  
      return result[0];
    } catch (error) {
      console.error('Error occurred:', error);
      throw new Error((error as Error).message || 'Failed to insert vendor social links');
    }
  }
  
  public async VendorBankDetailsV1(bankName: string, accountNumber: string, ibanCode: string, paymentType: string): Promise<number> {
    try {
      // Get PaymentType ID
      const paymentTypeResult = await executeQuery<PaymentTypeRow>(getPaymentTypeIdQuery, [paymentType]);
      if (paymentTypeResult.rows.length === 0) {
        throw new Error('Invalid payment type');
      }
      const paymentTypeId = paymentTypeResult.rows[0].paymentTypeId;

      // Insert VendorBankDetails
      const vendorBankDetailsParams = [bankName, accountNumber, ibanCode, paymentTypeId];
      const vendorBankDetailsResult = await executeQuery<VendorBankDetailsRow>(insertVendorBankDetailsQuery, vendorBankDetailsParams);

      return vendorBankDetailsResult.rows[0].vendorBankDetailsId;
    } catch (error) {
      console.error('Error inserting vendor bank details:', error);
      throw new Error('Failed to insert vendor bank details');
    }
  }


 
  
  }
  
  
  
   