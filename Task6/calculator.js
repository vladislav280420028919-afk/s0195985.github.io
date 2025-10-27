document.addEventListener('DOMContentLoaded', function() {
    const serviceTypeRadios = document.querySelectorAll('input[name="serviceType"]');
    const quantityInput = document.getElementById('quantity');
    const optionsGroup = document.getElementById('optionsGroup');
    const optionsSelect = document.getElementById('options');
    const propertyGroup = document.getElementById('propertyGroup');
    const propertyCheckbox = document.getElementById('property');
    const resultDiv = document.getElementById('result');

    const basePrices = {
        basic: 1000,
        premium: 2000,
        custom: 1500
    };

    function updateInterface() {
        const selectedType = document.querySelector('input[name="serviceType"]:checked').value;
        
        optionsSelect.selectedIndex = 0;
        propertyCheckbox.checked = false;
        
        switch(selectedType) {
            case 'basic':
                optionsGroup.classList.add('hidden');
                propertyGroup.classList.add('hidden');
                break;
            case 'premium':
                optionsGroup.classList.remove('hidden');
                propertyGroup.classList.add('hidden');
                break;
            case 'custom':
                optionsGroup.classList.add('hidden');
                propertyGroup.classList.remove('hidden');
                break;
        }
        
        calculateTotal();
    }

    function calculateTotal() {
        const selectedType = document.querySelector('input[name="serviceType"]:checked').value;
        const quantity = parseInt(quantityInput.value) || 1;
        let total = basePrices[selectedType] * quantity;
        
        if (selectedType === 'premium') {
            const optionPrice = parseInt(optionsSelect.value);
            total += optionPrice * quantity;
        }
        
        if (selectedType === 'custom' && propertyCheckbox.checked) {
            const propertyPrice = parseInt(propertyCheckbox.value);
            total += propertyPrice * quantity;
        }
        
        resultDiv.textContent = `Общая стоимость: ${total.toLocaleString('ru-RU')} руб.`;
    }

    serviceTypeRadios.forEach(radio => {
        radio.addEventListener('change', updateInterface);
    });
    
    quantityInput.addEventListener('input', calculateTotal);
    optionsSelect.addEventListener('change', calculateTotal);
    propertyCheckbox.addEventListener('change', calculateTotal);

    updateInterface();
});