/**
 * Based on the Workflow, we can create the following Activity:
 * User:
 * 1. SendEmailNeedPayment
 * 2. SendEmailPaymentSuccessfull
 * 3. SendEmailPaymentReminder
 * 4. SendEmailOrderCanceled
 * 5. SendEmailCVReviewResults
 * Admin:
 * 1. SendEmailOrderCVReview
 * 2. SendEmailUserPay
 * 3. SendEmailUserWaitingForCVReview
 * 4. SendEmailAdminReviewReminder
 * 5. UploadCVReviewResults
 */

export async function SendEmailNeedPayment(): Promise<string> {
  console.log("sending email to user to pay");
  return "SendEmailNeedPayment email sent";
}

export async function SendEmailPaymentSuccessfull(): Promise<string> {
  console.log("sending email to user that payment is successfull");
  return "SendEmailPaymentSuccessfull email sent";
}

export async function SendEmailPaymentReminder(): Promise<string> {
  console.log("sending email to user to remind payment");
  return "SendEmailPaymentReminder email sent";
}

export async function SendEmailOrderCanceled(): Promise<string> {
  console.log("sending email to user that order is canceled");
  return "SendEmailOrderCanceled email sent";
}

export async function SendEmailCVReviewResults(): Promise<string> {
  console.log("sending email to user with CV review results");
  return "SendEmailCVReviewResults email sent";
}

export async function SendEmailUserWaitingForCVReview(): Promise<string> {
  console.log("sending email to admin that user is waiting for CV review");
  return "SendEmailUserWaitingForCVReview email sent";
}

export async function SendEmailAdminReviewReminder(): Promise<string> {
  console.log("sending email to admin to remind CV review");
  return "SendEmailAdminReviewReminder email sent";
}

export async function UploadCVReviewResults(): Promise<string> {
  console.log("uploading CV review results");
  return "UploadCVReviewResults uploaded";
}

export async function UpdateStatus(
  orderId: string,
  status: string
): Promise<string> {
  console.log(`updating status for order ${orderId} to ${status}`);
  return `UpdateStatus updated status for order ${orderId} to ${status}`;
}
