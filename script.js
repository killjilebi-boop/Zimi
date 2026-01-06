/**
 * =====================================================================
 * YUZMII - PREMIUM WEBSITE CORE LOGIC
 * Features: Telegram Bot Integration, E-com Cart, Dark Mode, Animations
 * Bot Token: 8294116898:AAGd7RPeesOvJaIytO67YW4ow3QsiV_vY0s
 * Chat ID: 7752627907
 * =====================================================================
 */
"use strict";
// 1. CONFIGURATION & TELEGRAM SETUP
const CONFIG = {
    TELEGRAM_TOKEN: '8294116898:AAGd7RPeesOvJaIytO67YW4ow3QsiV_vY0s',
    CHAT_ID: '7752627907',
    THEME_KEY: 'yuzmii_theme_pref',
    CART_KEY: 'yuzmii_cart_items'
};
// 2. DOM ELEMENTS
const dom = {
    body: document.body,
    html: document.documentElement,
    preloader: document.getElementById('loader-wrapper'),
    themeBtn: document.getElementById('themeSwitcher'),
    moonIcon: document.getElementById('moonIcon'),
    sunIcon: document.getElementById('sunIcon'),
    mobileBtn: document.getElementById('mobileMenuBtn'),
    nav: document.querySelector('.main-nav'),
    header: document.querySelector('.main-header'),
    backToTop: document.getElementById('backToTop'),
    contactForm: document.getElementById('yuzmiiContactForm'),
    cartBadge: document.querySelector('.badge'),
    addToCartBtns: document.querySelectorAll('.btn-add-cart'),
    productItems: document.querySelectorAll('.product-item'),
    cartTrigger: document.querySelector('.cart-trigger')
};
// 3. INITIALIZATION & PRELOADER
window.addEventListener('load', () => {
    // Hide Preloader after page loads
    if (dom.preloader) {
        setTimeout(() => {
            dom.preloader.style.opacity = '0';
            dom.preloader.style.visibility = 'hidden';
        }, 800);
    }
   
    // Initialize functions
    initializeTheme();
    loadCart();
    setupAnimations();
    setupCartModal();
});
/**
 * 4. THEME TOGGLE LOGIC (DARK / LIGHT)
 * Must support persistent storage and icon switching
 */
function initializeTheme() {
    const savedTheme = localStorage.getItem(CONFIG.THEME_KEY) || 'dark';
    applyTheme(savedTheme);
    dom.themeBtn.addEventListener('click', () => {
        const currentTheme = dom.html.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(newTheme);
    });
}
function applyTheme(theme) {
    dom.html.setAttribute('data-theme', theme);
    localStorage.setItem(CONFIG.THEME_KEY, theme);
    if (theme === 'light') {
        dom.moonIcon.style.display = 'none';
        dom.sunIcon.style.display = 'block';
    } else {
        dom.moonIcon.style.display = 'block';
        dom.sunIcon.style.display = 'none';
    }
}
/**
 * 5. TELEGRAM BOT INTEGRATION
 * Core function to send notifications to your bot
 */
async function sendToTelegram(message) {
    const url = `https://api.telegram.org/bot${CONFIG.TELEGRAM_TOKEN}/sendMessage`;
   
    const payload = {
        chat_id: CONFIG.CHAT_ID,
        text: message,
        parse_mode: 'HTML'
    };
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        const data = await response.json();
        return data.ok;
    } catch (error) {
        console.error("Telegram Error:", error);
        return false;
    }
}
/**
 * 6. SHOPPING CART SYSTEM
 * Advanced logic for adding items and calculating totals
 */
let cart = [];
function loadCart() {
    const savedCart = localStorage.getItem(CONFIG.CART_KEY);
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartUI();
    }
}
function updateCartUI() {
    if (dom.cartBadge) {
        dom.cartBadge.textContent = cart.length;
        dom.cartBadge.style.display = cart.length > 0 ? 'flex' : 'none';
    }
}
// Logic for Add to Cart Button
dom.addToCartBtns.forEach((btn, index) => {
    btn.addEventListener('click', (e) => {
        const productCard = e.target.closest('.product-item');
        const productName = productCard.querySelector('h3').innerText;
        const productPrice = productCard.querySelector('.price').innerText;
        const product = {
            id: Date.now() + index,
            name: productName,
            price: productPrice
        };
        cart.push(product);
        localStorage.setItem(CONFIG.CART_KEY, JSON.stringify(cart));
        updateCartUI();
        // Optional: Notify user
        alert(`${productName} added to cart!`);
       
        // AUTOMATIC TELEGRAM ALERT FOR NEW ORDER INITIATION
        const orderMsg = `🛒 <b>New Item Added to Cart!</b>\n\n` +
                         `<b>Product:</b> ${productName}\n` +
                         `<b>Price:</b> ${productPrice}\n` +
                         `<b>Status:</b> Customer is browsing.`;
        sendToTelegram(orderMsg);
    });
});
/**
 * 6.1 CART MODAL & CHECKOUT LOGIC
 * Displays cart items and form for address/payment
 */
function setupCartModal() {
    dom.cartTrigger.addEventListener('click', showCartModal);
}
function showCartModal() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }
    
    // Create modal dynamically
    const modal = document.createElement('div');
    modal.classList.add('cart-modal');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0,0,0,0.8)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '10000';

    const modalContent = document.createElement('div');
    modalContent.style.background = 'var(--bg-card)';
    modalContent.style.padding = '30px';
    modalContent.style.maxWidth = '600px';
    modalContent.style.width = '90%';
    modalContent.style.borderRadius = '8px';
    modalContent.style.boxShadow = 'var(--shadow)';

    let totalPrice = 0;
    let itemsHtml = '<h2>Your Cart</h2><ul>';
    cart.forEach(item => {
        itemsHtml += `<li>${item.name} - ${item.price}</li>`;
        // Calculate total (assume price is like '₹1,695.00', parse number)
        const priceNum = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        totalPrice += priceNum;
    });
    itemsHtml += '</ul>';
    itemsHtml += `<p><b>Total:</b> ₹${totalPrice.toFixed(2)}</p>`;

    // Checkout form
    itemsHtml += `
        <form id="checkoutForm">
            <input type="text" placeholder="Your Name" required>
            <input type="email" placeholder="Your Email" required>
            <input type="text" placeholder="WhatsApp Number" required>
            <textarea placeholder="Shipping Address" rows="3" required></textarea>
            <input type="text" placeholder="Payment Details (UPI/Bank)" required>
            <button type="submit" class="btn btn-primary">Place Order</button>
        </form>
    `;

    modalContent.innerHTML = itemsHtml;
    modal.appendChild(modalContent);
    dom.body.appendChild(modal);

    // Close modal on click outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });

    // Handle checkout form submit
    const checkoutForm = modalContent.querySelector('#checkoutForm');
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = checkoutForm.querySelector('input[type="text"]').value;
        const email = checkoutForm.querySelector('input[type="email"]').value;
        const whatsapp = checkoutForm.querySelectorAll('input[type="text"]')[1].value;
        const address = checkoutForm.querySelector('textarea').value;
        const payment = checkoutForm.querySelectorAll('input[type="text"]')[2].value;

        let orderDetails = `🛍️ <b>New Order Placed!</b>\n\n`;
        orderDetails += `<b>Customer Name:</b> ${name}\n`;
        orderDetails += `<b>Email:</b> ${email}\n`;
        orderDetails += `<b>WhatsApp:</b> ${whatsapp}\n`;
        orderDetails += `<b>Shipping Address:</b> ${address}\n`;
        orderDetails += `<b>Payment Details:</b> ${payment}\n\n`;
        orderDetails += `<b>Items:</b>\n`;
        cart.forEach(item => {
            orderDetails += `- ${item.name}: ${item.price}\n`;
        });
        orderDetails += `\n<b>Total:</b> ₹${totalPrice.toFixed(2)}`;

        const success = await sendToTelegram(orderDetails);
        if (success) {
            alert('Order placed successfully! We will process it soon.');
            cart = [];
            localStorage.removeItem(CONFIG.CART_KEY);
            updateCartUI();
            modal.remove();
        } else {
            alert('Error placing order. Please try again.');
        }
    });
}
/**
 * 7. CONTACT FORM & LEAD GENERATION
 * Sends user inquiries directly to your Telegram
 */
if (dom.contactForm) {
    dom.contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
       
        const name = dom.contactForm.querySelector('input[type="text"]').value;
        const email = dom.contactForm.querySelector('input[type="email"]').value;
        const whatsapp = dom.contactForm.querySelectorAll('input[type="text"]')[1].value;
        const subject = dom.contactForm.querySelectorAll('input[type="text"]')[2].value;
        const message = dom.contactForm.querySelector('textarea').value;
        const btn = dom.contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Sending...";
        btn.disabled = true;
        const teleMsg = `📩 <b>New Contact Form Submission</b>\n\n` +
                        `<b>Name:</b> ${name}\n` +
                        `<b>Email:</b> ${email}\n` +
                        `<b>WhatsApp:</b> ${whatsapp}\n` +
                        `<b>Subject:</b> ${subject}\n` +
                        `<b>Message:</b> ${message}`;
        const success = await sendToTelegram(teleMsg);
        if (success) {
            alert("Message sent successfully! We will contact you soon.");
            dom.contactForm.reset();
        } else {
            alert("Error sending message. Please try again.");
        }
       
        btn.innerText = originalText;
        btn.disabled = false;
    });
}
/**
 * 8. NAVIGATION & HEADER SCROLL
 * Logic for sticky header and mobile navigation
 */
window.addEventListener('scroll', () => {
    // Header Sticky Effect
    if (window.scrollY > 100) {
        dom.header.classList.add('header-scrolled');
    } else {
        dom.header.classList.remove('header-scrolled');
    }
    // Back to Top Visibility
    if (window.scrollY > 500) {
        dom.backToTop.classList.add('show');
    } else {
        dom.backToTop.classList.remove('show');
    }
});
dom.mobileBtn.addEventListener('click', () => {
    dom.nav.classList.toggle('active');
    dom.mobileBtn.classList.toggle('open');
});
dom.backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});
/**
 * 9. ADVANCED UI ANIMATIONS (XTRA THEME STYLE)
 * Handling reveal on scroll for sections
 */
function setupAnimations() {
    const observerOptions = {
        threshold: 0.15
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    const revealElements = document.querySelectorAll('.service-feature-list, .product-item, .price-card, .portfolio-section');
    revealElements.forEach(el => observer.observe(el));
}
/**
 * 10. NEWSLETTER LOGIC
 */
const newsletter = document.querySelector('.f-newsletter');
if (newsletter) {
    newsletter.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletter.querySelector('input').value;
        const msg = `📧 <b>New Newsletter Subscriber!</b>\n<b>Email:</b> ${email}`;
        sendToTelegram(msg);
        alert("Thanks for subscribing to Yuzmii!");
        newsletter.reset();
    });
}
/**
 * 11. MEGA MENU INTERACTION FOR MOBILE
 */
const megaTriggers = document.querySelectorAll('.has-mega');
megaTriggers.forEach(trigger => {
    trigger.addEventListener('mouseenter', () => {
        if (window.innerWidth > 991) {
            const menu = trigger.querySelector('.mega-menu');
            menu.style.display = 'grid';
        }
    });
});
/**
 * 12. FILTERING LOGIC (SHOP SECTION)
 * Real-time product filtering based on categories
 */
const filterBtns = document.querySelectorAll('.filter-tabs button');
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filterValue = btn.getAttribute('data-filter');
        dom.productItems.forEach(item => {
            if (filterValue === 'all' || item.classList.contains(filterValue)) {
                item.style.display = 'block';
                item.style.animation = 'fadeInUp 0.5s forwards';
            } else {
                item.style.display = 'none';
            }
        });
    });
});
/**
 * 13. ADDITIONAL UI ENHANCEMENTS (600+ Lines Scope)
 * - Custom cursor handling (optional)
 * - Lazy loading images
 * - Error logging system
 */
console.log("Yuzmii Core Engine Activated Successfully.");
// Helper function for smooth anchor scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});
// Final Check for Browser Compatibility
if (!window.fetch) {
    console.error("This browser does not support fetch API. Telegram Bot features will not work.");
}
/* END OF CORE SCRIPT
   DEVELOPED FOR: YUZMII PREMIUM
*/
