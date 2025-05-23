document.addEventListener('DOMContentLoaded', () => { // Ensure DOM is loaded

    // --- Elements ---
    const header = document.querySelector('.main-header');
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
    const closeNavBtn = document.querySelector('.close-nav');
    const overlayNavLinks = document.querySelectorAll('.overlay-nav ul li a');
    const body = document.body;

    // --- Footer Current Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Header Hide/Show on Scroll ---
    let lastScrollTop = 0;
    if (header) { // Check if header exists
        window.addEventListener('scroll', () => {
            let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            // Check scroll position relative to header height to avoid hiding too early
            if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
                // Scrolling Down past header height
                if (!header.classList.contains('header-hidden')) {
                     console.log('Hiding Header'); // Debug Log
                     header.classList.add('header-hidden');
                     // Hamburger visibility is mainly handled by CSS media queries now,
                     // but ensure it's potentially visible when header hides on desktop
                     if (hamburgerBtn && window.innerWidth > 992) {
                          hamburgerBtn.classList.add('hamburger-visible');
                     }
                }
            } else {
                // Scrolling Up or at top (or not past header height)
                 if (header.classList.contains('header-hidden')) {
                     console.log('Showing Header'); // Debug Log
                     header.classList.remove('header-hidden');
                      if (hamburgerBtn && window.innerWidth > 992) {
                         // Hide hamburger ONLY if it was made visible by JS on desktop
                         hamburgerBtn.classList.remove('hamburger-visible');
                     }
                 }
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        }, false);
    } else {
         console.error("Could not find .main-header element");
    }

    

    // --- Hamburger Menu Toggle ---
    if (hamburgerBtn && mobileNavOverlay) { // Check if elements exist
        hamburgerBtn.addEventListener('click', () => {
            console.log('Hamburger clicked'); // Debug Log
            mobileNavOverlay.classList.add('overlay-active');
            body.classList.add('overlay-open'); // Prevent body scroll
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        });
    } else {
         if (!hamburgerBtn) console.error("Could not find .hamburger-menu element");
         if (!mobileNavOverlay) console.error("Could not find .mobile-nav-overlay element");
    }

    // --- Close Overlay ---
    if (closeNavBtn && mobileNavOverlay) { // Check if elements exist
        closeNavBtn.addEventListener('click', closeOverlay);
    } else {
         if (!closeNavBtn) console.error("Could not find .close-nav element");
    }

    // --- Close Overlay When Link is Clicked ---
    if(overlayNavLinks.length > 0 && mobileNavOverlay){
        overlayNavLinks.forEach(link => {
            link.addEventListener('click', closeOverlay); // Close when any overlay link is clicked
        });
    }

    // --- Function to Close Overlay ---
    function closeOverlay() {
         if (mobileNavOverlay && hamburgerBtn) {
             console.log('Closing overlay'); // Debug Log
             mobileNavOverlay.classList.remove('overlay-active');
             body.classList.remove('overlay-open'); // Re-enable body scroll
             hamburgerBtn.setAttribute('aria-expanded', 'false');
         }
    }


    // --- Smooth Scroll Animation ---
    const fadeInSections = document.querySelectorAll('.fade-in-section');
    if (fadeInSections.length > 0) {
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    console.log('Element intersecting:', entry.target); // DEBUG LOG
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px', threshold: 0.1 });

        fadeInSections.forEach(section => {
             if (section) {
                sectionObserver.observe(section);
             } else {
                  console.error("Tried to observe a non-existent section");
             }
        });
    } else {
        console.log('No elements with .fade-in-section found to observe.');
    }


/* --- START: Random Moving & Fading Ambient Background Logic (v3 - 2 Lights with Blend) --- */
const rootStyle = document.documentElement.style;

// --- Configuration ---
const lights = [
    { id: 'blue', opacityVar: '--light-blue-opacity', xVar: '--light-blue-x', yVar: '--light-blue-y', sizeVar: '--light-blue-size' },
    { id: 'pink', opacityVar: '--light-pink-opacity', xVar: '--light-pink-x', yVar: '--light-pink-y', sizeVar: '--light-pink-size' }
];
const dimOpacity = 0;
const brightOpacity = 1; // CSS color alpha controls actual brightness
const minDelay = 3000; // Min time before next change (3s)
const maxDelay = 8000; // Max time before next change (8s)
const minX = 5;  const maxX = 95;
const minY = 5;  const maxY = 95;
const minSize = 40; const maxSize = 60; // Size range (vmax)
const positionUpdateDelay = 150; // Delay (ms) AFTER moving BEFORE fading in

console.log('Initializing random moving ambient light effect (v3 - 2 Lights)...');

// --- Function to Update a Single Light ---
function updateLight(light) {
    try {
        const currentOpacity = parseFloat(rootStyle.getPropertyValue(light.opacityVar)) || 0;
        // Decide whether to fade IN (and move) or fade OUT
        const shouldFadeOut = (currentOpacity > dimOpacity) && (Math.random() < 0.4); // 40% chance to fade out

        if (shouldFadeOut) {
            // --- Fade Out ---
            console.log(`Fading out ${light.id} Light`);
            rootStyle.setProperty(light.opacityVar, dimOpacity);
        } else if (currentOpacity < brightOpacity) {
            // --- Fade In / Move ---
            // 1. Calculate new random position & size
            const newX = Math.random() * (maxX - minX) + minX;
            const newY = Math.random() * (maxY - minY) + minY;
            const newSize = Math.random() * (maxSize - minSize) + minSize;
            console.log(`Moving ${light.id} Light to ${newX.toFixed(0)}%, ${newY.toFixed(0)}% then fading in`);

            // 2. Ensure opacity is 0 *first*
            rootStyle.setProperty(light.opacityVar, dimOpacity);

            // 3. Set new position/size variables immediately
            rootStyle.setProperty(light.xVar, `${newX.toFixed(2)}%`);
            rootStyle.setProperty(light.yVar, `${newY.toFixed(2)}%`);
            rootStyle.setProperty(light.sizeVar, `${newSize.toFixed(0)}vmax`);

            // 4. Wait briefly, then trigger fade-in
            setTimeout(() => {
                if (parseFloat(rootStyle.getPropertyValue(light.opacityVar)) <= dimOpacity) {
                    console.log(`Fading in ${light.id} Light at new position`);
                    rootStyle.setProperty(light.opacityVar, brightOpacity);
                }
            }, positionUpdateDelay);
        }
    } catch (error) {
        console.error(`Error updating ${light.id} light:`, error);
    }
}

// --- Function to Schedule the Next Random Update ---
function scheduleNextUpdate() {
    const nextDelay = Math.random() * (maxDelay - minDelay) + minDelay;
    setTimeout(() => {
        // Choose which light to potentially update next (0 or 1)
        const targetLightIndex = Math.floor(Math.random() * lights.length); // Index 0 or 1
        updateLight(lights[targetLightIndex]); // Attempt to update the chosen light
        scheduleNextUpdate(); // Schedule the *next* random update attempt
    }, nextDelay);
}

// --- Initial Start ---
// Ensure lights start faded out
rootStyle.setProperty(lights[0].opacityVar, dimOpacity);
rootStyle.setProperty(lights[1].opacityVar, dimOpacity);
// Start the random scheduling loop
scheduleNextUpdate(); // Begin the cycle

/* --- END: Random Moving & Fading Ambient Background Logic (v3) --- */

/* --- START: Add NEW Interactive Logo Backlight Logic --- */
// --- Interactive Logo Backlight ---
const logoLink = document.querySelector('.logo a');

if (logoLink) {
    // Define the light colors
    const logoLightColors = [
        'rgba(0, 123, 255, 0.8)', // Brighter Blue for logo
        'rgba(233, 69, 96, 0.8)'  // Brighter Pink for logo
    ];
    let currentLogoColorIndex = 0; // Start with blue

    // Set initial background color
    logoLink.style.setProperty('--logo-light-color', logoLightColors[currentLogoColorIndex]);

    logoLink.addEventListener('mousemove', (e) => {
        const rect = logoLink.getBoundingClientRect();
        // Calculate mouse position relative to the element
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Calculate position as percentage
        const xPercent = (x / rect.width) * 100;
        const yPercent = (y / rect.height) * 100;

        // Update CSS variables on the logo element itself
        logoLink.style.setProperty('--logo-mouse-x', `${xPercent}%`);
        logoLink.style.setProperty('--logo-mouse-y', `${yPercent}%`);

        // Optionally change color slightly on move (e.g., random small hue shift)
        // Or change color completely randomly:
         if (Math.random() > 0.98) { // Low probability on each move event
             currentLogoColorIndex = (currentLogoColorIndex + 1) % logoLightColors.length;
             logoLink.style.setProperty('--logo-light-color', logoLightColors[currentLogoColorIndex]);
             console.log("Logo light color changed"); // Debug Log
         }

        // console.log(`Logo Mouse: ${xPercent}%, ${yPercent}%`); // Debug Log
    });

    // Optional: Reset position or effect when mouse leaves
    logoLink.addEventListener('mouseleave', () => {
        logoLink.style.setProperty('--logo-mouse-x', '50%');
        logoLink.style.setProperty('--logo-mouse-y', '-100%'); // Move light away off top
    });

    console.log('Interactive logo effect initialized.');
} else {
    console.error("Could not find .logo a element");
}
/* --- END: Add NEW Interactive Logo Backlight Logic --- */
    
    // --- Contact Form Handling (Keep as before) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // ... (form code remains the same) ...
         contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            // ... form processing ...
            console.log('Form submitted (frontend)'); // Keep logs
            alert('Thank you! (Frontend confirmation only - submission needs setup)');
        });
    }

    // --- Active Navigation Link Highlighting (Keep as before) ---
    try {
        // ... (nav highlighting code remains the same) ...
    } catch (e) {
        console.error("Error highlighting navigation:", e);
    }

}); // End DOMContentLoaded listener
