import { Worker } from "@temporalio/worker";
import { namespace, workflowQueueTask } from "./common";

async function run() {
  // Register Workflows with the Worker and connect to
  // the Temporal server.
  const worker = await Worker.create({
    connection: undefined,
    workflowsPath: "./workflow.ts",
    namespace: namespace,
    taskQueue: workflowQueueTask,
  });

  // Start accepting tasks from the Task Queue.
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
