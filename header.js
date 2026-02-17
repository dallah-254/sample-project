// LightHub Customs Header - Integrated with Auth System
class HeaderManager {
    constructor(containerId = 'header-container') {
        this.containerId = containerId;
        this.isLoggedIn = false;
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkAuthStatus();
        this.loadHeader();
        this.setupEventListeners();
        this.updateUI();
        this.addStyles();
        
        // Listen for auth changes from auth.html
        this.setupAuthListeners();
    }

    // Updated to check tokens from auth.html
    checkAuthStatus() {
        const authData = localStorage.getItem('lighthub_auth');
        const userData = localStorage.getItem('lighthub_user');
        
        if (authData && userData) {
            try {
                const auth = JSON.parse(authData);
                const user = JSON.parse(userData);
                
                // Check if token is still valid
                if (auth.expiresAt && auth.expiresAt > Date.now()) {
                    this.isLoggedIn = true;
                    this.currentUser = user;
                } else {
                    // Token expired, clear it
                    this.clearAuth();
                }
            } catch (e) {
                console.error('Error parsing auth data:', e);
                this.clearAuth();
            }
        } else {
            // Try old format for backward compatibility
            const oldToken = localStorage.getItem('idToken');
            const oldAccessToken = localStorage.getItem('accessToken');
            
            if (oldToken && oldAccessToken) {
                this.isLoggedIn = true;
                this.currentUser = { name: 'User', email: '' };
                
                // Migrate to new format
                this.migrateToNewFormat(oldToken, oldAccessToken);
            }
        }
    }

    migrateToNewFormat(idToken, accessToken) {
        localStorage.setItem('lighthub_auth', JSON.stringify({
            idToken: idToken,
            accessToken: accessToken,
            expiresAt: Date.now() + (3600 * 1000)
        }));
        
        localStorage.setItem('lighthub_user', JSON.stringify({
            name: 'User',
            email: ''
        }));
        
        // Clear old format
        localStorage.removeItem('idToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
    }

    loadHeader() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Header container #${this.containerId} not found`);
            return;
        }

        container.innerHTML = this.getHeaderHTML();
        this.cacheElements();
    }

    getHeaderHTML() {
        return `
            <header class="light-header">
                <div class="header-wrapper">
                    <!-- Logo -->
                    <a href="/" class="header-logo">
                        <i class="fas fa-lightbulb"></i>
                        <span>LightHub</span>
                    </a>

                    <!-- Desktop Navigation -->
                    <nav class="header-nav">
                        <a href="/" class="nav-link" data-path="/">Home</a>
                        <a href="/products" class="nav-link" data-path="/products">Products</a>
                        <a href="/custom" class="nav-link" data-path="/custom">Custom Build</a>
                        <a href="/support" class="nav-link" data-path="/support">Support</a>
                    </nav>

                    <!-- Header Actions -->
                    <div class="header-actions">
                        <!-- Search -->
                        <button class="header-action search-action" title="Search">
                            <i class="fas fa-search"></i>
                        </button>

                        <!-- Cart -->
                        <button class="header-action cart-action" title="Cart">
                            <i class="fas fa-shopping-cart"></i>
                            <span class="cart-badge">0</span>
                        </button>

                        ${this.isLoggedIn ? this.getUserSection() : this.getAuthSection()}

                        <!-- Mobile Menu Button -->
                        <button class="mobile-toggle" aria-label="Menu">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>

                    <!-- Mobile Menu - FIXED: Now properly shows all items -->
                    <div class="mobile-menu">
                        <div class="mobile-menu-header">
                            <div class="mobile-logo">
                                <i class="fas fa-lightbulb"></i>
                                <span>LightHub</span>
                            </div>
                            <button class="mobile-close">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="mobile-menu-content">
                            <!-- Main Navigation Links -->
                            <div class="mobile-nav-section">
                                <h3 class="mobile-section-title">Navigation</h3>
                                <a href="/" class="mobile-link" data-path="/">
                                    <i class="fas fa-home"></i>
                                    <span>Home</span>
                                </a>
                                <a href="/products" class="mobile-link" data-path="/products">
                                    <i class="fas fa-box"></i>
                                    <span>Products</span>
                                </a>
                                <a href="/categories" class="mobile-link" data-path="/categories">
                                    <i class="fas fa-tags"></i>
                                    <span>Categories</span>
                                </a>
                                <a href="/custom" class="mobile-link" data-path="/custom">
                                    <i class="fas fa-tools"></i>
                                    <span>Custom Build</span>
                                </a>
                                <a href="/support" class="mobile-link" data-path="/support">
                                    <i class="fas fa-headset"></i>
                                    <span>Support</span>
                                </a>
                            </div>

                            <!-- Featured Categories -->
                            <div class="mobile-categories-section">
                                <h3 class="mobile-section-title">Shop by Category</h3>
                                <div class="mobile-category-grid">
                                    <a href="/category/headlights" class="mobile-category-item">
                                        <i class="fas fa-car"></i>
                                        <span>Headlights</span>
                                    </a>
                                    <a href="/category/fog-lights" class="mobile-category-item">
                                        <i class="fas fa-car-side"></i>
                                        <span>Fog Lights</span>
                                    </a>
                                    <a href="/category/light-bars" class="mobile-category-item">
                                        <i class="fas fa-lightbulb"></i>
                                        <span>Light Bars</span>
                                    </a>
                                    <a href="/category/motorcycle" class="mobile-category-item">
                                        <i class="fas fa-motorcycle"></i>
                                        <span>Motorcycle</span>
                                    </a>
                                    <a href="/category/off-road" class="mobile-category-item">
                                        <i class="fas fa-mountain"></i>
                                        <span>Off-Road</span>
                                    </a>
                                    <a href="/category/accessories" class="mobile-category-item">
                                        <i class="fas fa-cog"></i>
                                        <span>Accessories</span>
                                    </a>
                                </div>
                            </div>

                            <!-- Quick Actions -->
                            <div class="mobile-actions-section">
                                <h3 class="mobile-section-title">Quick Actions</h3>
                                <button class="mobile-action-item search-mobile-trigger">
                                    <i class="fas fa-search"></i>
                                    <span>Search Products</span>
                                </button>
                                <button class="mobile-action-item cart-mobile-trigger">
                                    <i class="fas fa-shopping-cart"></i>
                                    <span>View Cart</span>
                                    <span class="mobile-cart-badge">0</span>
                                </button>
                            </div>
                            
                            <!-- Auth Section -->
                            <div class="mobile-auth-section">
                                ${this.isLoggedIn ? this.getMobileUserSection() : this.getMobileAuthSection()}
                            </div>

                            <!-- Contact Info -->
                            <div class="mobile-contact-section">
                                <h3 class="mobile-section-title">Get in Touch</h3>
                                <a href="tel:+18005551234" class="mobile-contact-item">
                                    <i class="fas fa-phone"></i>
                                    <span>1-800-555-1234</span>
                                </a>
                                <a href="mailto:support@lighthub.com" class="mobile-contact-item">
                                    <i class="fas fa-envelope"></i>
                                    <span>support@lighthub.com</span>
                                </a>
                                <div class="mobile-social-icons">
                                    <a href="#" class="social-icon"><i class="fab fa-facebook-f"></i></a>
                                    <a href="#" class="social-icon"><i class="fab fa-instagram"></i></a>
                                    <a href="#" class="social-icon"><i class="fab fa-twitter"></i></a>
                                    <a href="#" class="social-icon"><i class="fab fa-youtube"></i></a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Search Overlay -->
                    <div class="search-overlay">
                        <div class="search-container">
                            <div class="search-box">
                                <i class="fas fa-search"></i>
                                <input type="text" class="search-input" placeholder="Search products...">
                                <button class="search-close">
                                    <i class="fas fa-times"></i>
                                </button>
                            </div>
                            <div class="search-suggestions">
                                <p>Popular searches:</p>
                                <div class="suggestion-tags">
                                    <button class="tag">LED Headlights</button>
                                    <button class="tag">Fog Lights</button>
                                    <button class="tag">Light Bars</button>
                                    <button class="tag">Motorcycle Lights</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        `;
    }

    getUserSection() {
        // Extract user's first name from the stored user data
        let firstName = '';
        if (this.currentUser?.name) {
            // Split the full name and take the first part
            firstName = this.currentUser.name.split(' ')[0];
        } else if (this.currentUser?.firstName) {
            firstName = this.currentUser.firstName;
        } else {
            firstName = 'User';
        }
        
        const fullName = this.currentUser?.name || 'User Account';
        
        return `
            <div class="user-section">
                <button class="user-action" title="Account">
                    <i class="fas fa-user-circle"></i>
                    <span class="user-name">${firstName}</span>
                </button>
                <div class="user-dropdown">
                    <div class="user-dropdown-header">
                        <i class="fas fa-user-circle"></i>
                        <div>
                            <p class="dropdown-user-name">${fullName}</p>
                            <p class="dropdown-user-email">${this.currentUser?.email || ''}</p>
                        </div>
                    </div>
                    <div class="dropdown-divider"></div>
                    <a href="/profile" class="dropdown-item">
                        <i class="fas fa-user"></i>
                        <span>Profile</span>
                    </a>
                    <a href="/orders" class="dropdown-item">
                        <i class="fas fa-box"></i>
                        <span>Orders</span>
                    </a>
                    <a href="/wishlist" class="dropdown-item">
                        <i class="fas fa-heart"></i>
                        <span>Wishlist</span>
                    </a>
                    <a href="/settings" class="dropdown-item">
                        <i class="fas fa-cog"></i>
                        <span>Settings</span>
                    </a>
                    <div class="dropdown-divider"></div>
                    <button class="dropdown-item logout-action">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Logout</span>
                    </button>
                </div>
            </div>
        `;
    }

    getAuthSection() {
        return `
            <a href="/auth.html" class="login-action" title="Login">
                <i class="fas fa-sign-in-alt"></i>
                <span class="login-text">Login</span>
            </a>
        `;
    }

    getMobileUserSection() {
        const name = this.currentUser?.name || 'User';
        const email = this.currentUser?.email || '';
        
        // Extract first name for mobile view if needed
        let firstName = name;
        if (name.includes(' ')) {
            firstName = name.split(' ')[0];
        }
        
        return `
            <div class="mobile-user-info">
                <i class="fas fa-user-circle"></i>
                <div>
                    <p class="user-name">${firstName}</p>
                    <p class="user-email">${email}</p>
                </div>
            </div>
            <div class="mobile-user-links">
                <a href="/profile" class="mobile-user-link">
                    <i class="fas fa-user"></i>
                    <span>Profile</span>
                </a>
                <a href="/orders" class="mobile-user-link">
                    <i class="fas fa-box"></i>
                    <span>Orders</span>
                </a>
                <a href="/wishlist" class="mobile-user-link">
                    <i class="fas fa-heart"></i>
                    <span>Wishlist</span>
                </a>
                <a href="/settings" class="mobile-user-link">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </a>
                <button class="mobile-user-link logout-action">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </button>
            </div>
        `;
    }

    getMobileAuthSection() {
        return `
            <div class="mobile-login-section">
                <p>Welcome to LightHub</p>
                <a href="/auth.html" class="mobile-login-btn">
                    <i class="fas fa-sign-in-alt"></i>
                    <span>Sign In</span>
                </a>
                <a href="/auth.html?register=true" class="mobile-register-link">Create New Account</a>
            </div>
        `;
    }

    cacheElements() {
        this.elements = {
            header: document.querySelector('.light-header'),
            mobileToggle: document.querySelector('.mobile-toggle'),
            mobileMenu: document.querySelector('.mobile-menu'),
            mobileClose: document.querySelector('.mobile-close'),
            searchAction: document.querySelector('.search-action'),
            searchOverlay: document.querySelector('.search-overlay'),
            searchClose: document.querySelector('.search-close'),
            searchInput: document.querySelector('.search-input'),
            cartAction: document.querySelector('.cart-action'),
            cartBadge: document.querySelector('.cart-badge'),
            userAction: document.querySelector('.user-action'),
            userDropdown: document.querySelector('.user-dropdown'),
            logoutActions: document.querySelectorAll('.logout-action'),
            loginAction: document.querySelector('.login-action'),
            navLinks: document.querySelectorAll('.nav-link'),
            mobileLinks: document.querySelectorAll('.mobile-link'),
            suggestionTags: document.querySelectorAll('.tag'),
            searchMobileTrigger: document.querySelector('.search-mobile-trigger'),
            cartMobileTrigger: document.querySelector('.cart-mobile-trigger'),
            mobileCartBadge: document.querySelector('.mobile-cart-badge')
        };
    }

    setupEventListeners() {
        // Mobile menu
        if (this.elements.mobileToggle) {
            this.elements.mobileToggle.addEventListener('click', () => this.toggleMobileMenu(true));
        }
        if (this.elements.mobileClose) {
            this.elements.mobileClose.addEventListener('click', () => this.toggleMobileMenu(false));
        }

        // Search
        if (this.elements.searchAction) {
            this.elements.searchAction.addEventListener('click', () => this.toggleSearch(true));
        }
        if (this.elements.searchMobileTrigger) {
            this.elements.searchMobileTrigger.addEventListener('click', () => {
                this.toggleMobileMenu(false);
                this.toggleSearch(true);
            });
        }

        if (this.elements.searchClose) {
            this.elements.searchClose.addEventListener('click', () => this.toggleSearch(false));
        }

        // Cart mobile trigger
        if (this.elements.cartMobileTrigger) {
            this.elements.cartMobileTrigger.addEventListener('click', () => {
                this.toggleMobileMenu(false);
                this.openCart();
            });
        }

        // Profile dropdown
        if (this.elements.userAction) {
            this.elements.userAction.addEventListener('click', (e) => {
                e.stopPropagation();
                this.elements.userDropdown?.classList.toggle('show');
            });
        }

        // Logout
        if (this.elements.logoutActions) {
            this.elements.logoutActions.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.logout();
                });
            });
        }

        // Cart
        if (this.elements.cartAction) {
            this.elements.cartAction.addEventListener('click', () => this.openCart());
        }

        // Search input
        if (this.elements.searchInput) {
            this.elements.searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.performSearch();
            });
        }

        // Suggestion tags
        if (this.elements.suggestionTags) {
            this.elements.suggestionTags.forEach(tag => {
                tag.addEventListener('click', () => {
                    if (this.elements.searchInput) {
                        this.elements.searchInput.value = tag.textContent;
                        this.performSearch();
                    }
                });
            });
        }

        // Close dropdowns on outside click
        document.addEventListener('click', () => {
            if (this.elements.userDropdown) {
                this.elements.userDropdown.classList.remove('show');
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.toggleMobileMenu(false);
                this.toggleSearch(false);
                if (this.elements.userDropdown) {
                    this.elements.userDropdown.classList.remove('show');
                }
            }
        });

        // Active nav links
        if (this.elements.navLinks) {
            this.elements.navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const path = link.getAttribute('href');
                    this.navigateTo(path);
                });
            });
        }

        if (this.elements.mobileLinks) {
            this.elements.mobileLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    const path = link.getAttribute('href');
                    this.navigateTo(path);
                    this.toggleMobileMenu(false);
                });
            });
        }
    }

    setupAuthListeners() {
        // Listen for storage events (when auth.html updates localStorage)
        window.addEventListener('storage', (e) => {
            if (e.key === 'lighthub_auth' || e.key === 'lighthub_user') {
                this.checkAuthStatus();
                this.refreshHeader();
            }
        });

        // Listen for custom auth events
        document.addEventListener('authLogin', (e) => {
            if (e.detail) {
                this.login(e.detail.user, e.detail.token);
            }
        });

        document.addEventListener('authLogout', () => {
            this.logout();
        });

        // Check auth status every minute
        setInterval(() => {
            this.checkAuthStatus();
            if (this.isLoggedIn) {
                this.updateUI();
            }
        }, 60000);
    }

    navigateTo(path) {
        // Close mobile menu if open
        this.toggleMobileMenu(false);
        
        // Update active links
        this.updateActiveLinks();
        
        // Navigate to page
        window.location.href = path;
    }

    updateUI() {
        this.updateCartCount();
        this.updateActiveLinks();
    }

    updateCartCount() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const count = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
        
        // Update desktop cart badge
        if (this.elements.cartBadge) {
            this.elements.cartBadge.textContent = count;
            this.elements.cartBadge.style.display = count > 0 ? 'flex' : 'none';
        }
        
        // Update mobile cart badge
        if (this.elements.mobileCartBadge) {
            this.elements.mobileCartBadge.textContent = count;
            this.elements.mobileCartBadge.style.display = count > 0 ? 'inline-block' : 'none';
        }
    }

    updateActiveLinks() {
        const currentPath = window.location.pathname;
        
        // Update desktop links
        if (this.elements.navLinks) {
            this.elements.navLinks.forEach(link => {
                const href = link.getAttribute('href');
                const isActive = (href === '/' && currentPath === '/') ||
                               (href !== '/' && currentPath.startsWith(href));
                link.classList.toggle('active', isActive);
            });
        }

        // Update mobile links
        if (this.elements.mobileLinks) {
            this.elements.mobileLinks.forEach(link => {
                const href = link.getAttribute('href');
                const isActive = (href === '/' && currentPath === '/') ||
                               (href !== '/' && currentPath.startsWith(href));
                link.classList.toggle('active', isActive);
            });
        }
    }

    toggleMobileMenu(show) {
        const isOpen = this.elements.mobileMenu?.classList.contains('open');
        const shouldOpen = show !== undefined ? show : !isOpen;
        
        if (shouldOpen) {
            this.elements.mobileMenu?.classList.add('open');
            document.body.style.overflow = 'hidden';
        } else {
            this.elements.mobileMenu?.classList.remove('open');
            document.body.style.overflow = '';
        }
    }

    toggleSearch(show) {
        const isOpen = this.elements.searchOverlay?.classList.contains('active');
        const shouldOpen = show !== undefined ? show : !isOpen;
        
        if (shouldOpen) {
            this.elements.searchOverlay?.classList.add('active');
            if (this.elements.searchInput) {
                this.elements.searchInput.focus();
            }
            document.body.style.overflow = 'hidden';
        } else {
            this.elements.searchOverlay?.classList.remove('active');
            if (this.elements.searchInput) {
                this.elements.searchInput.value = '';
            }
            document.body.style.overflow = '';
        }
    }

    performSearch() {
        const query = this.elements.searchInput?.value.trim();
        if (query) {
            this.toggleSearch(false);
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
    }

    openCart() {
        document.dispatchEvent(new CustomEvent('openCart'));
    }

    // Updated login method to properly capture user's name from auth system
    login(userData, tokenData) {
        this.isLoggedIn = true;
        
        // Extract user info from token or userData
        if (typeof userData === 'object') {
            this.currentUser = {
                name: userData.name || 'User',
                email: userData.email || '',
                firstName: userData.firstName || (userData.name ? userData.name.split(' ')[0] : 'User')
            };
        } else if (tokenData) {
            // Try to extract user info from token
            try {
                const payload = JSON.parse(atob(tokenData.split('.')[1]));
                this.currentUser = {
                    name: payload.name || payload.given_name || 'User',
                    email: payload.email || '',
                    firstName: payload.given_name || (payload.name ? payload.name.split(' ')[0] : 'User')
                };
            } catch (e) {
                this.currentUser = { name: 'User', email: '', firstName: 'User' };
            }
        } else {
            this.currentUser = { name: 'User', email: '', firstName: 'User' };
        }

        // Store in localStorage (matching auth.html format)
        localStorage.setItem('lighthub_auth', JSON.stringify({
            idToken: tokenData?.idToken || tokenData,
            accessToken: tokenData?.accessToken || '',
            refreshToken: tokenData?.refreshToken || '',
            expiresAt: Date.now() + (3600 * 1000)
        }));

        localStorage.setItem('lighthub_user', JSON.stringify(this.currentUser));

        this.refreshHeader();
        this.showNotification(`Welcome back, ${this.currentUser.firstName || this.currentUser.name.split(' ')[0] || 'User'}!`);
    }

    logout() {
        this.isLoggedIn = false;
        this.currentUser = null;
        this.clearAuth();
        this.refreshHeader();
        this.showNotification('Successfully logged out');
        
        // Dispatch logout event
        document.dispatchEvent(new CustomEvent('authLogout'));
        
        // Redirect to home page after delay
        setTimeout(() => {
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }, 1000);
    }

    clearAuth() {
        // Clear all auth-related localStorage items
        localStorage.removeItem('lighthub_auth');
        localStorage.removeItem('lighthub_user');
        localStorage.removeItem('idToken');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userData');
        localStorage.removeItem('authToken');
    }

    refreshHeader() {
        this.loadHeader();
        this.setupEventListeners();
        this.updateUI();
    }

    showNotification(message) {
        const existing = document.querySelector('.header-notification');
        if (existing) existing.remove();

        const notification = document.createElement('div');
        notification.className = 'header-notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => notification.classList.add('show'), 10);
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 3000);
    }

    addStyles() {
        const styles = `
            /* Header Base Styles */
            .light-header {
                background: rgba(15, 23, 42, 0.98);
                backdrop-filter: blur(10px);
                border-bottom: 1px solid rgba(255, 60, 0, 0.2);
                position: fixed;
                width: 100%;
                top: 0;
                z-index: 1000;
                box-shadow: 0 2px 20px rgba(0, 0, 0, 0.2);
            }

            .header-wrapper {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 24px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                height: 64px;
                position: relative;
            }

            /* Logo */
            .header-logo {
                display: flex;
                align-items: center;
                gap: 12px;
                text-decoration: none;
                color: white;
                font-family: 'Rajdhani', sans-serif;
                font-size: 24px;
                font-weight: 700;
                transition: transform 0.2s;
            }

            .header-logo:hover {
                transform: scale(1.05);
            }

            .header-logo i {
                color: #ff3c00;
                font-size: 26px;
            }

            /* Desktop Navigation */
            .header-nav {
                display: flex;
                gap: 30px;
                margin-left: 40px;
            }

            @media (max-width: 1024px) {
                .header-nav {
                    display: none;
                }
            }

            .nav-link {
                color: #e2e8f0;
                text-decoration: none;
                font-family: 'Montserrat', sans-serif;
                font-size: 15px;
                font-weight: 500;
                letter-spacing: 0.3px;
                padding: 8px 0;
                position: relative;
                transition: color 0.2s;
            }

            .nav-link:hover,
            .nav-link.active {
                color: #ff3c00;
            }

            .nav-link.active::after {
                content: '';
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                height: 2px;
                background: #ff3c00;
                border-radius: 2px;
            }

            /* Header Actions */
            .header-actions {
                display: flex;
                align-items: center;
                gap: 16px;
            }

            .header-action {
                width: 42px;
                height: 42px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.05);
                border: none;
                color: #cbd5e1;
                cursor: pointer;
                transition: all 0.2s;
                position: relative;
            }

            .header-action:hover {
                background: rgba(255, 60, 0, 0.1);
                color: #ff3c00;
                transform: translateY(-2px);
            }

            .cart-badge {
                position: absolute;
                top: -6px;
                right: -6px;
                background: #ff3c00;
                color: white;
                font-size: 11px;
                font-weight: 700;
                min-width: 18px;
                height: 18px;
                border-radius: 9px;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0 5px;
            }

            /* Login Action */
            .login-action {
                width: 42px;
                height: 42px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 10px;
                background: rgba(255, 255, 255, 0.05);
                color: #cbd5e1;
                text-decoration: none;
                transition: all 0.2s;
            }

            .login-action:hover {
                background: rgba(255, 60, 0, 0.1);
                color: #ff3c00;
                transform: translateY(-2px);
            }

            .login-text {
                display: none;
            }

            @media (min-width: 1025px) {
                .login-text {
                    display: inline;
                    margin-left: 8px;
                    font-size: 14px;
                    font-weight: 500;
                }
                .login-action {
                    width: auto;
                    padding: 0 16px;
                    gap: 8px;
                }
            }

            /* Mobile Toggle Button */
            .mobile-toggle {
                width: 42px;
                height: 42px;
                display: none;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                gap: 5px;
                background: rgba(255, 255, 255, 0.05);
                border: none;
                border-radius: 10px;
                cursor: pointer;
            }

            @media (max-width: 1024px) {
                .mobile-toggle {
                    display: flex;
                }
            }

            .mobile-toggle span {
                width: 20px;
                height: 2px;
                background: #cbd5e1;
                border-radius: 1px;
                transition: all 0.3s;
            }

            .mobile-toggle:hover span {
                background: #ff3c00;
            }

            /* Mobile Menu - FIXED: Now properly shows all items */
            .mobile-menu {
                position: fixed;
                top: 0;
                right: -100%;
                width: 100%;
                max-width: 380px;
                height: 100vh;
                background: #0f172a;
                z-index: 1001;
                transition: right 0.3s ease;
                display: flex;
                flex-direction: column;
                box-shadow: -5px 0 30px rgba(0, 0, 0, 0.5);
                overflow-y: auto;
            }

            .mobile-menu.open {
                right: 0;
            }

            .mobile-menu-header {
                padding: 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                background: #0f172a;
                position: sticky;
                top: 0;
                z-index: 10;
            }

            .mobile-logo {
                display: flex;
                align-items: center;
                gap: 10px;
                color: white;
                font-family: 'Rajdhani', sans-serif;
                font-size: 20px;
                font-weight: 700;
            }

            .mobile-logo i {
                color: #ff3c00;
            }

            .mobile-close {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.05);
                border: none;
                border-radius: 10px;
                color: #cbd5e1;
                cursor: pointer;
                transition: all 0.2s;
            }

            .mobile-close:hover {
                background: rgba(255, 60, 0, 0.1);
                color: #ff3c00;
            }

            .mobile-menu-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px 20px 40px;
            }

            .mobile-section-title {
                color: #94a3b8;
                font-size: 13px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin: 0 0 15px 0;
                padding-bottom: 8px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            }

            .mobile-nav-section,
            .mobile-categories-section,
            .mobile-actions-section,
            .mobile-auth-section,
            .mobile-contact-section {
                margin-bottom: 30px;
            }

            .mobile-link {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 14px 16px;
                color: #cbd5e1;
                text-decoration: none;
                font-family: 'Montserrat', sans-serif;
                font-size: 15px;
                font-weight: 500;
                border-radius: 10px;
                transition: all 0.2s;
                margin-bottom: 4px;
            }

            .mobile-link i {
                width: 20px;
                color: #ff3c00;
                font-size: 16px;
            }

            .mobile-link:hover,
            .mobile-link.active {
                background: rgba(255, 60, 0, 0.1);
                color: #ff3c00;
                transform: translateX(5px);
            }

            /* Category Grid */
            .mobile-category-grid {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 10px;
            }

            .mobile-category-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 8px;
                padding: 16px 10px;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 12px;
                color: #cbd5e1;
                text-decoration: none;
                transition: all 0.2s;
                text-align: center;
            }

            .mobile-category-item i {
                font-size: 24px;
                color: #ff3c00;
            }

            .mobile-category-item span {
                font-size: 13px;
                font-weight: 500;
            }

            .mobile-category-item:hover {
                background: rgba(255, 60, 0, 0.1);
                color: #ff3c00;
                transform: translateY(-2px);
            }

            /* Mobile Action Items */
            .mobile-action-item {
                display: flex;
                align-items: center;
                gap: 12px;
                width: 100%;
                padding: 14px 16px;
                background: rgba(255, 255, 255, 0.03);
                border: none;
                border-radius: 10px;
                color: #cbd5e1;
                font-family: 'Montserrat', sans-serif;
                font-size: 15px;
                cursor: pointer;
                transition: all 0.2s;
                margin-bottom: 8px;
            }

            .mobile-action-item i {
                width: 20px;
                color: #ff3c00;
                font-size: 16px;
            }

            .mobile-action-item:hover {
                background: rgba(255, 60, 0, 0.1);
                color: #ff3c00;
                transform: translateX(5px);
            }

            .mobile-cart-badge {
                background: #ff3c00;
                color: white;
                font-size: 11px;
                font-weight: 700;
                padding: 2px 8px;
                border-radius: 12px;
                margin-left: auto;
            }

            /* Mobile User Info */
            .mobile-user-info {
                display: flex;
                align-items: center;
                gap: 15px;
                padding: 16px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
                margin-bottom: 20px;
            }

            .mobile-user-info i {
                font-size: 40px;
                color: #ff3c00;
            }

            .mobile-user-info .user-name {
                color: white;
                font-weight: 600;
                margin-bottom: 4px;
                font-size: 16px;
            }

            .mobile-user-info .user-email {
                color: #94a3b8;
                font-size: 14px;
            }

            .mobile-user-links {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .mobile-user-link {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 14px 16px;
                color: #cbd5e1;
                text-decoration: none;
                background: rgba(255, 255, 255, 0.03);
                border-radius: 10px;
                border: none;
                font-family: 'Montserrat', sans-serif;
                font-size: 15px;
                cursor: pointer;
                transition: all 0.2s;
                width: 100%;
                text-align: left;
            }

            .mobile-user-link i {
                width: 20px;
                color: #ff3c00;
            }

            .mobile-user-link:hover {
                background: rgba(255, 60, 0, 0.1);
                color: #ff3c00;
                transform: translateX(5px);
            }

            /* Mobile Login Section */
            .mobile-login-section {
                text-align: center;
                padding: 20px;
                background: rgba(255, 255, 255, 0.05);
                border-radius: 12px;
            }

            .mobile-login-section p {
                color: #cbd5e1;
                margin-bottom: 16px;
                font-size: 15px;
            }

            .mobile-login-btn {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
                width: 100%;
                padding: 14px;
                background: rgba(255, 60, 0, 0.1);
                color: #ff3c00;
                text-decoration: none;
                border-radius: 10px;
                font-weight: 600;
                margin-bottom: 12px;
                transition: all 0.2s;
            }

            .mobile-login-btn:hover {
                background: rgba(255, 60, 0, 0.2);
            }

            .mobile-register-link {
                display: block;
                color: #94a3b8;
                text-decoration: none;
                font-size: 14px;
                transition: color 0.2s;
            }

            .mobile-register-link:hover {
                color: #ff3c00;
            }

            /* Mobile Contact Section */
            .mobile-contact-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 16px;
                color: #cbd5e1;
                text-decoration: none;
                font-size: 14px;
                border-radius: 10px;
                transition: all 0.2s;
                margin-bottom: 4px;
            }

            .mobile-contact-item i {
                width: 20px;
                color: #ff3c00;
            }

            .mobile-contact-item:hover {
                background: rgba(255, 60, 0, 0.1);
                color: #ff3c00;
            }

            .mobile-social-icons {
                display: flex;
                gap: 12px;
                margin-top: 16px;
                padding: 0 16px;
            }

            .social-icon {
                width: 36px;
                height: 36px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.05);
                color: #cbd5e1;
                border-radius: 50%;
                transition: all 0.2s;
            }

            .social-icon:hover {
                background: rgba(255, 60, 0, 0.2);
                color: #ff3c00;
                transform: translateY(-2px);
            }

            /* Search Overlay */
            .search-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.95);
                z-index: 1002;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s;
            }

            .search-overlay.active {
                opacity: 1;
                visibility: visible;
            }

            .search-container {
                max-width: 600px;
                margin: 100px auto 0;
                padding: 0 24px;
            }

            .search-box {
                display: flex;
                align-items: center;
                gap: 16px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                padding: 16px 20px;
                margin-bottom: 24px;
            }

            .search-box i {
                color: #94a3b8;
                font-size: 20px;
            }

            .search-input {
                flex: 1;
                background: none;
                border: none;
                color: white;
                font-size: 16px;
                font-family: 'Montserrat', sans-serif;
                outline: none;
            }

            .search-input::placeholder {
                color: #94a3b8;
            }

            .search-close {
                width: 40px;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background: rgba(255, 255, 255, 0.05);
                border: none;
                border-radius: 10px;
                color: #cbd5e1;
                cursor: pointer;
                transition: all 0.2s;
            }

            .search-close:hover {
                background: rgba(255, 60, 0, 0.1);
                color: #ff3c00;
            }

            .search-suggestions {
                color: #94a3b8;
                font-size: 14px;
            }

            .search-suggestions p {
                margin-bottom: 16px;
            }

            .suggestion-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
            }

            .tag {
                padding: 10px 18px;
                background: rgba(255, 255, 255, 0.05);
                border: none;
                border-radius: 20px;
                color: #cbd5e1;
                font-size: 14px;
                cursor: pointer;
                transition: all 0.2s;
            }

            .tag:hover {
                background: rgba(255, 60, 0, 0.2);
                color: #ff3c00;
            }

            /* User Section */
            .user-section {
                position: relative;
            }

            .user-action {
                width: 42px;
                height: 42px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                background: rgba(255, 255, 255, 0.05);
                border: none;
                border-radius: 10px;
                color: #cbd5e1;
                cursor: pointer;
                transition: all 0.2s;
                font-family: 'Montserrat', sans-serif;
                font-size: 14px;
            }

            .user-action:hover {
                background: rgba(255, 60, 0, 0.1);
                color: #ff3c00;
            }

            .user-name {
                display: none;
            }

            @media (min-width: 1025px) {
                .user-name {
                    display: inline;
                }
                .user-action {
                    width: auto;
                    padding: 0 16px;
                }
            }

            .user-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                width: 240px;
                background: #1e293b;
                border-radius: 12px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
                padding: 16px 0;
                margin-top: 12px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(10px);
                transition: all 0.2s;
                z-index: 100;
                border: 1px solid rgba(255, 255, 255, 0.1);
            }

            .user-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .user-dropdown-header {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 0 20px 16px 20px;
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                margin-bottom: 12px;
            }

            .user-dropdown-header i {
                font-size: 36px;
                color: #ff3c00;
            }

            .dropdown-user-name {
                color: white;
                font-weight: 600;
                font-size: 14px;
                margin-bottom: 4px;
            }

            .dropdown-user-email {
                color: #94a3b8;
                font-size: 12px;
            }

            .dropdown-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px 20px;
                color: #cbd5e1;
                text-decoration: none;
                font-size: 14px;
                background: none;
                border: none;
                width: 100%;
                text-align: left;
                cursor: pointer;
                transition: all 0.2s;
            }

            .dropdown-item:hover {
                background: rgba(255, 60, 0, 0.1);
                color: #ff3c00;
            }

            .dropdown-divider {
                height: 1px;
                background: rgba(255, 255, 255, 0.1);
                margin: 12px 0;
            }

            /* Header Notification */
            .header-notification {
                position: fixed;
                top: 80px;
                right: 24px;
                background: linear-gradient(135deg, #ff3c00, #cc3000);
                color: white;
                padding: 14px 24px;
                border-radius: 10px;
                font-family: 'Rajdhani', sans-serif;
                font-weight: 600;
                font-size: 14px;
                z-index: 10000;
                transform: translateX(150%);
                transition: transform 0.3s;
                box-shadow: 0 8px 25px rgba(255, 60, 0, 0.3);
            }

            .header-notification.show {
                transform: translateX(0);
            }

            /* Responsive */
            @media (max-width: 768px) {
                .header-wrapper {
                    padding: 0 16px;
                    height: 60px;
                }

                .header-logo {
                    font-size: 22px;
                }

                .header-logo i {
                    font-size: 24px;
                }

                .header-action,
                .login-action,
                .mobile-toggle {
                    width: 40px;
                    height: 40px;
                }

                .mobile-menu {
                    max-width: 100%;
                }
            }

            @media (max-width: 480px) {
                .mobile-category-grid {
                    grid-template-columns: 1fr;
                }
            }

            /* Ensure content doesn't hide behind fixed header */
            body {
                padding-top: 64px;
                margin: 0;
                font-family: 'Montserrat', sans-serif;
                background: #0a0f1a;
                color: white;
            }

            @media (max-width: 768px) {
                body {
                    padding-top: 60px;
                }
            }
        `;

        const styleEl = document.createElement('style');
        styleEl.textContent = styles;
        document.head.appendChild(styleEl);
    }
}

// Initialize header on DOM load
document.addEventListener('DOMContentLoaded', () => {
    window.headerManager = new HeaderManager('header-container');
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HeaderManager;
}