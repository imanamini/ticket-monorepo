export function readOtpSms(minute = 2): Promise<string> {
  return new Promise((resolve, reject) => {
    const signal = new AbortController();
    setTimeout(
      () => {
        signal.abort();
      },
      minute * 60 * 1000,
    );

    if ('OTPCredential' in window) {
      try {
        if (navigator.credentials) {
          try {
            const content: any = navigator.credentials.get(<CredentialRequestOptions>{
              otp: { transport: ['sms'] },
              abort: signal.signal,
            });
            resolve(content.code);
          } catch (err) {
            reject(err);
          }
        }
      } catch (err) {
        reject(err);
      }
    }
  });
}
