document.addEventListener('DOMContentLoaded', () => { // Ensure DOM is loaded

    // --- Footer Current Year ---
    const currentYearSpan = document.getElementById('currentYear');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // --- Smooth Scroll Animation ---
    const fadeInSections = document.querySelectorAll('.fade-in-section');

    if (fadeInSections.length > 0) { // Only run if elements exist
        const sectionObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                // When element enters viewport (is intersecting)
                if (entry.isIntersecting) {
                    console.log('Element intersecting:', entry.target); // DEBUG LOG
                    entry.target.classList.add('visible');
                    // Stop observing the element once it's visible
                    observer.unobserve(entry.target);
                }
            });
        }, {
            rootMargin: '0px', // No margin around the viewport
            threshold: 0.1   // Trigger when 10% of the element is visible
        });

        // Observe each element with the fade-in class
        fadeInSections.forEach(section => {
            if (section) { // Ensure section exists before observing
               sectionObserver.observe(section);
            }
        });
    } else {
        console.log('No elements with .fade-in-section found to observe.'); // DEBUG LOG
    }


    // --- Contact Form Handling ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        // Pre-fill subject line if product is specified in URL
        try { // Add try...catch for robustness
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

            // **IMPORTANT:** Add backend/service submission logic here.
            alert('Thank you! (Frontend confirmation only - submission needs setup)');
            // contactForm.reset(); // Optional
        });
    }

    // --- Active Navigation Link Highlighting ---
    try { // Add try...catch for robustness
        const currentLocation = window.location.href;
        const navLinks = document.querySelectorAll('.main-nav ul li a');

        navLinks.forEach(link => {
            const linkHref = link.getAttribute('href');
            // Check if the link's href is exactly the current page or if it's index.html on the root path
            if (linkHref && currentLocation.endsWith(linkHref)) {
                 link.classList.add('active');
             } else if (linkHref === 'index.html' && (currentLocation.endsWith('/') || currentLocation.split('/').pop() === '')) {
                 // Handle root path case specifically for index.html
                 link.classList.add('active');
             }
             else {
                 link.classList.remove('active');
             }
        });
    } catch (e) {
        console.error("Error highlighting navigation:", e);
    }

}); // End DOMContentLoaded listener
