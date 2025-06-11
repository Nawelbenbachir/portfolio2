// ---
const hamMenuBtn = document.querySelector('.header__main-ham-menu-cont')
const smallMenu = document.querySelector('.header__sm-menu')
const headerHamMenuBtn = document.querySelector('.header__main-ham-menu')
const headerHamMenuCloseBtn = document.querySelector(
  '.header__main-ham-menu-close'
)
const headerSmallMenuLinks = document.querySelectorAll('.header__sm-menu-link')

hamMenuBtn.addEventListener('click', () => {
  if (smallMenu.classList.contains('header__sm-menu--active')) {
    smallMenu.classList.remove('header__sm-menu--active')
  } else {
    smallMenu.classList.add('header__sm-menu--active')
  }
  if (headerHamMenuBtn.classList.contains('d-none')) {
    headerHamMenuBtn.classList.remove('d-none')
    headerHamMenuCloseBtn.classList.add('d-none')
  } else {
    headerHamMenuBtn.classList.add('d-none')
    headerHamMenuCloseBtn.classList.remove('d-none')
  }
})

for (let i = 0; i < headerSmallMenuLinks.length; i++) {
  headerSmallMenuLinks[i].addEventListener('click', () => {
    smallMenu.classList.remove('header__sm-menu--active')
    headerHamMenuBtn.classList.remove('d-none')
    headerHamMenuCloseBtn.classList.add('d-none')
  })
}

const headerLogoConatiner = document.querySelector('.header__logo-container');

if (headerLogoConatiner) {
  headerLogoConatiner.addEventListener('click', () => {
    location.href = 'index.html';
  });
}

// animation au scroll
// document.addEventListener("DOMContentLoaded", () => {
//   const hiddenSections = document.querySelectorAll('.section-hidden');

//   const observer = new IntersectionObserver((entries, observer) => {
//     entries.forEach(entry => {
//       if (entry.isIntersecting) {
//         entry.target.classList.add('section-visible');
//         entry.target.classList.remove('section-hidden');
//         observer.unobserve(entry.target); // optionnel : n'observe qu'une fois
//       }
//     });
//   }, {
//     threshold: 0.1
//   });

//   hiddenSections.forEach(section => {
//     observer.observe(section);
//   });
// });
// document.querySelectorAll('.section-hidden')
document.addEventListener("DOMContentLoaded", () => {
  const hiddenSections = document.querySelectorAll('.section-hidden');

  console.log("Sections trouvées :", hiddenSections.length);

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      console.log("Observer déclenché :", entry.target); // DEBUG
      if (entry.isIntersecting) {
        entry.target.classList.add('section-visible');
        entry.target.classList.remove('section-hidden');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  hiddenSections.forEach(section => {
    observer.observe(section);
  });
});