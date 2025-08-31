import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newLang = event.target.value;
    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <div className="relative inline-block ">
      <select
        value={i18n.language}
        onChange={handleLanguageChange}
        className="appearance-none px-4 py-1 rounded-md text-sm font-medium text-gray-600 dark:text-gray-400
                  border border-gray-300 dark:border-gray-600 hover:border-gray-400 
                  dark:hover:border-gray-500 bg-white dark:bg-gray-800 
                  cursor-pointer outline-none mx-2"
      >
        <option value="ru" className="flex items-center gap-2 p-2 font-[16px]">
          RU
        </option>
        <option value="uz" className="flex items-center gap-2 p-2 font-[16px]">
          UZ
        </option>
        <option value="kk" className="flex items-center gap-2 p-2 font-[16px]">
          KK
        </option>
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
        <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
    </div>
  );
};
