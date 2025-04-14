// --- Footer Current Year ---
const currentYearSpan = document.getElementById('currentYear');
if (currentYearSpan) {
    currentYearSpan.textContent = new Date().getFullYear();
}

// --- Smooth Scroll Animation on Load ---
const fadeInSections = document.querySelectorAll('.fade-in-section');

const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            // Add a staggered delay based on the element's order in the NodeList
            // This creates a subtle cascading effect
            const delay = index * 100; // Delay in milliseconds (adjust as needed)

            setTimeout(() => {
                entry.target.classList.add('visible');
            }, delay);

            // Optional: Stop observing once the element is visible
            observer.unobserve(entry.target);
        }
    });
}, {
    rootMargin: '0px', // No margin
    threshold: 0.1 // Trigger when 10% of the element is visible
});

// Observe each section
fadeInSections.forEach(section => {
    sectionObserver.observe(section);
});

// Assign index for staggered delay for grid items (if needed, more complex setup)
// A simpler approach is the cascading effect based on section order above.
// For true grid item staggering within a section, you might need additional JS
// after the section becomes visible. Example (conceptual):
/*
function handleGridItemStagger(sectionElement) {
    const gridItems = sectionElement.querySelectorAll('.overview-item, .product-item, .benefit-item, .apparel-item');
    gridItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index + 1); // Set CSS variable used in style.css
    });
}

// In the observer:
if (entry.isIntersecting) {
    // ... existing code ...
    handleGridItemStagger(entry.target); // Call function to set indices
    observer.unobserve(entry.target);
}
*/


// --- Contact Form Handling Placeholder ---
const contactForm = document.getElementById('contact-form');

if (contactForm) {
    // Pre-fill subject line if product is specified in URL (e.g., from product page inquiry)
    const urlParams = new URLSearchParams(window.location.search);
    const subjectParam = urlParams.get('subject') || urlParams.get('product');
    if (subjectParam) {
        const subjectInput = contactForm.querySelector('#subject');
        if (subjectInput) {
            subjectInput.value = subjectParam.replace(/-/g, ' '); // Replace dashes with spaces
        }
    }

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Prevent default browser submission

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');

        console.log('Form submitted (frontend):', { name, email, subject, message });

        // **IMPORTANT:** Send data to your backend or form service here.
        // Use fetch() or configure the form 'action' attribute.

        alert('Thank you for your message! (Frontend confirmation only - form submission not implemented yet)');
        // Optionally clear form: contactForm.reset();
    });
}

// --- Active Navigation Link Highlighting ---
const currentLocation = window.location.href;
const navLinks = document.querySelectorAll('.main-nav ul li a');

navLinks.forEach(link => {
    // Check if the link's href is part of the current URL
    // More robust check to handle trailing slashes or index.html
    if (currentLocation.endsWith(link.getAttribute('href')) ||
       (currentLocation.endsWith('/') && link.getAttribute('href') === 'index.html')) {
        link.classList.add('active');
    } else {
        link.classList.remove('active'); // Ensure others are not active
    }
});
