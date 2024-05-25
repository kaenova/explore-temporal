export async function BlackboxChangeStringFunction(input: string): Promise<string> {
  console.log("running blackbox function")
  return input + " changed from blackbox"
}