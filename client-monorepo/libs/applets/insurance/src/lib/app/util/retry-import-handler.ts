import * as Sentry from '@sentry/angular-ivy';

export async function retryImport(originalFn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> {
  const maxRetries = retries;

  try {
    return await originalFn();
  } catch (error) {
    if (retries > 0) {
      const attemptNumber = maxRetries - retries + 1;

      Sentry.captureMessage(`Import retry attempt ${attemptNumber} of ${maxRetries}`, {
        level: 'warning',
        tags: {
          retry_attempt: attemptNumber,
          max_retries: maxRetries,
          remaining_retries: retries,
        },
        extra: {
          error_message: error instanceof Error ? error.message : String(error),
          error_stack: error instanceof Error ? error.stack : undefined,
          function_name: originalFn.name || 'anonymous',
        },
      });

      await new Promise((resolve) => setTimeout(resolve, delay));
      retries--;
      return retryImport(originalFn, retries, delay);
    } else {
      Sentry.captureException('Import retry attempt failed', {
        level: 'error',
        tags: {
          retry_failed: true,
          total_attempts: maxRetries,
        },
        extra: {
          message: 'All import retry attempts failed, reloading page',
          error: error,
        },
      });

      window.location.reload();
      throw error;
    }
  }
}
