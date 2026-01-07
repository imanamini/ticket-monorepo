/**
 * when user presses the back/close button and back=h query string is present
 * he/she should return back to the last visited URL and not the default one.
 */
export function shouldGoToPreviousUrl(): boolean {
  try {
    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.has('back') && searchParams.get('back') === 'h';
  } catch (error) {
    console.error('Error checking URL parameters:', error);
    return false;
  }
}
