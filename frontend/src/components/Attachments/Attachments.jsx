export const LoginPicture = ({ t }) => {
  return (
    <div className="w-full md:w-1/2 flex items-center justify-center">
      <img
        className="rounded-full w-48 h-48 object-cover shadow-lg"
        src="/loginPic.jpg"
        alt={t("assetsAltName.login")}
      />
    </div>
  );
};


// Замена Bootstrap-классов на Tailwind:
// col-12 → w-full (полная ширина на маленьких экранах)
// col-md-6 → md:w-1/2 (50% ширины на экранах md и выше)
// d-flex → flex (Flexbox контейнер)
// align-items-center → items-center (центрирование по вертикали)
// justify-content-center → justify-center (центрирование по горизонтали)

// Стили для изображения:
// rounded-circle → rounded-full (скругление до круга)
// Добавлен w-48 h-48 — фиксированный размер изображения (можно изменить по необходимости)
// object-cover — чтобы изображение не растягивалось и сохраняло пропорции
// shadow-lg — добавлена тень для улучшенного визуального эффекта
