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


/* --- START: Random Moving & Fading Ambient Background Logic (v2 - Smoother Fade-in & Stability) --- */
const rootStyle = document.documentElement.style;

// --- Configuration ---
const lightConfig = [ // Optional config if colors differ significantly later
    { id: 1, variableColor: '--light-color-blue' },
    { id: 2, variableColor: '--light-color-pink' },
    { id: 3, variableColor: '--light-color-blue' }
];
const dimOpacity = 0;       // Opacity when faded out
const brightOpacity = 1;    // Opacity when faded in (actual brightness from CSS color alpha)
const minDelay = 3000;      // Min time before next change (3s) - Increased slightly
const maxDelay = 8000;      // Max time before next change (8s) - Increased slightly
const minX = 5;  const maxX = 95; // X Position range %
const minY = 5;  const maxY = 95; // Y Position range %
const minSize = 35; const maxSize = 55; // Size range (vmax)
const positionUpdateDelay = 150; // Delay (ms) AFTER moving BEFORE fading in

console.log('Initializing random moving ambient light effect (v2)...');

// --- Function to Update a Single Light ---
function updateLight(lightNumber) {
    try { // Add basic error handling
        // Decide whether to fade IN (and move) or fade OUT
        // Bias slightly towards fading in if currently dim
        const currentOpacity = parseFloat(rootStyle.getPropertyValue(`--light${lightNumber}-opacity`)) || 0;
        const shouldFadeOut = (currentOpacity > dimOpacity) && (Math.random() < 0.4); // 40% chance to fade out if currently bright

        if (shouldFadeOut) {
            // --- Fade Out ---
            console.log(`Fading out Light ${lightNumber}`);
            rootStyle.setProperty(`--light${lightNumber}-opacity`, dimOpacity);

        } else if (currentOpacity < brightOpacity) { // Only fade in if not already bright
            // --- Fade In / Move ---
            // 1. Calculate new random position & size
            const newX = Math.random() * (maxX - minX) + minX;
            const newY = Math.random() * (maxY - minY) + minY;
            const newSize = Math.random() * (maxSize - minSize) + minSize;

            console.log(`Moving Light ${lightNumber} to ${newX.toFixed(0)}%, ${newY.toFixed(0)}% then fading in`);

            // 2. Ensure opacity is 0 *first* (it likely already is if fading in)
            rootStyle.setProperty(`--light${lightNumber}-opacity`, dimOpacity);

            // 3. Set new position/size variables immediately
            rootStyle.setProperty(`--light${lightNumber}-x`, `${newX.toFixed(2)}%`);
            rootStyle.setProperty(`--light${lightNumber}-y`, `${newY.toFixed(2)}%`);
            rootStyle.setProperty(`--light${lightNumber}-size`, `${newSize.toFixed(0)}vmax`);

            // 4. Wait briefly for position to apply, then trigger fade-in
            setTimeout(() => {
                 // Check if opacity is still dim before fading in
                 // (prevents interrupting a fade-out triggered immediately after)
                 if (parseFloat(rootStyle.getPropertyValue(`--light${lightNumber}-opacity`)) <= dimOpacity) {
                     console.log(`Fading in Light ${lightNumber} at new position`);
                     rootStyle.setProperty(`--light${lightNumber}-opacity`, brightOpacity);
                 }
            }, positionUpdateDelay);
        }
        // else: Already bright, do nothing this cycle or potentially just move without fade? (kept simple for now)

    } catch (error) {
        console.error(`Error updating light ${lightNumber}:`, error);
    }
}

// --- Function to Schedule the Next Random Update ---
function scheduleNextUpdate() {
    const nextDelay = Math.random() * (maxDelay - minDelay) + minDelay;
    // console.log(`Next light update in ${Math.round(nextDelay / 1000)} seconds`);
    setTimeout(() => {
        // Choose which light to potentially update next (1, 2, or 3)
        const targetLight = Math.floor(Math.random() * 3) + 1;
        updateLight(targetLight); // Attempt to update the chosen light
        scheduleNextUpdate();    // Schedule the *next* random update attempt
    }, nextDelay);
}

// --- Initial Start ---
// Ensure initial opacities are set (should match CSS :root)
rootStyle.setProperty('--light1-opacity', dimOpacity);
rootStyle.setProperty('--light2-opacity', dimOpacity);
rootStyle.setProperty('--light3-opacity', dimOpacity);

// Start the random scheduling loop
scheduleNextUpdate(); // Begin the cycle

/* --- END: Random Moving & Fading Ambient Background Logic (v2) --- */


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
