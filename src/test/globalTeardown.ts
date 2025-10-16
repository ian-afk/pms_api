export default async function globalTeardown(): Promise<void> {
  await globalThis.__MONGOINSTANCE.stop();
}
