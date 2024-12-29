// query.ts
export const getVendorCountQuery = `
  SELECT COUNT(*) as count FROM public."VendorTable";
`;

export const insertVendorQuery = `
  INSERT INTO public."VendorTable" ("refUserCustId", "vendorName", "vendordesgination")
  VALUES ($1, $2, $3)
  RETURNING "refvendorId";
`;

export const insertUserQuery = `
  INSERT INTO public."Users" ("refUserFname", "refUserLname", "refUserCustId", "refRoleId")
  VALUES ($1, $2, $3, $4)
  RETURNING "refUserId";
`;

export const insertCommunicationQuery = `
  INSERT INTO public."refCommunication" ("refUserId", "refMobileno", "refEmail")
  VALUES ($1, $2, $3)
  RETURNING "refComId";
`;

export const insertUserAddressQuery = `
  INSERT INTO public."refUserAddress" ("refAddress", "refUserCustId")
  VALUES ($1,  $2)
  RETURNING "AddressID";
`;

export const insertVendorSocialLinksQuery = `
  INSERT INTO public."VendorSocialLinks" ("refvendorId", "wbsiteUrl", "facebookUrl", "instagramUrl", "twitterUrl")
  VALUES ($1, $2, $3, $4, $5)
  RETURNING "VendorLinks";
`;

// query.ts
export const updateHistoryQuery = `
  INSERT INTO public."txnHistory" ("TransTypeID", "transData", "TransTime", "refUserId", "updatedBy")
  VALUES ($1, $2, $3, $4, $5)
  ;
`;

// src/db/queries.ts
export const insertVendorBankDetailsQuery = `
  INSERT INTO public."VendorBankDetails" ("bankName", "accountNumber", "ibanCode", "paymentTypeId")
  VALUES ($1, $2, $3, $4)
  RETURNING "vendorBankDetailsId";
`;

export const getPaymentTypeIdQuery = `
  SELECT "paymentTypeId" FROM public."PaymentTypes"
  WHERE "paymentType" = $1;
`;
