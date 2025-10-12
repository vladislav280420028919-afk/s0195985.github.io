document.addEventListener('DOMContentLoaded', function() {
    'use strict';
    
    const productSelect = document.getElementById('product');
    const quantityInput = document.getElementById('quantity');
    const calculateBtn = document.getElementById('calculateBtn');
    const resultDiv = document.getElementById('result');
    const errorDiv = document.getElementById('quantityError');
    
    const numberRegex = /^\d+$/;
    
    function validateInput(value) {
        return numberRegex.test(value) && parseInt(value, 10) > 0;
    }
    
    function formatNumber(number) {
        return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    }
    
    function calculateTotal() {
        
        errorDiv.style.display = 'none';
        resultDiv.style.display = 'none';
        
        
        const price = parseFloat(productSelect.value);
        const quantityValue = quantityInput.value.trim();
        
        
        if (!validateInput(quantityValue)) {
            errorDiv.style.display = 'block';
            return;
        }
        
        const quantity = parseInt(quantityValue, 10);
        
        
        const total = price * quantity;
        
        const productName = productSelect.options[productSelect.selectedIndex].text.split(' - ')[0];
        
        const formattedPrice = formatNumber(price);
        const formattedTotal = formatNumber(total);
        
        resultDiv.innerHTML = `
            <strong>Результат расчета:</strong><br>
            Товар: ${productName}<br>
            Цена: ${formattedPrice} руб.<br>
            Количество: ${quantity} шт.<br>
            <strong>Общая стоимость: ${formattedTotal} руб.</strong>
        `;
        resultDiv.style.display = 'block';
    }
    
    calculateBtn.addEventListener('click', calculateTotal);
    
    quantityInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            calculateTotal();
        }
    });
    
    quantityInput.addEventListener('input', function() {
        const value = this.value.trim();
        
        if (!validateInput(value)) {
            errorDiv.style.display = 'block';
        } else {
            errorDiv.style.display = 'none';
        }
    });
});
