export const selectUserByUsername =
  'SELECT * FROM public."refUsersDomain" WHERE "refUserName" = $1 OR "refCustPrimEmail" =$1;';
