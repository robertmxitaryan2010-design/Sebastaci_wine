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
function openProduct(name, price) {
    document.getElementById('detail-title').innerText = name;
    document.getElementById('detail-price').innerText = `$${price}`;
    
    const detailImg = document.getElementById('detail-img');
    
    if (name.includes('Red')) {
        detailImg.src = './images/Red wine.jpg';
    } else if (name.includes('White')) {
        detailImg.src = './images/White wine.png';
    } else if (name.includes('Rosé') || name.includes('Rose')) {
        detailImg.src = './images/Rose Wine.png';
    }

    // СТРОГО ВОТ ТАК (без WithHistory):
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


function navigateTo(sectionId) {
    // 1. Твой существующий код скрытия всех секций
    document.querySelectorAll('.site-section').forEach(s => s.classList.remove('active'));
    
    // 2. Показываем нужную
    document.getElementById('section-' + sectionId).classList.add('active');

    // 3. ПРИНУДИТЕЛЬНОЕ ОБНОВЛЕНИЕ КАРТЫ
    if (sectionId === 'contact') {
        const mapFrame = document.querySelector('.contact-map-container iframe');
        mapFrame.src = mapFrame.src; 
    }
}