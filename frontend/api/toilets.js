const toilets = [
  {
    id: 1,
    name: "Toaleta – Dworzec PKP",
    address: "Dworzec PKP, 41-400 Mysłowice",
    access: "24/7",
    paid: true,
  },
  {
    id: 2,
    name: "Toaleta – Urząd Miasta",
    address: "ul. Powstańców 1",
    access: "Pon–Pt 7:30–17:00",
    paid: false,
  },
  {
    id: 3,
    name: "Toaleta – MOSiR",
    address: "ul. Bończyka 32z",
    access: "Godz. otwarcia",
    paid: false,
  },
  {
    id: 4,
    name: "Toaleta – Kaufland",
    address: "ul. Fryderyka Chopina 1, 41-400 Mysłowice",
    access: "Pon–Sob 6:00–22:00, Nd 8:00–20:00",
    paid: false,
  },
  {
    id: 5,
    name: "Toaleta – Stacja BP Magnolia",
    address: "ul. Katowicka, 41-400 Mysłowice",
    access: "24/7",
    paid: false,
  },
  {
    id: 6,
    name: "Toaleta – Stacja Orlen",
    address: "ul. Oświęcimska 50, 41-400 Mysłowice",
    access: "24/7",
    paid: false,
  },
  {
    id: 7,
    name: "Toaleta – Stacja Shell",
    address: "ul. Katowicka 45, 41-400 Mysłowice",
    access: "24/7",
    paid: false,
  },
  {
    id: 8,
    name: "Toaleta – Stacja Orlen",
    address: "ul. Katowicka, 41-400 Mysłowice",
    access: "24/7",
    paid: false,
  },
];

export default function handler(req, res) {
  res.status(200).json(toilets);
}
