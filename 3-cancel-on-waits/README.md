# 3 Cancel on Waits

Just a simple workflow to cancel if there's external disruption other than from the workflow.

What I learn:
1. To cancel the workflow you need to know the run Id and the workflow Id.
1. Using the temporal client api, get the workflow handle first and then cancel it. See the implementation on the `cancel-workflow.ts`