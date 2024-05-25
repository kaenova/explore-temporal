import {
  condition,
  defineSignal,
  proxyActivities,
  setHandler,
  sleep,
} from "@temporalio/workflow";
import type * as activities from "./activity";
import { ApplicationFailure } from "@temporalio/common";
import { activityQueueTask } from "./common";

export interface Args {
  params1: string;
}

export interface Output {
  result: string;
}

export interface ContinueSignalData {
  data: string;
}

export async function CancelOnWaitsWorkflow(
  args: Args
): Promise<Output> {
  const continueSignal = defineSignal<[ContinueSignalData]>("ContinueSignal");
  let signalData: ContinueSignalData | null = null
  
  setHandler(continueSignal, (data) => {
    signalData = data
  })


  const { BlackboxChangeStringFunction, ConcatString } = proxyActivities<typeof activities>({
    retry: {
      initialInterval: "1 second",
      maximumInterval: "1 minute",
      backoffCoefficient: 2,
      maximumAttempts: 500,
      nonRetryableErrorTypes: ["ApplicationFailure"],
    },
    taskQueue: activityQueueTask,
    startToCloseTimeout: "120 seconds",
  });


  let res: string;
  try {
    res = await BlackboxChangeStringFunction(args.params1);
  } catch (err) {
    throw ApplicationFailure.create({
      message: "BlackboxChangeStringFunction failed",
    });
  }

  await condition(() => signalData !== null)

  res = await ConcatString(res, signalData.data);
  
  return {
    result: res,
  };
}
