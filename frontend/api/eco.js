const ecoPoints = [
  {
    id: 1,
    name: "PSZOK – Punkt Selektywnej Zbiórki",
    address: "ul. Przemysłowa 1",
    access: "Pon–Pt 8–16, Sob 9–13",
    accepts: "Meble, AGD, elektronika, opony, baterie, farby, chemia",
  },
  {
    id: 2,
    name: "Zbiórka Baterii – Urząd Miasta",
    address: "ul. Powstańców 1",
    access: "Pon–Pt 7:30–17:00",
    accepts: "Baterie",
  },
  {
    id: 3,
    name: "Zbiórka Baterii – Biblioteka",
    address: "ul. Laryska 5",
    access: "Pon–Pt 10–18",
    accepts: "Baterie",
  },
  {
    id: 4,
    name: "Punkt Tekstyliów – Kaufland",
    address: "ul. Bytomska (parking Kaufland)",
    access: "24/7",
    accepts: "Tekstylia, ubrania",
  },
];

export default function handler(req, res) {
  res.status(200).json(ecoPoints);
}
