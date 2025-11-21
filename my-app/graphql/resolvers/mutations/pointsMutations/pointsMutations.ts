import { manageUserPoints } from "./manageUserPoints";
import { updatePointSettings } from "./updatePointSettings";
import { generateVoucher } from "./generateVoucher";
import { useVoucher } from "./useVoucher";
import { resetUserPoints } from "./resetUserPoints";
import { deletePointTransaction } from "./deletePointTransaction";

export const pointsMutations = {
  manageUserPoints,
  updatePointSettings,
  generateVoucher,
  useVoucher,
  resetUserPoints,
  deletePointTransaction,
};