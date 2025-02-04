import i18next from "i18next";
import ru from "../../locales/ru.js";
import en from "../../locales/en.js";

const setupLocalization = async () => {
  await i18next.init({
    lng: "ru",
    fallbackLng: "en",
    resources: { ru, en },
  });
};

export default setupLocalization;
