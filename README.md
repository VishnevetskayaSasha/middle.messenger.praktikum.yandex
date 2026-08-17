# Sprint 3

## Описание проекта

Учебный проект, разработанный в рамках спринта 3 в курсе [«Мидл фронтенд‑разработчик»](https://practicum.yandex.ru/middle-frontend/?from=profile_overview)

Проект представляет собой веб-приложение messenger
В третьем спринте приложение было подключено к [API](https://ya-praktikum.tech/api/v2/swagger/), добавлены роутинг, авторизация, работа с профилем и чатами, а также обмен сообщениями через WebSocket

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


## Технологии
* TypeScript;
* Vite;
* Handlebars;
* SCSS;
* Netlify;
* ESLint, Stylelint;
* XMLHttpRequest;
* WebSocket;
* History API.
