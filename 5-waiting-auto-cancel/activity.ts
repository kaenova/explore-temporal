export async function BlackboxChangeStringFunction(input: string): Promise<string> {
  console.log("running blackbox function")
  return input + " changed from blackbox"
}

export async function ConcatString(input: string, input2: string): Promise<string> {
  console.log("running concat function")
  return input + " " + input2
}

export async function IsTimeout(id: string): Promise<boolean> {
  console.log("running timeout function")
  return Math.random() < 0.2
}

export async function SendEmailPaymentSuccessfull(): Promise<string> {
  console.log("sending email")
  return "email sent"
}