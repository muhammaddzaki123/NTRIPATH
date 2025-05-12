interface Meal {
  bahan: string;
  berat: string;
  urt: string;
  penukar: string;
}

interface MealPlan {
  title: string;
  meals: {
    pagi: Meal[];
    snackPagi?: Meal[];
    siang: Meal[];
    snackSiang?: Meal[];
    malam: Meal[];
  };
}

interface DietPlansByCalories {
  [calories: number]: MealPlan;
}

interface DietPlans {
  [disease: string]: DietPlansByCalories;
}

export const DIET_PLANS: DietPlans = {
  Diabetes: {
    1100: {
      title: "Standar Diet Diabetes 1100 Kalori",
      meals: {
        pagi: [
          { bahan: "Karbohidrat", berat: "50 gram", urt: "1/2 gls", penukar: "1 karbohidrat" },
          { bahan: "Hewani", berat: "35 gram", urt: "1 ptg sedang", penukar: "1 hewani" },
          { bahan: "Sayuran A", berat: "55 gram", urt: "1/2 gls", penukar: "1/2 sayuran" },
          { bahan: "Minyak", berat: "10 gram", urt: "1 sdt", penukar: "1 minyak" },
          { bahan: "Buah", berat: "90 gram", urt: "1 bh bsr", penukar: "1 buah" }
        ],
        siang: [
          { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 karbohidrat" },
          { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdng", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "50 gram", urt: "1 ptg sdg", penukar: "1 Nabati" },
          { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "1 sayuran" },
          { bahan: "Buah", berat: "110 gram", urt: "1 bh", penukar: "1 buah" },
          { bahan: "Minyak", berat: "5 gram", urt: "1 sdt", penukar: "1 minyak" }
        ],
        malam: [
          { bahan: "Karbohidrat", berat: "50 gram", urt: "1/2 gls", penukar: "1/2 karbohidrat" },
          { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdg", penukar: "1 hewani" },
          { bahan: "Nabati", berat: "110 gram", urt: "1 bj bsr", penukar: "1 nabati" },
          { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "1 sayuran" },
          { bahan: "Buah", berat: "110 gram", urt: "1 ptg bsr", penukar: "1 buah" }
        ]
      }
    },
    1300: {
      title: "Standar Diet Diabetes 1300 Kalori",
      meals: {
        pagi: [
          { bahan: "Karbohidrat", berat: "100 gram", urt: "1 gls", penukar: "1 karbohidrat" },
          { bahan: "Hewani", berat: "35 gram", urt: "1 ptg sedang", penukar: "1 hewani" },
          { bahan: "Sayran A", berat: "55 gram", urt: "1/2 gls", penukar: "1/2 Sayran"},
          { bahan: "Minyak", berat: "5 gram", urt: "1 sdt", penukar: "1 minyak" },
          { bahan: "Buah", berat: "90 gram", urt: "1 bh bsr", penukar: "1 Buah" }
        ],
        siang: [
          { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 karbohidrat" },
          { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdng", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "50 gram", urt: "1 ptg sdg", penukar: "1 Nabati" },
          { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "Sayur Asem" },
          { bahan: "Buah", berat: "110 gram", urt: "1 bh", penukar: "1 Buah" }
        ],
        malam: [
          { bahan: "Karbohidrat", berat: "100 gram", urt: "1 gls", penukar: "1 karbohidrat" },
          { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdg", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "110 gram", urt: "1 bj bsr", penukar: "1 Nabati" },
          { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "Bening labu siam" },
          { bahan: "Buah", berat: "110 gram", urt: "1 ptg bsr", penukar: "Pepaya" }
        ]
      }
    },
    1500: {
      title: "Standar Diet Diabetes 1500 Kalori",
      meals: {
        pagi: [
          { bahan: "Karbohidrat", berat: "100 gram", urt: "1 gls", penukar: "1 karbohidrat" },
          { bahan: "Hewani", berat: "35 gram", urt: "1 ptg sedang", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "25 gram", urt: "1/2 ptg sdg", penukar: "1/2 Nabati" },
          { bahan: "Sayran A", berat: "50 gram", urt: "1/2 gls", penukar: "1/2 Sayran A "},
          { bahan: "Minyak", berat: "5 gram", urt: "1 sdt", penukar: "1 Minyak" }
        ],
        siang: [
          { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 Karbohidrat" },
          { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdng", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "110 gram", urt: "1 bj besar", penukar: "1 Nabati" },
          { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "Sayur Asem" },
          { bahan: "Buah", berat: "110 gram", urt: "1 bh", penukar: "1 Buah" }
        ],
        malam: [
          { bahan: "Karbohidrat", berat: "100 gram", urt: "1 gls", penukar: "1 Karbohidrat" },
          { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdg", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "110 gram", urt: "1 bj bsr", penukar: "1 Nabati" },
          { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "Bening labu siam" },
          { bahan: "Buah", berat: "110 gram", urt: "1 ptg bsr", penukar: "Pepaya" }
        ]
      }
    },
    1700: {
      title: "Standar Diet Diabetes 1700 Kalori",
      meals: {
        pagi: [
          { bahan: "Nasi", berat: "100 gram", urt: "1 gls", penukar: "1 Karbohidrat" },
          { bahan: "Hewani", berat: "35 gram", urt: "1 ptg sedang", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "55 gram", urt: "1/2 bj sdg", penukar: "1/2 Nabati" },
          { bahan: "Minyak", berat: "5 gram", urt: "1 sdt", penukar: "1 Minyak" }
        ],
        siang: [
          { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 Karbohidrat" },
          { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdng", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "50 gram", urt: "1 ptg sdg", penukar: "1 Nabati" },
          { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "Sayur Asem" },
          { bahan: "Buah", berat: "110 gram", urt: "1 bh", penukar: "1 Buah" }
        ],
        malam: [
          { bahan: "Karbohidrat", berat: "150 gram", urt: "1 1/2 gls", penukar: "1 1/2 Karbohidrat" },
          { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdg", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "110 gram", urt: "1 bj bsr", penukar: "1 Nabati" },
          { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "Tumis Buncis" },
          { bahan: "Buah", berat: "110 gram", urt: "1 ptg bsr", penukar: "Pepaya" }
        ]
      }
    },
    1900: {
      title: "Standar Diet Diabetes 1900 Kalori",
      meals: {
        pagi: [
          { bahan: "Nasi", berat: "100 gram", urt: "1 gls", penukar: "1 karbohidrat" },
          { bahan: "Hewani", berat: "35 gram", urt: "1 ptg sedang", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "55 gram", urt: "1/2 bj sdg", penukar: "1/2 Nabati" },
          { bahan: "Minyak", berat: "10 gram", urt: "2 sdt", penukar: "2 Minyak" }
        ],
        siang: [
          { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 Karbohidrat" },
          { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdng", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "110 gram", urt: "1 bj besar", penukar: "1 Nabati" },
          { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "Sayur Asem" },
          { bahan: "Buah", berat: "110 gram", urt: "1 bh", penukar: "1 Buah" }
        ],
        malam: [
          { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 Karbohidrat" },
          { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdg", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "110 gram", urt: "1 bj besar", penukar: "1 Nabati" },
          { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "Bening Labu Siam" },
          { bahan: "Buah", berat: "110 gram", urt: "2 ptg bsr", penukar: "2 Buah" }
        ]
      }
    },
    2100: {
      title: "Standar Diet Diabetes 2100 Kalori",
      meals: {
        pagi: [
          { bahan: "Karbohidrat", berat: "150 gram", urt: "1 1/2 gls", penukar: "1 1/2 Karbohidrat" },
          { bahan: "Hewani", berat: "35 gram", urt: "1 ptg sedang", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "25 gram", urt: "1 ptg sdg", penukar: "1 Nabati" },
          { bahan: "Sayran A", berat: "50 gram", urt: "1/2 gls", penukar: "1/2 Sayran A"},
          { bahan: "Minyak", berat: "10 gram", urt: "2 sdt", penukar: "2 Minyak" }
        ],
        siang: [
          { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 Karbohidrat" },
          { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdng", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "110 gram", urt: "1 bj besar", penukar: "1 Nabati" },
          { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "Sayur Asem" },
          { bahan: "Buah", berat: "110 gram", urt: "1 bh", penukar: "1 Buah" }
        ],
        malam: [
          { bahan: "Karbohidrat", berat: "200 gram", urt: "2 gls", penukar: "2 Karbohidrat" },
          { bahan: "Hewani", berat: "40 gram", urt: "1 ptg sdg", penukar: "1 Hewani" },
          { bahan: "Nabati", berat: "110 gram", urt: "1 bj bsr", penukar: "1 Nabati" },
          { bahan: "Sayur B", berat: "100 gram", urt: "1 gls", penukar: "Bening Labu Siam" },
          { bahan: "Buah", berat: "110 gram", urt: "2 ptg bsr", penukar: "2 Buah" }
        ]
      }
    }
  },
  Hipertensi: {
    1700: {
      title: "Standar Diet Hipertensi 1700 Kalori",
      meals: {
        pagi: [
          { bahan: "Nasi", berat: "100 g", urt: "1/2 gls", penukar: "1 karbo" },
          { bahan: "Telur", berat: "50 g", urt: "1 butir", penukar: "1 hewani" },
          { bahan: "Sayur", berat: "100 g", urt: "1 mangkok", penukar: "1 sayuran" }
        ],
        snackPagi: [
          { bahan: "Buah", berat: "100 g", urt: "1 buah sedang", penukar: "1 buah" }
        ],
        siang: [
          { bahan: "Nasi", berat: "200 g", urt: "1 gls", penukar: "2 karbo" },
          { bahan: "Ikan", berat: "35 g", urt: "1 ptg sdg", penukar: "1 hewani" },
          { bahan: "Tahu", berat: "50 g", urt: "1 ptg sdg", penukar: "1 nabati" },
          { bahan: "Sayur", berat: "150 g", urt: "1 1/2 mangkok", penukar: "1.5 sayuran" }
        ],
        malam: [
          { bahan: "Nasi", berat: "150 g", urt: "3/4 gls", penukar: "1.5 karbo" },
          { bahan: "Daging Ayam", berat: "35 g", urt: "1 ptg sdg", penukar: "1 hewani" },
          { bahan: "Tempe", berat: "50 g", urt: "1 ptg sdg", penukar: "1 nabati" },
          { bahan: "Sayur", berat: "100 g", urt: "1 mangkok", penukar: "1 sayuran" }
        ]
      }
    }
  },

  Kanker: {
    1700: {
      title: "Standar Diet Kanker 1700 Kalori",
      meals: {
        pagi: [
          { bahan: "Karbohidrat", berat: "1 1/2", urt: "1 sdk nasi", penukar: "1 karbo" },
          { bahan: "Protein hewani", berat: "1 1/2", urt: "1 potong sedang", penukar: "1 hewani" },
          { bahan: "Protein Nabati", berat: "1", urt: "2 sdm", penukar: "1 nabati" },
          { bahan: "Sayuran", berat: "1", urt: "1 sndk sayur", penukar: "1 sayuran" },
          { bahan: "Buah Segar", berat: "1", urt: "1 bh", penukar: "1 buah" },
          { bahan: "Air Mineral", berat: "1", urt: "1 btl", penukar: "1 air mineral" }
        ],
        snackPagi: [
          { bahan: "Selingan", berat: "1", urt: "1 mangkok", penukar: "1 snack" }
        ],
        siang: [
          { bahan: "Karbohidrat", berat: "1 1/2", urt: "1 sdk nasi", penukar: "2 karbo" },
          { bahan: "Protein hewani", berat: "1 1/2", urt: "1 potong sedang", penukar: "1 hewani" },
          { bahan: "Protein Nabati", berat: "1", urt: "1 potong sdg", penukar: "1 nabati" },
          { bahan: "Sayuran", berat: "1", urt: "1 sndk sayur", penukar: "1 sayuran" },
          { bahan: "Buah Segar", berat: "1", urt: "2 ptg sdg", penukar: "1 buah" },
          { bahan: "Air Mineral", berat: "1", urt: "1 btl", penukar: "1 air mineral" }
        ],
        malam: [
          { bahan: "Karbohidrat", berat: "1 1/2", urt: "1 sdk nasi", penukar: "1 1/2 karbo" },
          { bahan: "Protein hewani", berat: "1 1/2", urt: "1 btr", penukar: "1 hewani" },
          { bahan: "Protein Nabati", berat: "1", urt: "1 potong sdg", penukar: "1 nabati" },
          { bahan: "Sayuran", berat: "1", urt: "1 sndk sayur", penukar: "1 sayuran" },
          { bahan: "Buah Segar", berat: "1", urt: "2 ptg sdg", penukar: "1 buah" },
          { bahan: "Air Mineral", berat: "1", urt: "1 btl", penukar: "1 air mineral" }
        ]
      }
    },
    1900: {
      title: "Standar Diet Kanker 1900 Kalori",
      meals: {
        pagi: [
          { bahan: "Karbohidrat", berat: "1 1/2", urt: "1 sdk nasi", penukar: "1 karbo" },
          { bahan: "Protein hewani", berat: "1 1/2", urt: "1 potong sedang", penukar: "1 hewani" },
          { bahan: "Protein Nabati", berat: "1", urt: "2 potong sdg", penukar: "1 nabati" },
          { bahan: "Sayuran", berat: "1", urt: "1 sndk sayur", penukar: "1 sayuran" },
          { bahan: "Buah Segar", berat: "1", urt: "1 bh", penukar: "1 buah" },
          { bahan: "Air Mineral", berat: "1", urt: "1 btl", penukar: "1 air mineral" }
        ],
        snackPagi: [
          { bahan: "Selingan", berat: "1", urt: "1 cup sdg", penukar: "1 snack" }
        ],
        siang: [
          { bahan: "Karbohidrat", berat: "1 1/2", urt: "1 sdk nasi", penukar: "2 karbo" },
          { bahan: "Protein hewani", berat: "1 1/2", urt: "1 potong sedang", penukar: "1 hewani" },
          { bahan: "Protein Nabati", berat: "1", urt: "1 potong sdg", penukar: "1 nabati" },
          { bahan: "Sayuran", berat: "1", urt: "1 sndk sayur", penukar: "1 sayuran" },
          { bahan: "Buah Segar", berat: "1", urt: "2 bh", penukar: "1 buah" },
          { bahan: "Air Mineral", berat: "1", urt: "1 btl", penukar: "1 air mineral" }
        ],
        malam: [
          { bahan: "Karbohidrat", berat: "1 1/2", urt: "1 sdk nasi", penukar: "1 1/2 karbo" },
          { bahan: "Protein hewani", berat: "1 1/2", urt: "1 btr", penukar: "1 hewani" },
          { bahan: "Protein Nabati", berat: "1", urt: "1 potong sdg", penukar: "1 nabati" },
          { bahan: "Sayuran", berat: "1", urt: "1 sndk sayur", penukar: "1 sayuran" },
          { bahan: "Buah Segar", berat: "1", urt: "2 ptg sdg", penukar: "1 buah" },
          { bahan: "Air Mineral", berat: "1", urt: "1 btl", penukar: "1 air mineral" }
        ]
      }
    },
    2100: {
      title: "Standar Diet Kanker 2100 Kalori",
      meals: {
        pagi: [
          { bahan: "Karbohidrat", berat: "1 1/2", urt: "1 sdk nasi", penukar: "1 karbo" },
          { bahan: "Protein hewani", berat: "1", urt: "1 btr", penukar: "1 hewani" },
          { bahan: "Protein Nabati", berat: "1", urt: "1 ptg sdg", penukar: "1 nabati" },
          { bahan: "Sayuran", berat: "1", urt: "1 sndk sayur", penukar: "1 sayuran" },
          { bahan: "Buah Segar", berat: "1", urt: "1 bh", penukar: "1 buah" },
          { bahan: "Air Mineral", berat: "1", urt: "1 btl", penukar: "1 air mineral" }
        ],
        snackPagi: [
          { bahan: "Selingan", berat: "1", urt: "1 bh", penukar: "1 snack" }
        ],
        siang: [
          { bahan: "Karbohidrat", berat: "1 1/2", urt: "1 sdk nasi", penukar: "2 karbo" },
          { bahan: "Protein hewani", berat: "1 1/2", urt: "2 potong sedang", penukar: "1 hewani" },
          { bahan: "Protein Nabati", berat: "1", urt: "1 potong sdg", penukar: "1 nabati" },
          { bahan: "Sayuran", berat: "1", urt: "1 sndk sayur", penukar: "1 sayuran" },
          { bahan: "Buah Segar", berat: "1", urt: "1 bh", penukar: "1 buah" },
          { bahan: "Air Mineral", berat: "1", urt: "1 btl", penukar: "1 air mineral" }
        ],
        malam: [
          { bahan: "Karbohidrat", berat: "1 1/2", urt: "1 sdk nasi", penukar: "1 1/2 karbo" },
          { bahan: "Protein hewani", berat: "1 1/2", urt: "1 ptg sdg", penukar: "1 hewani" },
          { bahan: "Protein Nabati", berat: "1", urt: "1 sndk sayur", penukar: "1 nabati" },
          { bahan: "Sayuran", berat: "1", urt: "1 sndk sayur", penukar: "1 sayuran" },
          { bahan: "Buah Segar", berat: "1", urt: "2 ptg sdg", penukar: "1 buah" },
          { bahan: "Air Mineral", berat: "1", urt: "1 btl", penukar: "1 air mineral" }
        ]
      }
    },
    2300: {
      title: "Standar Diet Kanker 2300 Kalori",
      meals: {
        pagi: [
          { bahan: "Karbohidrat", berat: "1 1/2", urt: "1 sdk nasi", penukar: "1 karbo" },
          { bahan: "Protein hewani", berat: "1", urt: "1 btr", penukar: "1 hewani" },
          { bahan: "Protein Nabati", berat: "1", urt: "2 potong sdg", penukar: "1 nabati" },
          { bahan: "Sayuran", berat: "1", urt: "2 sdm", penukar: "1 sayuran" },
          { bahan: "Buah Segar", berat: "1", urt: "1 bh", penukar: "1 buah" },
          { bahan: "Air Mineral", berat: "1", urt: "1 btl", penukar: "1 air mineral" }
        ],
        snackPagi: [
          { bahan: "Selingan", berat: "1", urt: "1 bh", penukar: "1 snack" }
        ],
        siang: [
          { bahan: "Karbohidrat", berat: "1 1/2", urt: "1 sdk nasi", penukar: "2 karbo" },
          { bahan: "Protein hewani", berat: "1 1/2", urt: "2 potong sedang", penukar: "1 hewani" },
          { bahan: "Protein Nabati", berat: "1", urt: "1 potong sdg", penukar: "1 nabati" },
          { bahan: "Sayuran", berat: "1", urt: "1 sndk sayur", penukar: "1 sayuran" },
          { bahan: "Buah Segar", berat: "1", urt: "2 ptg sdg", penukar: "1 buah" },
          { bahan: "Air Mineral", berat: "1", urt: "1 btl", penukar: "1 air mineral" }
        ],
        malam: [
          { bahan: "Karbohidrat", berat: "1 1/2", urt: "1 sdk nasi", penukar: "1 1/2 karbo" },
          { bahan: "Protein hewani", berat: "1 1/2", urt: "1 ptg sdg", penukar: "1 hewani" },
          { bahan: "Protein Nabati", berat: "1", urt: "1 sndk sayur", penukar: "1 nabati" },
          { bahan: "Sayuran", berat: "1", urt: "1 sndk sayur", penukar: "1 sayuran" },
          { bahan: "Buah Segar", berat: "1", urt: "2 ptg sdg", penukar: "1 buah" },
          { bahan: "Air Mineral", berat: "1", urt: "1 btl", penukar: "1 air mineral" }
        ]
      }
    }
  }


};
