// Velvet-Threads Boutique - Main JavaScript

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initTestimonialSlider();
    initScrollAnimations();
    initSmoothScroll();
    initParallax();
    initCounters();
});

// ===== Navbar Scroll Effect =====
function initNavbar() {
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // Add scrolled class when page is scrolled
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });
}

// ===== Mobile Menu =====
function initMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Animate hamburger
            const spans = menuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
                spans[2].style.width = '100%';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
                spans[2].style.width = '50%';
            }
        });
    }
    
    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = menuToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
            spans[2].style.width = '50%';
        });
    });
}

// ===== Testimonial Slider =====
function initTestimonialSlider() {
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.testimonial-dots .dot');
    let currentSlide = 0;
    let slideInterval;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            dots[i].classList.remove('active');
        });
        
        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    function nextSlide() {
        const next = (currentSlide + 1) % slides.length;
        showSlide(next);
    }
    
    // Dot click handlers
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            resetInterval();
        });
    });
    
    function resetInterval() {
        clearInterval(slideInterval);
        slideInterval = setInterval(nextSlide, 5000);
    }
    
    // Auto-advance slides
    slideInterval = setInterval(nextSlide, 5000);
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll(
        '.collection-card, .product-card, .about-content, .lookbook-item, .stat'
    );
    
    animateElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(el);
    });
    
    // Add animate-in class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ===== Smooth Scroll =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== Parallax Effect =====
function initParallax() {
    const heroImage = document.querySelector('.hero-image img');
    
    if (heroImage && !window.matchMedia('(pointer: coarse)').matches) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (rate < window.innerHeight) {
                heroImage.style.transform = `translateY(${rate}px)`;
            }
        });
    }
}

// ===== Animated Counters =====
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = counter.textContent;
                
                // Extract number from text (e.g., "500+" -> 500)
                const numericValue = parseInt(target.replace(/\D/g, ''));
                const suffix = target.replace(/[0-9]/g, '');
                
                animateCounter(counter, numericValue, suffix);
                observer.unobserve(counter);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target, suffix) {
    let current = 0;
    const increment = target / 50; // 50 steps
    const duration = 1500; // 1.5 seconds
    const stepTime = duration / 50;
    
    const timer = setInterval(() => {
        current += increment;
        
        if (current >= target) {
            element.textContent = target + suffix;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + suffix;
        }
    }, stepTime);
}

// ===== Product Card Interactions =====
document.querySelectorAll('.product-card').forEach(card => {
    const buttons = card.querySelectorAll('.product-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Add click feedback
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => {
                btn.style.transform = 'scale(1)';
            }, 150);
            
            // Show coming soon notification
            const action = btn.getAttribute('aria-label');
            showNotification(`${action} - Coming Soon!`);
        });
    });
});

// ===== Collection Card Interactions =====
document.querySelectorAll('.collection-card').forEach(card => {
    card.addEventListener('click', () => {
        const title = card.querySelector('h3')?.textContent || 'Collection';
        showNotification(`${title} - Coming Soon!`);
    });
});

// ===== Notification System =====
function showNotification(message) {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <span>${message}</span>
    `;
    
    // Styles
    notification.style.cssText = `
        position: fixed;
        bottom: 30px;
        left: 50%;
        transform: translateX(-50%) translateY(100px);
        background: var(--color-bg-dark);
        color: var(--color-white);
        padding: 16px 32px;
        font-size: 14px;
        letter-spacing: 1px;
        z-index: 9999;
        opacity: 0;
        transition: all 0.4s ease;
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(-50%) translateY(0)';
    });
    
    // Remove after delay
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(-50%) translateY(100px)';
        setTimeout(() => notification.remove(), 400);
    }, 3000);
}

// ===== Newsletter Form =====
document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification('Thank you for subscribing!');
        e.target.reset();
    }
});

// ===== Cart Functionality =====
let cartCount = 0;
const cartCountElement = document.querySelector('.cart-count');

document.querySelectorAll('.product-btn[aria-label="Add to cart"]').forEach(btn => {
    btn.addEventListener('click', () => {
        cartCount++;
        cartCountElement.textContent = cartCount;
        
        // Animate cart icon
        const cartBtn = document.querySelector('.cart-btn');
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartBtn.style.transform = 'scale(1)';
        }, 200);
        
        showNotification('Added to cart!');
    });
});

// ===== Hero Title Animation =====
function initHeroAnimation() {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const spans = heroTitle.querySelectorAll('span');
        
        spans.forEach((span, index) => {
            span.style.opacity = '0';
            span.style.transform = 'translateY(30px)';
            span.style.display = 'block';
            span.style.transition = 'all 0.8s ease';
            
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, 300 + (index * 200));
        });
    }
}

// Initialize hero animation
document.addEventListener('DOMContentLoaded', initHeroAnimation);

// ===== Back to Top Button =====
function initBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    if (!backToTopBtn) return;
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });
    
    // Smooth scroll to top when clicked
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

document.addEventListener('DOMContentLoaded', initBackToTop);

// ===== WhatsApp Button Collapse Timer =====
function initWhatsAppTimer() {
    const whatsappBtn = document.getElementById('whatsappFloat');
    if (!whatsappBtn) return;
    
    // Collapse after 20 seconds
    setTimeout(() => {
        whatsappBtn.classList.remove('whatsapp-expanded');
        whatsappBtn.classList.add('whatsapp-collapsed');
    }, 20000);
}

document.addEventListener('DOMContentLoaded', initWhatsAppTimer);

// ===== Google Sign-In Configuration =====
const GOOGLE_CLIENT_ID = '217484779229-gd0au2v1jr72dbt18fskqvd1cukdcoun.apps.googleusercontent.com'; // Replace with your actual Google Client ID

// Initialize Google Sign-In
function initGoogleSignIn() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            callback: handleGoogleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true
        });
    }
}

// Handle Google Sign-In response
function handleGoogleCredentialResponse(response) {
    // Decode JWT token to get user info
    const credential = response.credential;
    const payload = JSON.parse(atob(credential.split('.')[1]));
    
    const user = {
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        method: 'google',
        googleId: payload.sub
    };
    
    loginUser(user);
    closeAuthModal();
    showNotification(`Welcome, ${user.name}!`);
}

// Trigger Google Sign-In
function signInWithGoogle() {
    // Wait for Google API to load if not ready
    if (typeof google === 'undefined' || !google.accounts) {
        showNotification('Loading Google Sign-In...');
        
        // Retry after a short delay
        setTimeout(() => {
            if (typeof google !== 'undefined' && google.accounts) {
                initGoogleSignIn();
                google.accounts.id.prompt((notification) => {
                    handleGooglePrompt(notification);
                });
            } else {
                // Use demo mode as fallback
                useDemoLogin();
            }
        }, 1000);
        return;
    }
    
    // Initialize if not already done
    initGoogleSignIn();
    
    // Show the prompt
    google.accounts.id.prompt((notification) => {
        handleGooglePrompt(notification);
    });
}

function handleGooglePrompt(notification) {
    if (notification.isNotDisplayed()) {
        const reason = notification.getNotDisplayedReason();
        console.log('Google Sign-In not displayed:', reason);
        
        if (reason === 'opt_out_or_no_session' || reason === 'browser_not_supported') {
            // Use demo fallback
            useDemoLogin();
        } else {
            showNotification('Google Sign-In unavailable. Check console for details.');
            // Still allow demo login
            setTimeout(() => useDemoLogin(), 1500);
        }
    } else if (notification.isSkippedMoment()) {
        // User skipped, try again
        showNotification('Please select an account to continue');
    }
}

function useDemoLogin() {
    showNotification('Using demo mode...');
    
    const mockUser = {
        name: 'Demo User',
        email: 'demo@velvetsandthreads.com',
        picture: 'https://ui-avatars.com/api/?name=Demo+User&background=8B4513&color=fff',
        method: 'google',
        googleId: 'demo123'
    };
    
    setTimeout(() => {
        loginUser(mockUser);
        closeAuthModal();
        showNotification('Demo login successful!');
    }, 800);
}

// ===== Authentication Modal =====
function initAuthModal() {
    const authModal = document.getElementById('authModal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authContents = document.querySelectorAll('.auth-content');
    
    // Tab switching
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Update tabs
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            // Update content
            authContents.forEach(c => c.classList.remove('active'));
            document.getElementById(`${targetTab}Tab`).classList.add('active');
        });
    });
}

// Open auth modal
function openAuthModal(tab = 'login') {
    const authModal = document.getElementById('authModal');
    const authTabs = document.querySelectorAll('.auth-tab');
    const authContents = document.querySelectorAll('.auth-content');
    
    // Set active tab
    authTabs.forEach(t => {
        t.classList.toggle('active', t.dataset.tab === tab);
    });
    authContents.forEach(c => {
        c.classList.toggle('active', c.id === `${tab}Tab`);
    });
    
    authModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Initialize Google Sign-In when modal opens
    initGoogleSignIn();
}

// Close auth modal
function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    authModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Login user
function loginUser(userData) {
    const user = {
        ...userData,
        loggedIn: true,
        loginTime: new Date().toISOString(),
        id: userData.googleId
    };
    
    // Save to localStorage
    localStorage.setItem('velvetsUser', JSON.stringify(user));
    
    // Update UI
    updateAuthUI(user);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('userLoggedIn', { detail: user }));
}

// Logout user
function logoutUser() {
    // Clear Google Sign-In session if exists
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.disableAutoSelect();
    }
    
    localStorage.removeItem('velvetsUser');
    updateAuthUI(null);
    showNotification('Logged out successfully');
    
    // Dispatch custom event
    window.dispatchEvent(new CustomEvent('userLoggedOut'));
}

// Update auth UI based on login state
function updateAuthUI(user) {
    const authLink = document.querySelector('.auth-link');
    
    if (!authLink) return;
    
    if (user && user.loggedIn) {
        // Create user avatar if picture exists
        const avatarHtml = user.picture 
            ? `<img src="${user.picture}" alt="${user.name}" class="user-avatar" style="width: 28px; height: 28px; border-radius: 50%; object-fit: cover;">`
            : '<i class="fas fa-user-circle" style="font-size: 20px;"></i>';
        
        // Show user name and dropdown
        authLink.innerHTML = `
            <div class="user-menu" style="display: flex; align-items: center; gap: 8px; cursor: pointer;">
                ${avatarHtml}
                <span style="max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.name}</span>
                <i class="fas fa-chevron-down" style="font-size: 10px;"></i>
            </div>
        `;
        
        // Remove the onclick handler and add dropdown menu
        authLink.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleUserMenu(user);
        };
    } else {
        // Show login button
        authLink.innerHTML = '<span>Login</span>';
        authLink.onclick = (e) => {
            e.preventDefault();
            openAuthModal('login');
        };
    }
}

// Toggle user menu dropdown
function toggleUserMenu(user) {
    // Remove existing dropdown if any
    const existingDropdown = document.querySelector('.user-dropdown');
    if (existingDropdown) {
        existingDropdown.remove();
        return;
    }
    
    // Create dropdown menu
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        background: var(--color-white);
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        border-radius: 4px;
        padding: 10px 0;
        min-width: 180px;
        z-index: 1000;
        margin-top: 10px;
    `;
    
    dropdown.innerHTML = `
        <div style="padding: 10px 20px; border-bottom: 1px solid var(--color-border); font-family: var(--font-heading); font-size: 14px;">
            <strong>${user.name}</strong>
            <div style="font-size: 12px; color: var(--color-text-light);">${user.email}</div>
        </div>
        <a href="#" style="display: block; padding: 10px 20px; font-size: 13px; color: var(--color-text); text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='var(--color-bg-cream)'; this.style.color='var(--color-primary)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'">
            <i class="fas fa-user" style="margin-right: 10px; width: 16px;"></i> My Profile
        </a>
        <a href="#" style="display: block; padding: 10px 20px; font-size: 13px; color: var(--color-text); text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='var(--color-bg-cream)'; this.style.color='var(--color-primary)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'">
            <i class="fas fa-shopping-bag" style="margin-right: 10px; width: 16px;"></i> My Orders
        </a>
        <a href="#" style="display: block; padding: 10px 20px; font-size: 13px; color: var(--color-text); text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='var(--color-bg-cream)'; this.style.color='var(--color-primary)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'">
            <i class="fas fa-heart" style="margin-right: 10px; width: 16px;"></i> Wishlist
        </a>
        <div style="border-top: 1px solid var(--color-border); margin: 5px 0;"></div>
        <a href="#" onclick="logoutUser(); return false;" style="display: block; padding: 10px 20px; font-size: 13px; color: var(--color-text); text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='var(--color-bg-cream)'; this.style.color='var(--color-primary)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'">
            <i class="fas fa-sign-out-alt" style="margin-right: 10px; width: 16px;"></i> Logout
        </a>
    `;
    
    // Position dropdown relative to auth link
    const authLink = document.querySelector('.auth-link');
    authLink.style.position = 'relative';
    authLink.appendChild(dropdown);
    
    // Close dropdown when clicking outside
    const closeDropdown = (e) => {
        if (!dropdown.contains(e.target) && !authLink.contains(e.target)) {
            dropdown.remove();
            document.removeEventListener('click', closeDropdown);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeDropdown);
    }, 0);
}

// Check for existing session on page load
function checkExistingSession() {
    const savedUser = localStorage.getItem('velvetsUser');
    if (savedUser) {
        try {
            const user = JSON.parse(savedUser);
            // Check if session is still valid (30 days)
            const loginTime = new Date(user.loginTime);
            const now = new Date();
            const daysDiff = (now - loginTime) / (1000 * 60 * 60 * 24);
            
            if (daysDiff <= 30) {
                updateAuthUI(user);
            } else {
                // Session expired
                localStorage.removeItem('velvetsUser');
                updateAuthUI(null);
            }
        } catch (e) {
            console.error('Error parsing user data:', e);
            localStorage.removeItem('velvetsUser');
        }
    }
}

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    initAuthModal();
    checkExistingSession();
    
    // Initialize Google Sign-In when page loads
    if (document.getElementById('authModal')) {
        initGoogleSignIn();
    }
});

// ===== Preloader =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});
