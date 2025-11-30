const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const modalOverlay = document.getElementById('modalOverlay');
const feedbackForm = document.getElementById('feedbackForm');
const messageContainer = document.getElementById('messageContainer');
const submitBtn = document.getElementById('submitBtn');

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

feedbackForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправка...';
    
    const formData = new FormData(feedbackForm);
    const data = {
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        organization: formData.get('organization'),
        message: formData.get('message'),
        privacyPolicy: formData.get('privacyPolicy')
    };
    
    try {
        const response = await fetch('https://api.slapform.com/your-form-id', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        if (response.ok) {
            showMessage('Ваше сообщение успешно отправлено!', 'success');
            feedbackForm.reset();
            localStorage.removeItem('feedbackFormData');
        } else {
            throw new Error('Ошибка отправки формы');
        }
    } catch (error) {
        showMessage('Произошла ошибка при отправке формы. Пожалуйста, попробуйте еще раз.', 'error');
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
