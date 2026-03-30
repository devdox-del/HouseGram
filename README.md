# HouseGram Beta 🚀

Современный веб-мессенджер в стиле Telegram с возможностью чата с известными личностями.

## ✨ Особенности

- 💬 **Чат с Pavel Durov** — тестирование с AI-ботом
- 🔒 **Безопасность** — XSS защита, санитизация данных
- 💾 **localStorage** — сохранение переписки между сессиями
- 🎨 **Современный UI** — анимации, адаптивный дизайн
- ♿ **Доступность** — ARIA-атрибуты, keyboard navigation
- 📱 **Адаптивность** — работает на всех устройствах

## 🚀 Запуск

### Вариант 1: GitHub Pages (рекомендуется)
Сайт доступен по ссылке: **https://yourusername.github.io/HouseGram/**

### Вариант 2: Локальный сервер
```bash
# Python
python -m http.server 8080

# Node.js
npx http-server -p 8080

# Затем откройте в браузере
http://localhost:8080/
```

### Вариант 3: Прямой запуск
Откройте `index.html` в браузере (требуется атрибут `defer` в script.js)

## 🛠 Технологии

- HTML5
- CSS3 (CSS Variables, Flexbox)
- Vanilla JavaScript (ES6+)
- localStorage API

## 📁 Структура проекта

```
HouseGram Beta/
├── index.html      # Главная страница
├── style.css       # Стили
├── script.js       # Логика приложения
├── .gitignore      # Git ignore файл
└── README.md       # Документация
```

## 🔧 Исправления и улучшения

- ✅ Удалены лишние боты (оставлен только Pavel Durov)
- ✅ Исправлена XSS-уязвимость
- ✅ Добавлено сохранение в localStorage
- ✅ Улучшена производительность (DocumentFragment)
- ✅ Добавлены ARIA-атрибуты
- ✅ Исправлены баги с transitionend
- ✅ Добавлено пустое состояние чата

## 📝 Лицензия

MIT License

## 👤 Автор

Создано с помощью Qwen Code AI Assistant
