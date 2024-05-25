import { Connection, WorkflowClient } from "@temporalio/client";
import { HelloWorldWorkflow, type HelloWorldWorkflowArgs } from "./workflow";
import { workflowQueueTask } from "./common";

async function run() {
  const connection = await Connection.connect({
    address: "localhost:7233",
  });
  const client = new WorkflowClient({
    connection: connection,
    namespace: "default",
  });

  console.log("Starting HelloWorldWorkflow...");
  const workflowArgs: HelloWorldWorkflowArgs = {
    params1: "Hello World using function",
  };
  const workflow = await client.start(HelloWorldWorkflow, {
    args: [workflowArgs],
    workflowId: "HelloWorldWorkflow2",
    taskQueue: workflowQueueTask,
  });

  console.log(
    `Started Workflow ${workflow.workflowId} with RunID ${workflow.firstExecutionRunId}`
  );
  console.log(await workflow.result());
}

run();
