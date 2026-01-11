// =======================================================
// 1. DÉCLARATION DES FONCTIONS MODALES ET VISUELLES GLOBALES
// =======================================================

var modal = document.getElementById("myModal");
var modalImg = document.getElementById("modalImage");
var captionText = document.getElementById("caption");

function openModal(imageSrc, captionText) {
    
    // 1. Ouvrir le modal
    modal.classList.add("is-open");
    document.body.classList.add("modal-open");
    
    modalImg.src = imageSrc;
    captionText.innerHTML = captionText;

    // 2. CORRECTION CRUCIALE : Forcer le modal à se positionner au début du viewport
    modal.scrollTop = 0; 

    // Et on vérifie que le BODY n'est pas décalé (même si ça ne devrait pas être nécessaire)
    document.body.style.top = "0"; 
}


function closeModal() {
    document.body.classList.remove("modal-open");
    modal.classList.remove("is-open");
    
    // Si nous avons utilisé la correction body.style.top, il faut la réinitialiser au body
    // document.body.style.top = "";
}
// Fermer si l'utilisateur clique sur le fond sombre du modal
window.onclick = function(event) {
    const modal = document.getElementById("myModal");
    if (event.target === modal) {
        closeModal();
    }
}

// --- Fonction de Révélation Spécifique (Captures/Outils) ---
// Cette fonction est appelée par l'Observer secondaire.
const revealVisual = function (entries, observer) {
    const [entry] = entries;
    if (!entry.isIntersecting) return;

    // Déclenche la transition CSS (supprime l'état masqué)
    entry.target.classList.remove('section-hidden-visual');
    entry.target.classList.add('section-visible-visual');

    observer.unobserve(entry.target);
};


// =======================================================
// 2. LOGIQUE PRINCIPALE AU CHARGEMENT DU DOCUMENT
// =======================================================
document.addEventListener("DOMContentLoaded", () => {
    
    // --- Animation du Hero (Déjà en place) ---
    const heroElements = document.querySelectorAll('.hero-start-animation');
    heroElements.forEach(el => {
        el.classList.add('visible');
    });

    // ----------------------------------------------------
    // LOGIQUE DE L'OBSERVER PRINCIPAL (Révélation des Sections)
    // ----------------------------------------------------
    const allSections = document.querySelectorAll('.section-hidden');
    
    // Modifie la fonction principale pour lancer l'Observer enfant après révélation
    const revealSection = function (entries, observer) {
        const [entry] = entries;
        if (!entry.isIntersecting) return;
        
        // 1. Révélation de la section parente
        entry.target.classList.remove('section-hidden');
        entry.target.classList.add('section-visible');
        
        observer.unobserve(entry.target);

        // 2. LOGIQUE DE L'OBSERVER ENFANT (Pour la section #veille uniquement)
        if (entry.target.id === 'veille') {
            const visualContainer = entry.target.querySelector('.about__visual-container');
            
            if (visualContainer) {
                // Applique l'état caché APRES que le parent est révélé.
                // Le navigateur voit cet élément passer de "invisible par le parent" à 
                // "visible mais maintenant masqué par section-hidden-visual".
                visualContainer.classList.add('section-hidden-visual'); 
                
                const visualObserver = new IntersectionObserver(revealVisual, {
                    root: null,
                    threshold: 0.05, // Déclenchement dès que possible
                });
                
                // Lance l'observation avec un petit délai pour que le CSS initial soit appliqué
                setTimeout(() => {
                    visualObserver.observe(visualContainer);
                }, 100); 
            }
        }
    };

    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });

    // 🛑 LOGIQUE CORRIGÉE : Révéler immédiatement si la section est déjà à l'écran
    allSections.forEach(function (section) {
        // Vérifie si la section est dans le viewport (sa position Y est inférieure à la hauteur de la fenêtre)
        if (section.getBoundingClientRect().top < window.innerHeight) {
            
            // Révèle immédiatement (même logique que revealSection sans unobserve)
            section.classList.remove('section-hidden');
            section.classList.add('section-visible');
            
            // Si c'est la section #veille, on lance sa logique enfant immédiatement.
            if (section.id === 'veille') {
                const visualContainer = section.querySelector('.about__visual-container');
                if (visualContainer) {
                    // Simule l'effet du revealSection pour l'Observer enfant de la veille
                    visualContainer.classList.remove('section-hidden-visual'); 
                    visualContainer.classList.add('section-visible-visual');
                }
            }
            
        } else {
            // Sinon, on lance l'observation habituelle.
            sectionObserver.observe(section);
        }
    });
    // ----------------------------------------------------
    
    // ----------------------------------------------------
    // LOGIQUE DE HOVER DES CARTES DE COMPÉTENCE (déjà en place)
    // ----------------------------------------------------
    const skillCards = document.querySelectorAll('.skills__skill');
    skillCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.classList.add('is-hovering');
        });
        card.addEventListener('mouseleave', () => {
            card.classList.remove('is-hovering');
        });
    });
    const formElements = document.querySelectorAll('.section-hidden-contact');
        
    const revealForm = function (entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Pour chaque élément, on retire la classe cachée
                entry.target.classList.remove('section-hidden-contact');
                entry.target.classList.add('section-visible-contact');
                observer.unobserve(entry.target);
            }
        });
    };

    if (formElements.length > 0) {
        const formObserver = new IntersectionObserver(revealForm, {
            root: null,
            // Déclencher lorsque 10% de l'élément est visible
            threshold: 0.1, 
        });
        
        // Observez chaque champ individuellement
        formElements.forEach(element => {
            formObserver.observe(element);
        });
    }
    // ----------------------------------------------------
    // LOGIQUE DE RETOUR DU FORMULAIRE (Affichage des messages de succès/erreur)
    // ----------------------------------------------------
    const urlParams = new URLSearchParams(window.location.search);
    const successStatus = urlParams.get('success');

    // Récupérer la section où afficher le message (nous l'ajouterons après)
    const contactSection = document.getElementById('contact');
    
    if (successStatus === 'true' && contactSection) {
        alert("Votre message a été envoyé avec succès !");
        // Optionnel : Supprimer le paramètre de l'URL après affichage
        history.replaceState(null, '', window.location.pathname); 
    } else if (successStatus === 'false' && contactSection) {
        alert(" Une erreur est survenue lors de l'envoi. Veuillez réessayer.");
        history.replaceState(null, '', window.location.pathname);
    } else if (successStatus === 'validation_error' && contactSection) {
        alert(" Veuillez remplir tous les champs correctement.");
        history.replaceState(null, '', window.location.pathname);
    }
}); 


// =======================================================
// 3. LOGIQUE DE NAVIGATION
// (Gérer les liens d'ancres et le menu Hamburger)
// =======================================================

// --- Navigation Desktop ---
const headerDesktopLinks = document.querySelectorAll('.header__link-wrapper a');
headerDesktopLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        const targetId = link.getAttribute('href');
        if (targetId && targetId.startsWith('#') && targetId.length > 1) {
            e.preventDefault();
            const anchor = targetId.substring(1); 
            const targetElement = document.getElementById(anchor);
            
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, null, targetId);
            }
        }
    });
});

// --- Menu Mobile ---
const hamMenuBtn = document.querySelector('.header__main-ham-menu-cont'); 
const smallMenu = document.querySelector('.header__sm-menu'); 
const headerHamMenuBtn = document.querySelector('.header__main-ham-menu'); 
const headerHamMenuCloseBtn = document.querySelector('.header__main-ham-menu-close'); 
const headerSmallMenuLinks = document.querySelectorAll('.header__sm-menu-links .header__sm-menu-link a');

// Gérer l'ouverture/fermeture
if (hamMenuBtn && smallMenu && headerHamMenuBtn && headerHamMenuCloseBtn) {
    hamMenuBtn.addEventListener('click', () => {
        smallMenu.classList.toggle('header__sm-menu--active');
        headerHamMenuBtn.classList.toggle('d-none');
        headerHamMenuCloseBtn.classList.toggle('d-none');
    });
}


// Gérer le clic sur les liens du menu mobile
headerSmallMenuLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault(); 
        
        // Fermeture du menu après clic
        if (smallMenu) {
            smallMenu.classList.remove('header__sm-menu--active');
        }
        if (headerHamMenuBtn && headerHamMenuCloseBtn) {
            headerHamMenuBtn.classList.remove('d-none');
            headerHamMenuCloseBtn.classList.add('d-none');
        }

        let targetId = link.getAttribute('href');
        const anchor = targetId.includes('#') ? targetId.split('#').pop() : null;

        if (anchor) {
            const targetElement = document.getElementById(anchor);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                history.pushState(null, null, '#' + anchor);
            }
        } else {
            // Gérer les liens non-ancre (ex: /contact.html ou lien externe)
            window.location.href = targetId; 
        }
    });
});