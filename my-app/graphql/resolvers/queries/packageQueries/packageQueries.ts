import { getAllPackages } from "./allPackages";
import { GetAllPackagesForExport } from "./GetAllPackagesForExport";
import { packageById } from "./packageById";
import { packageByUserId } from "./packageByUserId";

export const packageQueries = {
  getAllPackages,
  packageById,
  packageByUserId,
  GetAllPackagesForExport
};
