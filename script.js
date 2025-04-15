document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    window.addEventListener('load', function() {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navbar = document.querySelector('.navbar');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navbar.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.navbar a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navbar.classList.remove('active');
        });
    });

    // Sticky Header
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTop.classList.add('active');
        } else {
            backToTop.classList.remove('active');
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Design Showcase Slider
    const designSlides = document.querySelectorAll('.design-slide');
    const designDots = document.querySelectorAll('.slider-dot');
    let currentDesignSlide = 0;
    
    function showDesignSlide(index) {
        designSlides.forEach(slide => slide.classList.remove('active'));
        designDots.forEach(dot => dot.classList.remove('active'));
        
        designSlides[index].classList.add('active');
        designDots[index].classList.add('active');
        currentDesignSlide = index;
    }
    
    if (document.querySelector('.design-slider .slider-prev')) {
        document.querySelector('.design-slider .slider-prev').addEventListener('click', function() {
            let newIndex = (currentDesignSlide - 1 + designSlides.length) % designSlides.length;
            showDesignSlide(newIndex);
        });
        
        document.querySelector('.design-slider .slider-next').addEventListener('click', function() {
            let newIndex = (currentDesignSlide + 1) % designSlides.length;
            showDesignSlide(newIndex);
        });
    }
    
    designDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showDesignSlide(index);
        });
    });
    
    // Auto slide change every 5 seconds
    if (designSlides.length > 0) {
        setInterval(() => {
            let newIndex = (currentDesignSlide + 1) % designSlides.length;
            showDesignSlide(newIndex);
        }, 5000);
    }

    // Animate Stats Counter
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    clearInterval(counter);
                    stat.textContent = target;
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    }
    
    // Intersection Observer for Stats Animation
    if (statNumbers.length > 0) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1
        });
        
        statsObserver.observe(document.querySelector('.stats'));
    }

    // Form Validation
    const contactForm = document.getElementById('contactForm');
    const eventForm = document.getElementById('eventForm');
    
    function setupFormValidation(form) {
        if (!form) return;
        
        // Validate on blur
        form.querySelectorAll('input, select, textarea').forEach(input => {
            input.addEventListener('blur', function() {
                validateInput(this);
            });
        });
        
        // Validate on submit
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            let isValid = true;
            this.querySelectorAll('input, select, textarea').forEach(input => {
                if (!validateInput(input)) {
                    isValid = false;
                }
            });
            
            if (isValid) {
                // Get form values
                const formData = new FormData(this);
                const data = Object.fromEntries(formData);
                
                // Store in localStorage
                localStorage.setItem('lastFormSubmission', JSON.stringify(data));
                
                // Here you would typically send the data to a server
                console.log('Form submitted:', data);
                
                // Show success message
                alert('Thank you for your message! We will contact you soon.');
                this.reset();
            }
        });
    }
    
    function validateInput(input) {
        const formGroup = input.closest('.form-group');
        if (!formGroup) return true;
        
        const errorElement = formGroup.querySelector('.form-error');
        
        if (input.required && !input.value.trim()) {
            formGroup.classList.add('error');
            errorElement.textContent = 'This field is required';
            return false;
        }
        
        if (input.type === 'email' && input.value.trim() && !/^\S+@\S+\.\S+$/.test(input.value)) {
            formGroup.classList.add('error');
            errorElement.textContent = 'Please enter a valid email';
            return false;
        }
        
        formGroup.classList.remove('error');
        return true;
    }
    
    setupFormValidation(contactForm);
    setupFormValidation(eventForm);

    // Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const emailInput = this.querySelector('input[type="email"]');
            const email = emailInput.value.trim();
            
            if (!email) {
                alert('Please enter your email address');
                return;
            }
            
            if (!/^\S+@\S+\.\S+$/.test(email)) {
                alert('Please enter a valid email address');
                return;
            }
            
            // Store email in localStorage
            let subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
            subscriptions.push(email);
            localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
            
            // Show success message
            alert('Thank you for subscribing to our newsletter!');
            this.reset();
        });
    }

    // Accessibility - Skip to Content
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            document.body.classList.add('show-focus-outlines');
        }
    });
});