import { createPointTransaction } from "./createPointTransaction";
import { updatePointSettings } from "./updatePointSettings";
import { generateVoucher } from "./generateVoucher";
import { useVoucher } from "./useVoucher";
import { addPointsToUser } from "./addPointsToUser";
import { resetUserPoints } from "./resetUserPoints";
import { deletePointTransaction } from "./deletePointTransaction";

export const pointsMutations = {
  createPointTransaction,
  updatePointSettings,
  generateVoucher,
  useVoucher,
  addPointsToUser,
  resetUserPoints,
  deletePointTransaction
};