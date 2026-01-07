import * as Sentry from '@sentry/angular-ivy';
import { EventManagementService } from '@client-monorepo/common/event-management';

export async function retryImport(
  originalFn: () => Promise<any>,
  retries = 3,
  delay = 1000,
  eventManagementService?: EventManagementService,
): Promise<any> {
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
      // const urlObj = new URL(window.location.href);
      // const pageUrl = urlObj.pathname;
      // const dataValue = {
      //   reloadCauseRoot: 'retry-import-monorepo',
      // };
      // eventManagementService?.triggerEvent(
      //   {
      //     eventType: 'custom',
      //     breadCrumbs: [pageUrl],
      //     data: {
      //       key: 'updateCount',
      //       value: JSON.stringify(dataValue),
      //     },
      //   },
      //   true,
      // );
      // setTimeout(() => {
      //   window.location.reload();
      // }, 0);
      window.location.reload();
      throw error;
    }
  }
}
