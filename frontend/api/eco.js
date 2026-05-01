export default function handler(req, res) {
  res.json([
    {
      id: 1,
      name: "PSZOK Mysłowice Północ",
      address: "ul. Karola Miarki 38, 41-400 Mysłowice",
      hours: "Pon-Pt 12:00-20:00, Sob 8:00-16:00",
      phone: "32 222 22 18",
      accepts: "Meble, AGD, elektronika, opony, baterie, farby, chemia, gruz, tekstylia",
    },
    {
      id: 2,
      name: "PSZOK Mysłowice Południe",
      address: "ul. Piaskowa, 41-400 Mysłowice",
      hours: "Pon-Pt 8:00-16:00",
      phone: "882 682 983",
      accepts: "Meble, AGD, elektronika, opony, baterie, farby, chemia, gruz, tekstylia",
    },
  ]);
}
