/** @format */
let numberSlider = document.getElementsByClassName('numberSlider');
var swiper = new Swiper('#how_work .swiper', {

  pagination: {
    el: '.swiper-paginations',
    type: 'fraction',
  },
  navigation: {
    nextEl: '#how_work .swiper-next',
    prevEl: '#how_work .swiper-prev',
  },
  effect: 'fade',
  thumbs: {
    swiper: swiper,
  },
  on: {
    'slideChange': function ( swiper ) {
      numberSlider[ 0 ].innerHTML = swiper.activeIndex + 1;
      numberSlider[ 1 ].innerHTML = swiper.activeIndex + 1;
    }
  }
});
var swiper2 = new Swiper('#how_work .texts', {
  slidesPerView: 1,
  watchSlidesProgress: true,
});

const openBtn = document.getElementById('openModalBtn');
const modal = document.getElementById('videoModal');
const closeBtn = document.getElementById('closeModalBtn');
const video = document.getElementById('modalVideo');

openBtn.addEventListener('click', () => {
  modal.style.display = 'flex';
  video.play();
});

closeBtn.addEventListener('click', () => {
  video.pause();
  video.currentTime = 0;
  modal.style.display = 'none';
});

// Close modal when clicking outside the video content
window.addEventListener('click', ( event ) => {
  if (event.target === modal) {
    video.pause();
    video.currentTime = 0;
    modal.style.display = 'none';
  }
});

const amountRange = document.getElementById('amountRange');

let selector = document.getElementById('selector');
let currentAmount = document.getElementById('currentAmount');
let monthlyProfit = document.getElementById('monthlyProfit');
let creaditCan = document.getElementById('creaditCan');

amountRange.oninput = function () {
  calculation(this);
};

calculation(amountRange);

function calculation ( el ) {
  currentAmount.innerHTML = el.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  selector.style.left = Math.round(el.value / 1000000) + '%';
  monthlyProfit.innerHTML = Math.round(( Number(el.value) * 0.3 )).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  creaditCan.innerHTML = Math.round(Number(el.value)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

document.addEventListener('DOMContentLoaded', function () {
  // Select all accordion headers
  const accordionHeaders = document.querySelectorAll('.accordion-header');

  // Add click event listeners to each accordion header
  accordionHeaders.forEach(( header ) => {
    header.addEventListener('click', toggleAccordion);
  });

  function toggleAccordion ( event ) {
    const allItems =
      document.querySelectorAll('.accordion-content');
    const allToggleButtons =
      document.querySelectorAll('.accordion-sign');

    // Find the content section associated with the clicked header
    const clickedItem = event.target.closest('.flex.flex-col');
    const clickedContent =
      clickedItem.querySelector('.accordion-content');
    const clickedToggle =
      clickedItem.querySelector('.accordion-sign');

    // Check if the clicked section is already open
    const isOpen = clickedContent.classList.contains('collapse');

    // Close all sections
    allItems.forEach(( item ) => {
      item.classList.add('collapse');
      item.style.height = '0px'; // Reset height when closing
    });
    allToggleButtons.forEach(( button ) => {
      button.textContent = '+'; // Reset all toggle buttons to "+"
    });

    // If clicked section was closed, open it
    if (isOpen) {
      clickedContent.classList.remove('collapse');
      clickedContent.style.height =
        clickedContent.scrollHeight + 'px'; // Set the height to scrollHeight for smooth expansion
      clickedToggle.textContent = '-'; // Change the "+" to "-"
    }
  }
});


