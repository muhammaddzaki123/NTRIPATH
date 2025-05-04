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
    1700: {
      title: "Standar Diet Diabetes Melitus 1700 Kalori",
      meals: {
        pagi: [
          { bahan: "Nasi", berat: "100 g", urt: "1/2 gls", penukar: "1 karbo" },
          { bahan: "Daging", berat: "35 g", urt: "1 ptg sdg", penukar: "1 hewani" },
          { bahan: "Tahu", berat: "55 g", urt: "1/2 bj sdg", penukar: "1/2 nabati" }
        ],
        snackPagi: [
          { bahan: "Buah", berat: "90 g", urt: "3/4 bh bsr", penukar: "1 buah" }
        ],
        siang: [
          { bahan: "Nasi", berat: "200 g", urt: "1 1/2 gls", penukar: "2 karbo" },
          { bahan: "Ikan", berat: "40 g", urt: "1 ptg sdg", penukar: "1 hewani" },
          { bahan: "Tempe", berat: "50 g", urt: "2 ptg sdg", penukar: "1 nabati" },
          { bahan: "Sayur B", berat: "100 g", urt: "1 gls", penukar: "1 sayuran" }
        ],
        malam: [
          { bahan: "Nasi", berat: "150 g", urt: "1 gls", penukar: "1 1/2 karbo" },
          { bahan: "Ayam tanpa kulit", berat: "40 g", urt: "1 ptg bsr", penukar: "1 hewani" },
          { bahan: "Tahu", berat: "100 g", urt: "1 bj bsr", penukar: "1 nabati" },
          { bahan: "Sayur B", berat: "100 g", urt: "1 gls", penukar: "1 sayuran" }
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
          { bahan: "Bubur", berat: "200 g", urt: "1 mangkok", penukar: "1 karbo" },
          { bahan: "Telur", berat: "50 g", urt: "1 butir", penukar: "1 hewani" },
          { bahan: "Sayur Sop", berat: "100 g", urt: "1 mangkok", penukar: "1 sayuran" }
        ],
        snackPagi: [
          { bahan: "Jus Buah", berat: "200 ml", urt: "1 gelas", penukar: "1 buah" }
        ],
        siang: [
          { bahan: "Nasi Tim", berat: "200 g", urt: "1 mangkok", penukar: "2 karbo" },
          { bahan: "Ikan Tim", berat: "50 g", urt: "1 ptg sdg", penukar: "1 hewani" },
          { bahan: "Tahu Tim", berat: "50 g", urt: "1 ptg sdg", penukar: "1 nabati" },
          { bahan: "Sayur Tim", berat: "100 g", urt: "1 mangkok", penukar: "1 sayuran" }
        ],
        malam: [
          { bahan: "Bubur", berat: "200 g", urt: "1 mangkok", penukar: "1 karbo" },
          { bahan: "Ayam Tim", berat: "50 g", urt: "1 ptg sdg", penukar: "1 hewani" },
          { bahan: "Sup Sayur", berat: "150 g", urt: "1 1/2 mangkok", penukar: "1.5 sayuran" }
        ]
      }
    }
  }
};
