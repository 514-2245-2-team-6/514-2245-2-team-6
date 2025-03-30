import { defineBackend } from "@aws-amplify/backend";
import { storage } from "./storage/resource";
import { getCroppedFaceFunctionHandler } from "./functions/getCroppedFace/resource";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
export const backend = defineBackend({
    getCroppedFaceFunctionHandler,
    storage,
  });
