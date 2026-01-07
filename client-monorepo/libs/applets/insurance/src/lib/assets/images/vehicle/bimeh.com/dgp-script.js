console.log('>>>************************************<<<');
console.log('BODY SCRIPT LOADED!!!!');
console.log('%c[Injected Script] Running in iframe. Attempting to override targetFunction.', 'color: red;background-color: yellow');

var POST_MESSAGE_TYPE = {
  SCRIPT_LOADED: 'SCRIPT_LOADED',
  URL_CHANGE: 'URL_CHANGE',
  UNAUTHORIZED: 'UNAUTHORIZED',
  GO_TO_PAYMENT: 'GO_TO_PAYMENT',
  NAVIGATE_TO_URL: 'NAVIGATE_TO_URL',
  GO_TO_MY_POLICIES: 'GO_TO_MY_POLICIES',
  API_LOG: 'API_LOG',
};

var parentOrigin = 'https://app.mydigipay.com';

disablePLPWalkthrough();
postScriptLoadedMessage();
window.requestIdleCallback(() => handleRedirection());

window.addEventListener('message', function ( event ) {
  if (parentOrigin.includes(event.origin)) {
    switch (event.data.type) {
      case POST_MESSAGE_TYPE.NAVIGATE_TO_URL:
        const path = event.data.url;
        window.location.assign(path);
        break;
      default:
        console.warn('Unknown message type from parent:', event.data);
    }
  }
});

( function ( open, send ) {
  XMLHttpRequest.prototype.open = function ( method, url, ...rest ) {
    this._method = method;
    this._url = url;
    this._startTime = Date.now(); // Start time
    return open.apply(this, [ method, url, ...rest ]);
  };

  var originalSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function ( body ) {
    this.addEventListener('readystatechange', function ( event ) {
      if (this.readyState === 4) {
        let original = this.responseText;
        try {
          let json = JSON.parse(original);
          json.intercepted = true;
          Object.defineProperty(this, 'responseText', {value: JSON.stringify(json)});
        } catch (e) {
        }
        if (this._url.includes('coreapi.bimeh.com')) {
          const latency = Date.now() - ( this._startTime || Date.now() );
          const logData = {
            method: this._method,
            url: this._url,
            status: this.status,
            latency // in ms
          };
          postMessageToParent(POST_MESSAGE_TYPE.API_LOG, logData);
        }
      }
    });
    this.addEventListener('load', function () {
      if (this.status === 401 || this.status === 440) {
        postMessageToParent(POST_MESSAGE_TYPE.UNAUTHORIZED, window.location.href);
      }
    });
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[ _key ] = arguments[ _key ];
    }
    return originalSend.apply(this, args);
  };
} )(XMLHttpRequest.prototype.open, XMLHttpRequest.prototype.send);

function postScriptLoadedMessage () {
  postMessageToParent(POST_MESSAGE_TYPE.SCRIPT_LOADED);
}

function postMessageToParent ( type, payload ) {
  if (window.location.origin.includes('https://digipay.bimeh.com')) {
    window.parent.postMessage({type: type, payload: payload}, parentOrigin);
  }
}

function disablePLPWalkthrough () {
  localStorage.setItem('placed', 0);
}

function sendCurrentReferrerToParent () {
  postMessageToParent(POST_MESSAGE_TYPE.URL_CHANGE, window.document.referrer);
}

function handleRedirection () {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const redirectUrl = urlParams.get('redirectUrlTo');
  if (redirectUrl) {
    window.location.origin = 'https://digipay.bimeh.com/' + redirectUrl;
  }
}

setInterval(function () {
  sendCurrentReferrerToParent();
}, 3000);

const observer = new MutationObserver(() => {
  const btn = document.querySelector('.after-payment > button.ant-btn.ant-btn-default.btn-filled.back-surface-color.primary-bk-color.link');
  if (btn) {
    if (!document.location.href.includes('paymentfailed')) {
      btn.addEventListener('click', function ( event ) {
        event.preventDefault();
        event.stopPropagation();
        postMessageToParent(POST_MESSAGE_TYPE.GO_TO_MY_POLICIES);
      });
    }
    observer.disconnect(); // stop observing once found
  }
});
if (document.body) {
  observer.observe(document.body, {childList: true, subtree: true});
}
