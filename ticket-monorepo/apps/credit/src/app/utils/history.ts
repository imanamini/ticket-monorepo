/**
 * when user presses the back/close button and back=h query string is present
 * he/she should return back to the last visited URL and not the default one.
 */
const shouldGoToPreviousUrl = () => {
  let searchParams = new URLSearchParams(window.location.search);
  return (searchParams.has('back') && searchParams.get('back') === 'h');
};

export {
  shouldGoToPreviousUrl,
};
