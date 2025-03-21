/** @type {import('prettier').Config} */
module.exports = {
  semi: true, // точки с запятой
  singleQuote: true, // одинарные кавычки
  trailingComma: 'es5', // висячие запятые
  tabWidth: 2, // отступ — 2 пробела
  useTabs: false, // пробелы вместо табов
  bracketSpacing: true, // пробелы между скобками { foo: bar }
  arrowParens: 'always', // всегда оборачивать параметры стрелочных функций: (x) => x
  endOfLine: 'lf', // переводы строк
  embeddedLanguageFormatting: 'auto', // безопасное поведение
  proseWrap: 'preserve', // не менять перенос строк в текстах
};
