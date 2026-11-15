# Пользователи

Тестовое WB-Tech: список пользователей, создание и редактирование в модальном окне, отдельная страница с подробностями.

## Стек

React, TypeScript, Vite, axios, React Router, Redux Toolkit и RTK Query (redux-thunk уже входит в `configureStore`), redux-persist, React Hook Form, Zod, Material UI.

## Ресурс на mockapi.io

Создайте ресурс `users` со строковыми полями:

- `name`
- `email`
- `phone`
- `city`
- `company`
- `position`
- `avatar`
- `about`

`id` и `createdAt` mockapi добавляет сам. Для полей можно включить faker, чтобы список был не пустой.

Скопируйте `.env.example` в `.env.local` и вставьте адрес вида `https://<проект>.mockapi.io/api/v1/users`.

## Запуск

```bash
npm install
npm run dev
```

Сборка: `npm run build`. Для деплоя подойдут Vercel или Netlify: в настройках проекта задайте `VITE_API_URL`. Конфиг для обоих хостингов уже в репозитории, прямые ссылки на карточку пользователя открываются без 404.
