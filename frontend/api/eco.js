const ecoPoints = [
  {
    id: 1,
    name: 'PSZOK Mysłowice Północ',
    type: 'PSZOK',
    address: 'Karola Miarki 38, 41-400 Mysłowice',
    hours: 'Pon-Pt 12:00-20:00, Sob 8:00-16:00',
    phone: '32 222 22 18, 32 222 22 19',
    accepts: 'Papier, metale, tworzywa sztuczne, szkło, odpady opakowaniowe wielomateriałowe, bioodpady, odpady niebezpieczne, przeterminowane leki i chemikalia, odpady medyczne (igły i strzykawki z domowego użytku), zużyte baterie i akumulatory, zużyty sprzęt elektryczny i elektroniczny (AGD, elektronika), meble i odpady wielkogabarytowe, zużyte opony, odpady budowlane i rozbiórkowe (gruz), tekstylia i odzież',
    coordinates: { lat: 50.23073471730748, lng: 19.134723086506078 }
  },
  {
    id: 2,
    name: 'PSZOK Mysłowice Południe',
    type: 'PSZOK',
    address: 'Piaskowa, 41-404 Mysłowice',
    hours: 'Pon-Pt 8:00-16:00',
    phone: '882 682 983',
    accepts: 'Papier, metale, tworzywa sztuczne, szkło, odpady opakowaniowe wielomateriałowe, bioodpady, odpady niebezpieczne, przeterminowane leki i chemikalia, odpady medyczne (igły i strzykawki z domowego użytku), zużyte baterie i akumulatory, zużyty sprzęt elektryczny i elektroniczny (AGD, elektronika), meble i odpady wielkogabarytowe, zużyte opony, odpady budowlane i rozbiórkowe (gruz), tekstylia i odzież',
    coordinates: { lat: 50.2015855831223, lng: 19.17731519815247 }
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
