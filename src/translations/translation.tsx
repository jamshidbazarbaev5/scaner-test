import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  ru: {
    translation: {
      // General
      loading: "Загрузка...",
      error: "Ошибка",
      close: "Закрыть",
      success: "Выполнено!",      // Auth
      login: "Вход",
      logout: "Выйти",
      username: "Имя пользователя",
      password: "Пароль",
      loginError: "Неверный логин или пароль",
      tokenFound: "Токен найден",
      noToken: "Токен отсутствует",
      clearToken: "Удалить токен",

      // Navigation
      scan: "Сканировать",
      reset: "Сбросить",
      bonusArchive: "Архив Бонусов",
      rewards: "Вознаграждения",
      profile: "Профиль",
      editProfile: "Редактировать профиль",

      // Scanner
      totalPoints: "Всего баллов",
      scannedCodes: "Отсканировано кодов",
      today: "Сегодня",
      scanError: "Ошибка при сканировании",
      browserNotSupported: "Браузер не поддерживается",
      cameraPermission: "Нет доступа к камере",
      openInBrowser: "Открыть в браузере",

      // Profile
      firstName: "Имя",
      lastName: "Фамилия",
      phone: "Номер телефона",
      newPassword: "Новый пароль",
      updateProfile: "Обновить профиль",
      show: "Показать",
      hide: "Скрыть",
      myBonuses: "Мои Бонусы",
      total: "Всего",
      points: "баллов",
      invalidDateRange: "Выберите корректный диапазон дат",
      noBonusesFound: "Бонусы не найдены за выбранный период",
      ball: "балл",
      bonus_code: "Код бонуса",
      required: "Требуется",
      prize: "Приз",
      tariffs: "Тарифы",
      accumulate: "Накапливайте баллы и получайте призы!",

      // Scanner Messages
      pointsEarned: "Вы получили {{points}} баллов",
      alreadyScanned: "Пользователь с ID {{userId}} уже сканировал этот штрихкод",
      barcodeNotFound: "Такого штрихкода нет в базе данных",

      myPrizes: "Мои призы",
      exchangedPoints: "Обменянные баллы",
      receivedPrizes: "Полученные призы",
      totalExchanged: "Всего обменяно",

      gotBonuses: "Полученные бонусы",

      // Scanner specific translations
      stop: "Остановить",
      typeBarcode: "Ввести штрихкод",
      enterBarcode: "Введите штрихкод",
      barcodeNumber: "Номер штрихкода",
      submit: "Отправить",
      cancel: "Отмена",
      scannedCode: "Отсканированный код",
      browserNotSupportedMessage: "Ваш браузер не поддерживает сканирование. Пожалуйста, используйте другой браузер.",
      cameraPermissionMessage: "Для сканирования необходим доступ к камере",

      // API Messages
      "Вы получили 50 баллов": "Вы получили 50 баллов",
      "Вы получили {{points}} баллов": "Вы получили {{points}} баллов",
      "Такого штрихкода нет в базе данных.": "Такого штрихкода нет в базе данных.",
      "Пользователь с ID {{userId}} уже сканировал этот штрихкод.": "Пользователь с ID {{userId}} уже сканировал этот штрихкод.",
      "Пользователь с ID 2 уже сканировал этот штрихкод.": "Пользователь с ID 2 уже сканировал этот штрихкод.",
    },
  },
  uz: {
    translation: {
      // General
      loading: "Yuklanmoqda...",
      error: "Xato",
      close: "Yopish",
      success: "Bajarildi!",

      // Auth
      login: "Kirish",
      logout: "Chiqish",
      username: "Foydalanuvchi nomi",
      password: "Parol",
      loginError: "Noto'g'ri login yoki parol",
      tokenFound: "Token mavjud",
      noToken: "Token mavjud emas",
      clearToken: "Tokenni o'chirish",

      // Navigation
      scan: "Skanerlash",
      reset: "O'chirish",
      bonusArchive: "Bonuslar arxivi",
      rewards: "Mukofotlar",
      profile: "Profil",
      editProfile: "Profilni tahrirlash",

      // Scanner
      totalPoints: "Jami ballar",
      scannedCodes: "Skaner qilingan kodlar",
      today: "Bugun",
      scanError: "Skanerlashda xatolik yuz berdi",
      browserNotSupported: "Brauzer qo'llab-quvvatlanmaydi",
      cameraPermission: "Kameraga ruxsat yo'q",
      openInBrowser: "Brauzerda ochish",

      // Profile
      firstName: "Ism",
      lastName: "Familiya",
      phone: "Telefon raqami",
      newPassword: "Yangi parol",
      updateProfile: "Profilni yangilash",
      show: "Ko'rsatish",
      hide: "Yashirish",
      myBonuses: "Mening Bonuslarim",
      total: "Jami",
      points: "ball",
      invalidDateRange: "Yaroqli sana oralig'ini tanlang",
      noBonusesFound: "Tanlangan davr uchun bonuslar topilmadi",
      ball: "ball",
      bonus_code: "Bonus kodi",
      required: "Talab qilinadi",
      prize: "Mukofot",
      tariffs: "Ta'riflar",
      accumulate: "Ball toplang va sovgalar oling!",

      // Scanner Messages
      pointsEarned: "Siz {{points}} ball oldingiz",
      alreadyScanned: "{{userId}} ID raqamli foydalanuvchi allaqachon bu shtrix-kodni skanerlagan",
      barcodeNotFound: "Bunday shtrix-kod ma'lumotlar bazasida mavjud emas",

      myPrizes: "Mening sovg'alarim",
      exchangedPoints: "Almashtirilgan ballar",
      receivedPrizes: "Olingan sovg'alar",
      totalExchanged: "Jami almashtirilgan",

      gotBonuses: "Olingan sovg'alar",

      // Scanner specific translations
      stop: "To'xtatish",
      typeBarcode: "Shtrix-kodni kiriting",
      enterBarcode: "Shtrix-kodni kiriting",
      barcodeNumber: "Shtrix-kod raqami",
      submit: "Yuborish",
      cancel: "Bekor qilish",
      scannedCode: "Skanerlangan kod",
      browserNotSupportedMessage: "Brauzeringiz skanerlashni qo'llab-quvvatlamaydi. Iltimos, boshqa brauzerdan foydalaning.",
      cameraPermissionMessage: "Skanerlash uchun kameraga ruxsat kerak",

      // API Messages
      "Вы получили 50 баллов": "Siz 50 ball oldingiz",
      "Вы получили {{points}} баллов": "Siz {{points}} ball oldingiz",
      "Такого штрихкода нет в базе данных.": "Bunday shtrix-kod ma'lumotlar bazasida mavjud emas.",
      "Пользователь с ID {{userId}} уже сканировал этот штрихкод.": "{{userId}} ID raqamli foydalanuvchi allaqachon bu shtrix-kodni skanerlagan.",
      "Пользователь с ID 2 уже сканировал этот штрихкод.": "2 ID raqamli foydalanuvchi allaqachon bu shtrix-kodni skanerlagan.",
    },
  },
  kk: {
    translation: {
      // General
      loading: "Júklenip atır...",
      error: "Qátelik",
      close: "Jabıw",
      success: "Orınlandı!",

      // Auth
      login: "Kiriw",
      logout: "Shıǵıw",
      username: "Paydalanıwshı atı",
      password: "Parol",
      loginError: "Nadurıs login yamasa parol",
      tokenFound: "Token bar",
      noToken: "Token joq",
      clearToken: "Tokendı óshiriw",

      // Navigation
      scan: "Skanerlew",
      reset: "Òshiriw",
      bonusArchive: "Bonus arxivi",
      rewards: "Sıylıqlar",
      profile: "Profil",
      editProfile: "Profildi ózgertiw",

      // Scanner
      totalPoints: "Ulıwma ballar",
      scannedCodes: "Skanerlengen kodlar",
      today: "Búgin",
      scanError: "Skanerlew kezinde qate",
      browserNotSupported: "Brauzer qollap-quwatlamaydı",
      cameraPermission: "Kameradan ruxsat joq",
      openInBrowser: "Brauzerda ashıw",

      // Profile
      firstName: "Atı",
      lastName: "Familiyası",
      phone: "Telefon nomeri",
      newPassword: "Jańa parol",
      updateProfile: "Profildi jańalaw",
      show: "Kórsetiw",
      hide: "Jasırıw",
      myBonuses: "Menıń bonuslarım",
      total: "Ulıwma",
      points: "ball",
      invalidDateRange: "Durıs sáne aralıǵın tańlań",
      noBonusesFound: "Tańlanǵan dáwir ushın bonuslar tabılmadı",
      ball: "ball",
      bonus_code: "Bonus kodı",
      required: "Talap etiledi",
      prize: "Sıylıq",
      tariffs: "Tarifler",
      accumulate: "Ball jıynań hám sıylıqlar alıń!",

      // Scanner Messages
      pointsEarned: "Siz {{points}} ball aldıńız",
      alreadyScanned: "{{userId}} ID paydalanıwshı bul shtrix-kodtı aldın skanerlegen",
      barcodeNotFound: "Bul shtrix-kod derekter bazasında joq",

      myPrizes: "Menıń sıylıqlarım",
      exchangedPoints: "Almastırılǵan ballar",
      receivedPrizes: "Alınǵan sıylıqlar",
      totalExchanged: "Barlıq almastırılǵan",
      gotBonuses: "Alinġan Siyliqlar",

      // Scanner specific translations
      stop: "Toqtatıw",
      typeBarcode: "Qolda kiritiw",
      enterBarcode: "Shtrix-kodtı engizińiz",
      barcodeNumber: "Shtrix-kod ",
      submit: "Jiberiw",
      cancel: "Bıykarlaw",
      scannedCode: "Skanerlengen kod",
      browserNotSupportedMessage: "Brauzerińiz skanerlew múmkinshiligin qoldamaydı. Basqa brauzerdi paydalanıńız.",
      cameraPermissionMessage: "Skanerlew úshin kamerağa ruqsat qajet",

      // API Messages
      "Вы получили 50 баллов": "Siz 50 ball aldıńız",
      "Вы получили {{points}} баллов": "Siz {{points}} ball aldıńız",
      "Такого штрихкода нет в базе данных.": "Bul shtrix-kod derekter bazasında joq.",
      "Пользователь с ID {{userId}} уже сканировал этот штрихкод.": "{{userId}} ID paydalanıwshı bul shtrix-kodtı aldın skanerlegen.",
      "Пользователь с ID 2 уже сканировал этот штрихкод.": "2 ID paydalanıwshı bul shtrix-kodtı aldın skanerlegen.",
    },
  },
} as const;

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "ru",
  fallbackLng: "ru",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
