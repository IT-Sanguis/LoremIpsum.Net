const header = document.querySelector("header");
let headerHeight = header.clientHeight;
const intro = document.querySelector(".intro");

const anchors = document.querySelectorAll('a[href^="#"]');
const navAnchors = document.querySelectorAll('.main-nav a[href^="#"]');


const burger = document.querySelector(".page-header__burger");
const nav = document.querySelector(".main-nav");

const burgerOpenClass = "page-header__burger--open";
const navOpenClass = "main-nav--open";

const currentLinkClass = "main-nav__link--current";

// Динамический отступ от хедера
const setPaddingTop = () => {
  if (header && intro) {
    let paddingTop = header.offsetHeight;
    let currentPaddingTop = parseInt(intro.style.paddingTop, 10) || 0;

    if (paddingTop > currentPaddingTop) {    // Проверка, чтобы при резайзе оставался наибольший паддинг.
      intro.style.paddingTop = `${paddingTop}px`;
    }
  }
};

// Функция задержки для ограничения частоты вызова
const debounce = (fn, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
};

document.addEventListener("DOMContentLoaded", setPaddingTop);
window.addEventListener("resize", debounce(setPaddingTop, 100));



document.addEventListener('click', (event) => {
  if (nav.classList.contains(navOpenClass)) {
    const targetElement = event.target;
    const isHeaderClicked = header.contains(targetElement);

    if (!isHeaderClicked) {
      burger.classList.remove(burgerOpenClass);
      nav.classList.remove(navOpenClass);
    }
  }
});


// Переход по якорям при скролле
const scrollSetCurrentLink = (scrollPosition, currentLinkClass) => {
  navAnchors.forEach(element => {
    if (element.hash) {
      const section = document.querySelector(element.hash);
      if (section) {
        const sectionPosition = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPosition >= sectionPosition && scrollPosition < sectionPosition + sectionHeight) {
          element.classList.add(currentLinkClass);
        } else {
          element.classList.remove(currentLinkClass);
        }
      }
    }
  });
}


document.addEventListener('scroll', () => {
  let scrollPosition = window.scrollY;
  scrollSetCurrentLink(scrollPosition, currentLinkClass);
  if (scrollPosition > headerHeight) {
    header.classList.add("page-header--scroll");
  } else {
    header.classList.remove("page-header--scroll");
  }
});


// Переход по якорям при клике
anchors.forEach(element => {
  element.addEventListener("click", (event) => {
    event.preventDefault();
    if (element.hash) {
      const section = document.querySelector(element.hash);
      if (section) {
        if ("scrollBehavior" in document.documentElement.style) {
          window.scrollTo({
            top: section.offsetTop,
            behavior: 'smooth'
          });
        } else {
          window.scrollTo({
            top: section.offsetTop,
            behavior: 'auto'
          });
        }
      }
    }
  });
});


// Бургер
burger.addEventListener("click", (e) => {
  e.preventDefault();
  burger.classList.toggle(burgerOpenClass);
  nav.classList.toggle(navOpenClass);
});



const element = document.querySelector('.js-choice');
const choices = new Choices(element, {
  searchEnabled: false,
  itemSelectText: '',
  shouldSort: false,
  shouldSortItems: false
});
