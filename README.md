# pubsub-debug

Выгрузка сообщений из очереди

## Прошивка данных сервисного аккаунта

### Через терминал (не исп.)

- [Setup instructions](https://github.com/google/clasp/blob/master/docs/run.md#setup-instructions)
- `clasp run 'setProperties' '[{"foo": "bar"}]'`

### Через онлайн редактор

- Открыть `lib/getCredential.gs`
- Найти функцию `setCredentials`
- Вписать имя свойства `propNames`
- В `credentials` Вставить данные из файла
- Запустить функцию вручную
- Стереть функцию, или вернуть все как было

[clasp run](https://github.com/google/clasp/blob/master/docs/run.md)

## Ньюансы проекта для Google Apps Script

### Скрипт `comments.sh`

Чтобы ускорить разработку, решено было отказаться от Babel и нового
синтаксиса, однако в целях тестирования и просто для наглядности что от чего зависит как-то сохранить импорты и экспорты. При том импорты и экспорты не поддерживаются в Google Apps Script. Для этого нужно закомментировать эти инструкции в коде. Чтобы было легче можно воспользоваться скриптом, который автоматизирует этот процесс. Файлы в субмодулях игнорируются. Файлы в собственных поддиректориях обрабатываются. Обработка ведется в папке `dist`.

Комментирование инструкций import, export, export default

```BASH
./comment.sh
```

```JS
/* dist/main.js */

// import _ from './lodash';

/* export */ function myFunction() {
  // My code
}

// export default myFunction;
```

Удаление комментирования

```BASH
./comment.sh -u
```

```JS
/* dist/main.js */

import _ from './lodash';

export function myFunction() {
  // My code
}

export default myFunction;
```

## Зависимости проекта

### [OAuth2](https://github.com/gsuitedevs/apps-script-oauth2)

#### Installation

In the Google online script editor, select the Resources menu item and choose Libraries.... In the "Add a library" input box, enter `1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF` and click "Add." Choose the most recent version number.

OR

Update manifest file `appscript.json` like below:

```JS
{
  "timeZone": "Europe/Bucharest",
  "dependencies": {
    "libraries": [{
      "userSymbol": "FirestoreApp",
      "libraryId": "1B7FSrk5Zi6L1rSxxTDgDEUsPzlukDsi4KGuTMorsTQHhGBzBkMun4iDF",
      "version": "35"
    }]
  },
  "exceptionLogging": "STACKDRIVER"
}
```
