export type FoodRestriction = {
  name: string;
  maxAmount: number;
  unit: string;
};

export type DiseaseRestrictions = {
  [key: string]: FoodRestriction[];
};

export const foodRestrictions: DiseaseRestrictions = {
  hipertensi: [
    { name: "garam", maxAmount: 1, unit: "sendok teh" },
    { name: "daging sapi", maxAmount: 2, unit: "potong sedang" },
    { name: "abon", maxAmount: 3, unit: "sendok makan" },
    { name: "daging goreng", maxAmount: 2, unit: "potong sedang" },
    { name: "rawon", maxAmount: 2, unit: "potong sedang" },
    { name: "daging kambing", maxAmount: 2, unit: "potong sedang" },
    { name: "bebek", maxAmount: 2, unit: "potong sedang" },
    { name: "olahan daging", maxAmount: 2, unit: "potong sedang" },
    { name: "dendeng sapi", maxAmount: 2, unit: "potong sedang" },
    { name: "jeroan sapi", maxAmount: 2, unit: "potong sedang" },
    { name: "daging ayam", maxAmount: 2, unit: "potong sedang" },
    { name: "ayam goreng", maxAmount: 2, unit: "potong sedang" },
    { name: "opor ayam", maxAmount: 2, unit: "potong sedang" },
    { name: "kulit ayam", maxAmount: 2, unit: "sendok makan" },
    { name: "olahan ayam", maxAmount: 2, unit: "potong sedang" },
    { name: "ikan laut", maxAmount: 2, unit: "potong sedang" },
    { name: "ikan asin", maxAmount: 2, unit: "potong sedang" },
    { name: "ikan kaleng", maxAmount: 2, unit: "potong sedang" },
    { name: "ikan teri", maxAmount: 2, unit: "sendok makan" },
    { name: "ikan pindang", maxAmount: 2, unit: "potong sedang" }
  ],
  kanker: [
    { name: "sate rembiga", maxAmount: 2, unit: "biji" },
    { name: "mayonaise", maxAmount: 2, unit: "biji" },
    { name: "dendeng sasak", maxAmount: 2, unit: "potong" },
    { name: "ayam taliwang", maxAmount: 1, unit: "potong" },
    { name: "beberok terong", maxAmount: 2, unit: "sendok makan" },
    { name: "plecing kangkung", maxAmount: 3, unit: "sendok makan" },
    { name: "ikan asin sepat", maxAmount: 2, unit: "potong" },
    { name: "ikan teri", maxAmount: 2, unit: "sendok makan" },
    { name: "abon sapi kemasan", maxAmount: 2, unit: "sendok makan" },
    { name: "kornet sapi kalengan", maxAmount: 1, unit: "sendok makan" },
    { name: "sosis kemasan", maxAmount: 2, unit: "biji" },
    { name: "nugget ayam", maxAmount: 2, unit: "potong" },
    { name: "ikan asap", maxAmount: 1, unit: "potong" }
  ],
  diabetes: [
    { name: "nasi putih", maxAmount: 2, unit: "centong" },
    { name: "roti", maxAmount: 2, unit: "potong" },
    { name: "gula pasir", maxAmount: 2, unit: "sendok teh" },
    { name: "es krim", maxAmount: 1, unit: "cup" },
    { name: "cake", maxAmount: 1, unit: "potong" },
    { name: "pisang goreng", maxAmount: 2, unit: "buah" },
    { name: "sirup", maxAmount: 1, unit: "sendok makan" },
    { name: "soda", maxAmount: 1, unit: "gelas" },
    { name: "coklat", maxAmount: 1, unit: "batang" },
    { name: "permen", maxAmount: 2, unit: "buah" },
    { name: "donat", maxAmount: 1, unit: "buah" }
  ]
};
