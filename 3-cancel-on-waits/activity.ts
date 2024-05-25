export async function BlackboxChangeStringFunction(input: string): Promise<string> {
  console.log("running blackbox function")
  return input + " changed from blackbox"
}

export async function ConcatString(input: string, input2: string): Promise<string> {
  console.log("running concat function")
  return input + " " + input2
}