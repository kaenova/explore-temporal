import { NativeConnection, Worker } from "@temporalio/worker";
import { activityQueueTask, namespace, workflowQueueTask } from "./common";
import * as activities from "./activity";

async function run() {
  // Register Workflows with the Worker and connect to
  // the Temporal server.
  const worker = await Worker.create({
    connection: undefined,
    activities: activities,
    namespace: namespace,
    taskQueue: activityQueueTask,
  });

  // Start accepting tasks from the Task Queue.
  await worker.run();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
