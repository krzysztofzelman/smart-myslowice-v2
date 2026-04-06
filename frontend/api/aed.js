const aedLocations = [
  {
    id: 1,
    name: "Mysłowickie Centrum Zdrowia – Szpital",
    address: "ul. Mikołowska 1, 41-400 Mysłowice",
    coordinates: { lat: 50.2396846, lng: 19.1373742 },
    access: "24/7",
    description: "Defibrylator przy Izbie Przyjęć szpitala",
  },
  {
    id: 2,
    name: "Urząd Miasta Mysłowice",
    address: "ul. Powstańców 1, 41-400 Mysłowice",
    coordinates: { lat: 50.2409042, lng: 19.1415714 },
    access: "Pon–Pt 7:30–17:00",
    description: "Defibrylator w holu głównym urzędu",
  },
  {
    id: 3,
    name: "MOSiR – Hala Sportowa",
    address: "ul. Bończyka 32z, 41-400 Mysłowice",
    coordinates: { lat: 50.2459527, lng: 19.1143236 },
    access: "Pon–Pt 7:00–15:00",
    description: "Defibrylator przy recepcji hali sportowej",
  },
  {
    id: 4,
    name: "Straż Miejska",
    address: "ul. Strażacka 7, 41-400 Mysłowice",
    coordinates: { lat: 50.2400854, lng: 19.1428678 },
    access: "Codziennie 6:00–22:00",
    description: "Defibrylator w siedzibie Straży Miejskiej",
  },
  {
    id: 5,
    name: "Biblioteka Miejska – Filia Brzezinka",
    address: "ul. Laryska 5, 41-404 Mysłowice",
    coordinates: { lat: 50.2039125, lng: 19.1571627 },
    access: "Pon–Pt 10:00–18:00",
    description: "Defibrylator w holu biblioteki",
  },
  {
    id: 6,
    name: "Dworzec PKP Mysłowice",
    address: "Dworzec PKP, 41-400 Mysłowice",
    coordinates: { lat: 50.237775, lng: 19.1406167 },
    access: "24/7",
    description: "Defibrylator na głównym holu dworca",
  },
  {
    id: 7,
    name: "Szpital nr 2 im. dr. T. Boczonia",
    address: "ul. Bytomska 41, 41-400 Mysłowice",
    coordinates: { lat: 50.2471739, lng: 19.1330167 },
    access: "24/7",
    description: "Defibrylator przy Izbie Przyjęć i SOR",
  },
];

export default function handler(req, res) {
  res.status(200).json(aedLocations);
}
