/**
 * Kerjago User Workflow in short are:
 * 1. User Order CV Review
 *    - Send email to payment
 * 2. User Pay
 *    - Send email to user
 *    - after 1 minute, send email to user to remind payment
 *    - If user not pay in time (2 minutes), the workflow/order will be cancelled
 * 3. User Waiting for CV Review
 * 4. Admin Get notification when user waiting for CV Review
 *    - If the admin have not review the CV in time, the workflow will notify the admin every 1 minutes
 * 5. Admin Upload the CV Review results
 * 6. User Get the CV Review results by Emails
 */

import {
  CancelledFailure,
  condition,
  defineSignal,
  proxyActivities,
  setHandler,
} from "@temporalio/workflow";
import * as activities from "./activity";
import { activityQueueTask } from "./common";

const paymentMaxDurationMs = 1 * 60 * 1000; // 1 minute
const paymentReminderDurationMs = 30 * 1000; // 30 seoconds
const adminReviewCVReminderDurationMs = 1 * 60 * 1000 // 1 minute

export interface CVReviewOrderWorkflowArgs {
  orderId: string;
}

export interface CVReviewOrderWorkflowOutput {
  orderId: string;
}

export interface PaymentDataSignal {
  data: string;
}

export interface ReviewCVDataSignal {
  data: string;
}

const paymentSignal = defineSignal<[PaymentDataSignal]>("PaymentSignal");
const adminReviewCv = defineSignal<[ReviewCVDataSignal]>("AdminReviewCV");

export async function CVReviewOrderWorkflow(
  args: CVReviewOrderWorkflowArgs
): Promise<CVReviewOrderWorkflowOutput> {
  const {
    SendEmailAdminReviewReminder,
    SendEmailCVReviewResults,
    SendEmailNeedPayment,
    SendEmailOrderCanceled,
    SendEmailPaymentReminder,
    SendEmailPaymentSuccessfull,
    SendEmailUserWaitingForCVReview,
    UploadCVReviewResults,
    UpdateStatus,
  } = proxyActivities<typeof activities>({
    retry: {
      initialInterval: "1 second",
      maximumInterval: "1 minute",
      backoffCoefficient: 2,
      maximumAttempts: 500,
      nonRetryableErrorTypes: ["ApplicationFailure", "CancelledFailure"],
    },
    taskQueue: activityQueueTask,
    startToCloseTimeout: "120 seconds",
  });

  // 1. User Order CV Review
  await SendEmailNeedPayment();
  await UpdateStatus(args.orderId, "waiting_payment");

  // 2. User Pay
  let paymentDataSignal: PaymentDataSignal | null = null;
  setHandler(paymentSignal, (data) => {
    paymentDataSignal = data;
  });

  condition(() => paymentDataSignal !== null, paymentReminderDurationMs)
    .then(() => {
      SendEmailPaymentReminder();
    })
    .catch((err) => {
      console.error(err);
    });

  const paymentSuccess = await condition(
    () => paymentDataSignal !== null,
    paymentMaxDurationMs
  );

  if (!paymentSuccess) {
    await SendEmailOrderCanceled();
    await UpdateStatus(args.orderId, "canceled");
    throw new CancelledFailure("Payment timed out");
  }
  await SendEmailPaymentSuccessfull();

  // 3. User Waiting for CV Review
  await UpdateStatus(args.orderId, "waiting_cv_review");

  // 4. Admin Get notification when user waiting for CV Review
  await SendEmailUserWaitingForCVReview();

  // 5. Admin Upload the CV Review results
  let reviewCVDataSignal: ReviewCVDataSignal | null = null;
  setHandler(adminReviewCv, (data) => {
    reviewCVDataSignal = data;
  });
  while (reviewCVDataSignal == null) {
    const reviewCVSuccess = await condition(
      () => reviewCVDataSignal !== null,
      adminReviewCVReminderDurationMs
    );
    if (!reviewCVSuccess) {
      await SendEmailAdminReviewReminder();
    }
  }

  await UploadCVReviewResults();
  await UpdateStatus(args.orderId, "completed");

  // 6. User Get the CV Review results by Emails
  await SendEmailCVReviewResults();

  return {
    orderId: args.orderId,
  };
}
