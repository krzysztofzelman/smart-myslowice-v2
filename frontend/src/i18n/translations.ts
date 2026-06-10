export type Lang = 'pl' | 'en';

export type TranslationKey = keyof typeof pl;

export const pl = {
  // --- App ---
  app: {
    tabAir: 'Jakość Powietrza',
    tabWeather: 'Pogoda',
    tabWater: 'Wody',
    tabToilets: 'Toalety',
    tabEco: 'Eko',
    tabAed: 'AED',
    footer: 'Smart Mysłowice — Platforma Danych Miejskich',
  },

  // --- Common ---
  common: {
    loading: 'Ładowanie…',
    close: 'Zamknij',
    error: 'Błąd:',
    noData: 'Brak danych',
    refresh: 'Spróbuj ponownie',
    home: 'Strona główna',
    showList: 'Pokaż listę',
    hideList: 'Ukryj listę',
    showNearest: 'Pokaż najbliższy',
    hideNearest: 'Ukryj najbliższy',
    details: 'Szczegóły',
    source: 'Źródło:',
    call112: 'Dzwoń pod 112',
    paid: 'Płatna',
    free: 'Bezpłatna',
    withinRange: 'W zasięgu',
    outOfRange: 'Poza zasięgiem',
    total: 'W sumie',
  },

  // --- Header ---
  header: {
    badge: 'IoT · Dane na Żywo',
    themeDay: 'Dzień',
    themeDusk: 'Zmierzch',
    themeNight: 'Noc',
    title: 'Smart Mysłowice',
    subtitle: 'Platforma Danych Miejskich · Woj. Śląskie',
    loadingWeather: 'Ładowanie pogody…',
    languageSwitch: 'English',
    languageSwitchTitle: 'Przełącz na angielski',
    themeTitle: 'Zmień motyw',
  },

  // --- Nav ---
  nav: {
    ariaLabel: 'Główna nawigacja',
  },

  // --- ErrorBoundary ---
  errorBoundary: {
    title: 'Coś poszło nie tak',
    message: 'Wystąpił nieoczekiwany błąd. Spróbuj odświeżyć stronę.',
    retry: 'Spróbuj ponownie',
    home: 'Strona główna',
  },

  // --- AI Assistant ---
  aiAssistant: {
    greeting: 'Cześć! Jestem asystentem Smart Mysłowice. Jak mogę Ci pomóc?',
    title: 'Asystent',
    close: 'Zamknij',
    open: 'Otwórz asystenta',
    cityAssistant: 'Asystent miejski',
    placeholder: 'Zadaj pytanie o miasto…',
    send: 'Wyślij zapytanie',
    showDetails: 'Zobacz szczegóły',
    goToPage: 'Przejdź do strony',
  },

  // --- AirHistoryModal ---
  airHistoryModal: {
    title: 'PM2.5 i PM10 — ostatnie 24h',
    close: 'Zamknij',
    loading: 'Ładowanie…',
    error: 'Błąd:',
    noData: 'Brak danych historycznych dla tej stacji.',
  },

  // --- WaterMap ---
  waterMap: {
    level: 'Poziom:',
    warning: 'Ostrzegawczy:',
    alarm: 'Alarmowy:',
    approxLocation: '(przybliżona lokalizacja)',
  },

  // --- AirPage ---
  airPage: {
    title: 'Jakość Powietrza',
    subtitle: 'Monitorowanie jakości powietrza w Mysłowicach',
    qualityVeryGood: 'Bardzo dobra',
    qualityGood: 'Dobra',
    qualityModerate: 'Umiarkowana',
    qualitySufficient: 'Dostateczna',
    qualityPoor: 'Zła',
    qualityVeryPoor: 'Bardzo zła',
    cagiLabel: 'CAQI',
    whoNorm: 'Norma WHO:',
    tempCompensation: 'Kompensacja temperaturowa',
    warningBadAir: 'Ostrzeżenie: Jakość powietrza jest zła. Rozważ ograniczenie aktywności na zewnątrz.',
    stationRef: 'Stacja referencyjna',
    dataReanalysis: 'Dane z reanalizy',
    source: 'Źródło: GIOŚ / OpenAQ',
    errorLoading: 'Błąd ładowania danych jakości powietrza',
    noStation: 'Nie znaleziono stacji pomiarowych w Mysłowicach',
    toastUpdate: 'Dane są aktualizowane co godzinę',
    toastSource: 'Dane pochodzą z Głównego Inspektoratu Ochrony Środowiska',
    whoInNorm: 'w normie',
    whoExceed: 'ponad normę',
    activeStations: 'Stacje aktywne',
    avgPm25: 'Średnie PM2.5 µg/m³',
    avgPm10: 'Średnie PM10 µg/m³',
    historicalNotAvailable: '📊 Dane historyczne niedostępne dla stacji GIOŚ',
    sourceText: 'Źródło: GIOŚ (stacje w promieniu 20 km) + Airly (czujniki w promieniu 5 km od centrum Mysłowic). Dane odświeżane co 30 minut. Mysłowice leżą w jednym z najbardziej zanieczyszczonych regionów Polski.',
  },

  // --- AedPage ---
  aedPage: {
    title: 'Defibrylatory AED',
    subtitle: 'Sieć defibrylatorów AED w Mysłowicach',
    alert: '⚠️ W nagłych wypadkach dzwoń pod 112',
    call112: 'Dzwoń pod 112',
    totalAed: 'W sumie AED',
    withinRange: 'W zasięgu',
    outOfRange: 'Poza zasięgiem',
    locationError: 'Nie udało się określić Twojej lokalizacji.',
    dataError: 'Nie udało się pobrać danych AED.',
    listTitle: 'Lista defibrylatorów',
    popupCall: 'Wezwij pomoc (112)',
    popupDetails: 'Szczegóły',
    alertTitle: 'Nagłe zatrzymanie krążenia?',
    alertSub: 'Zadzwoń na pogotowie, znajdź defibrylator, zacznij RKO',
    alertBtn: 'Zadzwoń 112',
    available247: 'Dostępne 24/7',
    publiclyAvailable: 'Publicznie dostępne',
    geoBtnText: '📍 Znajdź najbliższy AED',
    geoBtnLoading: '⏳ Szukanie…',
    geoErrorGeneric: 'Geolokalizacja nie jest wspierana przez Twoją przeglądarkę.',
    geoErrorDenied: 'Nie udzielono dostępu do lokalizacji. Aby znaleźć najbliższy AED, włącz lokalizację w ustawieniach przeglądarki.',
    geoErrorUnavailable: 'Nie udało się ustalić Twojej lokalizacji. Spróbuj ponownie.',
    geoErrorTimeout: 'Upłynął czas oczekiwania na lokalizację. Spróbuj ponownie.',
    geoErrorDefault: 'Nie udało się pobrać lokalizacji. Spróbuj ponownie.',
    dataErrorMsg: '⚠️ Nie udało się załadować danych. Spróbuj ponownie.',
    navigateBtn: 'Nawiguj →',
    allLocations: 'Wszystkie lokalizacje',
    navigateTo: 'Nawiguj do',
    collapseList: '▲ Zwiń',
    showAll: '▼ Pokaż wszystkie',
    expandAria: 'Rozwiń listę',
    collapseAria: 'Zwiń listę',
    aedLabel: 'Defibrylatory AED',
  },

  // --- WeatherPage ---
  weatherPage: {
    title: 'Pogoda',
    location: 'Mysłowice, Woj. Śląskie',
    humidity: 'Wilgotność',
    wind: 'Wiatr',
    pressure: 'Ciśnienie',
    cloudCover: 'Zachmurzenie',
    visibility: 'Widzialność',
    uvIndex: 'UV Index',
    feelsLike: 'Odczuwalna',
    source: 'Źródło: IMGW / Open-Meteo',
    errorFetch: 'Błąd pobierania pogody',
    errorApiKey: 'Sprawdź klucz API OpenWeatherMap w backendzie.',
    noData: 'Brak danych',
    sourceText: 'Odświeżanie co 10 minut. Klucz API przechowywany po stronie serwera.',
  },

  // --- ToiletsPage ---
  toiletsPage: {
    title: 'Toalety Miejskie',
    subtitle: 'Mapa toalet publicznych w Mysłowicach',
    error: 'Nie udało się pobrać danych toalet.',
    tip: '💡 Wskazówka: Kliknij znacznik na mapie, aby zobaczyć szczegóły.',
    paid: 'Płatna',
    free: 'Bezpłatna',
    collapse: '▲ Zwiń',
    showAll: 'Pokaż wszystkie',
  },

  // --- EcoPage ---
  ecoPage: {
    title: 'Ekologia i Odpady',
    subtitle: 'Punkty zbiórki odpadów i ekologia w Mysłowicach',
    categoryPszok: 'PSZOK',
    categoryPharmacy: 'Apteki',
    categoryEwaste: 'Elektroodpady',
    categoryTextiles: 'Tekstylia',
    categoryBatteries: 'Baterie',
    info: 'Informacja: PSZOK przyjmuje odpady segregowane, elektrośmieci, meble, opony. Przeterminowane leki oddawaj w aptekach.',
    errorLoad: 'Nie udało się załadować danych. Spróbuj ponownie.',
    collapse: '▲ Zwiń',
    showAll: 'Pokaż wszystkie',
  },

  // --- WaterPage ---
  waterPage: {
    title: 'Monitoring Wód',
    subtitle: 'Poziom rzek i potoków w Mysłowicach',
    level: 'Poziom:',
    status: 'Stan:',
    listTitle: 'Lista stacji pomiarowych',
    source: 'Źródło: IMGW / dane publiczne',
    geoBtnText: '📍 Znajdź najbliższą stację',
    geoBtnLoading: '⏳ Szukanie…',
    collapse: '▲ Zwiń',
    showAll: 'Pokaż wszystkie',
    sourceRefresh: 'Odświeżane co 60 minut.',
  },

  // --- WaterStatus (utils) ---
  waterStatus: {
    safe: 'Bezpieczny',
    warning: 'Ostrzeżenie',
    danger: 'Niebezpieczny',
    noData: 'Brak danych',
  },

  // --- useFetch ---
  useFetch: {
    fetchError: 'Nie można pobrać danych:',
    timeout: 'Timeout — serwer nie odpowiada',
  },

  // --- useAIAssistant ---
  useAIAssistant: {
    queryTooLong: 'Zapytanie zbyt długie. Maksymalnie 500 znaków.',
    timeout: 'Timeout — serwer nie odpowiada. Spróbuj ponownie.',
    commError: 'Wystąpił błąd podczas komunikacji z asystentem.',
  },

  // --- Day/Month names ---
  days: {
    sunday: 'Niedziela',
    monday: 'Poniedziałek',
    tuesday: 'Wtorek',
    wednesday: 'Środa',
    thursday: 'Czwartek',
    friday: 'Piątek',
    saturday: 'Sobota',
  },
  months: {
    january: 'Styczeń',
    february: 'Luty',
    march: 'Marzec',
    april: 'Kwiecień',
    may: 'Maj',
    june: 'Czerwiec',
    july: 'Lipiec',
    august: 'Sierpień',
    september: 'Wrzesień',
    october: 'Październik',
    november: 'Listopad',
    december: 'Grudzień',
  },
};

export const en: typeof pl = {
  // --- App ---
  app: {
    tabAir: 'Air Quality',
    tabWeather: 'Weather',
    tabWater: 'Water',
    tabToilets: 'Toilets',
    tabEco: 'Eco',
    tabAed: 'AED',
    footer: 'Smart Mysłowice — Urban Data Platform',
  },

  // --- Common ---
  common: {
    loading: 'Loading…',
    close: 'Close',
    error: 'Error:',
    noData: 'No data',
    refresh: 'Try again',
    home: 'Home',
    showList: 'Show list',
    hideList: 'Hide list',
    showNearest: 'Show nearest',
    hideNearest: 'Hide nearest',
    details: 'Details',
    source: 'Source:',
    call112: 'Call 112',
    paid: 'Paid',
    free: 'Free',
    withinRange: 'Within range',
    outOfRange: 'Out of range',
    total: 'Total',
  },

  // --- Header ---
  header: {
    badge: 'IoT · Live Data',
    themeDay: 'Day',
    themeDusk: 'Dusk',
    themeNight: 'Night',
    title: 'Smart Mysłowice',
    subtitle: 'Urban Data Platform · Silesia',
    loadingWeather: 'Loading weather…',
    languageSwitch: 'Polski',
    languageSwitchTitle: 'Przełącz na polski',
    themeTitle: 'Change theme',
  },

  // --- Nav ---
  nav: {
    ariaLabel: 'Main navigation',
  },

  // --- ErrorBoundary ---
  errorBoundary: {
    title: 'Something went wrong',
    message: 'An unexpected error occurred. Try refreshing the page.',
    retry: 'Try again',
    home: 'Home',
  },

  // --- AI Assistant ---
  aiAssistant: {
    greeting: 'Hi! I\'m the Smart Mysłowice assistant. How can I help you?',
    title: 'Assistant',
    close: 'Close',
    open: 'Open assistant',
    cityAssistant: 'City assistant',
    placeholder: 'Ask about the city…',
    send: 'Send query',
    showDetails: 'Show details',
    goToPage: 'Go to page',
  },

  // --- AirHistoryModal ---
  airHistoryModal: {
    title: 'PM2.5 & PM10 — last 24h',
    close: 'Close',
    loading: 'Loading…',
    error: 'Error:',
    noData: 'No historical data for this station.',
  },

  // --- WaterMap ---
  waterMap: {
    level: 'Level:',
    warning: 'Warning:',
    alarm: 'Alarm:',
    approxLocation: '(approximate location)',
  },

  // --- AirPage ---
  airPage: {
    title: 'Air Quality',
    subtitle: 'Air quality monitoring in Mysłowice',
    qualityVeryGood: 'Very good',
    qualityGood: 'Good',
    qualityModerate: 'Moderate',
    qualitySufficient: 'Sufficient',
    qualityPoor: 'Poor',
    qualityVeryPoor: 'Very poor',
    cagiLabel: 'CAQI',
    whoNorm: 'WHO norm:',
    tempCompensation: 'Temperature compensation',
    warningBadAir: 'Warning: Air quality is poor. Consider limiting outdoor activity.',
    stationRef: 'Reference station',
    dataReanalysis: 'Reanalysis data',
    source: 'Source: GIOS / OpenAQ',
    errorLoading: 'Error loading air quality data',
    noStation: 'No monitoring stations found in Mysłowice',
    toastUpdate: 'Data is updated every hour',
    toastSource: 'Data from Chief Inspectorate of Environmental Protection',
    whoInNorm: 'within norm',
    whoExceed: 'above norm',
    activeStations: 'Active stations',
    avgPm25: 'Avg PM2.5 µg/m³',
    avgPm10: 'Avg PM10 µg/m³',
    historicalNotAvailable: '📊 Historical data not available for GIOS stations',
    sourceText: 'Source: GIOS (stations within 20 km radius) + Airly (sensors within 5 km of Mysłowice city center). Data refreshed every 30 minutes. Mysłowice is located in one of the most polluted regions of Poland.',
  },

  // --- AedPage ---
  aedPage: {
    title: 'AED Defibrillators',
    subtitle: 'AED defibrillator network in Mysłowice',
    alert: '⚠️ In emergencies call 112',
    call112: 'Call 112',
    totalAed: 'Total AED',
    withinRange: 'Within range',
    outOfRange: 'Out of range',
    locationError: 'Could not determine your location.',
    dataError: 'Could not load AED data.',
    listTitle: 'Defibrillator list',
    popupCall: 'Call 112',
    popupDetails: 'Details',
    alertTitle: 'Sudden cardiac arrest?',
    alertSub: 'Call emergency services, find a defibrillator, start CPR',
    alertBtn: 'Call 112',
    available247: 'Available 24/7',
    publiclyAvailable: 'Publicly available',
    geoBtnText: '📍 Find nearest AED',
    geoBtnLoading: '⏳ Searching…',
    geoErrorGeneric: 'Geolocation is not supported by your browser.',
    geoErrorDenied: 'Location access denied. To find the nearest AED, enable location in your browser settings.',
    geoErrorUnavailable: 'Could not determine your location. Try again.',
    geoErrorTimeout: 'Location request timed out. Try again.',
    geoErrorDefault: 'Could not get your location. Try again.',
    dataErrorMsg: '⚠️ Could not load data. Please try again.',
    navigateBtn: 'Navigate →',
    allLocations: 'All locations',
    navigateTo: 'Navigate to',
    collapseList: '▲ Collapse',
    showAll: '▼ Show all',
    expandAria: 'Expand list',
    collapseAria: 'Collapse list',
    aedLabel: 'AED Defibrillators',
  },

  // --- WeatherPage ---
  weatherPage: {
    title: 'Weather',
    location: 'Mysłowice, Silesia',
    humidity: 'Humidity',
    wind: 'Wind',
    pressure: 'Pressure',
    cloudCover: 'Cloud cover',
    visibility: 'Visibility',
    uvIndex: 'UV Index',
    feelsLike: 'Feels like',
    source: 'Source: IMGW / Open-Meteo',
    errorFetch: 'Weather fetch error',
    errorApiKey: 'Check the OpenWeatherMap API key in the backend.',
    noData: 'No data',
    sourceText: 'Refreshing every 10 minutes. API key stored server-side.',
  },

  // --- ToiletsPage ---
  toiletsPage: {
    title: 'Public Toilets',
    subtitle: 'Public toilet map in Mysłowice',
    error: 'Could not load toilet data.',
    tip: '💡 Tip: Click a marker on the map to see details.',
    paid: 'Paid',
    free: 'Free',
    collapse: '▲ Collapse',
    showAll: 'Show all',
  },

  // --- EcoPage ---
  ecoPage: {
    title: 'Ecology & Waste',
    subtitle: 'Waste collection points and ecology in Mysłowice',
    categoryPszok: 'Waste Facility',
    categoryPharmacy: 'Pharmacies',
    categoryEwaste: 'E-waste',
    categoryTextiles: 'Textiles',
    categoryBatteries: 'Batteries',
    info: 'Info: Waste facility accepts segregated waste, e-waste, furniture, tires. Expired medications should be returned to pharmacies.',
    errorLoad: 'Failed to load data. Try again.',
    collapse: '▲ Collapse',
    showAll: 'Show all',
  },

  // --- WaterPage ---
  waterPage: {
    title: 'Water Monitoring',
    subtitle: 'River and stream levels in Mysłowice',
    level: 'Level:',
    status: 'Status:',
    listTitle: 'Monitoring station list',
    source: 'Source: IMGW / public data',
    geoBtnText: '📍 Find nearest station',
    geoBtnLoading: '⏳ Searching…',
    collapse: '▲ Collapse',
    showAll: 'Show all',
    sourceRefresh: 'Refreshed every 60 minutes.',
  },

  // --- WaterStatus (utils) ---
  waterStatus: {
    safe: 'Safe',
    warning: 'Warning',
    danger: 'Danger',
    noData: 'No data',
  },

  // --- useFetch ---
  useFetch: {
    fetchError: 'Could not fetch data:',
    timeout: 'Timeout — server not responding',
  },

  // --- useAIAssistant ---
  useAIAssistant: {
    queryTooLong: 'Query too long. Maximum 500 characters.',
    timeout: 'Timeout — server not responding. Try again.',
    commError: 'An error occurred while communicating with the assistant.',
  },

  // --- Day/Month names ---
  days: {
    sunday: 'Sunday',
    monday: 'Monday',
    tuesday: 'Tuesday',
    wednesday: 'Wednesday',
    thursday: 'Thursday',
    friday: 'Friday',
    saturday: 'Saturday',
  },
  months: {
    january: 'January',
    february: 'February',
    march: 'March',
    april: 'April',
    may: 'May',
    june: 'June',
    july: 'July',
    august: 'August',
    september: 'September',
    october: 'October',
    november: 'November',
    december: 'December',
  },
};

export type Translations = typeof pl;
