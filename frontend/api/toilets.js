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
];

export default function handler(req, res) {
  res.status(200).json(toilets);
}
