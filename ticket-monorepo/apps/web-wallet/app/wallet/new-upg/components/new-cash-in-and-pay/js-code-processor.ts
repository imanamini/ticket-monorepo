export function extractJavaScriptCode(htmlContent: string): string | null {
  const scriptRegex = /<script type="text\/javascript">(.*?)<\/script>/s;
  const match = htmlContent.match(scriptRegex);
  let extractedCode = '';
  const scriptContent = match[1];

  if (scriptContent) {
    const startPattern = 'window.onload = function () {';
    const endPattern = '}';
    const startIndex = scriptContent.indexOf(startPattern);
    const endIndex = scriptContent.lastIndexOf(endPattern);
    if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
      extractedCode = scriptContent.substring(startIndex + startPattern.length, endIndex).trim();
    }
  }

  return extractedCode
}

export function runJavaScriptCode(jsCode: string): void {
  try {
    const scriptFunction = new Function(jsCode);
    scriptFunction();
  } catch (error) {
    console.error('Error running JavaScript code:', error);
  }
}
