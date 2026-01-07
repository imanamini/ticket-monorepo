/******/ (() => { // webpackBootstrap
/*!********************************!*\
  !*** ./resources/js/header.js ***!
  \********************************/
document.addEventListener("DOMContentLoaded", function () {
  var mobileBtn = document.querySelector(".mobile_btn");
  var mainMenu = document.querySelector(".main_menu");
  var nav = document.querySelector("nav");
  var header = document.querySelector(".header");
  var stickyHeader = document.querySelector(".header-sticky");
  var backdrop = document.getElementById('backdrop');
  var footer = document.getElementById('footer');
  var main = document.getElementById('main');
  var searchMobile = document.querySelector('.search-mobile');
  var bottomNavigation = document.getElementById('bottomNavigation');
  var searchBack = document.querySelector('.search-back');
  if (mobileBtn) {
    var openMenu = mobileBtn.querySelector('.open-menu');
    var closeMenu = mobileBtn.querySelector('.close-menu');
    mobileBtn.addEventListener("click", function () {
      if (mainMenu) {
        mainMenu.style.display = mainMenu.style.display === "none" || !mainMenu.style.display ? "block" : "none";
      }
      var spans = mobileBtn.querySelectorAll('span.x-icon');
      spans.forEach(function (span) {
        span === null || span === void 0 || span.classList.toggle('d-block');
        span === null || span === void 0 || span.classList.toggle('d-none');
      });
    });
    openMenu.addEventListener('click', function () {
      footer === null || footer === void 0 || footer.classList.add('content-hide');
      main === null || main === void 0 || main.classList.add('content-hide');
      searchMobile === null || searchMobile === void 0 || searchMobile.classList.add('content-hide');
      bottomNavigation === null || bottomNavigation === void 0 || bottomNavigation.classList.add('content-hide');
      searchBack === null || searchBack === void 0 || searchBack.classList.add('content-hide');
    });
    closeMenu.addEventListener('click', function () {
      if (resultsContainer3.classList.contains('d-none')) {
        footer === null || footer === void 0 || footer.classList.remove('content-hide');
        main === null || main === void 0 || main.classList.remove('content-hide');
        bottomNavigation === null || bottomNavigation === void 0 || bottomNavigation.classList.remove('content-hide');
      }
      searchMobile === null || searchMobile === void 0 || searchMobile.classList.remove('content-hide');
      searchBack === null || searchBack === void 0 || searchBack.classList.remove('content-hide');
    });
  }
  var searchIcon = document.getElementById('searchIcon');
  var searchBox = document.getElementById('searchBox');
  var magnet = document.getElementById('magnet');
  searchIcon.addEventListener('click', function () {
    searchBox.classList.add('expanded');
    searchIcon.classList.add('d-none');
    magnet.classList.remove('d-none');
  });

  // Collapse search box and show icon when clicking outside
  document.addEventListener('click', function (event) {
    var isClickInsideSearchBox = searchBox.contains(event.target);
    var isClickOnSearchIcon = searchIcon.contains(event.target);
    if (!isClickInsideSearchBox && !isClickOnSearchIcon) {
      searchBox.classList.remove('expanded');
      searchIcon.classList.remove('d-none');
      magnet.classList.add('d-none');
    }
  });
  document.querySelectorAll('li.l1').forEach(function (li) {
    var subMenu = li.querySelector('ul.sub_menu');
    var arrowIcon = li.querySelector('span.d-s-block');
    if (!subMenu && arrowIcon) {
      arrowIcon.remove();
    }
  });
  if (window.innerWidth <= 1280) {
    var submenus = document.querySelectorAll('.sub_menu_level1');
    submenus.forEach(function (menu) {
      menu === null || menu === void 0 || menu.classList.replace('d-flex', 'd-none');
      var l1 = menu === null || menu === void 0 ? void 0 : menu.closest('.l1');
      var arrowUp = l1.querySelector('span.arrow-up');
      var arrowdown = l1.querySelector('span.arrow-down');
      l1.addEventListener("click", function () {
        menu === null || menu === void 0 || menu.classList.toggle('d-none');
        menu === null || menu === void 0 || menu.classList.toggle('d-flex');
        arrowUp.classList.toggle('d-none');
        arrowUp.classList.toggle('d-block');
        arrowdown.classList.toggle('d-none');
        arrowdown.classList.toggle('d-block');
      });
    });
    var allLevel1 = document.querySelectorAll('.level1');
    allLevel1.forEach(function (level1) {
      level1.addEventListener("click", function () {
        event.stopPropagation();
      });
    });
    var level2 = document.querySelectorAll('.level2-menu');
    level2.forEach(function (level2) {
      var iconColorLevel2 = level2.querySelector('.icon-color');
      if (window.innerWidth >= 1280) {
        level2.addEventListener('mouseenter', function () {
          if (iconColorLevel2) {
            iconColorLevel2.classList.add('active');
          }
        });
        level2.addEventListener('mouseleave', function () {
          if (iconColorLevel2) {
            iconColorLevel2.classList.remove('active');
          }
        });
      }
      level2 === null || level2 === void 0 || level2.classList.replace('d-flex', 'd-none');
      level2.closest('.level1').addEventListener("click", function () {
        event.stopPropagation();
        level2 === null || level2 === void 0 || level2.classList.toggle('d-none');
        level2 === null || level2 === void 0 || level2.classList.toggle('d-flex');
        level2 === null || level2 === void 0 || level2.classList.toggle('hidden-opacity');
        level2 === null || level2 === void 0 || level2.classList.toggle('visible-opacity');
      });
    });
    var menuLinks = document.querySelectorAll(".main_menu ul li a");
    menuLinks.forEach(function (link) {
      link.addEventListener("click", function () {
        var parent = link.closest(".has_dropdown");
        if (parent) {
          var subMenu = parent.querySelector(".sub_menu");
          if (subMenu) {
            subMenu.style.paddingLeft = "15px";
            subMenu.style.display = subMenu.style.display === "none" || !subMenu.style.display ? "block" : "none";
          }
        }
      });
    });
  }
  document.querySelectorAll('ul.sub_menu_level1 > li').forEach(function (submenu) {
    var firstLevel1 = submenu.querySelector('.level1'); // Select the first level1 element
    var level2Menu = submenu.querySelector('ul.level2-menu');
    if (level2Menu) {
      var level2Li = level2Menu.querySelectorAll('li');
      level2Li.forEach(function (li) {
        li.addEventListener('mouseenter', function () {
          li.classList.add('active');
        });
        li.addEventListener('mouseleave', function () {
          li.classList.remove('active');
        });
      });
    }
    var divider = document.querySelectorAll('.custom-divider');
    divider.forEach(function (divider) {
      divider.style.display = 'none';
    });
    if (level2Menu) {
      submenu.addEventListener('mouseenter', function () {
        var _submenu$closest;
        (_submenu$closest = submenu.closest('ul.sub_menu_level1')) === null || _submenu$closest === void 0 || _submenu$closest.classList.add('custom-width');
        divider.forEach(function (divider) {
          divider.style.display = 'block';
        });
      });
      submenu.addEventListener('mouseleave', function () {
        var _submenu$closest2;
        (_submenu$closest2 = submenu.closest('ul.sub_menu_level1')) === null || _submenu$closest2 === void 0 || _submenu$closest2.classList.remove('custom-width');
        divider.forEach(function (divider) {
          divider.style.display = 'none';
        });
      });
    }
  });
  document.querySelectorAll('.level1').forEach(function (level1Item) {
    var iconColor = level1Item.querySelector('.icon-color');
    level1Item.addEventListener('mouseenter', function () {
      if (window.innerWidth >= 1280) {
        level1Item === null || level1Item === void 0 || level1Item.classList.add('active');
        if (iconColor) {
          iconColor.classList.add('active');
        }
      }
      var level2Menu = level1Item.querySelector('.level2-menu');
      if (level2Menu) {
        level2Menu.style.opacity = '1';
        level2Menu.style.visibility = 'visible';
      }
    });
    level1Item.addEventListener('mouseleave', function () {
      level1Item === null || level1Item === void 0 || level1Item.classList.remove('active');
      if (iconColor) {
        iconColor.classList.remove('active');
      }
      var level2Menu = level1Item.querySelector('.level2-menu');
      if (level2Menu) {
        level2Menu.style.opacity = '0';
        level2Menu.style.visibility = 'hidden';
      }
    });
  });
  if (window.innerWidth >= 1280) {
    document.querySelectorAll('li').forEach(function (li) {
      li.addEventListener("mouseenter", function () {
        var _li$querySelector;
        (_li$querySelector = li.querySelector('a span')) === null || _li$querySelector === void 0 || _li$querySelector.classList.add('active');
      });
      li.addEventListener("mouseleave", function () {
        var _li$querySelector2;
        (_li$querySelector2 = li.querySelector('a span')) === null || _li$querySelector2 === void 0 || _li$querySelector2.classList.remove('active');
      });
    });
  }

  //bottom header js

  if (window.innerWidth > 1280) {
    var lastScrollTop = 0;
    document.addEventListener("scroll", function () {
      var currentScroll = window.pageYOffset || document.documentElement.scrollTop;
      if (currentScroll >= 100) {
        if (currentScroll > lastScrollTop) {
          // Scrolling down
          nav.style.visibility = "hidden";
          nav.style.opacity = "0";
          header.style.visibility = "hidden";
          header.style.opacity = "0";
          stickyHeader.style.visibility = "visible";
          stickyHeader.style.opacity = "1";
        } else {
          // Scrolling up
          nav.style.visibility = "visible";
          nav.style.opacity = "1";
          header.style.visibility = "visible";
          header.style.opacity = "1";
          stickyHeader.style.visibility = "hidden";
          stickyHeader.style.opacity = "0";
        }
      } else {
        // At the top of the page
        nav.style.visibility = "visible";
        nav.style.opacity = "1";
        header.style.visibility = "visible";
        header.style.opacity = "1";
        stickyHeader.style.visibility = "hidden";
        stickyHeader.style.opacity = "0";
      }
      lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
    });
  }
  var searchTimeout;
  var searchInput = document.getElementById('searchInput');
  var searchInput2 = document.getElementById('searchInput2');
  var searchInput3 = document.getElementById('searchInput3');
  var resultsContainer = document.getElementById("results");
  var resultsContainer2 = document.getElementById("results2");
  var resultsContainer3 = document.getElementById("results3");
  var closeIcons = document.querySelectorAll('.close-icon');
  var searcBar = document.querySelector('.search-bar');
  var searcBarMobile = document.querySelector('.search-bar-mobile');
  var suggestionComponent = document.getElementById("suggestionResultComponent");
  var suggestionComponent2 = document.getElementById("suggestionResultComponent2");
  var suggestionComponent3 = document.getElementById("suggestionResultComponent3");
  searchInput.addEventListener("focus", function () {
    resultsContainer === null || resultsContainer === void 0 || resultsContainer.classList.remove("d-none");
    backdrop === null || backdrop === void 0 || backdrop.classList.add('visible');
    toggleBodyScroll(true);
    closeIcons.forEach(function (close) {
      close === null || close === void 0 || close.classList.remove('d-none');
    });
    searcBar === null || searcBar === void 0 || searcBar.classList.add('focus-input');
  });
  var abortController = new AbortController();
  searchInput2.addEventListener("focus", function () {
    setTimeout(function () {
      resultsContainer2 === null || resultsContainer2 === void 0 || resultsContainer2.classList.remove("d-none");
      backdrop === null || backdrop === void 0 || backdrop.classList.add('visible');
      toggleBodyScroll(true);
      closeIcons.forEach(function (close) {
        close === null || close === void 0 || close.classList.remove('d-none');
      });
      searcBar === null || searcBar === void 0 || searcBar.classList.add('focus-input');
    }, 500);
  });
  searchInput3.addEventListener("focus", function () {
    setTimeout(function () {
      resultsContainer3 === null || resultsContainer3 === void 0 || resultsContainer3.classList.remove("d-none");
      footer === null || footer === void 0 || footer.classList.add('content-hide');
      main === null || main === void 0 || main.classList.add('content-hide');
      bottomNavigation === null || bottomNavigation === void 0 || bottomNavigation.classList.add('content-hide');
      searchBack === null || searchBack === void 0 || searchBack.classList.remove("d-none");
      closeIcons.forEach(function (close) {
        close === null || close === void 0 || close.classList.remove('d-none');
      });
      searcBarMobile === null || searcBarMobile === void 0 || searcBarMobile.classList.add('focus-input');
      document.body.classList.add("no-scroll");
      var previousScrollTop = 0; // Track the previous scroll position

      // Add scroll event listener to resultsContainer3
      resultsContainer3.addEventListener('scroll', function () {
        var currentScrollTop = this.scrollTop; // Current scroll position
        var halfScrollHeight = this.scrollHeight / 2; // Half of the scrollable height

        if (currentScrollTop > previousScrollTop) {
          // Detect downward scroll
          if (currentScrollTop + this.clientHeight >= halfScrollHeight) {
            var query = searchInput3.value;
            fetchSuggestions(query, true);
          }
        }

        // Update the previous scroll position
        previousScrollTop = currentScrollTop;
      });
    }, 500);
  });

  // Function to toggle body scroll
  function toggleBodyScroll(disable) {
    document.body.style.overflow = disable ? 'hidden' : '';
  }
  closeIcons.forEach(function (close) {
    close.addEventListener("click", function () {
      // Clear search inputs
      searchInput.value = "";
      searchInput2.value = "";
      searchInput3.value = "";

      // Hide the close icon
      close === null || close === void 0 || close.classList.add('d-none');

      // Remove focus classes
      searcBar === null || searcBar === void 0 || searcBar.classList.remove('focus-input');
      searcBarMobile === null || searcBarMobile === void 0 || searcBarMobile.classList.remove('focus-input');
    });
  });
  var currentPage = 0; // Track the current page number
  var isLoading = false; // Prevent multiple requests

  var components = [suggestionComponent, suggestionComponent2, suggestionComponent3];
  function loadSkeleton() {
    components.forEach(function (component) {
      var skeletonItems = '';
      for (var i = 0; i < 5; i++) {
        skeletonItems += "\n                                 <div class=\"stores-wrapper d-flex align-items-center gap-low\">\n                                 <div class=\"logo-wrapper radius-minus p-small surface-back d-flex align-items-center justify-content-center skeleton-logo\"></div>\n                                 <div class=\"title text-onback-medium c-2 skeleton-text\"></div>\n                                 </div>";
      }

      // Set the innerHTML of the component
      component.innerHTML = "\n                        <div class=\"suggestion-result-wrapper py-plus px-small\">\n                        <div class=\"d-flex flex-column gap-plus\">\n                              <div class=\"skeleton pr-plus\">\n                              <p class=\"c-1 text-onback-high skeleton-title\"></p>\n                                <div class=\"d-flex flex-column gap-minus result\">\n                                   ".concat(skeletonItems, "\n                                 </div>\n                                 </div>\n                           </div>\n                       </div>");
    });
  }
  var searchInputs = [{
    type: 'header',
    element: searchInput
  }, {
    type: 'sticky',
    element: searchInput2
  }, {
    type: 'mobile',
    element: searchInput3
  }];
  searchInputs.forEach(function (searchInputObj) {
    var element = searchInputObj.element;
    element.addEventListener('click', function (event) {
      if (event.key !== 'Enter' && searchInput.value === '') {
        if (isLoading) return;
        isLoading = true;
        loadSkeleton();
        fetch("/header-search?query=", {
          headers: {
            'X-Requested-With': 'XMLHttpRequest' // Identify as an AJAX request
          },
          signal: abortController.signal
        }).then(function (response) {
          return response.text();
        }).then(function (html) {
          var components = [suggestionComponent, suggestionComponent2, suggestionComponent3];
          components.forEach(function (component) {
            return component.innerHTML = html;
          });
          isLoading = false;
          invokeSuggestionResult();
        });
      }
    });
    element.addEventListener('keyup', function (event) {
      if (event.key !== 'Enter') {
        var query = event.target.value;
        // Clear previous timeout
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function () {
          if (query.trim() !== '' && query.length > 2) {
            abortController.abort(); // Abort the previous request
            abortController = new AbortController();
            loadSkeleton();
            fetch("/header-search?query=".concat(encodeURIComponent(query)), {
              headers: {
                'X-Requested-With': 'XMLHttpRequest' // Identify as an AJAX request
              },
              signal: abortController.signal
            }).then(function (response) {
              return response.text();
            }).then(function (html) {
              components.forEach(function (component) {
                return component.innerHTML = html;
              });
              isLoading = false;
              InvokeSuggestion();
            });
          } else {
            loadSkeleton();
            fetch("/header-search?query=", {
              headers: {
                'X-Requested-With': 'XMLHttpRequest' // Identify as an AJAX request
              },
              signal: abortController.signal
            }).then(function (response) {
              return response.text();
            }).then(function (html) {
              components.forEach(function (component) {
                return component.innerHTML = html;
              });
              isLoading = false;
              invokeSuggestionResult();
            });
          }
        }, 400);

        // Delay in milliseconds
      } else {
        event.preventDefault();
        var _query = event.target.value;
        if (searchInputObj.type === 'mobile') {
          currentPage = 0;
          fetchSuggestions(_query, false);
        } else {
          abortController.abort();
          abortController = new AbortController();
          resultsContainer === null || resultsContainer === void 0 || resultsContainer.classList.toggle("d-none");
          resultsContainer2 === null || resultsContainer2 === void 0 || resultsContainer2.classList.toggle("d-none");
          window.location.assign("/search?query=".concat(encodeURIComponent(_query)));
        }
      }
    });
  });
  function InvokeSuggestion() {
    var suggestionComponentsArray = [{
      component: suggestionComponent,
      input: searchInput
    }, {
      component: suggestionComponent2,
      input: searchInput2
    }, {
      component: suggestionComponent3,
      input: searchInput3
    }];
    suggestionComponentsArray.forEach(function (_ref) {
      var component = _ref.component,
        input = _ref.input;
      var suggestions = component.querySelectorAll('.search-box .searchSuggestion');
      suggestions.forEach(function (suggestion) {
        suggestion.addEventListener('click', function () {
          input.value = suggestion.querySelector('span').innerHTML;
          if (input === searchInput3) {
            fetchSuggestions(input.value, false);
          } else {
            resultsContainer === null || resultsContainer === void 0 || resultsContainer.classList.toggle("d-none");
            resultsContainer2 === null || resultsContainer2 === void 0 || resultsContainer2.classList.toggle("d-none");
            window.location.assign("/search?query=".concat(encodeURIComponent(suggestion.querySelector('span').innerHTML)));
          }
        });
      });
    });
  }
  function invokeSuggestionResult() {
    var suggestionComponentsArray = [{
      component: suggestionComponent,
      input: searchInput
    }, {
      component: suggestionComponent2,
      input: searchInput2
    }, {
      component: suggestionComponent3,
      input: searchInput3
    }];
    suggestionComponentsArray.forEach(function (_ref2) {
      var component = _ref2.component,
        input = _ref2.input;
      var suggestionsResultChips = component.querySelectorAll('.suggested-search-result .suggestion-chips');
      suggestionsResultChips.forEach(function (chips) {
        chips.addEventListener('click', function () {
          input.value = chips.innerHTML.trim();
          if (input === searchInput3) {
            fetchSuggestions(input.value, false);
          } else {
            resultsContainer === null || resultsContainer === void 0 || resultsContainer.classList.toggle("d-none");
            resultsContainer2 === null || resultsContainer2 === void 0 || resultsContainer2.classList.toggle("d-none");
            window.location.assign("/search?query=".concat(encodeURIComponent(chips.innerHTML.trim())));
          }
        });
      });
    });
  }
  function fetchSuggestions(query) {
    var hasScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function () {
      if (query.trim() !== '' && query.length > 2) {
        if (hasScroll) {
          currentPage++;
        } else {
          currentPage = 0;
        }
        if (!hasScroll) {
          abortController.abort();
          abortController = new AbortController();
        }
        if (currentPage === 0) {
          loadSkeleton();
        }
        fetch("/header-search?query=".concat(encodeURIComponent(query), "&products=true&page=").concat(currentPage, "&size=30"), {
          headers: {
            'X-Requested-With': 'XMLHttpRequest' // Identify as an AJAX request
          },
          signal: abortController.signal
        }).then(function (response) {
          return response.text();
        }).then(function (html) {
          var components = [suggestionComponent, suggestionComponent2, suggestionComponent3];
          if (!hasScroll) {
            components.forEach(function (component) {
              return component.innerHTML = html;
            });
          } else {
            var tempContainer = document.createElement('div');
            tempContainer.innerHTML = html;
            var newProducts = tempContainer.querySelector('.suggestion-result-wrapper .products .result');
            if (newProducts) {
              components.forEach(function (component) {
                var existingProducts = component.querySelector('.suggestion-result-wrapper .products .result');
                if (existingProducts) existingProducts.innerHTML += newProducts.innerHTML;
              });
            }
          }
          InvokeSuggestion();
          isLoading = false;
        });
      } else {
        fetch("/header-search?query=", {
          headers: {
            'X-Requested-With': 'XMLHttpRequest' // Identify as an AJAX request
          },
          signal: abortController.signal
        }).then(function (response) {
          return response.text();
        }).then(function (html) {
          var components = [suggestionComponent, suggestionComponent2, suggestionComponent3];
          components.forEach(function (component) {
            return component.innerHTML = html;
          });
          isLoading = false;
          invokeSuggestionResult();
        })["catch"](function () {
          isLoading = false;
        });
      }
    }, 400);
  }
  searchBack.addEventListener("click", function () {
    resultsContainer3 === null || resultsContainer3 === void 0 || resultsContainer3.classList.add("d-none");
    footer === null || footer === void 0 || footer.classList.remove('content-hide');
    main === null || main === void 0 || main.classList.remove('content-hide');
    bottomNavigation === null || bottomNavigation === void 0 || bottomNavigation.classList.remove('content-hide');
    searcBarMobile === null || searcBarMobile === void 0 || searcBarMobile.classList.remove('focus-input');
    searchBack === null || searchBack === void 0 || searchBack.classList.add("d-none");
    searchInput3.value = '';
  });
  document.addEventListener("click", function (event) {
    var isClickInsideSearchOrResults = searchInput.contains(event.target) || searchInput2.contains(event.target) || resultsContainer.contains(event.target) || resultsContainer2.contains(event.target) || closeIcons.forEach(function (close) {
      close.contains(event.target);
    });
    if (!isClickInsideSearchOrResults) {
      resultsContainer === null || resultsContainer === void 0 || resultsContainer.classList.add("d-none");
      resultsContainer === null || resultsContainer === void 0 || resultsContainer.classList.remove("d-block");
      resultsContainer2 === null || resultsContainer2 === void 0 || resultsContainer2.classList.add("d-none");
      resultsContainer2 === null || resultsContainer2 === void 0 || resultsContainer2.classList.remove("d-block");
      toggleBodyScroll(false);
      searchInput.value = "";
      searchInput2.value = "";
      searchInput2.blur();
      closeIcons.forEach(function (close) {
        close === null || close === void 0 || close.classList.add('d-none');
      });
      searcBar === null || searcBar === void 0 || searcBar.classList.remove('focus-input');
      backdrop === null || backdrop === void 0 || backdrop.classList.remove('visible');
    } else {
      if (resultsContainer2.contains(event.target)) {
        searchInput2.focus();
        searchInput2.style.width = "350px";
      }
    }
    var isClickingResult3 = searchInput3.contains(event.target) || resultsContainer3.contains(event.target) || mobileBtn.contains(event.target);
    if (!isClickingResult3) {
      document.body.classList.remove("no-scroll");
    }
  });
});
/******/ })()
;