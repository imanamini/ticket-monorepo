/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./resources/js/app.js":
/*!*****************************!*\
  !*** ./resources/js/app.js ***!
  \*****************************/
/***/ (() => {

document.addEventListener('DOMContentLoaded', function () {
  var buttons = document.querySelectorAll('.ripple-button');
  buttons.forEach(function (button) {
    button.addEventListener('click', function (e) {
      // Get the button's position
      var rect = button.getBoundingClientRect();

      // Create the ripple element
      var ripple = document.createElement('span');
      var size = Math.max(rect.width, rect.height);
      var x = e.clientX - rect.left - size / 2;
      var y = e.clientY - rect.top - size / 2;

      // Set ripple size and position
      ripple.style.width = ripple.style.height = "".concat(size, "px");
      ripple.style.left = "".concat(x, "px");
      ripple.style.top = "".concat(y, "px");
      ripple.classList.add('ripple');

      // Append ripple to the button
      button.appendChild(ripple);

      // Remove the ripple after animation ends
      ripple.addEventListener('animationend', function () {
        ripple.remove();
      });
    });
  });
});
function updateParentClass() {
  var mlpWrapper = document.querySelector('.mlp-wrapper');
  var topFooterSection = document.getElementById('top-footer-section');
  var header = document.getElementById('header');
  var mainNavContainer = document.getElementById('main-nav-container');
  var carousels = document.querySelectorAll('.full-width-carousel');
  carousels.forEach(function (carousel) {
    var parent = carousel.closest('.stores-carousel-box, .products-carousel-box , .incredible-discount-box');
    if (parent) {
      if (window.innerWidth >= 1280) {
        parent.classList.add('container');
        if (!parent.matches('.incredible-discount-box')) {
          parent.classList.remove('pr-plus');
        }
      } else {
        parent.classList.remove('container');
        parent.classList.add('pr-plus');
      }
    }
  });
  if (mlpWrapper) {
    if (window.innerWidth >= 1280) {
      mlpWrapper.classList.add('container');
      mlpWrapper.classList.remove('surface-elevated');
    } else {
      mlpWrapper.classList.remove('container');
      mlpWrapper.classList.add('surface-elevated');
    }
  }
  if (topFooterSection) {
    if (window.innerWidth >= 1280) {
      topFooterSection.classList.add('container');
    } else {
      topFooterSection.classList.remove('container');
    }
  }
  if (header) {
    if (window.innerWidth >= 1280) {
      header.classList.add('pb-plus');
    } else {
      header.classList.remove('pb-plus');
    }
  }
  if (mainNavContainer) {
    if (window.innerWidth >= 1280) {
      mainNavContainer.classList.add('pt-huge');
    } else {
      mainNavContainer.classList.remove('pt-huge');
    }
  }
}

// Run on page load
updateParentClass();

// Listen for window resize events
window.addEventListener('resize', updateParentClass);

/***/ }),

/***/ "./resources/scss/components/badge.scss":
/*!**********************************************!*\
  !*** ./resources/scss/components/badge.scss ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/product-preview.scss":
/*!********************************************************!*\
  !*** ./resources/scss/components/product-preview.scss ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/stores.scss":
/*!***********************************************!*\
  !*** ./resources/scss/components/stores.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/store-preview.scss":
/*!******************************************************!*\
  !*** ./resources/scss/components/store-preview.scss ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/service-card.scss":
/*!*****************************************************!*\
  !*** ./resources/scss/components/service-card.scss ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/icon.scss":
/*!*********************************************!*\
  !*** ./resources/scss/components/icon.scss ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/incredible-discount.scss":
/*!************************************************************!*\
  !*** ./resources/scss/components/incredible-discount.scss ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/services.scss":
/*!*************************************************!*\
  !*** ./resources/scss/components/services.scss ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/charity.scss":
/*!************************************************!*\
  !*** ./resources/scss/components/charity.scss ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/service-wrapper-box.scss":
/*!************************************************************!*\
  !*** ./resources/scss/components/service-wrapper-box.scss ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/services-item.scss":
/*!******************************************************!*\
  !*** ./resources/scss/components/services-item.scss ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/suggestion-result-search.scss":
/*!*****************************************************************!*\
  !*** ./resources/scss/components/suggestion-result-search.scss ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/square-promotion.scss":
/*!*********************************************************!*\
  !*** ./resources/scss/components/square-promotion.scss ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/shop-category.scss":
/*!******************************************************!*\
  !*** ./resources/scss/components/shop-category.scss ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/category-carousel.scss":
/*!**********************************************************!*\
  !*** ./resources/scss/components/category-carousel.scss ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/dynamic-carousel.scss":
/*!*********************************************************!*\
  !*** ./resources/scss/components/dynamic-carousel.scss ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/discount-code.scss":
/*!******************************************************!*\
  !*** ./resources/scss/components/discount-code.scss ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/merchant-list-in-page.scss":
/*!**************************************************************!*\
  !*** ./resources/scss/components/merchant-list-in-page.scss ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/merchant-item.scss":
/*!******************************************************!*\
  !*** ./resources/scss/components/merchant-item.scss ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/bottom-navigation.scss":
/*!**********************************************************!*\
  !*** ./resources/scss/components/bottom-navigation.scss ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/shop.scss":
/*!**********************************!*\
  !*** ./resources/scss/shop.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/products-list.scss":
/*!*******************************************!*\
  !*** ./resources/scss/products-list.scss ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/store.scss":
/*!***********************************!*\
  !*** ./resources/scss/store.scss ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/services.scss":
/*!**************************************!*\
  !*** ./resources/scss/services.scss ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/home.scss":
/*!**********************************!*\
  !*** ./resources/scss/home.scss ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/app.scss":
/*!*********************************!*\
  !*** ./resources/scss/app.scss ***!
  \*********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/header.scss":
/*!************************************!*\
  !*** ./resources/scss/header.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/footer.scss":
/*!************************************!*\
  !*** ./resources/scss/footer.scss ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/button.scss":
/*!***********************************************!*\
  !*** ./resources/scss/components/button.scss ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./resources/scss/components/divider.scss":
/*!************************************************!*\
  !*** ./resources/scss/components/divider.scss ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/bck-assets/js/app": 0,
/******/ 			"bck-assets/css/components/divider": 0,
/******/ 			"bck-assets/css/components/button": 0,
/******/ 			"bck-assets/css/footer": 0,
/******/ 			"bck-assets/css/header": 0,
/******/ 			"bck-assets/css/app": 0,
/******/ 			"bck-assets/css/home": 0,
/******/ 			"bck-assets/css/services": 0,
/******/ 			"bck-assets/css/store": 0,
/******/ 			"bck-assets/css/products-list": 0,
/******/ 			"bck-assets/css/shop": 0,
/******/ 			"bck-assets/css/components/bottom-navigation": 0,
/******/ 			"bck-assets/css/components/merchant-item": 0,
/******/ 			"bck-assets/css/components/merchant-list-in-page": 0,
/******/ 			"bck-assets/css/components/discount-code": 0,
/******/ 			"bck-assets/css/components/dynamic-carousel": 0,
/******/ 			"bck-assets/css/components/category-carousel": 0,
/******/ 			"bck-assets/css/components/shop-category": 0,
/******/ 			"bck-assets/css/components/square-promotion": 0,
/******/ 			"bck-assets/css/components/suggestion-result-search": 0,
/******/ 			"bck-assets/css/components/services-item": 0,
/******/ 			"bck-assets/css/components/service-wrapper-box": 0,
/******/ 			"bck-assets/css/components/charity": 0,
/******/ 			"bck-assets/css/components/services": 0,
/******/ 			"bck-assets/css/components/incredible-discount": 0,
/******/ 			"bck-assets/css/components/icon": 0,
/******/ 			"bck-assets/css/components/service-card": 0,
/******/ 			"bck-assets/css/components/store-preview": 0,
/******/ 			"bck-assets/css/components/stores": 0,
/******/ 			"bck-assets/css/components/product-preview": 0,
/******/ 			"bck-assets/css/components/badge": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunk"] = self["webpackChunk"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/js/app.js")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/app.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/header.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/footer.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/button.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/divider.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/badge.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/product-preview.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/stores.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/store-preview.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/service-card.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/icon.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/incredible-discount.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/services.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/charity.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/service-wrapper-box.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/services-item.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/suggestion-result-search.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/square-promotion.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/shop-category.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/category-carousel.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/dynamic-carousel.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/discount-code.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/merchant-list-in-page.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/merchant-item.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/components/bottom-navigation.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/shop.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/products-list.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/store.scss")))
/******/ 	__webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/services.scss")))
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["bck-assets/css/components/divider","bck-assets/css/components/button","bck-assets/css/footer","bck-assets/css/header","bck-assets/css/app","bck-assets/css/home","bck-assets/css/services","bck-assets/css/store","bck-assets/css/products-list","bck-assets/css/shop","bck-assets/css/components/bottom-navigation","bck-assets/css/components/merchant-item","bck-assets/css/components/merchant-list-in-page","bck-assets/css/components/discount-code","bck-assets/css/components/dynamic-carousel","bck-assets/css/components/category-carousel","bck-assets/css/components/shop-category","bck-assets/css/components/square-promotion","bck-assets/css/components/suggestion-result-search","bck-assets/css/components/services-item","bck-assets/css/components/service-wrapper-box","bck-assets/css/components/charity","bck-assets/css/components/services","bck-assets/css/components/incredible-discount","bck-assets/css/components/icon","bck-assets/css/components/service-card","bck-assets/css/components/store-preview","bck-assets/css/components/stores","bck-assets/css/components/product-preview","bck-assets/css/components/badge"], () => (__webpack_require__("./resources/scss/home.scss")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;