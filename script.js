// Функция для переключения секций (вкладок) сайта
function navigateTo(sectionId) {
    // 1. ПЕРЕКЛЮЧЕНИЕ СЕКЦИЙ
    // Скрываем все секции
    document.querySelectorAll('.site-section').forEach(s => {
        s.classList.remove('active');
    });
    
    // Показываем нужную секцию
    const targetSection = document.getElementById('section-' + sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }

    // 2. ИСПРАВЛЕНИЕ АНИМАЦИИ КНОПОК МЕНЮ
    // Находим абсолютно все ссылки внутри шапки
    document.querySelectorAll('.main-nav .nav-link').forEach(link => {
        link.classList.remove('active'); // Сбрасываем оранжевую линию со всех кнопок
    });

    // Находим именно ту кнопку, на которую нажали (например: id="nav-shop" или id="nav-about")
    const activeNav = document.getElementById('nav-' + sectionId);
    if (activeNav) {
        activeNav.classList.add('active'); // Включаем оранжевую линию для нее
    }

    // 3.ОБНОВЛЕНИЕ КАРТЫ (чтобы она не ломалась при открытии)
    if (sectionId === 'contact') {
        const iframe = document.querySelector('.contact-map-container iframe');
        if (iframe) {
            iframe.src = iframe.src;
        }
    }

    closeMobileNav();
}

function toggleMobileNav() {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('nav-toggle');
    if (nav) nav.classList.toggle('open');
    if (toggle) toggle.classList.toggle('active');
}

function closeMobileNav() {
    const nav = document.getElementById('main-nav');
    const toggle = document.getElementById('nav-toggle');
    if (nav) nav.classList.remove('open');
    if (toggle) toggle.classList.remove('active');
}

// Храним историю для кнопки "Назад"
let navigationHistory = ['home'];

function navigateToWithHistory(sectionId) {
    const currentSection = navigationHistory[navigationHistory.length - 1];
    if (currentSection !== sectionId) {
        navigationHistory.push(sectionId);
    }
    navigateTo(sectionId);
}

function goBack() {
    if (navigationHistory.length > 1) {
        navigationHistory.pop(); 
        const previousSection = navigationHistory[navigationHistory.length - 1];
        navigateTo(previousSection);
    } else {
        navigateTo("shop");
    }
}

// Открытие карточки конкретного вина
let currentProductKey = null;

function openProduct(productKey, price, wineType) {
    currentProductKey = productKey;
    const detailTitle = document.getElementById('detail-title');
    if (detailTitle && translations[currentLanguage]?.[productKey]) {
        detailTitle.textContent = translations[currentLanguage][productKey];
    } else if (detailTitle) {
        detailTitle.textContent = productKey;
    }

    document.getElementById('detail-price').innerText = `$${price}`;
    
    const detailImg = document.getElementById('detail-img');
    
    if (wineType === 'red') {
        detailImg.src = './images/Red Dry wine.png';
    } else if (wineType === 'white') {
        detailImg.src = './images/White wine.png';
    } else if (wineType === 'rose') {
        detailImg.src = './images/Rose Wine.png';
    }

    navigateTo('product-detail');
}

// Переключение табов внутри описания вина (Details, Origin, Perfect with)
function switchDetailTab(event, tabId) {
    const tabPanes = document.querySelectorAll('.tab-pane');
    tabPanes.forEach(pane => pane.classList.remove('active'));

    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Управление всплывающим окном заказа (Popup)
function showOrderPopup() {
    document.getElementById('order-notification').classList.add('pop-active');
}

function closeOrderPopup() {
    document.getElementById('order-notification').classList.remove('pop-active');
}

// Функция для перехода на внешнюю ссылку блога школы
function openBlog() {
    window.open('https://mskh.am/posts/post/_id/68b97fdbba68ef9d84aa4a6f', '_blank');
}

// Ждём загрузки страницы и вешаем клики на фильтры категорий
document.addEventListener('DOMContentLoaded', () => {
    const categoryItems = document.querySelectorAll('.category-list .category-item');
    const winesGrid = document.getElementById('wines-grid');

    if (categoryItems.length > 0 && winesGrid) {
        categoryItems.forEach(item => {
            item.addEventListener('click', function() {
                // Убираем активный класс у старой категории и даём новой
                categoryItems.forEach(i => i.classList.remove('active'));
                this.classList.add('active');

                const selectedCategory = this.getAttribute('data-category');
                const productCards = winesGrid.querySelectorAll('.product-card');

                // Прячем или показываем карточки вин
                productCards.forEach(card => {
                    const wineType = card.getAttribute('data-wine-type');
                    if (selectedCategory === 'all' || wineType === selectedCategory) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }
});


// ЯЗЫКОВОЙ ПЕРЕКЛЮЧАТЕЛЬ
let currentLanguage = localStorage.getItem('language') || 'en';
const translations = {};

async function loadTranslations() {
    try {
        const response = await fetch('./translations.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        Object.assign(translations, data);
        applyLanguage(currentLanguage);
        updateCurrentFlag(currentLanguage);
    } catch (error) {
        console.error('Failed to load translations:', error);
    }
}

function updateCurrentFlag(lang) {
    const currentFlagImg = document.getElementById('current-flag');
    if (currentFlagImg) {
        currentFlagImg.src = `./images/flags/${lang}.svg`;
        currentFlagImg.alt = lang.toUpperCase();
    }
}

function toggleLanguageMenu() {
    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

function changeLanguage(lang) {
    if (!translations[lang]) return;

    currentLanguage = lang;
    localStorage.setItem('language', lang);
    applyLanguage(lang);
    updateCurrentFlag(lang);

    const dropdown = document.getElementById('lang-dropdown');
    if (dropdown) {
        dropdown.classList.remove('active');
    }
}

function applyLanguage(lang) {
    if (!translations[lang]) return;

    document.documentElement.lang = lang;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = translations[lang][key];
        if (!text) return;

        if (text.includes('<')) {
            element.innerHTML = text;
        } else {
            element.textContent = text;
        }
    });

    if (currentProductKey) {
        const detailTitle = document.getElementById('detail-title');
        const productName = translations[lang][currentProductKey];
        if (detailTitle && productName) {
            detailTitle.textContent = productName;
        }
    }
}

document.addEventListener('click', (e) => {
    const switcher = document.querySelector('.language-switcher');
    const dropdown = document.getElementById('lang-dropdown');

    if (switcher && !switcher.contains(e.target) && dropdown) {
        dropdown.classList.remove('active');
    }
});

document.addEventListener('DOMContentLoaded', loadTranslations);

window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        closeMobileNav();
    }
});