export function generateDeviceUid(): string | null {
  if (localStorage.getItem('__dp_machine_id')) {
    return localStorage.getItem('__dp_machine_id');
  }
  if (crypto && typeof crypto.randomUUID === 'function') {
    const machineId = crypto.randomUUID();
    localStorage.setItem('__dp_machine_id', machineId);
    return machineId;
  }
  const timeStamp = Math.floor(Date.now()).toString();
  let result = '';
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < 20) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    if (timeStamp.charAt(counter)) {
      result += timeStamp.charAt(counter);
    }
    counter += 1;
  }
  localStorage.setItem('__dp_machine_id', result);
  return result;
}

export function getIOSVersion() {
  const match = navigator.userAgent.match(/OS (\d+)_(\d+)_?(\d+)?/);
  return {
    major: parseInt(match[1]),
    minor: parseInt(match[2]),
    version: match[1] + '.' + match[2],
  };
}

export function isIOsDevice() {
  const w = window as any;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !w.MSStream;
}

const getBrowserName = () => {
  const test = (regexp: any) => regexp.test(window.navigator.userAgent);
  switch (true) {
    case test(/edg/i):
      return 'Microsoft Edge';
    case test(/trident/i):
      return 'Internet Explorer';
    case test(/firefox|fxios/i):
      return 'Firefox';
    case test(/opr\//i):
      return 'Opera';
    case test(/ucbrowser/i):
      return 'UC Browser';
    case test(/samsungbrowser/i):
      return 'Samsung Browser';
    case test(/chrome|chromium|crios/i):
      return 'Chrome';
    case test(/safari/i):
      return 'Safari';
    default:
      return 'Unknown';
  }
};

const getOsName = () => {
  const userAgent = window.navigator.userAgent,
    platform = window.navigator.platform,
    macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
    windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
    iosPlatforms = ['iPhone', 'iPad', 'iPod'];
  let os = 'Unknown';

  if (macosPlatforms.indexOf(platform) !== -1) {
    os = 'Mac OS';
  } else if (iosPlatforms.indexOf(platform) !== -1) {
    os = 'iOS';
  } else if (windowsPlatforms.indexOf(platform) !== -1) {
    os = 'Windows';
  } else if (/Android/.test(userAgent)) {
    os = 'Android';
  } else if (!os && /Linux/.test(platform)) {
    os = 'Linux';
  }

  return os;
};

export { getBrowserName, getOsName };
