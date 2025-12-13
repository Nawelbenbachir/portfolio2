
document.addEventListener("DOMContentLoaded", () => {

  const hiddenSections = document.querySelectorAll('.section-hidden');

  console.log("Sections trouvées :", hiddenSections.length);

  const observer = new IntersectionObserver((entries, observer) => {

    entries.forEach(entry => {

      console.log("Observer déclenché :", entry.target); 

      if (entry.isIntersecting) {

        entry.target.classList.add('section-visible');

        entry.target.classList.remove('section-hidden');

        observer.unobserve(entry.target);

      }

    });

  }, {

    threshold: 0.1

  });
  const heroElements = document.querySelectorAll('.hero-start-animation');
      
      // Ajoute la classe 'visible' à tous les éléments pour lancer l'animation CSS
      heroElements.forEach(el => {
          el.classList.add('visible');
      });


  hiddenSections.forEach(section => {

    observer.observe(section);

  });

});
// Sélectionne tous les liens A à l'intérieur de LI avec la classe header__link-wrapper
const headerDesktopLinks = document.querySelectorAll('.header__link-wrapper a');

headerDesktopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        
        // On vérifie que c'est un lien d'ancre (commence par # et n'est pas juste #)
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
            
            //  Empêche la navigation par défaut (qui cause le flash ou la redirection)
            e.preventDefault();
            
            const anchor = targetId.substring(1); // Retire le #
            const targetElement = document.getElementById(anchor);
            
            if (targetElement) {
                //  Défile en douceur vers la cible
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                
                //  Met à jour l'URL sans recharger
                history.pushState(null, null, targetId);
            }
        }
    });
});
const hamMenuBtn = document.querySelector('.header__main-ham-menu-cont'); 
const smallMenu = document.querySelector('.header__sm-menu'); 
const headerHamMenuBtn = document.querySelector('.header__main-ham-menu'); 
const headerHamMenuCloseBtn = document.querySelector('.header__main-ham-menu-close'); 

// SÉLECTION DES LIENS DU MENU MOBILE (Nécessaire pour le défilement et la fermeture)
const headerSmallMenuLinks = document.querySelectorAll('.header__sm-menu-links .header__sm-menu-link a');
// ÉCOUTEUR DE CLIC SUR LE BOUTON HAMBURGER
hamMenuBtn.addEventListener('click', () => {
    // Inverse l'état d'affichage du menu mobile
    if (smallMenu.classList.contains('header__sm-menu--active')) {
        smallMenu.classList.remove('header__sm-menu--active');
    } else {
        smallMenu.classList.add('header__sm-menu--active');
    }

    // Inverse l'affichage des icônes (hamburger <-> fermeture X)
    if (headerHamMenuBtn.classList.contains('d-none')) {
        headerHamMenuBtn.classList.remove('d-none');
        headerHamMenuCloseBtn.classList.add('d-none');
    } else {
        headerHamMenuBtn.classList.add('d-none');
        headerHamMenuCloseBtn.classList.remove('d-none');
    }
});
// LOGIQUE DE NAVIGATION DES LIENS DU MENU MOBILE
for (let i = 0; i < headerSmallMenuLinks.length; i++) {
    headerSmallMenuLinks[i].addEventListener('click', (e) => {
        
        // Empêche la navigation par défaut (pour stopper le flash)
        e.preventDefault(); 

        // Ferme le menu mobile
        smallMenu.classList.remove('header__sm-menu--active');
        headerHamMenuBtn.classList.remove('d-none');
        headerHamMenuCloseBtn.classList.add('d-none');

        // Récupère l'ancre et lance le défilement
        let targetId = headerSmallMenuLinks[i].getAttribute('href');
        const anchor = targetId.includes('#') ? targetId.split('#').pop() : null;

        if (anchor) {
            const targetElement = document.getElementById(anchor);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
                history.pushState(null, null, '#' + anchor);
            }
        } else {
            window.location.href = targetId;
        }
    });
}