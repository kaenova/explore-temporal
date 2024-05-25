# 1 Hello World

Just a simple workflow to change a input string to another string using "blackbox" function.

What I learn:
1. You need a worker to run the workflow and the activity.
1. Temporal uses task queue to manage and distribute workflow or activity to run to the worker.
1. Workflow Worker and Activity worker can listen to different Task Queue. In my case i'm using Task Queue that're defined in the `common.ts`.
1. To assign a Task Queue for workflow, you will defined it in the temporal io client workflow invokes. You can check on `start-workflow.ts`
1. To assign a Task Queue for activity, you need to define it on the workflow it self. The logic is that the workflow will invoke some activities that'll be using this queue. You can check the `workflow.ts` in the `proxyActivities` function.