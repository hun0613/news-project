import { create } from "zustand";
import { CountryType, FilterModalType, FilterType, ScrapType } from "./types";
import { persist, createJSONStorage } from "zustand/middleware";

// 필터 모달 상태 (각 페이지 unmount 시 false로 전환)
export const useFilterModalState = create<FilterModalType>((set) => ({
  // 모달 랜더링 상태
  modalState: false,
  setModalState: (el) => {
    set((state) => ({ modalState: el }));
  },

  // 모달 클릭 여부
  modalClickState: false,
  setModalClickState: (el) => {
    set((state) => ({ modalClickState: el }));
  },
}));

// Home 필터 상태 (헤드라인, 날짜, 국가)
export const useHomeFilterStore = create<FilterType, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      // 헤드라인
      headline: "",
      setHeadLine: (el: string) => {
        set(() => ({ headline: el }));
      },

      // 날짜
      date: "",
      setDate: (el: string) => {
        set(() => ({ date: el }));
      },

      // 국가
      country: [],
      setCountry: (el: CountryType[]) => {
        set(() => ({ country: el }));
      },
    }),
    {
      name: "h_filter",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// Scrap 필터 상태 (헤드라인, 날짜, 국가)
export const useScrapFilterStore = create<FilterType, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      // 헤드라인
      headline: "",
      setHeadLine: (el) => {
        set((state) => ({ headline: el }));
      },

      // 날짜
      date: "",
      setDate: (el) => {
        set((state) => ({ date: el }));
      },

      // 국가
      country: [],
      setCountry: (el) => {
        set((state) => ({ country: el }));
      },
    }),
    {
      name: "s_filter",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

// scrap 데이터
export const useScrapStore = create<ScrapType, [["zustand/persist", unknown]]>(
  persist(
    (set) => ({
      // scrap url이 담겨있는 배열
      scrapIdArr: JSON.parse(localStorage.getItem("scrap") || "[]"),
      setScrapIdArr: (el) => {
        set((state) => ({ scrapIdArr: el }));
      },
    }),
    {
      name: "s_id",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
