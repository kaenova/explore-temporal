import { Connection, WorkflowClient } from "@temporalio/client";
import { workflowId, workflowQueueTask } from "./common";
import { DefferedWorkflow, Args } from "./workflow";

async function run() {
  const connection = await Connection.connect({
    address: "localhost:7233",
  });
  const client = new WorkflowClient({
    connection: connection,
    namespace: "default",
  });

  console.log("Starting Workflow...");
  const workflowArgs: Args = {
    params1: "Waiting for user invoke using function",
  };

  const workflow = await client.start("DefferedWorkflow", {
    args: [workflowArgs],
    workflowId: workflowId,
    taskQueue: workflowQueueTask,
    startDelay: "360 seconds",
  });

  console.log(
    `Started Workflow ${workflow.workflowId} with RunID ${workflow.firstExecutionRunId}`
  );
  console.log(await workflow.result());
}

run();
