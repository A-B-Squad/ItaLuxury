import { getAllPackages } from "./allPackages";
import { packageById } from "./packageById";
import { packageByUserId } from "./packageByUserId";

export const packageQueries = {
    getAllPackages,
    packageById, packageByUserId
}