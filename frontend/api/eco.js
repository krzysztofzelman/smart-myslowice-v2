const ecoPoints = [
  {
    id: 1,
    name: 'ZOMM Mysłowice - PSZOK Północ',
    type: 'PSZOK',
    address: 'ul. Miarki, Mysłowice',
    hours: 'Pon-Sob 8:00-18:00',
    phone: '',
    accepts: 'elektrośmieci, meble, gruz, opony, tekstylia',
    coordinates: { lat: 50.230722, lng: 19.134722 }
  },
  {
    id: 2,
    name: 'ZOMM Mysłowice - PSZOK Południe',
    type: 'PSZOK',
    address: 'ul. Piaskowa, Mysłowice',
    hours: 'Pon-Sob 8:00-18:00',
    phone: '',
    accepts: 'elektrośmieci, meble, gruz, opony, tekstylia',
    coordinates: { lat: 50.201583, lng: 19.177315 }
  },
  {
    id: 3,
    name: 'Apteki w Mysłowicach',
    type: 'Apteki',
    address: 'różne lokalizacje w mieście',
    hours: 'godziny otwarcia aptek',
    phone: '—',
    accepts: 'Przeterminowane leki (tabletki, syropy, maści itp.) oraz termometry rtęciowe — można oddać w każdej aptece na terenie Mysłowic',
    coordinates: undefined
  }
];

export default async function handler(req, res) {
  res.status(200).json(ecoPoints);
}
