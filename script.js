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
            if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
                // Scrolling Down past header height
                header.classList.add('header-hidden');
                if (hamburgerBtn) hamburgerBtn.classList.add('hamburger-visible'); // Show hamburger explicitly
            } else {
                // Scrolling Up or at top
                header.classList.remove('header-hidden');
                 if (hamburgerBtn && window.innerWidth > 992) { // Only hide hamburger on desktop when header shows
                     hamburgerBtn.classList.remove('hamburger-visible');
                 }
            }
            lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // For Mobile or negative scrolling
        }, false);
    }


    // --- Hamburger Menu Toggle ---
    if (hamburgerBtn && mobileNavOverlay) { // Check if elements exist
        hamburgerBtn.addEventListener('click', () => {
            mobileNavOverlay.classList.add('overlay-active');
            body.classList.add('overlay-open'); // Prevent body scroll
            hamburgerBtn.setAttribute('aria-expanded', 'true');
        });
    }

    // --- Close Overlay ---
    if (closeNavBtn && mobileNavOverlay) { // Check if elements exist
        closeNavBtn.addEventListener('click', closeOverlay);
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
                    console.log('Element intersecting:', entry.target); // DEBUG LOG (Keep for testing)
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px', threshold: 0.1 });

        fadeInSections.forEach(section => {
             if (section) {
                sectionObserver.observe(section);
             }
        });
    } else {
        console.log('No elements with .fade-in-section found to observe.');
    }


    // --- Contact Form Handling (Keep as before) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const subjectParam = urlParams.get('subject') || urlParams.get('product');
            if (subjectParam) {
                const subjectInput = contactForm.querySelector('#subject');
                if (subjectInput) {
                    subjectInput.value = subjectParam.replace(/-/g, ' ');
                }
            }
        } catch (e) {
            console.error("Error processing URL params:", e);
        }

        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const formData = new FormData(contactForm);
            const name = formData.get('name');
            const email = formData.get('email');
            const subject = formData.get('subject');
            const message = formData.get('message');
            console.log('Form submitted (frontend):', { name, email, subject, message });
            alert('Thank you! (Frontend confirmation only - submission needs setup)');
            // contactForm.reset(); // Optional
        });
    }

    // --- Active Navigation Link Highlighting (Keep as before) ---
    try {
        const currentLocation = window.location.href;
        const desktopNavLinks = document.querySelectorAll('.main-nav > ul > li > a'); // Target desktop links
        const mobileNavLinks = document.querySelectorAll('.overlay-nav ul li a'); // Target mobile links

        const setActiveLink = (links) => {
             links.forEach(link => {
                const linkHref = link.getAttribute('href');
                link.classList.remove('active'); // Remove active from all first

                if (linkHref && currentLocation.endsWith(linkHref)) {
                     link.classList.add('active');
                 } else if (linkHref === 'index.html' && (currentLocation.endsWith('/') || currentLocation.split(/[?#]/)[0].split('/').pop() === '')) {
                     link.classList.add('active');
                 }
            });
        };

        setActiveLink(desktopNavLinks);
        setActiveLink(mobileNavLinks); // Set active class in mobile nav too

    } catch (e) {
        console.error("Error highlighting navigation:", e);
    }

}); // End DOMContentLoaded listener
