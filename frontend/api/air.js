const airSensors = [
  {
    id: 1,
    name: "MOSiR – Bończyka",
    address: "ul. Bończyka 32z",
    pm25: 18,
    quality: "good",
  },
  {
    id: 2,
    name: "Park Słupna",
    address: "Park Słupna",
    pm25: 22,
    quality: "good",
  },
  {
    id: 3,
    name: "Urząd Miasta",
    address: "ul. Powstańców 1",
    pm25: 35,
    quality: "moderate",
  },
  {
    id: 4,
    name: "Brzezinka – Biblioteka",
    address: "ul. Laryska 5",
    pm25: 20,
    quality: "good",
  },
  {
    id: 5,
    name: "Bytomska 37",
    address: "ul. Bytomska 37",
    pm25: 28,
    quality: "moderate",
  },
  {
    id: 6,
    name: "Brzozowa",
    address: "ul. Brzozowa",
    pm25: 19,
    quality: "good",
  },
];

export default function handler(req, res) {
  res.status(200).json(airSensors);
}
