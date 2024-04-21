import styled from "styled-components";
import { CountryType } from "../../store/types";
import { useFilterModalState } from "../../store/store";

const Wrapper = styled.div`
  width: 100%;
  height: 60px;
  background: #ffffff;
  border-bottom: 1px solid #c4c4c4;
  padding: 13px 20px;
  position: sticky;
  top: 0;

  display: flex;
  flex-direction: row;
  justify-content: start;
  align-items: center;
`;

const FilterBtn = styled.button<{ $btnId: string; $headline: string; $date: string; $countryLen: number }>`
  /* 전체 width가 줄어들 경우, 레이아웃 깨짐 현상 방지를 위한 반응형 설정 */
  max-width: 130px;
  @media screen and (max-width: 400px) {
    max-width: 100px;
  }
  @media screen and (max-width: 350px) {
    max-width: 70px;
  }

  width: fit-content;
  height: 34px;
  padding: 6px 12px 4px 12px;
  border-radius: 30px;
  /* 필터 적용 유무에 따른 스타일 변경 */
  border: 1px solid
    ${(props) =>
      (props.$btnId === "headline" && props.$headline) ||
      (props.$btnId === "date" && props.$date) ||
      (props.$btnId === "country" && props.$countryLen > 0)
        ? "#82B0F4"
        : "#c4c4c4"};
  background: transparent;
  margin-right: 7px;
  cursor: pointer;

  /* font */
  > p {
    /* 필터 적용 유무에 따른 스타일 변경 */
    color: ${(props) =>
      (props.$btnId === "headline" && props.$headline) ||
      (props.$btnId === "date" && props.$date) ||
      (props.$btnId === "country" && props.$countryLen > 0)
        ? "#3478F6"
        : "#6d6d6d"};
    font-family: AppleSDGothicNeo;
    font-weight: 400;
    font-size: 14px;

    /* 길어질 경우 말줄임 */
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  /* flex */
  display: flex;
  flex-direction: row;
`;

const FilterBtnImg = styled.img`
  width: 16px;
  height: 16px;
  color: #6d6d6d;
  margin-right: 4px;
  margin-top: 2px;
`;

interface Props {
  headline: string;
  date: string;
  country: CountryType[];
}

const Header = ({ headline, date, country }: Props) => {
  const { setModalState } = useFilterModalState();

  return (
    <Wrapper>
      <FilterBtn onClick={() => setModalState(true)} $btnId="headline" $headline={headline} $date={date} $countryLen={country.length}>
        <FilterBtnImg src={headline ? `images/search_active.png` : `images/search_inActive.png`} alt="search_icon" />
        <p>{headline ? headline : "전체 헤드라인"}</p>
      </FilterBtn>

      <FilterBtn onClick={() => setModalState(true)} $btnId="date" $headline={headline} $date={date} $countryLen={country.length}>
        <FilterBtnImg src={date ? `images/date_active.png` : `images/date_inActive.png`} alt="search_icon" />
        <p>{date ? date.replaceAll("-", ".") : "전체 날짜"}</p>
      </FilterBtn>

      <FilterBtn onClick={() => setModalState(true)} $btnId="country" $headline={headline} $date={date} $countryLen={country.length}>
        <p>{country.length === 1 ? country[0].ctyNm : country.length > 1 ? `${country[0].ctyNm} 외 ${country.length - 1}개` : "전체 국가"}</p>
      </FilterBtn>
    </Wrapper>
  );
};

export default Header;
