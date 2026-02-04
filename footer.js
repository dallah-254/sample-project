// Footer JavaScript for Motorcycle Lighting E-commerce
// Responsive footer that collapses on mobile

class FooterManager {
    constructor() {
        // DOM Elements
        this.footerContainer = document.getElementById('footer-container');
        this.footerColumns = null;
        this.collapseButtons = null;
        
        // Initialize
        this.init();
    }
    
    init() {
        // Create and insert footer HTML
        this.createFooter();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Check initial screen size
        this.handleResponsive();
    }
    
    // Create footer HTML
    createFooter() {
        const footerHTML = `
            <footer>
                <div class="container">
                    <div class="footer-content">
                        <!-- Company Info -->
                        <div class="footer-column">
                            <h3>LightHub Customs</h3>
                            <div class="footer-contact">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>123 Lighting Ave, Detroit, MI 48201</span>
                            </div>
                            <div class="footer-contact">
                                <i class="fas fa-phone"></i>
                                <span>(555) 123-4567</span>
                            </div>
                            <div class="footer-contact">
                                <i class="fas fa-envelope"></i>
                                <span>info@lighthubcustoms.com</span>
                            </div>
                            
                            <div class="social-links">
                                <a href="#" class="social-link" aria-label="Facebook">
                                    <i class="fab fa-facebook-f"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="Instagram">
                                    <i class="fab fa-instagram"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="YouTube">
                                    <i class="fab fa-youtube"></i>
                                </a>
                                <a href="#" class="social-link" aria-label="TikTok">
                                    <i class="fab fa-tiktok"></i>
                                </a>
                            </div>
                        </div>
                        
                        <!-- Quick Links -->
                        <div class="footer-column">
                            <h3>
                                <span class="footer-column-title">Quick Links</span>
                                <button class="footer-collapse-btn" data-column="quick-links">
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                            </h3>
                            <ul class="footer-links" id="quick-links">
                                <li><a href="/"><i class="fas fa-chevron-right"></i> Home</a></li>
                                <li><a href="/products"><i class="fas fa-chevron-right"></i> Products</a></li>
                                <li><a href="/categories"><i class="fas fa-chevron-right"></i> Categories</a></li>
                                <li><a href="/build-pc"><i class="fas fa-chevron-right"></i> Build Your PC</a></li>
                                <li><a href="/deals"><i class="fas fa-chevron-right"></i> Hot Deals</a></li>
                            </ul>
                        </div>
                        
                        <!-- Customer Service -->
                        <div class="footer-column">
                            <h3>
                                <span class="footer-column-title">Customer Service</span>
                                <button class="footer-collapse-btn" data-column="customer-service">
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                            </h3>
                            <ul class="footer-links" id="customer-service">
                                <li><a href="/shipping"><i class="fas fa-chevron-right"></i> Shipping Policy</a></li>
                                <li><a href="/returns"><i class="fas fa-chevron-right"></i> Return Policy</a></li>
                                <li><a href="/warranty"><i class="fas fa-chevron-right"></i> Warranty</a></li>
                                <li><a href="/faq"><i class="fas fa-chevron-right"></i> FAQ</a></li>
                                <li><a href="/contact"><i class="fas fa-chevron-right"></i> Contact Us</a></li>
                                <li><a href="/support"><i class="fas fa-chevron-right"></i> Technical Support</a></li>
                            </ul>
                        </div>
                        
                        <!-- Newsletter & Payment -->
                        <div class="footer-column">
                            <h3>
                                <span class="footer-column-title">Stay Updated</span>
                                <button class="footer-collapse-btn" data-column="newsletter">
                                    <i class="fas fa-chevron-down"></i>
                                </button>
                            </h3>
                            <div class="footer-section" id="newsletter">
                                <p style="color: var(--gray); margin-bottom: 20px;">
                                    Subscribe to our newsletter for exclusive deals and lighting tips.
                                </p>
                                <form class="newsletter-form" id="footerNewsletterForm">
                                    <input type="email" placeholder="Your email address" required>
                                    <button type="submit">Subscribe</button>
                                </form>
                                
                                <div class="payment-methods">
                                    <p style="color: var(--gray); margin-top: 30px; margin-bottom: 10px;">We Accept:</p>
                                    <div class="payment-icons">
                                        <i class="fab fa-cc-visa" title="Visa"></i>
                                        <i class="fab fa-cc-mastercard" title="Mastercard"></i>
                                        <i class="fab fa-cc-amex" title="American Express"></i>
                                        <i class="fab fa-cc-paypal" title="PayPal"></i>
                                        <i class="fab fa-cc-apple-pay" title="Apple Pay"></i>
                                        <i class="fab fa-cc-amazon-pay" title="Amazon Pay"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Footer Bottom -->
                    <div class="footer-bottom">
                        <div class="copyright">
                            <p>&copy; ${new Date().getFullYear()} <span class="highlight">LightHub Customs</span>. All rights reserved.</p>
                            <p style="margin-top: 10px; font-size: 14px;">Premium Vehicle Lighting Solutions</p>
                        </div>
                        
                        <div class="footer-bottom-links">
                            <a href="/privacy">Privacy Policy</a>
                            <a href="/terms">Terms of Service</a>
                            <a href="/sitemap">Sitemap</a>
                            <a href="/cookies">Cookie Policy</a>
                        </div>
                    </div>
                </div>
            </footer>
        `;
        
        if (this.footerContainer) {
            this.footerContainer.innerHTML = footerHTML;
        } else {
            // Create footer container if it doesn't exist
            const footer = document.createElement('footer');
            footer.innerHTML = footerHTML;
            document.body.appendChild(footer);
        }
        
        // Cache DOM elements after creation
        this.footerColumns = document.querySelectorAll('.footer-column');
        this.collapseButtons = document.querySelectorAll('.footer-collapse-btn');
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Collapse buttons for mobile
        if (this.collapseButtons) {
            this.collapseButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    const columnId = button.getAttribute('data-column');
                    this.toggleColumn(columnId, button);
                });
            });
        }
        
        // Newsletter form submission
        const newsletterForm = document.getElementById('footerNewsletterForm');
        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (e) => this.handleNewsletterSubmit(e));
        }
        
        // Handle window resize
        window.addEventListener('resize', () => this.handleResponsive());
        
        // Smooth scroll for anchor links
        this.setupSmoothScroll();
    }
    
    // Toggle footer column on mobile
    toggleColumn(columnId, button) {
        const columnContent = document.getElementById(columnId);
        const isExpanded = columnContent.classList.contains('expanded');
        
        if (isExpanded) {
            columnContent.classList.remove('expanded');
            button.innerHTML = '<i class="fas fa-chevron-down"></i>';
        } else {
            columnContent.classList.add('expanded');
            button.innerHTML = '<i class="fas fa-chevron-up"></i>';
        }
    }
    
    // Handle responsive design
    handleResponsive() {
        const isMobile = window.innerWidth <= 768;
        
        if (this.footerColumns) {
            this.footerColumns.forEach((column, index) => {
                if (isMobile && index > 0) { // Keep first column (company info) always visible
                    const columnId = column.querySelector('.footer-collapse-btn')?.getAttribute('data-column');
                    if (columnId) {
                        const content = document.getElementById(columnId);
                        if (content && !content.classList.contains('expanded')) {
                            content.style.display = 'none';
                        }
                    }
                } else {
                    // Show all columns on desktop
                    const content = column.querySelector('.footer-links, .footer-section');
                    if (content) {
                        content.style.display = 'block';
                    }
                }
            });
        }
    }
    
    // Handle newsletter subscription
    handleNewsletterSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value.trim();
        
        if (this.validateEmail(email)) {
            // Simulate API call
            this.showNewsletterMessage('Subscribing...', 'info');
            
            setTimeout(() => {
                this.showNewsletterMessage('Thank you for subscribing to our newsletter!', 'success');
                emailInput.value = '';
                
                // Store subscription in localStorage
                const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
                subscriptions.push({
                    email: email,
                    date: new Date().toISOString()
                });
                localStorage.setItem('newsletterSubscriptions', JSON.stringify(subscriptions));
            }, 1000);
        } else {
            this.showNewsletterMessage('Please enter a valid email address', 'error');
        }
    }
    
    // Validate email format
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Show newsletter message
    showNewsletterMessage(message, type) {
        // Remove existing message if any
        const existingMessage = document.querySelector('.newsletter-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        const form = document.getElementById('footerNewsletterForm');
        if (!form) return;
        
        const messageEl = document.createElement('div');
        messageEl.className = `newsletter-message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            margin-top: 15px;
            padding: 10px 15px;
            border-radius: var(--radius);
            font-size: 14px;
            font-weight: 500;
            text-align: center;
            transition: all 0.3s ease;
        `;
        
        // Style based on type
        if (type === 'success') {
            messageEl.style.backgroundColor = 'rgba(0, 168, 255, 0.1)';
            messageEl.style.color = 'var(--accent)';
            messageEl.style.border = '1px solid rgba(0, 168, 255, 0.3)';
        } else if (type === 'error') {
            messageEl.style.backgroundColor = 'rgba(255, 60, 0, 0.1)';
            messageEl.style.color = 'var(--primary)';
            messageEl.style.border = '1px solid rgba(255, 60, 0, 0.3)';
        } else {
            messageEl.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
            messageEl.style.color = 'var(--gray)';
            messageEl.style.border = '1px solid rgba(255, 255, 255, 0.1)';
        }
        
        form.appendChild(messageEl);
        
        // Remove message after 5 seconds
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.opacity = '0';
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.remove();
                    }
                }, 300);
            }
        }, 5000);
    }
    
    // Setup smooth scroll for footer links
    setupSmoothScroll() {
        document.querySelectorAll('.footer-links a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                e.preventDefault();
                
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;
                
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    // Update copyright year
    updateCopyrightYear() {
        const copyright = document.querySelector('.copyright p');
        if (copyright) {
            copyright.innerHTML = `&copy; ${new Date().getFullYear()} <span class="highlight">LightHub Customs</span>. All rights reserved.`;
        }
    }
    
    // Get newsletter subscribers count
    getSubscriberCount() {
        const subscriptions = JSON.parse(localStorage.getItem('newsletterSubscriptions') || '[]');
        return subscriptions.length;
    }
}

// Initialize footer when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Create footer instance
    window.footerManager = new FooterManager();
    
    // Add responsive CSS
    const footerStyles = `
        /* Footer responsive styles */
        @media (max-width: 1024px) {
            .footer-content {
                grid-template-columns: repeat(2, 1fr);
                gap: 30px;
            }
            
            .footer-bottom {
                flex-direction: column;
                text-align: center;
                gap: 20px;
            }
        }
        
        @media (max-width: 768px) {
            .footer-content {
                grid-template-columns: 1fr;
                gap: 20px;
            }
            
            .footer-column {
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                padding-bottom: 20px;
            }
            
            .footer-column:last-child {
                border-bottom: none;
                padding-bottom: 0;
            }
            
            .footer-column h3 {
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: pointer;
                margin-bottom: 0;
            }
            
            .footer-collapse-btn {
                background: none;
                border: none;
                color: var(--gray);
                font-size: 16px;
                cursor: pointer;
                padding: 5px;
                transition: var(--transition);
            }
            
            .footer-collapse-btn:hover {
                color: var(--primary);
            }
            
            .footer-column:first-child .footer-collapse-btn {
                display: none;
            }
            
            .footer-links,
            .footer-section {
                max-height: 0;
                overflow: hidden;
                transition: max-height 0.3s ease;
            }
            
            .footer-links.expanded,
            .footer-section.expanded {
                max-height: 1000px;
                margin-top: 20px;
            }
            
            /* First column always visible on mobile */
            .footer-column:first-child .footer-links,
            .footer-column:first-child .footer-section {
                max-height: none;
                display: block !important;
            }
            
            .payment-icons {
                justify-content: center;
            }
            
            .footer-bottom-links {
                justify-content: center;
                gap: 15px;
                flex-wrap: wrap;
            }
        }
        
        @media (max-width: 480px) {
            .footer-column h3 {
                font-size: 18px;
            }
            
            .footer-contact {
                font-size: 14px;
            }
            
            .social-links {
                justify-content: center;
            }
            
            .newsletter-form {
                flex-direction: column;
                gap: 10px;
            }
            
            .newsletter-form input,
            .newsletter-form button {
                border-radius: var(--radius);
                width: 100%;
            }
            
            .footer-bottom-links {
                flex-direction: column;
                gap: 10px;
            }
            
            .footer-bottom-links a {
                font-size: 13px;
            }
        }
        
        /* Desktop - hide collapse buttons */
        @media (min-width: 769px) {
            .footer-collapse-btn {
                display: none;
            }
            
            .footer-links,
            .footer-section {
                display: block !important;
            }
        }
    `;
    
    // Add styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = footerStyles;
    document.head.appendChild(styleSheet);
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FooterManager;
}