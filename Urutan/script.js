// Enhanced Responsive JavaScript for Urutan Ayam Bali Landing Page
// Optimized for all devices: Mobile, Tablet, Laptop, Desktop

// Device Detection and Responsive Management
class ResponsiveManager {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1280,
            ultrawide: 1920
        };
        
        this.currentDevice = this.detectDevice();
        this.orientation = this.detectOrientation();
        this.touchDevice = this.detectTouch();
        
        this.init();
    }
    
    detectDevice() {
        const width = window.innerWidth;
        if (width < this.breakpoints.mobile) return 'mobile';
        if (width < this.breakpoints.tablet) return 'tablet';
        if (width < this.breakpoints.desktop) return 'laptop';
        if (width < this.breakpoints.ultrawide) return 'desktop';
        return 'ultrawide';
    }
    
    detectOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }
    
    detectTouch() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    init() {
        document.body.classList.add(`device-${this.currentDevice}`);
        document.body.classList.add(`orientation-${this.orientation}`);
        if (this.touchDevice) document.body.classList.add('touch-device');
        
        // Listen for resize events with debouncing
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Listen for orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => this.handleOrientationChange(), 100);
        });
    }
    
    handleResize() {
        const newDevice = this.detectDevice();
        const newOrientation = this.detectOrientation();
        
        if (newDevice !== this.currentDevice) {
            document.body.classList.remove(`device-${this.currentDevice}`);
            document.body.classList.add(`device-${newDevice}`);
            this.currentDevice = newDevice;
            
            // Trigger device change event
            window.dispatchEvent(new CustomEvent('devicechange', {
                detail: { device: newDevice }
            }));
        }
        
        if (newOrientation !== this.orientation) {
            document.body.classList.remove(`orientation-${this.orientation}`);
            document.body.classList.add(`orientation-${newOrientation}`);
            this.orientation = newOrientation;
        }
    }
    
    handleOrientationChange() {
        this.handleResize();
        // Force a small delay to ensure proper orientation handling
        setTimeout(() => {
            window.dispatchEvent(new CustomEvent('orientationchange'));
        }, 500);
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
}

// Initialize Responsive Manager
const responsiveManager = new ResponsiveManager();

// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main App Initialization
function initializeApp() {
    // Initialize all components
    initNavbar();
    initMobileMenu();
    initSmoothScrolling();
    initIntersectionObserver();
    initButtonEffects();
    initPerformanceOptimizations();
    initAccessibility();
    initTouchHandlers();
    initSwipeGestures();
    initResponsiveImages();
    
    // Add loading animation
    document.body.classList.add('loading');
    
    console.log('🍗 Urutan Ayam Bali website loaded successfully!');
    console.log(`Device: ${responsiveManager.currentDevice}, Touch: ${responsiveManager.touchDevice}`);
}

// Enhanced Navbar Functionality
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    let lastScrollY = window.scrollY;
    let ticking = false;
    let scrollDirection = 'up';

    function updateNavbar() {
        const currentScrollY = window.scrollY;
        
        // Determine scroll direction
        scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
        
        // Add/remove scrolled class
        if (currentScrollY > 50) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
        
        // Enhanced mobile navbar hide/show
        if (responsiveManager.currentDevice === 'mobile') {
            if (scrollDirection === 'down' && currentScrollY > 200) {
                navbar.style.transform = 'translateY(-100%)';
                navbar.style.transition = 'transform 0.3s ease-in-out';
            } else if (scrollDirection === 'up') {
                navbar.style.transform = 'translateY(0)';
                navbar.style.transition = 'transform 0.3s ease-in-out';
            }
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }

    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    }

    // Optimized scroll listener with passive flag
    window.addEventListener('scroll', requestTick, { passive: true });

    // Enhanced active link highlighting
    function updateActiveLink() {
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + (navbar.offsetHeight + 20);

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            const correspondingLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => link.classList.remove('text-primary'));
                if (correspondingLink) {
                    correspondingLink.classList.add('text-primary');
                }
            }
        });
    }

    window.addEventListener('scroll', throttle(updateActiveLink, 100), { passive: true });
}

// Enhanced Mobile Menu Functionality
function initMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
    const mobileMenu = document.getElementById('mobile-menu');
    const closeMobileMenu = document.getElementById('close-mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    
    let isMenuOpen = false;

    function openMobileMenu() {
        if (isMenuOpen) return;
        
        isMenuOpen = true;
        mobileMenuOverlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Prevent background scrolling on iOS
        if (responsiveManager.touchDevice) {
            document.body.style.position = 'fixed';
            document.body.style.width = '100%';
        }
        
        // Animate menu slide in with improved timing
        requestAnimationFrame(() => {
            mobileMenu.classList.add('active');
            mobileMenu.style.transform = 'translateX(0)';
        });
        
        // Focus management for accessibility
        setTimeout(() => {
            closeMobileMenu.focus();
        }, 300);
    }

    function closeMobileMenuHandler() {
        if (!isMenuOpen) return;
        
        isMenuOpen = false;
        mobileMenu.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            mobileMenuOverlay.classList.add('hidden');
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.width = '';
            mobileMenu.classList.remove('active');
        }, 300);
        
        // Return focus to menu button
        mobileMenuButton.focus();
    }

    // Event listeners with improved handling
    mobileMenuButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        openMobileMenu();
    });
    
    closeMobileMenu.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closeMobileMenuHandler();
    });
    
    // Close menu when clicking outside
    mobileMenuOverlay.addEventListener('click', function(e) {
        if (e.target === mobileMenuOverlay) {
            closeMobileMenuHandler();
        }
    });

    // Enhanced mobile nav links with animation
    mobileNavLinks.forEach((link, index) => {
        link.addEventListener('click', () => {
            // Add small delay for better UX
            setTimeout(() => {
                closeMobileMenuHandler();
            }, 150);
        });
        
        // Stagger animation for links
        link.style.transitionDelay = `${index * 50}ms`;
    });

    // Enhanced keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && isMenuOpen) {
            closeMobileMenuHandler();
        }
    });
    
    // Close menu on device change
    window.addEventListener('devicechange', (e) => {
        if (e.detail.device !== 'mobile' && isMenuOpen) {
            closeMobileMenuHandler();
        }
    });
}

// Enhanced Smooth Scrolling
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const navbar = document.getElementById('navbar');
                const navbarHeight = navbar ? navbar.offsetHeight : 0;
                const targetPosition = targetElement.offsetTop - navbarHeight - 20;
                
                // Use native smooth scrolling with fallback
                if ('scrollBehavior' in document.documentElement.style) {
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                } else {
                    // Fallback for older browsers
                    smoothScrollTo(targetPosition, 800);
                }
            }
        });
    });
}

// Smooth scroll fallback function
function smoothScrollTo(target, duration) {
    const start = window.pageYOffset;
    const distance = target - start;
    let startTime = null;

    function animation(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = ease(timeElapsed, start, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animation);
    }

    function ease(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animation);
}

// Enhanced Intersection Observer for Animations
function initIntersectionObserver() {
    // Different thresholds for different devices
    const observerOptions = {
        threshold: responsiveManager.currentDevice === 'mobile' ? 0.05 : 0.1,
        rootMargin: responsiveManager.currentDevice === 'mobile' ? '0px 0px -30px 0px' : '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Add stagger effect for grid items
                const delay = entry.target.parentElement.classList.contains('grid') ? index * 100 : 0;
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, delay);
                
                // Unobserve after animation for performance
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all fade-in elements
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    animatedElements.forEach(el => observer.observe(el));
    
    // Re-initialize on device change
    window.addEventListener('devicechange', () => {
        // Re-observe elements with new options if needed
        initIntersectionObserver();
    });
}

// Enhanced Button Effects and Interactions
function initButtonEffects() {
    // Enhanced ripple effect for touch devices
    const buttons = document.querySelectorAll('.btn-ripple, .bg-whatsapp, .bg-primary, .bg-secondary');
    
    buttons.forEach(button => {
        if (responsiveManager.touchDevice) {
            button.addEventListener('touchstart', createRippleEffect, { passive: true });
        } else {
            button.addEventListener('click', createRippleEffect);
        }
    });

    // Enhanced product card interactions
    const productCards = document.querySelectorAll('.bg-white.rounded-2xl, .bg-white.rounded-3xl');
    
    productCards.forEach(card => {
        if (!responsiveManager.touchDevice) {
            card.addEventListener('mouseenter', function() {
                if (responsiveManager.currentDevice !== 'mobile') {
                    this.style.transform = 'translateY(-15px) scale(1.02)';
                    this.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                }
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        }
    });

    // Enhanced WhatsApp button interactions
    const whatsappButtons = document.querySelectorAll('a[href*="wa.me"]');
    whatsappButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Analytics tracking
            console.log('WhatsApp button clicked');
            
            // Enhanced click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
            
            // Haptic feedback for supported devices
            if ('vibrate' in navigator && responsiveManager.touchDevice) {
                navigator.vibrate(50);
            }
        });
    });
}

// Enhanced Ripple Effect Function
function createRippleEffect(e) {
    const button = e.currentTarget;
    const existingRipple = button.querySelector('.ripple');
    if (existingRipple) existingRipple.remove();
    
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    
    // Enhanced touch position detection
    let x, y;
    if (e.type === 'touchstart' && e.touches) {
        x = e.touches[0].clientX - rect.left - size / 2;
        y = e.touches[0].clientY - rect.top - size / 2;
    } else {
        x = e.clientX - rect.left - size / 2;
        y = e.clientY - rect.top - size / 2;
    }
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    ripple.classList.add('ripple');
    
    // Enhanced ripple styles
    Object.assign(ripple.style, {
        position: 'absolute',
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.3)',
        transform: 'scale(0)',
        animation: 'ripple 0.6s linear',
        pointerEvents: 'none',
        zIndex: '1000'
    });
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Touch and Swipe Handlers
function initTouchHandlers() {
    if (!responsiveManager.touchDevice) return;
    
    // Prevent iOS bounce effect
    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('.scrollable')) return;
        e.preventDefault();
    }, { passive: false });
    
    // Enhanced touch feedback
    const touchElements = document.querySelectorAll('button, a, .mobile-nav-link');
    touchElements.forEach(element => {
        element.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        }, { passive: true });
        
        element.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        }, { passive: true });
    });
}

// Swipe Gestures for Mobile
function initSwipeGestures() {
    if (responsiveManager.currentDevice !== 'mobile') return;
    
    let startX, startY, startTime;
    
    document.addEventListener('touchstart', function(e) {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        startTime = Date.now();
    }, { passive: true });
    
    document.addEventListener('touchend', function(e) {
        if (!startX || !startY) return;
        
        const touch = e.changedTouches[0];
        const endX = touch.clientX;
        const endY = touch.clientY;
        const endTime = Date.now();
        
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const deltaTime = endTime - startTime;
        
        // Detect swipe gestures
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50 && deltaTime < 300) {
            if (deltaX > 0) {
                // Right swipe - could be used for navigation
                console.log('Swipe right detected');
            } else {
                // Left swipe
                console.log('Swipe left detected');
            }
        }
        
        // Reset
        startX = startY = null;
    }, { passive: true });
}

// Responsive Images
function initResponsiveImages() {
    const images = document.querySelectorAll('img');
    
    images.forEach(img => {
        img.classList.add('responsive-img');
        
        // Lazy loading for images
        if ('loading' in HTMLImageElement.prototype) {
            img.loading = 'lazy';
        } else {
            // Fallback for browsers without native lazy loading
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.classList.add('loaded');
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        }
    });
}

// Enhanced Performance Optimizations
function initPerformanceOptimizations() {
    // Enhanced lazy loading for non-critical resources
    if ('IntersectionObserver' in window) {
        const lazyElements = document.querySelectorAll('.lazy-load');
        const elementObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('loaded');
                    elementObserver.unobserve(entry.target);
                }
            });
        });
        
        lazyElements.forEach(el => elementObserver.observe(el));
    }

    // Preload critical resources based on device
    const criticalResources = [
        'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap'
    ];
    
    criticalResources.forEach(href => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'style';
        link.href = href;
        document.head.appendChild(link);
    });

    // Enhanced resize handling with device-specific optimizations
    let resizeTimer;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            // Recalculate layout-dependent features
            if (responsiveManager.currentDevice !== responsiveManager.detectDevice()) {
                // Device changed, reinitialize what's needed
                initIntersectionObserver();
            }
        }, 250);
    });
    
    // Memory management
    window.addEventListener('beforeunload', () => {
        // Clear intervals and timeouts
        if (window.particleInterval) {
            clearInterval(window.particleInterval);
        }
    });
}

// Enhanced Accessibility
function initAccessibility() {
    // Enhanced focus management for all devices
    const focusableElements = document.querySelectorAll(
        'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    
    // Better focus indicators
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #ff6b35';
            this.style.outlineOffset = '2px';
            this.style.borderRadius = '4px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = '';
            this.style.outlineOffset = '';
        });
    });

    // Enhanced keyboard navigation for mobile menu
    document.addEventListener('keydown', function(e) {
        const mobileMenuOverlay = document.getElementById('mobile-menu-overlay');
        
        if (!mobileMenuOverlay.classList.contains('hidden')) {
            if (e.key === 'Tab') {
                const focusableElements = mobileMenuOverlay.querySelectorAll(
                    'a, button, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey && document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                } else if (!e.shiftKey && document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        }
    });

    // Enhanced screen reader announcements
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);

    window.announce = function(message) {
        announcer.textContent = message;
        setTimeout(() => {
            announcer.textContent = '';
        }, 1000);
    };
    
    // Skip to content link for accessibility
    const skipLink = document.createElement('a');
    skipLink.href = '#main';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-white p-2 rounded';
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Utility Functions
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait, immediate) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Enhanced Floating Particles (Desktop Only)
function createFloatingParticles() {
    const hero = document.querySelector('#home');
    if (!hero || responsiveManager.currentDevice === 'mobile' || responsiveManager.touchDevice) return;
    
    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'absolute pointer-events-none opacity-20';
        particle.innerHTML = ['🌟', '✨', '🍽️'][Math.floor(Math.random() * 3)];
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = '100%';
        particle.style.fontSize = (Math.random() * 20 + 10) + 'px';
        particle.style.animation = `floatUp ${Math.random() * 3 + 5}s linear forwards`;
        particle.style.willChange = 'transform';
        
        hero.appendChild(particle);
        
        setTimeout(() => {
            if (particle.parentNode) {
                particle.remove();
            }
        }, 8000);
    }
    
    // Create particles less frequently for better performance
    window.particleInterval = setInterval(() => {
        if (document.hidden || !document.hasFocus()) return;
        createParticle();
    }, 3000);
}

// Initialize floating particles after page load
window.addEventListener('load', () => {
    setTimeout(createFloatingParticles, 1000);
});

// Enhanced Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // Could send error reports to analytics here
});

window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Service Worker Registration (Progressive Web App)
if ('serviceWorker' in navigator && 'PushManager' in window) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('SW registered: ', registration);
            })
            .catch(function(registrationError) {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Analytics and Performance Tracking
function trackEvent(action, category, label) {
    // Enhanced analytics with device info
    const eventData = {
        action,
        category,
        label,
        device: responsiveManager.currentDevice,
        touchDevice: responsiveManager.touchDevice,
        orientation: responsiveManager.orientation
    };
    
    if (typeof gtag !== 'undefined') {
        gtag('event', action, {
            event_category: category,
            event_label: label,
            custom_parameter_device: responsiveManager.currentDevice
        });
    }
    
    console.log('Event tracked:', eventData);
}

// Performance Monitoring
function initPerformanceMonitoring() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                
                console.log(`Page load time: ${loadTime}ms`);
                console.log(`Device: ${responsiveManager.currentDevice}`);
                
                // Track performance metrics
                trackEvent('performance', 'page_load', `${loadTime}ms`);
            }, 0);
        });
    }
}

// Initialize performance monitoring
initPerformanceMonitoring();

// Export functions for external use
window.UrutanAyamBali = {
    announce: window.announce,
    trackEvent: trackEvent,
    createRippleEffect: createRippleEffect,
    responsiveManager: responsiveManager
};