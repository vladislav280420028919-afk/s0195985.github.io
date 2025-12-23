(function() {
  'use strict';
  
  // === КОНФИГУРАЦИЯ FORMCARRY ===
  const FORMCARRY_CONFIG = {
    formId: 't170gla_y2-', // ЗАМЕНИТЕ НА ВАШ FORM ID
    successUrl: '', // Опционально: URL для редиректа после успеха
    successMessage: 'Заявка успешно отправлена! Мы свяжемся с вами в ближайшее время.',
    errorMessage: 'Ошибка при отправке. Пожалуйста, попробуйте позже.',
    networkErrorMessage: 'Ошибка сети. Пожалуйста, проверьте подключение к интернету.'
  };
  
  // === ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ ===
  let currentReviewIndex = 0;
  let reviewInterval;
  
  // === ОСНОВНАЯ ИНИЦИАЛИЗАЦИЯ ===
  function init() {
    initScrollEffects();
    initMobileMenu();
    initDesktopDropdowns();
    initReviewsSlider();
    initFAQ();
    initFormcarryForm();
    initSmoothScrolling();
    initLazyLoading();
  }
  
  // === ЭФФЕКТЫ ПРИ СКРОЛЛЕ ===
  function initScrollEffects() {
    const header = document.querySelector('.top-bar');
    
    function handleScroll() {
      if (window.scrollY > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      // Анимация элементов при скролле
      const animatedElements = document.querySelectorAll('.service-item, .support-card, .pricing-card');
      animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
          element.classList.add('animated');
        }
      });
    }
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Инициализация при загрузке
  }
  
  // === ПЛАВНАЯ ПРОКРУТКА ===
  function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          const headerHeight = document.querySelector('.top-bar').offsetHeight;
          const targetPosition = targetElement.offsetTop - headerHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          // Закрыть мобильное меню если открыто
          const mobileMenu = document.querySelector('.mobile-nav-menu');
          const menuToggle = document.querySelector('.mobile-menu-toggle');
          if (mobileMenu && mobileMenu.classList.contains('active')) {
            mobileMenu.classList.remove('active');
            menuToggle.classList.remove('active');
          }
        }
      });
    });
  }
  
  // === ЛЕНИВАЯ ЗАГРУЗКА ИЗОБРАЖЕНИЙ ===
  function initLazyLoading() {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
            if (img.dataset.srcset) {
              img.srcset = img.dataset.srcset;
            }
            img.classList.add('loaded');
            imageObserver.unobserve(img);
          }
        });
      }, {
        rootMargin: '50px 0px',
        threshold: 0.1
      });
      
      document.querySelectorAll('img[loading="lazy"]').forEach(img => {
        imageObserver.observe(img);
      });
    }
  }
  
  // === ДЕСКТОПНОЕ МЕНЮ ===
  function initDesktopDropdowns() {
    if (window.innerWidth > 992) {
      const desktopDropdownItems = document.querySelectorAll('.nav-menu > li');
      
      desktopDropdownItems.forEach(item => {
        const dropdown = item.querySelector('.dropdown-menu');
        if (dropdown) {
          item.addEventListener('mouseenter', function() {
            this.classList.add('active-dropdown');
          });
          
          item.addEventListener('mouseleave', function() {
            this.classList.remove('active-dropdown');
          });
        }
      });
      
      // Закрытие при клике вне меню
      document.addEventListener('click', function(e) {
        if (!e.target.closest('.nav-menu')) {
          desktopDropdownItems.forEach(item => {
            item.classList.remove('active-dropdown');
          });
        }
      });
    }
  }
  
  // === МОБИЛЬНОЕ МЕНЮ ===
  function initMobileMenu() {
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileNavMenu = document.querySelector('.mobile-nav-menu');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    if (!mobileMenuToggle || !mobileNavMenu) return;
    
    // Открытие/закрытие основного меню
    mobileMenuToggle.addEventListener('click', function() {
      const isOpening = !mobileNavMenu.classList.contains('active');
      mobileNavMenu.classList.toggle('active');
      this.classList.toggle('active');
      
      // Обновляем aria-атрибуты
      if (isOpening) {
        mobileNavMenu.setAttribute('aria-hidden', 'false');
        this.setAttribute('aria-label', 'Закрыть меню');
        document.body.style.overflow = 'hidden';
      } else {
        mobileNavMenu.setAttribute('aria-hidden', 'true');
        this.setAttribute('aria-label', 'Открыть меню');
        document.body.style.overflow = '';
      }
    });
    
    // Раскрытие подменю
    dropdownToggles.forEach(toggle => {
      toggle.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        const submenu = this.nextElementSibling;
        const isActive = submenu.classList.contains('active');
        
        // Закрываем другие подменю
        if (window.innerWidth <= 992) {
          dropdownToggles.forEach(otherToggle => {
            if (otherToggle !== this) {
              otherToggle.classList.remove('active');
              otherToggle.setAttribute('aria-expanded', 'false');
              otherToggle.nextElementSibling.classList.remove('active');
            }
          });
        }
        
        // Переключаем текущее подменю
        submenu.classList.toggle('active');
        this.classList.toggle('active');
        this.setAttribute('aria-expanded', !isActive);
      });
    });
    
    // Закрытие меню при клике на ссылку
    const navLinks = document.querySelectorAll('.mobile-nav-menu a:not(.dropdown-toggle)');
    navLinks.forEach(link => {
      link.addEventListener('click', function() {
        if (window.innerWidth <= 992) {
          mobileNavMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          mobileNavMenu.setAttribute('aria-hidden', 'true');
          mobileMenuToggle.setAttribute('aria-label', 'Открыть меню');
          document.body.style.overflow = '';
          
          // Закрываем все подменю
          dropdownToggles.forEach(toggle => {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.nextElementSibling.classList.remove('active');
          });
        }
      });
    });
    
    // Закрытие меню при клике вне его
    document.addEventListener('click', function(e) {
      if (window.innerWidth <= 992 && 
          mobileNavMenu.classList.contains('active') &&
          !e.target.closest('.mobile-nav-menu') && 
          !e.target.closest('.mobile-menu-toggle')) {
        mobileNavMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        mobileNavMenu.setAttribute('aria-hidden', 'true');
        mobileMenuToggle.setAttribute('aria-label', 'Открыть меню');
        document.body.style.overflow = '';
      }
    });
    
    // Обработка ресайза окна
    let isMobileMenu = window.innerWidth <= 992;
    
    function handleResize() {
      const newIsMobile = window.innerWidth <= 992;
      
      if (newIsMobile !== isMobileMenu) {
        isMobileMenu = newIsMobile;
        
        if (!newIsMobile) {
          // При переходе на десктоп - закрыть мобильное меню
          mobileNavMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          mobileNavMenu.setAttribute('aria-hidden', 'true');
          mobileMenuToggle.setAttribute('aria-label', 'Открыть меню');
          document.body.style.overflow = '';
          
          // Закрыть все подменю
          dropdownToggles.forEach(toggle => {
            toggle.classList.remove('active');
            toggle.setAttribute('aria-expanded', 'false');
            toggle.nextElementSibling.classList.remove('active');
          });
        }
      }
    }
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
  }
  
  // === СЛАЙДЕР ОТЗЫВОВ ===
  function initReviewsSlider() {
    const reviewItems = document.querySelectorAll('.review-item');
    const prevBtn = document.querySelector('.review-prev');
    const nextBtn = document.querySelector('.review-next');
    const counter = document.querySelector('.review-counter');
    
    if (!reviewItems.length || !prevBtn || !nextBtn || !counter) return;
    
    function showReview(index) {
      reviewItems.forEach((item, i) => {
        item.classList.remove('active');
        if (i === index) {
          setTimeout(() => item.classList.add('active'), 50);
        }
      });
      currentReviewIndex = index;
      counter.textContent = `${String(index + 1).padStart(2, '0')} / ${String(reviewItems.length).padStart(2, '0')}`;
    }
    
    function startAutoSlide() {
      if (reviewItems.length <= 1) return;
      
      reviewInterval = setInterval(() => {
        const nextIndex = (currentReviewIndex + 1) % reviewItems.length;
        showReview(nextIndex);
      }, 8000); // 8 секунд
    }
    
    function stopAutoSlide() {
      if (reviewInterval) {
        clearInterval(reviewInterval);
      }
    }
    
    // Навигация
    prevBtn.addEventListener('click', () => {
      stopAutoSlide();
      const prevIndex = (currentReviewIndex - 1 + reviewItems.length) % reviewItems.length;
      showReview(prevIndex);
      startAutoSlide();
    });
    
    nextBtn.addEventListener('click', () => {
      stopAutoSlide();
      const nextIndex = (currentReviewIndex + 1) % reviewItems.length;
      showReview(nextIndex);
      startAutoSlide();
    });
    
    // Клавиатурная навигация
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        prevBtn.click();
      } else if (e.key === 'ArrowRight') {
        nextBtn.click();
      }
    });
    
    // Остановка автопрокрутки при наведении
    const reviewSlider = document.querySelector('.review-slider');
    if (reviewSlider) {
      reviewSlider.addEventListener('mouseenter', stopAutoSlide);
      reviewSlider.addEventListener('mouseleave', startAutoSlide);
    }
    
    // Запуск автопрокрутки
    showReview(0);
    startAutoSlide();
  }
  
  // === FAQ ===
  function initFAQ() {
    const faqQuestions = document.querySelectorAll('.faq-question');
    
    if (!faqQuestions.length) return;
    
    faqQuestions.forEach((question) => {
      question.addEventListener('click', () => {
        const item = question.closest('.faq-item');
        const isActive = item.classList.contains('active');
        
        // Закрываем все FAQ
        document.querySelectorAll('.faq-item').forEach(faq => {
          faq.classList.remove('active');
        });
        
        // Открываем текущий, если он был закрыт
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
    
    // Автооткрытие первого FAQ
    const firstFaq = document.querySelector('.faq-item');
    if (firstFaq) {
      firstFaq.classList.add('active');
    }
  }
  
  // === ФОРМА FORMCARRY ===
  function initFormcarryForm() {
    const contactForm = document.getElementById('contactForm');
    if (!contactForm) return;
    
    // Элементы формы
    const nameInput = document.getElementById('name');
    const phoneInput = document.getElementById('phone');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');
    const consentInput = document.getElementById('consent');
    const submitBtn = contactForm.querySelector('.form-submit');
    const btnText = submitBtn.querySelector('.btn-text');
    const spinner = submitBtn.querySelector('.spinner');
    const formMessages = document.getElementById('form-messages');
    const replyToEmail = document.getElementById('reply-to-email');
    
    // Валидация email
    function isValidEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    }
    
    // Валидация телефона
    function isValidPhone(phone) {
      const digits = phone.replace(/\D/g, '');
      return digits.length === 11;
    }
    
    // Показать ошибку поля
    function showFieldError(field, message) {
      const formGroup = field.closest('.form-group') || field.closest('.checkbox-label');
      if (formGroup) {
        formGroup.classList.add('error');
        formGroup.classList.remove('success');
        
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
          errorMsg.textContent = message;
        }
      }
    }
    
    // Очистить ошибку поля
    function clearFieldError(field) {
      const formGroup = field.closest('.form-group') || field.closest('.checkbox-label');
      if (formGroup) {
        formGroup.classList.remove('error');
        formGroup.classList.remove('success');
        
        const errorMsg = formGroup.querySelector('.error-message');
        if (errorMsg) {
          errorMsg.textContent = '';
        }
      }
    }
    
    // Показать успех поля
    function showFieldSuccess(field) {
      const formGroup = field.closest('.form-group') || field.closest('.checkbox-label');
      if (formGroup) {
        formGroup.classList.add('success');
        formGroup.classList.remove('error');
      }
    }
    
    // Показать сообщение формы
    function showFormMessage(type, message) {
      if (!formMessages) return;
      
      formMessages.className = type;
      formMessages.textContent = message;
      formMessages.style.display = 'block';
      
      // Автоскрытие через 5 секунд (только для успеха)
      if (type === 'success') {
        setTimeout(() => {
          formMessages.style.display = 'none';
        }, 5000);
      }
    }
    
    // Маска для телефона
    if (phoneInput) {
      phoneInput.addEventListener('input', function(e) {
        let value = this.value.replace(/\D/g, '');
        
        // Ограничение 11 цифр
        if (value.length > 11) {
          value = value.substring(0, 11);
        }
        
        // Форматирование
        if (value.length > 0) {
          let formatted = '';
          
          if (value.startsWith('7') || value.startsWith('8')) {
            formatted = '+7';
            if (value.length > 1) {
              formatted += ' (' + value.substring(1, 4);
            }
            if (value.length >= 5) {
              formatted += ') ' + value.substring(4, 7);
            }
            if (value.length >= 8) {
              formatted += '-' + value.substring(7, 9);
            }
            if (value.length >= 10) {
              formatted += '-' + value.substring(9, 11);
            }
          } else {
            // Если начинается не с 7 или 8
            formatted = value;
          }
          
          this.value = formatted;
        }
        
        clearFieldError(this);
      });
      
      // Валидация при потере фокуса
      phoneInput.addEventListener('blur', function() {
        if (this.value && !isValidPhone(this.value)) {
          showFieldError(this, 'Введите корректный номер телефона (11 цифр)');
        } else if (this.value) {
          showFieldSuccess(this);
        }
      });
    }
    
    // Валидация email
    if (emailInput) {
      emailInput.addEventListener('blur', function() {
        if (this.value && !isValidEmail(this.value)) {
          showFieldError(this, 'Введите корректный email адрес');
        } else if (this.value) {
          showFieldSuccess(this);
          // Обновить hidden поле для reply-to
          if (replyToEmail) {
            replyToEmail.value = this.value;
          }
        }
      });
    }
    
    // Валидация имени
    if (nameInput) {
      nameInput.addEventListener('blur', function() {
        if (this.value && this.value.trim().length < 2) {
          showFieldError(this, 'Имя должно содержать минимум 2 символа');
        } else if (this.value) {
          showFieldSuccess(this);
        }
      });
    }
    
    // Валидация сообщения
    if (messageInput) {
      messageInput.addEventListener('blur', function() {
        if (this.value && this.value.trim().length > 0) {
          showFieldSuccess(this);
        }
      });
    }
    
    // Валидация чекбокса
    if (consentInput) {
      consentInput.addEventListener('change', function() {
        if (!this.checked) {
          showFieldError(this, 'Необходимо дать согласие');
        } else {
          clearFieldError(this);
        }
      });
    }
    
    // Проверка всей формы
    function validateForm() {
      let isValid = true;
      
      // Проверка имени
      if (!nameInput.value.trim()) {
        showFieldError(nameInput, 'Введите ваше имя');
        isValid = false;
      } else if (nameInput.value.trim().length < 2) {
        showFieldError(nameInput, 'Имя должно содержать минимум 2 символа');
        isValid = false;
      }
      
      // Проверка телефона
      if (!phoneInput.value.trim()) {
        showFieldError(phoneInput, 'Введите номер телефона');
        isValid = false;
      } else if (!isValidPhone(phoneInput.value)) {
        showFieldError(phoneInput, 'Введите корректный номер телефона');
        isValid = false;
      }
      
      // Проверка email
      if (!emailInput.value.trim()) {
        showFieldError(emailInput, 'Введите email адрес');
        isValid = false;
      } else if (!isValidEmail(emailInput.value)) {
        showFieldError(emailInput, 'Введите корректный email адрес');
        isValid = false;
      }
      
      // Проверка чекбокса
      if (!consentInput.checked) {
        showFieldError(consentInput, 'Необходимо дать согласие');
        isValid = false;
      }
      
      return isValid;
    }
    
    // Обработка отправки формы
    contactForm.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      // Скрыть предыдущие сообщения
      if (formMessages) {
        formMessages.style.display = 'none';
      }
      
      // Валидация формы
      if (!validateForm()) {
        showFormMessage('error', 'Пожалуйста, исправьте ошибки в форме');
        return;
      }
      
      // Показать состояние загрузки
      submitBtn.disabled = true;
      btnText.textContent = 'Отправка...';
      if (spinner) spinner.style.display = 'inline-block';
      
      // Собрать данные формы
      const formData = new FormData(contactForm);
      
      // Добавить динамические данные
      formData.append('timestamp', new Date().toISOString());
      formData.append('user_agent', navigator.userAgent);
      formData.append('page_url', window.location.href);
      formData.append('referrer', document.referrer);
      
      try {
        // Отправка на Formcarry
        const response = await fetch(`https://formcarry.com/s/${FORMCARRY_CONFIG.formId}`, {
          method: 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });
        
        const result = await response.json();
        
        if (response.ok && result.status === 'success') {
          // Успешная отправка
          showFormMessage('success', FORMCARRY_CONFIG.successMessage);
          
          // Сброс формы
          contactForm.reset();
          
          // Трекинг в Google Analytics (если есть)
          if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
              'event_category': 'Contact',
              'event_label': 'Main Form'
            });
          }
          
          // ПЕРЕЗАГРУЗИТЬ СТРАНИЦУ ЧЕРЕЗ 2 СЕКУНДЫ
          setTimeout(() => {
            window.location.reload();
          }, 2000);
          
        } else {
          // Ошибка Formcarry
          const errorMsg = result.message || FORMCARRY_CONFIG.errorMessage;
          showFormMessage('error', errorMsg);
          console.error('Formcarry error:', result);
          
          // Восстановить кнопку при ошибке
          submitBtn.disabled = false;
          btnText.textContent = 'СВЯЖИТЕСЬ С НАМИ';
          if (spinner) spinner.style.display = 'none';
        }
        
      } catch (error) {
        // Ошибка сети
        showFormMessage('error', FORMCARRY_CONFIG.networkErrorMessage);
        console.error('Network error:', error);
        
        // Восстановить кнопку при ошибке
        submitBtn.disabled = false;
        btnText.textContent = 'СВЯЖИТЕСЬ С НАМИ';
        if (spinner) spinner.style.display = 'none';
      }
      
      // При успешной отправке кнопка не восстанавливается,
      // т.к. страница перезагрузится через 2 секунды
    });
    
    // Очистка ошибок при вводе
    const formInputs = contactForm.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
      input.addEventListener('input', function() {
        clearFieldError(this);
      });
    });
    
    // Очистка ошибок при фокусе
    formInputs.forEach(input => {
      input.addEventListener('focus', function() {
        clearFieldError(this);
      });
    });
  }
  
  // === ЗАПУСК ПРИ ЗАГРУЗКЕ ===
  document.addEventListener('DOMContentLoaded', init);
  
  // === ЭКСПОРТ ФУНКЦИЙ (для консоли) ===
  window.drupalCoderApp = {
    init: init,
    showReview: function(index) {
      const reviewItems = document.querySelectorAll('.review-item');
      if (reviewItems[index]) {
        reviewItems.forEach((item, i) => {
          item.classList.remove('active');
          if (i === index) item.classList.add('active');
        });
        currentReviewIndex = index;
      }
    },
    validateForm: function() {
      const contactForm = document.getElementById('contactForm');
      if (contactForm) {
        contactForm.dispatchEvent(new Event('submit', { cancelable: true }));
      }
    }
  };
})();
