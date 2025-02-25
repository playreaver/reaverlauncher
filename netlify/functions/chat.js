const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method Not Allowed' }),
        };
    }

    const { message } = JSON.parse(event.body);

    const DEEPSEEK_API_URL = 'https://api.deepseek.com/v1/completions'; // Убедитесь, что URL правильный
    const DEEPSEEK_API_KEY = 'sk-67bacbe36fba437ba67c81f607281bc1'; // Ваш API ключ

    try {
        const response = await fetch(DEEPSEEK_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${DEEPSEEK_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prompt: message,
                max_tokens: 50,
                temperature: 0.7,
                model: "deepseek-chat", // Укажите правильную модель DeepSeek
                top_p: 1,
                n: 1,
            }),
        });

        if (!response.ok) {
            throw new Error(`DeepSeek API error: ${response.statusText}`);
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
