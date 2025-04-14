// --- Footer Current Year ---
document.getElementById('currentYear').textContent = new Date().getFullYear();

// --- Basic Dark Mode Toggle (Example) ---
// Uncomment this if you add the toggle button in the HTML
/*
const darkModeToggle = document.getElementById('darkModeToggle');
const body = document.body;

// Check local storage for theme preference
if (localStorage.getItem('theme') === 'light') {
    body.classList.remove('dark-mode');
    body.classList.add('light-mode'); // Add a light-mode class if you define specific light styles
} else {
     body.classList.add('dark-mode'); // Default to dark
}


darkModeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    body.classList.toggle('light-mode'); // Toggle light mode class too

    // Store preference
    if (body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
});
*/

// --- Placeholder for Scroll Animations ---
// You would typically use a library like Intersection Observer API or AOS (Animate On Scroll)
// Example using Intersection Observer (conceptual):
/*
const animatedElements = document.querySelectorAll('.utility-card, .benefit-item'); // Add classes/selectors to animate

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible'); // Add a CSS class for the animation
            // observer.unobserve(entry.target); // Optional: stop observing once visible
        }
    });
}, {
    threshold: 0.1 // Trigger when 10% of the element is visible
});

animatedElements.forEach(el => observer.observe(el));
*/
// You'd need corresponding CSS for the '.visible' class (e.g., opacity: 1, transform: translateY(0))
// and initial states (e.g., opacity: 0, transform: translateY(20px)).


// --- Contact Form Handling Placeholder ---
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent default browser submission

    // 1. Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    console.log('Form submitted (in frontend):', { name, email, message });

    // 2. **IMPORTANT:** Send data to your backend or form service
    //    This part requires additional setup. Examples:
    //    - Using fetch() to POST to a server endpoint you create.
    //    - Setting the form's 'action' attribute to a service like Formspree or Netlify Forms
    //      (and potentially configuring that service).

    alert('Thank you for your message! (Frontend confirmation only - form submission not implemented yet)');

    // 3. Optionally clear the form or show a success message
    // contactForm.reset();
});
