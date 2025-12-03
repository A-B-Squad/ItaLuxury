import { getActiveBundles } from "./getActiveBundles";
import { getAllBundles } from "./getAllBundles";
import { getBundle } from "./getBundle";
import { incrementBundleUsage } from "../../mutations/bundleMutations/incrementBundleUsage";


export const bundleQueries = {

    getActiveBundles,
    getAllBundles,
    getBundle
};
