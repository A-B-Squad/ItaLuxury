import { createBundle } from "./createBundle";
import { deleteBundle } from "./deleteBundle";
import { incrementBundleUsage } from "./incrementBundleUsage";
import { toggleBundleStatus } from "./toggleBundleStatus";
import { updateBundle } from "./updateBundle";


export const bundleMutations = {
    createBundle,
    deleteBundle,
    toggleBundleStatus,
    updateBundle, incrementBundleUsage
};
