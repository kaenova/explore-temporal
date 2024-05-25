# 2 Waiting for User Invocation

Just a simple workflow to continue a workflow that're on hold by user invocation.

What I learn:
1. Signal is a type of unit to handle input asynchronously
1. To wait for signal, rather using sleep, using condition is much better. Check implementation on `workflow.ts`