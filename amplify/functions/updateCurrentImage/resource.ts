import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineFunction } from "@aws-amplify/backend";
import { Duration } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";

const functionDir = path.dirname(fileURLToPath(import.meta.url));

export const updateCurrentImageFunctionHandler = defineFunction(
  (scope) =>
    new Function(scope, "updateCurrentImage", {
      handler: "index.lambda_handler",
      runtime: Runtime.PYTHON_3_13,
      timeout: Duration.seconds(20),
      code: Code.fromAsset(functionDir),
    })
);