// فایل scripts.js

// متغیرهای سراسری
let currentTheme = 'light';
let currentLang = 'fa';

// تابع مقداردهی اولیه
function init() {
    loadTheme();
    loadPortfolioItems();
    setupEventListeners();
    setupGoogleTranslate();
}

// بارگذاری تم از localStorage
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        document.body.setAttribute('data-theme', currentTheme);
        updateThemeIcon();
    }
}

// بروزرسانی آیکون تم
function updateThemeIcon() {
    const themeToggle = document.getElementById('themeToggle');
    const icon = themeToggle.querySelector('i');
    
    if (currentTheme === 'dark') {
        icon.classList.remove('fa-moon');
        icon.classList.add('fa-sun');
    } else {
        icon.classList.remove('fa-sun');
        icon.classList.add('fa-moon');
    }
}

// بارگذاری نمونه کارها از فایل JSON
async function loadPortfolioItems() {
    try {
        const response = await fetch('works.json');
        const works = await response.json();
        
        // مرتب‌سازی بر اساس id نزولی
        works.sort((a, b) => b.id - a.id);
        
        displayPortfolioItems(works);
    } catch (error) {
        console.error('خطا در بارگذاری نمونه کارها:', error);
        document.getElementById('portfolioGrid').innerHTML = 
            '<p class="error-message">خطا در بارگذاری نمونه کارها</p>';
    }
}

// نمایش نمونه کارها در صفحه
function displayPortfolioItems(works) {
    const portfolioGrid = document.getElementById('portfolioGrid');
    
    if (works.length === 0) {
        portfolioGrid.innerHTML = '<p>هیچ نمونه کاری موجود نیست</p>';
        return;
    }
    
    portfolioGrid.innerHTML = works.map(work => `
        <div class="portfolio-card" data-id="${work.id}">
            <img src="${work.image}" alt="${work.title}" class="portfolio-image" loading="lazy">
            <div class="portfolio-overlay">
                <h3 class="portfolio-title">${work.title}</h3>
                <button class="btn btn-outline view-work-btn" data-id="${work.id}">نمایش</button>
            </div>
            <div class="portfolio-info">
                <h3>${work.title}</h3>
            </div>
        </div>
    `).join('');
    
    // اضافه کردن event listener برای دکمه‌های نمایش
    document.querySelectorAll('.view-work-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const workId = e.target.getAttribute('data-id');
            const work = works.find(w => w.id == workId);
            if (work) {
                openLightbox(work);
            }
        });
    });
}

// باز کردن لایت باکس
function openLightbox(work) {
    const lightbox = document.getElementById('lightbox');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxTitle = document.getElementById('lightboxTitle');
    
    lightboxImage.src = work.image;
    lightboxImage.alt = work.title;
    lightboxTitle.textContent = work.title;
    
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// بستن لایت باکس
function closeLightbox() {
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// تنظیم event listenerها
function setupEventListeners() {
    // تغییر تم
    document.getElementById('themeToggle').addEventListener('click', toggleTheme);
    
    // تغییر زبان
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const lang = e.target.getAttribute('data-lang');
            changeLanguage(lang);
        });
    });
    
    // بستن لایت باکس
    document.getElementById('lightboxClose').addEventListener('click', closeLightbox);
    document.getElementById('lightbox').addEventListener('click', (e) => {
        if (e.target === e.currentTarget) {
            closeLightbox();
        }
    });
    
    // بستن لایت باکس با کلید ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
    
    // ارسال فرم
    document.getElementById('orderForm').addEventListener('submit', handleFormSubmit);
    
    // اعتبارسنجی فیلدها
    document.getElementById('phone').addEventListener('blur', validatePhone);
}

// تغییر تم
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.body.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    updateThemeIcon();
}

// تغییر زبان
function changeLanguage(lang) {
    currentLang = lang;
    
    // به‌روزرسانی دکمه‌های زبان
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        }
    });
    
    // تغییر جهت متن
    if (lang === 'en') {
        document.body.setAttribute('dir', 'ltr');
    } else {
        document.body.setAttribute('dir', 'rtl');
    }
    
    // فعال‌سازی ترجمه گوگل
    if (window.google && window.google.translate) {
        const translateElement = google.translate.TranslateElement();
        if (translateElement) {
            translateElement.showBanner(false);
        }
    }
}

// راه‌اندازی ترجمه گوگل
function setupGoogleTranslate() {
    // این تابع توسط اسکریپت گوگل فراخوانی می‌شود
    window.googleTranslateElementInit = function() {
        new google.translate.TranslateElement({
            pageLanguage: 'fa',
            includedLanguages: 'en,ar,fa',
            layout: google.translate.TranslateElement.InlineLayout.SIMPLE
        }, 'google_translate_element');
    };
}

// اعتبارسنجی شماره تلفن
function validatePhone() {
    const phoneInput = document.getElementById('phone');
    const phoneError = document.getElementById('phoneError');
    const phoneValue = phoneInput.value.trim();
    
    // الگوی ساده برای شماره تلفن (می‌توانید پیچیده‌تر کنید)
    const phonePattern = /^[\d\s\-+()]{10,}$/;
    
    if (!phonePattern.test(phoneValue)) {
        phoneError.textContent = 'لطفاً شماره تلفن معتبر وارد کنید';
        return false;
    } else {
        phoneError.textContent = '';
        return true;
    }
}

// مدیریت ارسال فرم
async function handleFormSubmit(e) {
    e.preventDefault();
    
    // اعتبارسنجی فرم
    if (!validateForm()) {
        return;
    }
    
    const form = e.target;
    const formData = new FormData(form);
    
    // آماده‌سازی داده‌ها برای ارسال
    const submissionData = {
        'entry.1779351425': formData.get('name'),     // نام و نام خانوادگی
        'entry.612053626': formData.get('phone'),     // شماره تلفن
        'entry.420437738': formData.get('orderTitle'), // عنوان سفارش
        'entry.946057571': formData.get('description') // توضیحات سفارش
    };
    
    // ارسال فرم
    try {
        await submitToGoogleForms(submissionData);
        showFormMessage('اطلاعات شما ثبت شد و به زودی با شما تماس گرفته می‌شود.', 'success');
        form.reset();
    } catch (error) {
        console.error('خطا در ارسال فرم:', error);
        showFormMessage('خطا در ارسال اطلاعات. لطفاً دوباره تلاش کنید یا از فرم گوگل استفاده کنید.', 'error');
        
        // ارائه لینک جایگزین
        setTimeout(() => {
            const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScOy0P6NRXcB6q8Ud-FlJVmTqcwbDidilgq282BEVxA4WAyXQ/viewform?usp=pp_url&entry.1779351425=%D9%86%D8%A7%D9%85+%D9%88+%D9%86%D8%A7%D9%85+%D8%AE%D8%A7%D9%86%D9%88%D8%A7%D8%AF%DA%AF%DB%8C&entry.612053626=%D8%B4%D9%85%D8%A7%D8%B1%D9%87+%D8%AA%D9%84%D9%81%D9%86&entry.420437738=%D8%B9%D9%86%D9%88%D8%A7%D9%86+%D8%B3%D9%81%D8%A7%D8%B1%D8%B4&entry.946057571=%D8%AA%D9%88%D8%B6%DB%8C%D8%AD%D8%A7%D8%AA+%D8%B3%D9%81%D8%A7%D8%B1%D8%B4';
            const backupLink = document.createElement('p');
            backupLink.innerHTML = `اگر مشکل ادامه دارد، <a href="${formUrl}" target="_blank">از این لینک</a> برای ارسال فرم استفاده کنید.`;
            document.getElementById('formMessage').appendChild(backupLink);
        }, 2000);
    }
}

// اعتبارسنجی فرم
function validateForm() {
    let isValid = true;
    
    // اعتبارسنجی نام
    const nameInput = document.getElementById('name');
    const nameError = document.getElementById('nameError');
    if (!nameInput.value.trim()) {
        nameError.textContent = 'لطفاً نام و نام خانوادگی را وارد کنید';
        isValid = false;
    } else {
        nameError.textContent = '';
    }
    
    // اعتبارسنجی شماره تلفن
    if (!validatePhone()) {
        isValid = false;
    }
    
    // اعتبارسنجی توضیحات
    const descriptionInput = document.getElementById('description');
    const descriptionError = document.getElementById('descriptionError');
    if (!descriptionInput.value.trim()) {
        descriptionError.textContent = 'لطفاً توضیحات سفارش را وارد کنید';
        isValid = false;
    } else {
        descriptionError.textContent = '';
    }
    
    return isValid;
}

// ارسال به Google Forms
async function submitToGoogleForms(data) {
    const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLScOy0P6NRXcB6q8Ud-FlJVmTqcwbDidilgq282BEVxA4WAyXQ/formResponse';
    
    // ایجاد پارامترهای URL
    const params = new URLSearchParams();
    for (const key in data) {
        if (data[key]) {
            params.append(key, data[key]);
        }
    }
    
    // ارسال با fetch
    try {
        const response = await fetch(formUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: params
        });
        
        // با no-cors، ما نمی‌توانیم وضعیت پاسخ را بررسی کنیم
        // بنابراین فرض می‌کنیم که ارسال موفق بوده
        return true;
    } catch (error) {
        // اگر fetch با خطا مواجه شد، از روش فرم پنهان استفاده می‌کنیم
        return submitWithHiddenForm(data);
    }
}

// ارسال با فرم پنهان (روش جایگزین)
function submitWithHiddenForm(data) {
    return new Promise((resolve, reject) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://docs.google.com/forms/d/e/1FAIpQLScOy0P6NRXcB6q8Ud-FlJVmTqcwbDidilgq282BEVxA4WAyXQ/formResponse';
        form.style.display = 'none';
        
        for (const key in data) {
            if (data[key]) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            }
        }
        
        document.body.appendChild(form);
        
        // ارسال فرم
        form.submit();
        
        // پس از ارسال، فرم را حذف می‌کنیم
        setTimeout(() => {
            document.body.removeChild(form);
            resolve(true);
        }, 1000);
    });
}

// نمایش پیام فرم
function showFormMessage(message, type) {
    const messageElement = document.getElementById('formMessage');
    messageElement.textContent = message;
    messageElement.className = `form-message ${type}`;
    
    // پنهان کردن پیام پس از 5 ثانیه
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// مقداردهی اولیه زمانی که DOM بارگذاری شد
document.addEventListener('DOMContentLoaded', init);