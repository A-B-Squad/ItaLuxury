import { getPointSettings } from "./getPointSettings";
import { getUserPoints } from "./getUserPoints";
import { getUserPointTransactions } from "./getUserPointTransactions";
import { getUserVouchers } from "./getUserVouchers";
import { getVoucherByCode } from "./getVoucherByCode";

export const pointsQueries = {
  getPointSettings,
  getUserPoints,
  getUserPointTransactions,
  getUserVouchers,
  getVoucherByCode
};