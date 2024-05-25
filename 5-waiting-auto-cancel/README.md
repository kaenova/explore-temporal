# 5 Waiting auto cancel

Imagine you have an application that user's need to fill but because it's already too long to wait, the workflow was automatically canceled.
One thing in my mind that we have a service that gets.

Put it simply, it's workflow that waiting for payment for some time. it may failed if the time reached or continue if the payment successfull.

What I learn:
1. You can cancel inside workflow by throwing `CancelledFailure`
1. Hmm you need to poll the timeout with sleep(?)

NOPE!

Rather than using timeout with sleep, we can use condition with timeout. So after the condition are met, we can continue. Check on `workflow.ts` for implementation.