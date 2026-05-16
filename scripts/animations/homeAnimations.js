// ============================================================
// HOME PAGE ANIMATIONS
// Handles counter animations, ticker, 3D effects, and more
// ============================================================

// make init function global for spa reinitialization
window.initHomeAnimations = initHomeAnimations;

// ============================================================
// Recent Breaches Data
// ============================================================
const recentBreachesList = [
    { company: "TechCorp", year: "2024", records: "2.5M", type: "Emails, Passwords" },
    { company: "HealthNet", year: "2024", records: "850K", type: "Medical Records" },
    { company: "GlobalBank", year: "2024", records: "1.2M", type: "Account Details" },
    { company: "SocialHub", year: "2024", records: "4M", type: "User Profiles" }
];

// ============================================================
// Populate Recent Breaches Grid
// ============================================================
function populateRecentBreaches() {
    const grid = document.getElementById('recentBreachesGrid');
    if (!grid) return;
    
    grid.innerHTML = recentBreachesList.map(breach => `
        <div class="recent-card">
            <h4>${escapeHtml(breach.company)}</h4>
            <div class="recent-year">${breach.year}</div>
            <div class="recent-records">${breach.records} records</div>
            <div class="recent-type">${breach.type}</div>
            <a href="database.html" class="recent-link">View Details →</a>
        </div>
    `).join('');
}

function escapeHtml(str) {
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

// ============================================================
// Animated Number Counters
// ============================================================
function animateNumbers() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    statNumbers.forEach(stat => observer.observe(stat));
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const update = () => {
        current += increment;
        if (current >= target) {
            element.textContent = target.toLocaleString() + '+';
            return;
        }
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
}

// ============================================================
// Alert Ticker Animation
// ============================================================
function setupAlertTicker() {
    const alerts = document.querySelectorAll('.alert-item');
    if (alerts.length <= 1) return;
    
    let index = 0;
    alerts.forEach((alert, i) => {
        if (i !== 0) alert.style.display = 'none';
    });
    
    setInterval(() => {
        alerts[index].style.opacity = '0';
        setTimeout(() => {
            alerts[index].style.display = 'none';
            index = (index + 1) % alerts.length;
            alerts[index].style.display = 'flex';
            setTimeout(() => alerts[index].style.opacity = '1', 50);
        }, 300);
    }, 5000);
}

// ============================================================
// Parallax Effect on Hero Image
// ============================================================
function setupParallax() {
    const heroImage = document.querySelector('.hero-image');
    if (!heroImage) return;
    
    window.addEventListener('scroll', () => {
        heroImage.style.transform = `translateY(${window.pageYOffset * 0.3}px)`;
    });
}

// ============================================================
// Scroll Reveal Animations
// ============================================================
function setupScrollReveal() {
    const sections = document.querySelectorAll('.intro, .stats-section, .updates-section, .recent-breaches, .testimonials');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('section-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    
    sections.forEach(section => {
        section.classList.add('section-hidden');
        observer.observe(section);
    });
}

// ============================================================
// 3D Tilt Effect for Cards
// ============================================================
function setup3DCardEffects() {
    const cards = document.querySelectorAll('.stat-card, .testimonial-card, .recent-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;
            card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
        });
    });
}

// ============================================================
// Initialize All Home Page Animations
// ============================================================
function initHomeAnimations() {
    console.log('home animations initializing...');
    populateRecentBreaches();
    animateNumbers();
    setupAlertTicker();
    setupParallax();
    setupScrollReveal();
    setup3DCardEffects();
    console.log('home animations initialized');
}

// ============================================================
// Auto-initialize on page load
// ============================================================
if (!window.isSPA && document.readyState !== 'loading') {
    initHomeAnimations();
} else if (!window.isSPA) {
    document.addEventListener('DOMContentLoaded', initHomeAnimations);
}