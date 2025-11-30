const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const feedbackForm = document.getElementById('feedbackForm');
const messageContainer = document.getElementById('messageContainer');
const submitBtn = document.getElementById('submitBtn');

const FORMCARRY_FORM_ID = 't170gla_y2-';

openModalBtn.addEventListener('click', function() {
    modalOverlay.classList.add('active');
    history.pushState({ modalOpen: true }, '', '#feedback');
    restoreFormData();
});

function closeModal() {
    modalOverlay.classList.remove('active');
    history.pushState(null, '', window.location.pathname);
}

closeModalBtn.addEventListener('click', closeModal);

window.addEventListener('popstate', function(event) {
    if (modalOverlay.classList.contains('active')) {
        closeModal();
    }
});

function saveFormData() {
    const formData = {
        fullName: document.getElementById('fullName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        organization: document.getElementById('organization').value,
        message: document.getElementById('message').value,
        privacyPolicy: document.getElementById('privacyPolicy').checked
    };
    localStorage.setItem('feedbackFormData', JSON.stringify(formData));
}

function restoreFormData() {
    const savedData = localStorage.getItem('feedbackFormData');
    if (savedData) {
        const formData = JSON.parse(savedData);
        document.getElementById('fullName').value = formData.fullName || '';
        document.getElementById('email').value = formData.email || '';
        document.getElementById('phone').value = formData.phone || '';
        document.getElementById('organization').value = formData.organization || '';
        document.getElementById('message').value = formData.message || '';
        document.getElementById('privacyPolicy').checked = formData.privacyPolicy || false;
    }
}

function validateForm() {
    const fullName = document.getElementById('fullName').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    const privacyPolicy = document.getElementById('privacyPolicy').checked;
    
    if (!fullName) {
        showMessage('Пожалуйста, введите ФИО', 'error');
        return false;
    }
    
    if (!email || !isValidEmail(email)) {
        showMessage('Пожалуйста, введите корректный email', 'error');
        return false;
    }
    
    if (!message) {
        showMessage('Пожалуйста, введите сообщение', 'error');
        return false;
    }
    
    if (!privacyPolicy) {
        showMessage('Необходимо согласие с политикой обработки данных', 'error');
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

feedbackForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        return;
    }
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    const formData = new FormData(feedbackForm);
    const data = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        organization: formData.get('organization'),
        message: formData.get('message'),
        privacyPolicy: formData.get('privacyPolicy') ? 'Да' : 'Нет'
    };
    
    try {
        const response = await fetch(`https://formcarry.com/s/${FORMCARRY_FORM_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (response.ok && result.code === 200) {
            showMessage('Ваше сообщение успешно отправлено!', 'success');
            feedbackForm.reset();
            localStorage.removeItem('feedbackFormData');
        } else {
            throw new Error(result.message || 'Ошибка отправки формы');
        }
    } catch (error) {
        showMessage('Произошла ошибка при отправке формы: ' + error.message, 'error');
        console.error('Ошибка:', error);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить';
    }
});

function showMessage(text, type) {
    messageContainer.textContent = text;
    messageContainer.className = 'message ' + type;
    messageContainer.style.display = 'block';
    
    setTimeout(function() {
        messageContainer.style.display = 'none';
    }, 5000);
}

feedbackForm.addEventListener('input', saveFormData);
feedbackForm.addEventListener('change', saveFormData);

window.addEventListener('load', function() {
    if (window.location.hash === '#feedback') {
        openModalBtn.click();
    }
});
