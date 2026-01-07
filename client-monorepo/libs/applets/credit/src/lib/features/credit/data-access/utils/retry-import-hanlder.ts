export async function retryImport(originalFn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> {
  try {
    return await originalFn();
  } catch (error) {
    if (retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      retries--;
      return retryImport(originalFn, retries, delay);
    } else {
      window.location.reload();
      throw error;
    }
  }
}
