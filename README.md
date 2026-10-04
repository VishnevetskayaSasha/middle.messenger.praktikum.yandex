# Sprint 4

## Описание проекта

Учебный проект, разработанный в рамках спринта 4 в курсе [«Мидл фронтенд‑разработчик»](https://practicum.yandex.ru/middle-frontend/?from=profile_overview)

Проект представляет собой веб-приложение messenger
В проекте реализованы роутинг, авторизация, работа с профилем и чатами, а также обмен сообщениями через WebSocket.

В четвёртом спринте добавлены тесты для роутера, модуля отправки запросов и компонентов, улучшена обработка ошибок HTTP и WebSocket, настроена Content Security Policy и добавлен pre-commit hook с автоматическим запуском линтеров и тестов.

## Функциональность

### Авторизация

- регистрация пользователя;
- вход и выход из системы;
- проверка авторизации;
- защищённые маршруты;

### Профиль

- отображение данных пользователя;
- изменение данных профиля;
- изменение пароля;
- загрузка и изменение аватара.

### Чаты

- получение списка чатов;
- создание и удаление чата;
- поиск чатов по названию;
- отображение последнего сообщения и количества непрочитанных сообщений;
- добавление пользователя в чат;
- удаление пользователя из чата;
- автоматическое обновление списка чатов.

### Сообщения

- подключение к чату через WebSocket;
- получение истории сообщений;
- отправка и получение новых сообщений;
- отображение собственных и чужих сообщений;

### Роутинг

Реализован Router с поддержкой History API.

### Тестирование

Тестами покрыты:
- Router;
- HTTPTransport;
- базовый класс Block;
- компоненты Button, Input, ChatItem, Modal и ChatFooter.

Для тестирования используется Vitest с окружением jsdom.

## Страницы проекта

- Страница входа — `https://vishnevetskayasasha-messenger.netlify.app/`
- Страница регистрации — `https://vishnevetskayasasha-messenger.netlify.app/sign-up`
- Страница чатов — `https://vishnevetskayasasha-messenger.netlify.app/messenger`
- Страница профиля — `https://vishnevetskayasasha-messenger.netlify.app/settings`
- Страница 404 — `https://vishnevetskayasasha-messenger.netlify.app/404`
- Страница 500 — `https://vishnevetskayasasha-messenger.netlify.app/500`

---

- 🔥 [Макет в Figma](https://www.figma.com/design/jF5fFFzgGOxQeB4CmKWTiE/Chat_external_link?node-id=12-54&t=g2XkTTQav3DHTNNJ-0)
- ✅ [Деплой сайта](https://vishnevetskayasasha-messenger.netlify.app/)

---

## Установка и запуск проекта

- `npm install` — установка зависимостей
- `npm run dev` — запуск dev-сервера
- `npm run build` — сборка проекта
- `npm run start` — сборка и запуск production preview
- `npm run lint` — запуск ESLint, Stylelint и проверки TypeScript
- `npm test` — запуск тестов в watch-режиме
- `npm run test:run` — однократный запуск всех тестов


## Технологии
* TypeScript;
* Vite;
* Vitest;
* Handlebars;
* SCSS;
* Netlify;
* ESLint, Stylelint;
* Husky;
* XMLHttpRequest;
* WebSocket;
* History API.
