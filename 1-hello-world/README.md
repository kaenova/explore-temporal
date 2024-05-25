# 1 Hello World

Just a simple workflow to change a input string to another string using "blackbox" function.

What I learn:
1. Worker and Activity worker can be using different Task Queue. In my case i'm using Task Queue that're defined in the `common.ts`.
2. To assign a Task Queue for workflow, you will defined it in the temporal io client workflow invokes. You can check on `start-workflow.ts`
3. To assign a Task Queue for activity, you need to define it on the workflow it self. The logic is that the workflow will invoke some activities that'll be using this queue. You can check the `workflow.ts` in the `proxyActivities` function.