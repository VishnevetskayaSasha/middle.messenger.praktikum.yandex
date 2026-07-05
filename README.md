# Sprint 2

## Описание проекта

Учебный проект, разработанный в рамках спринта 2 в курсе [«Мидл фронтенд‑разработчик»](https://practicum.yandex.ru/middle-frontend/?from=profile_overview)

Проект представляет собой веб-приложение messenger с несколькими страницами и базовой навигацией.
Во втором спринте проект был полностью переведён на **TypeScript**, реализована компонентная архитектура на основе собственного класса `Block`, добавлена общая система валидации форм.


## Страницы проекта

- Страница входа — `#`
- Страница регистрации — `/#register`
- Страница чатов — `/#chats`
- Страница профиля — `/#profile`
- Страница 404 — `/#404`
- Страница 500 — `/#500`


## Реализованные возможности

- Компонентная архитектура;
- Базовый класс `Block`;
- Жизненный цикл компонентов;
- Переиспользуемые компоненты (`Button`, `Input`, `Link`, `Heading`, `ChatItem`, `ProfileField`);
- Валидация всех форм по требованиям ТЗ;
- Вывод данных форм в консоль при успешной отправке;
- Переключение режимов просмотра и редактирования профиля;
- Строгая типизация TypeScript.

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
* ESLint, Stylelint.
