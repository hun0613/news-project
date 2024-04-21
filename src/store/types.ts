export interface FilterModalType {
  // 모달 랜더링 여부
  modalState: boolean;
  setModalState: (el: boolean) => void;

  // 모달 클릭 여부
  modalClickState: boolean;
  setModalClickState: (el: boolean) => void;
}

export interface CountryType {
  ctyId: number;
  ctyCd: string;
  ctyNm: string;
}

export interface FilterType {
  // 헤드라인
  headline: string;
  setHeadLine: (el: string) => void;

  // 날짜
  date: string;
  setDate: (el: string) => void;

  // 국가
  country: CountryType[];
  setCountry: (el: CountryType[]) => void;
}

export interface ScrapType {
  // scrap id 배열
  scrapIdArr: string[];
  setScrapIdArr: (el: string[]) => void;
}
