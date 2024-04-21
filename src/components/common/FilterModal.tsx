import styled from "styled-components";
import { CountryType } from "../../store/types";
import CountryBox from "./CountryBox";
import { useFilterModalState, useHomeFilterStore, useScrapFilterStore } from "../../store/store";
import useExchageDateFormat from "../../hooks/useExchangeDateFormat";
import { useEffect, useState } from "react";

const BackgroundWrapper = styled.div`
  position: fixed;
  /* top: 0; */
  max-width: 560px; /* 데스크탑일 경우 width 제한 (560px 이내는 반응형) */
  width: 100vw;
  height: 100vh;
  background-color: rgb(0, 0, 0, 0.5);

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;

  z-index: 999;
`;

const ModalContainer = styled.div`
  width: 100%;
  height: fit-content;
  border-radius: 16px;
  background: #ffffff;
  padding: 20px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const HeadLineSection = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  margin-bottom: 40px;

  > h3 {
    font-family: AppleSDGothicNeo;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    opacity: 100%;

    margin-bottom: 8px;
  }

  > input {
    width: 100%;
    outline: none;

    border-radius: 8px;
    border: 1px solid #c4c4c4;
    padding: 10px 20px;

    font-family: AppleSDGothicNeo;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
  }
`;

const DateSection = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  margin-bottom: 40px;

  > h3 {
    font-family: AppleSDGothicNeo;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    opacity: 100%;

    margin-bottom: 8px;
  }

  > input[type="date"] {
    width: 100%;
    outline: none;
    position: relative;
    background: url(images/date_icon.png) no-repeat right 20px center / 16px auto;

    border-radius: 8px;
    border: 1px solid #c4c4c4;
    padding: 10px 20px;

    font-family: AppleSDGothicNeo;
    font-size: 14px;
    font-weight: 400;
    color: #000000;
  }

  > input[type="date"]::-webkit-clear-button,
  input[type="date"]::-webkit-inner-spin-button {
    display: none;
  }

  > input[type="date"]::-webkit-calendar-picker-indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: transparent;
    color: transparent;
    cursor: pointer;
  }
`;

const CountrySection = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;

  margin-bottom: 40px;

  > h3 {
    font-family: AppleSDGothicNeo;
    font-size: 16px;
    font-weight: 600;
    color: #000000;
    opacity: 100%;

    margin-bottom: 8px;
  }

  > section {
    width: 100%;
    height: fit-content;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: start;
    align-items: center;
  }
`;

const ApplyBtn = styled.button`
  width: 100%;
  height: fit-content;
  padding: 18px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  background: #3478f6;
  border-radius: 16px;
  border: 0px solid transparent;

  font-family: AppleSDGothicNeo;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;

  cursor: pointer;
`;

// 국가 체크박스 리스트
const CountryDataArray: CountryType[] = [
  {
    ctyId: 1,
    ctyCd: "SOUTH KOREA",
    ctyNm: "대한민국",
  },
  {
    ctyId: 2,
    ctyCd: "CHINA",
    ctyNm: "중국",
  },
  {
    ctyId: 3,
    ctyCd: "JAPAN",
    ctyNm: "일본",
  },
  {
    ctyId: 4,
    ctyCd: "UNITED STATES",
    ctyNm: "미국",
  },
  {
    ctyId: 5,
    ctyCd: "NORTH KOREA",
    ctyNm: "북한",
  },
  {
    ctyId: 6,
    ctyCd: "RUSSIA",
    ctyNm: "러시아",
  },
  {
    ctyId: 7,
    ctyCd: "FRANCH",
    ctyNm: "프랑스",
  },
  {
    ctyId: 8,
    ctyCd: "ENGLAND",
    ctyNm: "영국",
  },
];

const FilterModal = () => {
  const pathName = window.location.pathname;

  // 필터 모달 랜더링 제어 상태
  const { setModalState, setModalClickState } = useFilterModalState();

  // Home 필터 전역상태
  const {
    headline: headlineH,
    setHeadLine: setHeadLineH,
    date: dateH,
    setDate: setDateH,
    country: countryH,
    setCountry: setCountryH,
  } = useHomeFilterStore();

  // Scrap 필터 전역상태
  const {
    headline: headlineS,
    setHeadLine: setHeadLineS,
    date: dateS,
    setDate: setDateS,
    country: countryS,
    setCountry: setCountryS,
  } = useScrapFilterStore();

  // 필터 적용 전 필터 별 상태
  const [headLine, setHeadLine] = useState<string>(pathName === "/" ? headlineH : headlineS);
  const [date, setDate] = useState<string>(pathName === "/" ? dateH : dateS);
  const [country, setCountry] = useState<CountryType[]>(pathName === "/" ? countryH : countryS);

  const handleClickApplyBtn = () => {
    // 모달 닫기
    setModalState(false);
    setModalClickState(true);
    // 여기서 전역상태 변경 -> useEffect dependency array를 통해 refetch
    if (pathName === "/") {
      setHeadLineH(headLine);
      setDateH(date);
      setCountryH(country.sort((a, b) => a.ctyId - b.ctyId));
    } else {
      setHeadLineS(headLine);
      setDateS(date);
      setCountryS(country.sort((a, b) => a.ctyId - b.ctyId));
    }
  };

  const handleChangeHeadLine = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHeadLine(e.target.value);
  };

  const handleChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  useEffect(() => {
    document.body.style.overflowY = "hidden";

    return () => {
      document.body.style.overflowY = "auto";
    };
  }, []);

  return (
    <BackgroundWrapper>
      <ModalContainer>
        {/* 헤드라인 */}
        <HeadLineSection>
          <h3>헤드라인</h3>
          <input type="text" placeholder="검색하실 헤드라인을 입력해주세요." value={headLine} onChange={handleChangeHeadLine} />
        </HeadLineSection>

        {/* 날짜 */}
        <DateSection>
          <h3>날짜</h3>
          <input
            type="date"
            placeholder="날짜를 선택해주세요."
            required
            max={useExchageDateFormat(new Date())}
            value={date}
            onChange={handleChangeDate}
          />
        </DateSection>

        {/* 국가 */}
        <CountrySection>
          <h3>국가</h3>
          <section>
            {CountryDataArray.map((ctyEl: CountryType) => {
              return (
                <CountryBox key={ctyEl.ctyCd} ctyId={ctyEl.ctyId} ctyCd={ctyEl.ctyCd} ctyNm={ctyEl.ctyNm} country={country} setCountry={setCountry} />
              );
            })}
          </section>
        </CountrySection>

        {/* 적용 버튼 */}
        <ApplyBtn onClick={handleClickApplyBtn}>필터 적용하기</ApplyBtn>
      </ModalContainer>
    </BackgroundWrapper>
  );
};

export default FilterModal;
