import { Connection, WorkflowClient } from "@temporalio/client";
import { workflowId, workflowQueueTask } from "./common";

// Get ArgV for runId only on second position
const runId = process.argv[2];

async function run() {
  const connection = await Connection.connect({
    address: "localhost:7233",
  });
  const client = new WorkflowClient({
    connection: connection,
    namespace: "default",
  });

  const workflow = client.getHandle(workflowId, runId);
  await workflow.cancel();
  console.log(
    `Workflow ${workflow.workflowId} with RunID ${runId} has been cancelled`
  );
}

run();
