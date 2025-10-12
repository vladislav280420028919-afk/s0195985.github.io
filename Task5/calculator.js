<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Калькулятор стоимости заказа</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            max-width: 500px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f5f5f5;
        }
        .calculator {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            margin-bottom: 5px;
            font-weight: bold;
            color: #333;
        }
        input, select, button {
            width: 100%;
            padding: 10px;
            border: 2px solid #ddd;
            border-radius: 5px;
            font-size: 16px;
            box-sizing: border-box;
        }
        button {
            background-color: #007bff;
            color: white;
            border: none;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        button:hover {
            background-color: #0056b3;
        }
        #result {
            margin-top: 20px;
            padding: 15px;
            background-color: #e9f7ef;
            border: 2px solid #28a745;
            border-radius: 5px;
            font-size: 18px;
            font-weight: bold;
            text-align: center;
            display: none;
        }
        .error {
            color: #dc3545;
            font-size: 14px;
            margin-top: 5px;
            display: none;
        }
    </style>
</head>
<body>
    <div class="calculator">
        <h1>Калькулятор стоимости заказа</h1>
        
        <div class="form-group">
            <label for="product">Выберите товар:</label>
            <select id="product">
                <option value="1500">Смартфон - 1 500 руб.</option>
                <option value="800">Наушники - 800 руб.</option>
                <option value="2500">Планшет - 2 500 руб.</option>
                <option value="500">Чехол для телефона - 500 руб.</option>
                <option value="1200">Power Bank - 1 200 руб.</option>
            </select>
        </div>

        <div class="form-group">
            <label for="quantity">Количество товара:</label>
            <input type="text" id="quantity" value="1">
            <div id="quantityError" class="error">Пожалуйста, введите корректное количество (только цифры)</div>
        </div>

        <button id="calculateBtn">Рассчитать стоимость</button>

        <div id="result"></div>
    </div>

    <script src="calculator.js" defer></script>
</body>
</html>
