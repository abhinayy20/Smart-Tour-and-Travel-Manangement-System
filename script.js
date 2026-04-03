// ===========================
// INTERACTIVE FUNCTIONALITY
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // Smooth scrolling for navigation links
    setupSmoothScrolling();
    
    // Newsletter subscription
    setupNewsletterForm();
    
    // Enquire button functionality
    setupEnquireButtons();
    
    // Search box functionality
    setupSearchBox();
    
    // Counter animation
    animateCounters();
    
    // Add animation to elements on scroll
    setupScrollAnimation();
    
    // Setup booking modal
    setupBookingModal();
});

// Setup booking modal
function setupBookingModal() {
    const modal = document.getElementById('bookingModal');
    const closeBtn = document.querySelector('.close');
    const bookingForm = document.getElementById('bookingForm');
    const bookNowBtn = document.querySelector('.book-btn');
    
    if (bookNowBtn) {
        bookNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
        });
    }
    
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });
    
    window.addEventListener('click', function(e) {
        if (e.target == modal) {
            modal.style.display = 'none';
        }
    });
    
    bookingForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('fullname').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            package: document.getElementById('package').value,
            travelers: document.getElementById('travelers').value,
            date: document.getElementById('date').value,
            message: document.getElementById('message').value
        };
        
        showNotification(`Booking request received! We'll contact you at ${formData.email} soon.`, 'success');
        bookingForm.reset();
        modal.style.display = 'none';
        
        console.log('Booking data:', formData);
    });
}

// Smooth scrolling
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Newsletter signup
function setupNewsletterForm() {
    const newsletterForms = document.querySelectorAll('.newsletter-form');
    
    newsletterForms.forEach(form => {
        const input = form.querySelector('input');
        const button = form.querySelector('button');
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const email = input.value.trim();
            
            if (validateEmail(email)) {
                showNotification('Successfully subscribed to our newsletter!', 'success');
                input.value = '';
            } else {
                showNotification('Please enter a valid email address', 'error');
            }
        });
        
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                button.click();
            }
        });
    });
}

// Enquire button functionality
function setupEnquireButtons() {
    const enquireButtons = document.querySelectorAll('.enquire-btn');
    
    enquireButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            const modal = document.getElementById('bookingModal');
            const packageCard = this.closest('.package-card');
            const packageName = packageCard.querySelector('h3').textContent;
            const packageSelect = document.getElementById('package');
            
            modal.style.display = 'block';
            packageSelect.value = packageName.toLowerCase().replace(/\s+/g, '-');
        });
    });
}

// Search box functionality
function setupSearchBox() {
    const searchInput = document.querySelector('.search-box input');
    const searchButton = document.querySelector('.search-box button');
    
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            const destination = searchInput.value.trim();
            
            if (destination) {
                showNotification(`Searching for destinations in: ${destination}`, 'info');
                searchInput.value = '';
            } else {
                showNotification('Please enter a destination', 'error');
            }
        });
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchButton.click();
            }
        });
    }
}

// Animate counters
function animateCounters() {
    const counters = document.querySelectorAll('.stat-item h3');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.textContent);
                
                let current = 0;
                const increment = target / 30;
                
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        counter.textContent = Math.floor(current) + '+';
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.textContent = target + '+';
                    }
                };
                
                updateCounter();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// Scroll animation
function setupScrollAnimation() {
    const elements = document.querySelectorAll('.package-card, .destination-card, .feature-card, .contact-card');
    
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    elements.forEach(element => observer.observe(element));
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196F3'};
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        max-width: 300px;
        font-size: 14px;
        animation: slideInRight 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease forwards';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Email validation
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Add animations to CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Active nav link highlighting
window.addEventListener('scroll', () => {
    const navLinks = document.querySelectorAll('.nav-menu a');
    const sections = document.querySelectorAll('section');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        if (scrollY >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Explore destination links
const exploreLinks = document.querySelectorAll('.explore-link');
exploreLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const destination = this.closest('.destination-card').querySelector('h3').textContent;
        showNotification(`Loading ${destination} tour packages...`, 'info');
    });
});

console.log('TravelSphere website initialized successfully!');
