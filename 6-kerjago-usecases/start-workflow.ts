import { Connection, WorkflowClient } from "@temporalio/client";
import { workflowId, workflowQueueTask } from "./common";
import { CVReviewOrderWorkflowArgs } from "./workflow";

async function run() {
  const connection = await Connection.connect({
    address: "localhost:7233",
  });
  const client = new WorkflowClient({
    connection: connection,
    namespace: "default",
  });

  console.log("Starting Workflow...");
  const workflowArgs: CVReviewOrderWorkflowArgs = {
    orderId: 'test1'
  };

  const workflow = await client.start("CVReviewOrderWorkflow", {
    args: [workflowArgs],
    workflowId: workflowId,
    taskQueue: workflowQueueTask,
  });

  console.log(
    `Started Workflow ${workflow.workflowId} with RunID ${workflow.firstExecutionRunId}`
  );
  console.log(await workflow.result());
}

run();
