/**
 * =====================================================================
 * YUZMII - ULTIMATE CORE ENGINE (PRO VERSION)
 * Features: Multi-Layer Telegram Bot, Advanced E-com Logic, 
 * Real-time Validation, Theme Persistence, Scroll Interactions.
 * =====================================================================
 */

"use strict";

// 1. GLOBAL CONFIGURATION
const YUZMII_CONFIG = {
    BOT_TOKEN: '8294116898:AAGd7RPeesOvJaIytO67YW4ow3QsiV_vY0s',
    CHAT_ID: '7752627907',
    THEME_STORAGE: 'yuzmii_theme_pref',
    API_URL: 'https://api.telegram.org/bot'
};

// 2. DOM ELEMENTS CACHING
const UI = {
    html: document.documentElement,
    body: document.body,
    header: document.querySelector('.main-header'),
    loader: document.getElementById('loader-wrapper'),
    themeBtn: document.getElementById('themeSwitcher'),
    mobileBtn: document.getElementById('mobileMenuBtn'),
    nav: document.querySelector('.main-nav'),
    sourcingForm: document.getElementById('telegramOrderForm'),
    backToTop: document.getElementById('backToTop'),
    products: document.querySelectorAll('.product-item'),
    filterBtns: document.querySelectorAll('.filter-tabs button')
};

// 3. PAGE INITIALIZER
document.addEventListener('DOMContentLoaded', () => {
    console.log("Initializing Yuzmii Core...");
    
    // Start Services
    handlePreloader();
    initThemeSystem();
    initScrollLogic();
    initSourcingForm();
    initProductFilters();
    initSmoothScroll();
    
    // Optional Premium Feature: Console Branding
    console.log("%c YUZMII %c Sourcing Agency Sri Lanka ", "color: #fff; background: #000; padding:5px; border-radius: 5px 0 0 5px;", "color: #000; background: #d4af37; padding:5px; border-radius: 0 5px 5px 0;");
});

// 4. PRELOADER & ANIMATIONS
function handlePreloader() {
    if (UI.loader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                UI.loader.style.opacity = '0';
                UI.loader.style.visibility = 'hidden';
            }, 1200);
        });
    }
}

// 5. ADVANCED TELEGRAM ENGINE (With Error Handling)
async function notifyAdmin(message) {
    const endpoint = `${YUZMII_CONFIG.API_URL}${YUZMII_CONFIG.BOT_TOKEN}/sendMessage`;
    
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: YUZMII_CONFIG.CHAT_ID,
                text: message,
                parse_mode: 'HTML'
            })
        });
        
        const result = await response.json();
        if (!result.ok) throw new Error(result.description);
        return true;
    } catch (err) {
        console.error("Critical: Notification Failed", err);
        return false;
    }
}

// 6. THEME SWITCHER (Light/Dark Persistent)
function initThemeSystem() {
    const currentTheme = localStorage.getItem(YUZMII_CONFIG.THEME_STORAGE) || 'dark';
    UI.html.setAttribute('data-theme', currentTheme);
    updateThemeIcons(currentTheme);

    UI.themeBtn.addEventListener('click', () => {
        const newTheme = UI.html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        UI.html.setAttribute('data-theme', newTheme);
        localStorage.setItem(YUZMII_CONFIG.THEME_STORAGE, newTheme);
        updateThemeIcons(newTheme);
    });
}

function updateThemeIcons(theme) {
    const moon = document.getElementById('moonIcon');
    const sun = document.getElementById('sunIcon');
    if (theme === 'light') {
        if(moon) moon.style.display = 'none';
        if(sun) sun.style.display = 'block';
    } else {
        if(moon) moon.style.display = 'block';
        if(sun) sun.style.display = 'none';
    }
}

// 7. SOURCING FORM LOGIC (Daraz/Temu Link Submission)
function initSourcingForm() {
    if (UI.sourcingForm) {
        UI.sourcingForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = UI.sourcingForm.querySelector('button');
            const name = document.getElementById('name').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const link = document.getElementById('link').value.trim();

            if (!name || !phone || !link) {
                alert("Please fill all fields!");
                return;
            }

            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitBtn.disabled = true;

            const message = `🔥 <b>NEW SOURCING REQUEST</b>\n\n` +
                            `👤 <b>Name:</b> ${name}\n` +
                            `📞 <b>WhatsApp:</b> ${phone}\n` +
                            `🔗 <b>Link:</b> ${link}\n\n` +
                            `🕒 <i>Time: ${new Date().toLocaleString()}</i>`;

            const status = await notifyAdmin(message);

            if (status) {
                alert("Success! Our sourcing expert will contact you on WhatsApp within 30 minutes.");
                UI.sourcingForm.reset();
            } else {
                alert("Server error. Please contact us via WhatsApp directly.");
            }
            
            submitBtn.innerHTML = 'Request Sourcing Quote';
            submitBtn.disabled = false;
        });
    }
}

// 8. PRODUCT FILTERING SYSTEM
function initProductFilters() {
    UI.filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            UI.filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const filter = btn.getAttribute('data-filter');
            
            UI.products.forEach(item => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.9)';
                
                setTimeout(() => {
                    if (filter === 'all' || item.classList.contains(filter)) {
                        item.style.display = 'block';
                        setTimeout(() => {
                            item.style.opacity = '1';
                            item.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        item.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
}

// 9. SCROLL & UI INTERACTIVITY
function initScrollLogic() {
    window.addEventListener('scroll', () => {
        // Sticky Header
        if (window.scrollY > 100) {
            UI.header.classList.add('header-scrolled');
        } else {
            UI.header.classList.remove('header-scrolled');
        }

        // Back to Top Button
        if (window.scrollY > 600) {
            UI.backToTop?.classList.add('show');
        } else {
            UI.backToTop?.classList.remove('show');
        }
    });
}

// 10. HELPER: SMOOTH SCROLLING
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                // Close mobile menu if open
                UI.nav.classList.remove('active');
                UI.mobileBtn.classList.remove('open');
            }
        });
    });
}

// Mobile Toggle Support
UI.mobileBtn?.addEventListener('click', () => {
    UI.nav.classList.toggle('active');
    UI.mobileBtn.classList.toggle('open');
});
