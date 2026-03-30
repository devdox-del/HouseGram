# 🚀 Инструкция по публикации на GitHub Pages

## Шаг 1: Пуш репозитория

Откройте терминал в папке проекта и выполните:

```bash
cd "d:\HouseGram Beta"

# Пуш на GitHub (потребуется ввести логин и пароль/токен)
git push -u origin main
```

**Если используется двухфакторная аутентификация:**
1. Создайте Personal Access Token: https://github.com/settings/tokens
2. Используйте токен вместо пароля

## Шаг 2: Включение GitHub Pages

1. Откройте репозиторий: https://github.com/devdox-del/HouseGram
2. Перейдите в **Settings** → **Pages**
3. В разделе **Source** выберите:
   - Branch: **main**
   - Folder: **/ (root)**
4. Нажмите **Save**

## Шаг 3: Доступ к сайту

Через 1-2 минуты сайт будет доступен по ссылке:
```
https://devdox-del.github.io/HouseGram/
```

## Альтернатива: Быстрый пуш

```bash
cd "d:\HouseGram Beta"
git push -u origin main --force
```

## 📝 Примечания

- Изменения на GitHub Pages обновляются в течение 1-2 минут
- Для обновления после изменений: `git add . && git commit -m "update" && git push`
- Кэш GitHub Pages может обновляться до 5 минут
