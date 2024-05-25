import { proxyActivities } from "@temporalio/workflow";
import type * as activities from "./activity";
import { ApplicationFailure } from "@temporalio/common";
import { activityQueueTask } from "./common";

export interface HelloWorldWorkflowArgs {
  params1: string;
}

export interface HelloWorldWorkflowOutput {
  result: string;
}

export async function HelloWorldWorkflow(
  args: HelloWorldWorkflowArgs
): Promise<HelloWorldWorkflowOutput> {
  const { BlackboxChangeStringFunction } = proxyActivities<typeof activities>({
    retry: {
      initialInterval: "1 second",
      maximumInterval: "1 minute",
      backoffCoefficient: 2,
      maximumAttempts: 500,
      nonRetryableErrorTypes: ["ApplicationFailure"],
    },
    taskQueue: activityQueueTask,
    scheduleToCloseTimeout: "60 seconds",
  });

  let res: string;
  try {
    res = await BlackboxChangeStringFunction(args.params1);
  } catch (err) {
    throw ApplicationFailure.create({
      message: "BlackboxChangeStringFunction failed",
    });
  }

  return {
    result: res,
  };
}