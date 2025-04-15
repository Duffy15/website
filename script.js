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

    // --- Ambient Background Light Effect ---
    const root = document.documentElement;

    // Check if the device supports hover (likely not a touch device)
    // This prevents the effect from just staying static on mobile
    const prefersHover = window.matchMedia('(hover: hover)').matches;

    if (prefersHover) { // Only add listener if hover is supported
        window.addEventListener('mousemove', (e) => {
            // Update CSS variables based on mouse position
            // Using requestAnimationFrame can potentially make it smoother
            // but direct update is often fine.
            root.style.setProperty('--mouse-x', e.clientX + 'px');
            root.style.setProperty('--mouse-y', e.clientY + 'px');

             // Optional: Console log to check values (remove for production)
             // console.log(`Mouse X: ${e.clientX}, Mouse Y: ${e.clientY}`);
        });
        console.log('Ambient light effect initialized.'); // Confirm setup
    } else {
        console.log('Ambient light effect skipped (device likely touch-only).');
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
