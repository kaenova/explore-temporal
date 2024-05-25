import { Connection, WorkflowClient } from "@temporalio/client";
import { workflowQueueTask } from "./common";
import { WaitingForUserInvokeWorkflow, WaitingForUserInvokeWorkflowArgs } from "./workflow";

async function run() {
  const connection = await Connection.connect({
    address: "localhost:7233",
  });
  const client = new WorkflowClient({
    connection: connection,
    namespace: "default",
  });

  console.log("Starting HelloWorldWorkflow...");
  const workflowArgs: WaitingForUserInvokeWorkflowArgs = {
    params1: "Waiting for user invoke using function",
  };
  const workflow = await client.start(WaitingForUserInvokeWorkflow, {
    args: [workflowArgs],
    workflowId: "WaitingForUserInvoke1",
    taskQueue: workflowQueueTask,
  });

  console.log(
    `Started Workflow ${workflow.workflowId} with RunID ${workflow.firstExecutionRunId}`
  );
  console.log(await workflow.result());
}

run();
