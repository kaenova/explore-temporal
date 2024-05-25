import {
  condition,
  defineSignal,
  proxyActivities,
  setHandler,
  sleep,
} from "@temporalio/workflow";
import type * as activities from "./activity";
import { ApplicationFailure, CancelledFailure } from "@temporalio/common";
import { activityQueueTask } from "./common";

export interface Args {
  params1: string;
  paymentTimeoutMs: number;
}

export interface Output {
  result: string;
}

export interface ContinueSignalData {
  data: string;
}

export async function WaitingAutoCancelWorkflow(args: Args): Promise<Output> {
  const paymentSignal = defineSignal<[ContinueSignalData]>("ContinueSignal");
  let signalData: ContinueSignalData | null = null;
  setHandler(paymentSignal, (data) => {
    signalData = data;
  });

  const { BlackboxChangeStringFunction, SendEmailPaymentSuccessfull } =
    proxyActivities<typeof activities>({
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

  // Waiting for payment for payment Timeout
  const paymentSuccess = await condition(
    () => signalData !== null,
    args.paymentTimeoutMs
  );

  if (!paymentSuccess) {
    throw new CancelledFailure("Payment timed out");
  }

  res = await SendEmailPaymentSuccessfull();

  return {
    result: res,
  };
}
