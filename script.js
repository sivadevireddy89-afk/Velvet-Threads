// Rivaayah Boutique - Main JavaScript

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
            const href = this.getAttribute('href');
            
            // Skip if href is just "#" or empty
            if (!href || href === '#' || href.length <= 1) {
                return;
            }
            
            e.preventDefault();
            const target = document.querySelector(href);
            
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

// ===== Phone.email Mobile Login =====
// Make function globally available for the SDK
window.phoneEmailListener = function(userObj) {
    console.log('Phone.email callback received:', userObj);
    var user_json_url = userObj.user_json_url;
    
    // Client-side implementation
    fetch(user_json_url)
        .then(response => {
            if (!response.ok) throw new Error('Failed to fetch user data');
            return response.json();
        })
        .then(data => {
            console.log('Phone.email user data:', data);
            const user = {
                name: data.name || 'User ' + data.phoneNumber,
                email: data.email || '',
                phone: data.phoneNumber,
                countryCode: data.countryCode,
                picture: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(data.phoneNumber) + '&background=8B4513&color=fff',
                method: 'phone',
                phoneId: data.phoneNumber,
                verified: true
            };
            loginUser(user);
            closeAuthModal();
            showNotification(`Welcome! Verified: ${data.countryCode} ${data.phoneNumber}`);
        })
        .catch(error => {
            console.error('Phone.email verification error:', error);
            showNotification('Phone verification failed. Please try again.');
        });
};

// Local reference for internal use
function phoneEmailListener(userObj) {
    window.phoneEmailListener(userObj);
}

// Fallback phone login (if Phone.email button doesn't render)
function showPhoneLoginFallback() {
    showNotification('Please use the Phone.email button or try Google Sign-In');
    console.log('Phone.email button not rendered. Check browser console for SDK errors.');
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

    // Force Phone.email buttons to re-initialize
    // The SDK renders on page load, but modal starts hidden
    // We need to recreate the containers to force re-render
    document.querySelectorAll('.pe_signin_button').forEach((btn, index) => {
        const clientId = btn.getAttribute('data-client-id');
        // Clear and recreate to force SDK to render
        btn.innerHTML = '';
        btn.setAttribute('data-client-id', clientId);

        // If SDK has render function, use it
        if (window.phoneEmail && typeof window.phoneEmail.render === 'function') {
            window.phoneEmail.render(btn);
        }
    });

    // Fallback: if buttons still not rendered after delay, show manual button
    setTimeout(() => {
        document.querySelectorAll('.pe_signin_button').forEach(btn => {
            if (!btn.querySelector('iframe') && !btn.querySelector('button')) {
                console.log('Phone.email button not rendered, showing fallback');
                btn.innerHTML = '<button class="auth-btn" style="background:#25D366;color:white;width:100%;" onclick="initPhoneEmailManually()">' +
                    '<i class="fas fa-phone" style="margin-right:8px;"></i> Continue with Phone / OTP</button>';
            }
        });
    }, 1000);
}

// Manual Phone.email initialization
function initPhoneEmailManually() {
    const phoneNumber = prompt('Enter your phone number (with country code, e.g., +919876543210):');
    if (!phoneNumber) return;

    showNotification('SMS verification would be sent to ' + phoneNumber);
    console.log('Phone number entered:', phoneNumber);

    // In a real implementation, you would:
    // 1. Send phone number to your backend
    // 2. Backend calls Phone.email API to send SMS
    // 3. User enters OTP in another prompt
    // 4. Verify OTP and login

    // For now, simulate successful login
    const mockUser = {
        name: 'Phone User ' + phoneNumber,
        email: '',
        phone: phoneNumber,
        countryCode: phoneNumber.substring(0, phoneNumber.length - 10) || '+91',
        picture: 'https://ui-avatars.com/api/?name=' + encodeURIComponent(phoneNumber) + '&background=25D366&color=fff',
        method: 'phone',
        phoneId: phoneNumber.replace(/\D/g, ''),
        verified: true
    };

    setTimeout(() => {
        loginUser(mockUser);
        closeAuthModal();
        showNotification('Phone login successful! (Demo mode)');
    }, 500);
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
        id: userData.googleId || userData.phoneId || 'user_' + Date.now()
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
        <a href="#" onclick="openProfileModal('profile'); return false;" style="display: block; padding: 10px 20px; font-size: 13px; color: var(--color-text); text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='var(--color-bg-cream)'; this.style.color='var(--color-primary)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'">
            <i class="fas fa-user" style="margin-right: 10px; width: 16px;"></i> My Profile
        </a>
        <a href="#" onclick="openProfileModal('orders'); return false;" style="display: block; padding: 10px 20px; font-size: 13px; color: var(--color-text); text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='var(--color-bg-cream)'; this.style.color='var(--color-primary)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'">
            <i class="fas fa-shopping-bag" style="margin-right: 10px; width: 16px;"></i> My Orders
        </a>
        <a href="#" onclick="openProfileModal('wishlist'); return false;" style="display: block; padding: 10px 20px; font-size: 13px; color: var(--color-text); text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='var(--color-bg-cream)'; this.style.color='var(--color-primary)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'">
            <i class="fas fa-heart" style="margin-right: 10px; width: 16px;"></i> Wishlist
        </a>
        <a href="#" onclick="openProfileModal('cart'); return false;" style="display: block; padding: 10px 20px; font-size: 13px; color: var(--color-text); text-decoration: none; transition: all 0.3s;" onmouseover="this.style.background='var(--color-bg-cream)'; this.style.color='var(--color-primary)'" onmouseout="this.style.background='transparent'; this.style.color='var(--color-text)'">
            <i class="fas fa-shopping-cart" style="margin-right: 10px; width: 16px;"></i> Cart
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
    initUserFeatures();
    
    // Initialize Google Sign-In when page loads
    if (document.getElementById('authModal')) {
        initGoogleSignIn();
    }
});

// ===== Preloader =====
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
});

// ===== User Data Management =====

// Get current user data
function getCurrentUserData() {
    const user = getCurrentUser();
    if (!user) return null;
    
    const userDataKey = `velvetsData_${user.id}`;
    const savedData = localStorage.getItem(userDataKey);
    
    if (savedData) {
        return JSON.parse(savedData);
    }
    
    // Return default empty data structure
    return {
        profile: {
            name: user.name,
            email: user.email,
            phone: user.phone || '',
            address: {
                street: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India'
            }
        },
        wishlist: [],
        cart: [],
        orders: [],
        createdAt: new Date().toISOString()
    };
}

// Save user data
function saveUserData(data) {
    const user = getCurrentUser();
    if (!user) return;
    
    const userDataKey = `velvetsData_${user.id}`;
    localStorage.setItem(userDataKey, JSON.stringify(data));
    
    // Update UI
    updateCartCount();
    updateWishlistCount();
}

// Get current logged in user
function getCurrentUser() {
    const savedUser = localStorage.getItem('velvetsUser');
    if (savedUser) {
        try {
            return JSON.parse(savedUser);
        } catch (e) {
            return null;
        }
    }
    return null;
}

// ===== Wishlist Functions =====

function addToWishlist(productId, productData) {
    const user = getCurrentUser();
    if (!user) {
        showNotification('Please login to add to wishlist');
        openAuthModal('login');
        return false;
    }
    
    const userData = getCurrentUserData();
    
    // Check if already in wishlist
    const exists = userData.wishlist.find(item => item.id === productId);
    if (exists) {
        showNotification('Already in your wishlist!');
        return false;
    }
    
    userData.wishlist.push({
        id: productId,
        ...productData,
        addedAt: new Date().toISOString()
    });
    
    saveUserData(userData);
    showNotification('Added to wishlist!');
    return true;
}

function removeFromWishlist(productId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userData = getCurrentUserData();
    userData.wishlist = userData.wishlist.filter(item => item.id !== productId);
    
    saveUserData(userData);
    showNotification('Removed from wishlist');
    return true;
}

function isInWishlist(productId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userData = getCurrentUserData();
    return userData.wishlist.some(item => item.id === productId);
}

function getWishlist() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const userData = getCurrentUserData();
    return userData.wishlist;
}

function updateWishlistCount() {
    const wishlist = getWishlist();
    const count = wishlist.length;
    
    // Update UI if element exists
    document.querySelectorAll('.wishlist-count').forEach(el => {
        el.textContent = count;
        el.style.display = count > 0 ? 'inline' : 'none';
    });
}

// ===== Cart Functions =====

function addToCart(productId, productData, quantity = 1) {
    const user = getCurrentUser();
    if (!user) {
        showNotification('Please login to add items to cart');
        openAuthModal('login');
        return false;
    }
    
    const userData = getCurrentUserData();
    
    // Check if already in cart
    const existingItem = userData.cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
        existingItem.updatedAt = new Date().toISOString();
    } else {
        userData.cart.push({
            id: productId,
            ...productData,
            quantity: quantity,
            addedAt: new Date().toISOString()
        });
    }
    
    saveUserData(userData);
    showNotification(`Added to cart (${quantity} item${quantity > 1 ? 's' : ''})`);
    return true;
}

function removeFromCart(productId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userData = getCurrentUserData();
    userData.cart = userData.cart.filter(item => item.id !== productId);
    
    saveUserData(userData);
    showNotification('Removed from cart');
    return true;
}

function updateCartQuantity(productId, quantity) {
    const user = getCurrentUser();
    if (!user) return false;
    
    if (quantity <= 0) {
        return removeFromCart(productId);
    }
    
    const userData = getCurrentUserData();
    const item = userData.cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity = quantity;
        item.updatedAt = new Date().toISOString();
        saveUserData(userData);
        return true;
    }
    
    return false;
}

function getCart() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const userData = getCurrentUserData();
    return userData.cart;
}

function getCartTotal() {
    const cart = getCart();
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price?.replace(/[^0-9]/g, '') || 0);
        return total + (price * item.quantity);
    }, 0);
}

function clearCart() {
    const user = getCurrentUser();
    if (!user) return;
    
    const userData = getCurrentUserData();
    userData.cart = [];
    saveUserData(userData);
}

function updateCartCount() {
    const cart = getCart();
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update UI
    document.querySelectorAll('.cart-count').forEach(el => {
        el.textContent = `(${count})`;
    });
}

// ===== Orders Functions =====

function createOrder(orderData) {
    const user = getCurrentUser();
    if (!user) {
        showNotification('Please login to place an order');
        return null;
    }
    
    const userData = getCurrentUserData();
    
    const order = {
        id: 'ORD' + Date.now(),
        items: orderData.items || getCart(),
        total: orderData.total || getCartTotal(),
        status: 'confirmed',
        shippingAddress: orderData.shippingAddress || userData.profile.address,
        paymentMethod: orderData.paymentMethod || 'COD',
        createdAt: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    userData.orders.unshift(order); // Add to beginning
    
    // Clear cart after order
    userData.cart = [];
    
    saveUserData(userData);
    showNotification(`Order ${order.id} placed successfully!`);
    
    return order;
}

function getOrders() {
    const user = getCurrentUser();
    if (!user) return [];
    
    const userData = getCurrentUserData();
    return userData.orders || [];
}

function getOrder(orderId) {
    const orders = getOrders();
    return orders.find(order => order.id === orderId);
}

function cancelOrder(orderId) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userData = getCurrentUserData();
    const order = userData.orders.find(o => o.id === orderId);
    
    if (order && order.status === 'confirmed') {
        order.status = 'cancelled';
        order.cancelledAt = new Date().toISOString();
        saveUserData(userData);
        showNotification('Order cancelled successfully');
        return true;
    }
    
    showNotification('Order cannot be cancelled');
    return false;
}

// ===== Profile Functions =====

function updateProfile(profileData) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userData = getCurrentUserData();
    userData.profile = { ...userData.profile, ...profileData };
    
    // Update main user object if name/email changed
    if (profileData.name) user.name = profileData.name;
    if (profileData.email) user.email = profileData.email;
    
    // Save both
    localStorage.setItem('velvetsUser', JSON.stringify(user));
    saveUserData(userData);
    
    // Update UI
    updateAuthUI(user);
    showNotification('Profile updated successfully');
    return true;
}

function getProfile() {
    const user = getCurrentUser();
    if (!user) return null;
    
    const userData = getCurrentUserData();
    return userData.profile;
}

function updateAddress(address) {
    const user = getCurrentUser();
    if (!user) return false;
    
    const userData = getCurrentUserData();
    userData.profile.address = { ...userData.profile.address, ...address };
    saveUserData(userData);
    
    showNotification('Address updated successfully');
    return true;
}

// ===== Initialize User Features =====

function initUserFeatures() {
    // Update counts on page load
    updateCartCount();
    updateWishlistCount();
    
    // Initialize wishlist buttons
    initWishlistButtons();
    
    // Initialize cart buttons
    initCartButtons();
}

function initWishlistButtons() {
    document.querySelectorAll('.wishlist-btn, .product-btn[aria-label="Add to wishlist"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Get product info from parent card
            const card = btn.closest('.product-card, .collection-card, .collection-item');
            if (!card) return;
            
            const productId = card.dataset.productId || card.querySelector('img')?.src?.split('/').pop()?.split('.')[0];
            const productName = card.querySelector('.product-name, h3')?.textContent || 'Product';
            const productPrice = card.querySelector('.product-price')?.textContent || '';
            const productImage = card.querySelector('img')?.src;
            
            if (!productId) {
                showNotification('Unable to add to wishlist');
                return;
            }
            
            // Toggle wishlist
            if (isInWishlist(productId)) {
                removeFromWishlist(productId);
                btn.classList.remove('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            } else {
                addToWishlist(productId, {
                    name: productName,
                    price: productPrice,
                    image: productImage
                });
                btn.classList.add('active');
                btn.innerHTML = '<i class="fas fa-heart"></i>';
            }
        });
    });
}

function initCartButtons() {
    document.querySelectorAll('.add-to-cart-btn, .product-btn[aria-label="Add to cart"]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Get product info
            const card = btn.closest('.product-card, .collection-card, .collection-item');
            if (!card) return;
            
            const productId = card.dataset.productId || card.querySelector('img')?.src?.split('/').pop()?.split('.')[0];
            const productName = card.querySelector('.product-name, h3')?.textContent || 'Product';
            const productPrice = card.querySelector('.product-price')?.textContent || '';
            const productImage = card.querySelector('img')?.src;
            
            if (!productId) {
                showNotification('Unable to add to cart');
                return;
            }
            
            addToCart(productId, {
                name: productName,
                price: productPrice,
                image: productImage
            });
        });
    });
}

// ===== Profile Modal =====

function openProfileModal(section = 'profile') {
    const user = getCurrentUser();
    if (!user) {
        showNotification('Please login first');
        openAuthModal('login');
        return;
    }
    
    const userData = getCurrentUserData();
    
    // Create modal if not exists
    let profileModal = document.getElementById('profileModal');
    if (profileModal) {
        profileModal.remove();
    }
    
    profileModal = document.createElement('div');
    profileModal.id = 'profileModal';
    profileModal.className = 'auth-modal active';
    
    const orders = getOrders();
    const wishlist = getWishlist();
    const cart = getCart();
    
    profileModal.innerHTML = `
        <div class="auth-overlay" onclick="closeProfileModal()"></div>
        <div class="auth-container" style="max-width: 800px; max-height: 90vh; overflow-y: auto;">
            <button class="auth-close" onclick="closeProfileModal()" aria-label="Close">
                <i class="fas fa-times"></i>
            </button>
            
            <div class="profile-layout" style="display: grid; grid-template-columns: 200px 1fr; gap: 30px;">
                <!-- Sidebar -->
                <div class="profile-sidebar" style="border-right: 1px solid var(--color-border); padding-right: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <img src="${user.picture || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(user.name) + '&background=8B4513&color=fff'}" 
                             alt="${user.name}" 
                             style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 10px;">
                        <h3 style="font-size: 16px; margin: 0;">${user.name}</h3>
                        <p style="font-size: 12px; color: var(--color-text-light); margin: 5px 0;">${user.email}</p>
                    </div>
                    
                    <nav style="display: flex; flex-direction: column; gap: 5px;">
                        <button class="profile-nav-btn ${section === 'profile' ? 'active' : ''}" 
                                onclick="showProfileSection('profile')"
                                style="text-align: left; padding: 12px; border: none; background: ${section === 'profile' ? 'var(--color-bg-cream)' : 'transparent'}; cursor: pointer; border-radius: 4px;">
                            <i class="fas fa-user" style="margin-right: 10px;"></i> Profile
                        </button>
                        <button class="profile-nav-btn ${section === 'orders' ? 'active' : ''}" 
                                onclick="showProfileSection('orders')"
                                style="text-align: left; padding: 12px; border: none; background: ${section === 'orders' ? 'var(--color-bg-cream)' : 'transparent'}; cursor: pointer; border-radius: 4px;">
                            <i class="fas fa-shopping-bag" style="margin-right: 10px;"></i> My Orders (${orders.length})
                        </button>
                        <button class="profile-nav-btn ${section === 'wishlist' ? 'active' : ''}" 
                                onclick="showProfileSection('wishlist')"
                                style="text-align: left; padding: 12px; border: none; background: ${section === 'wishlist' ? 'var(--color-bg-cream)' : 'transparent'}; cursor: pointer; border-radius: 4px;">
                            <i class="fas fa-heart" style="margin-right: 10px;"></i> Wishlist (${wishlist.length})
                        </button>
                        <button class="profile-nav-btn ${section === 'cart' ? 'active' : ''}" 
                                onclick="showProfileSection('cart')"
                                style="text-align: left; padding: 12px; border: none; background: ${section === 'cart' ? 'var(--color-bg-cream)' : 'transparent'}; cursor: pointer; border-radius: 4px;">
                            <i class="fas fa-shopping-cart" style="margin-right: 10px;"></i> Cart (${cart.length})
                        </button>
                        <button class="profile-nav-btn" 
                                onclick="logoutUser(); closeProfileModal();"
                                style="text-align: left; padding: 12px; border: none; background: transparent; cursor: pointer; border-radius: 4px; color: #c0392b;">
                            <i class="fas fa-sign-out-alt" style="margin-right: 10px;"></i> Logout
                        </button>
                    </nav>
                </div>
                
                <!-- Content -->
                <div class="profile-content" id="profileContent">
                    ${getProfileSectionContent(section)}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(profileModal);
    document.body.style.overflow = 'hidden';
}

function getProfileSectionContent(section) {
    const user = getCurrentUser();
    const userData = getCurrentUserData();
    
    switch(section) {
        case 'profile':
            return `
                <h2 style="margin-bottom: 30px; font-size: 24px;">My Profile</h2>
                <form id="profileForm" style="display: grid; gap: 20px;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Full Name</label>
                            <input type="text" name="name" value="${userData.profile.name}" 
                                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Email</label>
                            <input type="email" name="email" value="${userData.profile.email}" 
                                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                        </div>
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Phone Number</label>
                        <input type="tel" name="phone" value="${userData.profile.phone || ''}" placeholder="+91 98765 43210"
                               style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                    </div>
                    
                    <h3 style="margin-top: 30px; margin-bottom: 20px; font-size: 18px;">Shipping Address</h3>
                    <div>
                        <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Street Address</label>
                        <input type="text" name="street" value="${userData.profile.address.street}" 
                               style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">City</label>
                            <input type="text" name="city" value="${userData.profile.address.city}" 
                                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">State</label>
                            <input type="text" name="state" value="${userData.profile.address.state}" 
                                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                        </div>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Pincode</label>
                            <input type="text" name="pincode" value="${userData.profile.address.pincode}" 
                                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                        </div>
                        <div>
                            <label style="display: block; margin-bottom: 8px; font-size: 14px; font-weight: 500;">Country</label>
                            <input type="text" name="country" value="${userData.profile.address.country}" 
                                   style="width: 100%; padding: 12px; border: 1px solid var(--color-border); border-radius: 4px; font-family: inherit;">
                        </div>
                    </div>
                    
                    <button type="submit" class="btn btn-primary" style="margin-top: 20px;">Save Changes</button>
                </form>
            `;
            
        case 'orders':
            const orders = getOrders();
            if (orders.length === 0) {
                return `
                    <h2 style="margin-bottom: 30px; font-size: 24px;">My Orders</h2>
                    <div style="text-align: center; padding: 60px 20px; color: var(--color-text-light);">
                        <i class="fas fa-shopping-bag" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                        <p>No orders yet</p>
                        <a href="collections.html" class="btn btn-outline-dark" style="margin-top: 20px;">Start Shopping</a>
                    </div>
                `;
            }
            return `
                <h2 style="margin-bottom: 30px; font-size: 24px;">My Orders</h2>
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    ${orders.map(order => `
                        <div style="border: 1px solid var(--color-border); border-radius: 8px; padding: 20px;">
                            <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                                <div>
                                    <strong>${order.id}</strong>
                                    <p style="font-size: 12px; color: var(--color-text-light); margin: 5px 0;">
                                        ${new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span style="padding: 4px 12px; border-radius: 20px; font-size: 12px; text-transform: uppercase;
                                    ${order.status === 'confirmed' ? 'background: #d4edda; color: #155724;' : ''}
                                    ${order.status === 'cancelled' ? 'background: #f8d7da; color: #721c24;' : ''}
                                    ${order.status === 'delivered' ? 'background: #d1ecf1; color: #0c5460;' : ''}">
                                    ${order.status}
                                </span>
                            </div>
                            <p style="margin-bottom: 10px;">${order.items.length} item(s)</p>
                            <p style="font-size: 18px; font-weight: 600; margin-bottom: 15px;">₹${order.total.toLocaleString()}</p>
                            ${order.status === 'confirmed' ? `
                                <button onclick="cancelOrder('${order.id}'); showProfileSection('orders');" 
                                        style="padding: 8px 16px; border: 1px solid #c0392b; background: transparent; color: #c0392b; border-radius: 4px; cursor: pointer; font-size: 13px;">
                                    Cancel Order
                                </button>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            `;
            
        case 'wishlist':
            const wishlist = getWishlist();
            if (wishlist.length === 0) {
                return `
                    <h2 style="margin-bottom: 30px; font-size: 24px;">My Wishlist</h2>
                    <div style="text-align: center; padding: 60px 20px; color: var(--color-text-light);">
                        <i class="fas fa-heart" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                        <p>Your wishlist is empty</p>
                        <a href="collections.html" class="btn btn-outline-dark" style="margin-top: 20px;">Explore Collection</a>
                    </div>
                `;
            }
            return `
                <h2 style="margin-bottom: 30px; font-size: 24px;">My Wishlist (${wishlist.length} items)</h2>
                <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 20px;">
                    ${wishlist.map(item => `
                        <div style="border: 1px solid var(--color-border); border-radius: 8px; overflow: hidden;">
                            <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 200px; object-fit: cover;">
                            <div style="padding: 15px;">
                                <h4 style="font-size: 14px; margin-bottom: 8px;">${item.name}</h4>
                                <p style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${item.price}</p>
                                <div style="display: flex; gap: 10px;">
                                    <button onclick="addToCart('${item.id}', {name: '${item.name}', price: '${item.price}', image: '${item.image}'}); showProfileSection('cart');" 
                                            style="flex: 1; padding: 10px; background: var(--color-bg-dark); color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 13px;">
                                        <i class="fas fa-shopping-cart"></i> Add
                                    </button>
                                    <button onclick="removeFromWishlist('${item.id}'); showProfileSection('wishlist');" 
                                            style="padding: 10px; background: transparent; border: 1px solid var(--color-border); border-radius: 4px; cursor: pointer; color: #c0392b;">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
            
        case 'cart':
            const cart = getCart();
            const cartTotal = getCartTotal();
            if (cart.length === 0) {
                return `
                    <h2 style="margin-bottom: 30px; font-size: 24px;">Shopping Cart</h2>
                    <div style="text-align: center; padding: 60px 20px; color: var(--color-text-light);">
                        <i class="fas fa-shopping-cart" style="font-size: 48px; margin-bottom: 20px; opacity: 0.3;"></i>
                        <p>Your cart is empty</p>
                        <a href="collections.html" class="btn btn-outline-dark" style="margin-top: 20px;">Start Shopping</a>
                    </div>
                `;
            }
            return `
                <h2 style="margin-bottom: 30px; font-size: 24px;">Shopping Cart (${cart.length} items)</h2>
                <div style="display: flex; flex-direction: column; gap: 20px; margin-bottom: 30px;">
                    ${cart.map(item => `
                        <div style="display: flex; gap: 20px; border: 1px solid var(--color-border); border-radius: 8px; padding: 15px;">
                            <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;">
                            <div style="flex: 1;">
                                <h4 style="font-size: 16px; margin-bottom: 8px;">${item.name}</h4>
                                <p style="font-size: 16px; font-weight: 600; margin-bottom: 12px;">${item.price}</p>
                                <div style="display: flex; align-items: center; gap: 15px;">
                                    <div style="display: flex; align-items: center; border: 1px solid var(--color-border); border-radius: 4px;">
                                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity - 1}); showProfileSection('cart');" 
                                                style="padding: 8px 12px; background: transparent; border: none; cursor: pointer;">-</button>
                                        <span style="padding: 8px 16px; min-width: 40px; text-align: center;">${item.quantity}</span>
                                        <button onclick="updateCartQuantity('${item.id}', ${item.quantity + 1}); showProfileSection('cart');" 
                                                style="padding: 8px 12px; background: transparent; border: none; cursor: pointer;">+</button>
                                    </div>
                                    <button onclick="removeFromCart('${item.id}'); showProfileSection('cart');" 
                                            style="color: #c0392b; border: none; background: transparent; cursor: pointer; font-size: 13px;">
                                        <i class="fas fa-trash"></i> Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div style="border-top: 1px solid var(--color-border); padding-top: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
                        <span>Total:</span>
                        <span>₹${cartTotal.toLocaleString()}</span>
                    </div>
                    <button onclick="openCheckoutModal()" 
                            style="width: 100%; padding: 15px; background: var(--color-bg-dark); color: white; border: none; border-radius: 4px; font-size: 16px; cursor: pointer;">
                        Proceed to Checkout
                    </button>
                </div>
            `;
    }
}

function showProfileSection(section) {
    const contentDiv = document.getElementById('profileContent');
    if (contentDiv) {
        contentDiv.innerHTML = getProfileSectionContent(section);
        
        // Update active state on nav buttons
        document.querySelectorAll('.profile-nav-btn').forEach(btn => {
            btn.classList.remove('active');
            btn.style.background = 'transparent';
        });
        event?.target?.classList.add('active');
        if (event?.target) event.target.style.background = 'var(--color-bg-cream)';
        
        // Setup form handler if profile section
        if (section === 'profile') {
            document.getElementById('profileForm')?.addEventListener('submit', (e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                updateProfile({
                    name: formData.get('name'),
                    email: formData.get('email'),
                    phone: formData.get('phone')
                });
                updateAddress({
                    street: formData.get('street'),
                    city: formData.get('city'),
                    state: formData.get('state'),
                    pincode: formData.get('pincode'),
                    country: formData.get('country')
                });
            });
        }
    }
}

function closeProfileModal() {
    const modal = document.getElementById('profileModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function openCheckoutModal() {
    // Simple checkout - creates order and clears cart
    const cart = getCart();
    if (cart.length === 0) {
        showNotification('Your cart is empty');
        return;
    }
    
    const order = createOrder({});
    if (order) {
        closeProfileModal();
        showNotification(`Order ${order.id} placed! Check My Orders for details.`);
    }
}

// ===== Utility Functions =====

// Clear all user data (for testing)
function clearAllUserData() {
    localStorage.removeItem('velvetsUser');
    // Remove all user data entries
    Object.keys(localStorage).forEach(key => {
        if (key.startsWith('velvetsData_')) {
            localStorage.removeItem(key);
        }
    });
    showNotification('All user data cleared');
}

// Migrate old user data format if needed
function migrateUserData() {
    const user = getCurrentUser();
    if (!user) return;
    
    // Check if data exists in new format
    const userDataKey = `velvetsData_${user.id}`;
    if (!localStorage.getItem(userDataKey)) {
        // Create new data structure
        const oldCart = localStorage.getItem('velvetsCart');
        const oldWishlist = localStorage.getItem('velvetsWishlist');
        
        const newData = getCurrentUserData();
        
        if (oldCart) {
            try {
                newData.cart = JSON.parse(oldCart);
            } catch(e) {}
        }
        if (oldWishlist) {
            try {
                newData.wishlist = JSON.parse(oldWishlist);
            } catch(e) {}
        }
        
        saveUserData(newData);
        
        // Clean up old keys
        localStorage.removeItem('velvetsCart');
        localStorage.removeItem('velvetsWishlist');
    }
}
