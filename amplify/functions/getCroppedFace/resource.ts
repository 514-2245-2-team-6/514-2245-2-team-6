import { execSync } from "node:child_process";
import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { defineFunction } from "@aws-amplify/backend";
import { DockerImage, Duration } from "aws-cdk-lib";
import { Code, Function, Runtime } from "aws-cdk-lib/aws-lambda";
import * as fs from "fs";

const functionDir = path.dirname(fileURLToPath(import.meta.url));

export const getCroppedFaceFunctionHandler = defineFunction(
  (scope) =>
    new Function(scope, "getCroppedFace", {
      handler: "index.lambda_handler",
      runtime: Runtime.PYTHON_3_13,
      timeout: Duration.seconds(20),
      code: Code.fromAsset(functionDir, {
        bundling: {
          image: DockerImage.fromRegistry("public.ecr.aws/lambda/python:3.13"),
          local: {
            tryBundle(outputDir: string) {
              execSync(
                `python -m pip install -r ${path.join(functionDir, "requirements.txt")} -t ${path.join(outputDir)} --platform manylinux2014_x86_64 --only-binary=:all:`
              );
              const copyFiles = (source: string, destination: string) => {
                fs.readdirSync(source).forEach((file) => {
                  const sourcePath = path.join(source, file);
                  const destinationPath = path.join(destination, file);
                  const stat = fs.statSync(sourcePath);
                  if (stat.isDirectory()) {
                    // Create the directory if it doesn't exist
                    if (!fs.existsSync(destinationPath)) {
                      fs.mkdirSync(destinationPath);
                    }
                    // Recursively copy the sub-directory
                    copyFiles(sourcePath, destinationPath);
                  } else {
                    // Copy the file
                    fs.copyFileSync(sourcePath, destinationPath);
                  }
                });
              };

              // Run the copy process
              copyFiles(functionDir, outputDir);
              return true;
            },
          },
        },
      }),
    })
);