import styled from "styled-components";
import { CountryType } from "../../store/types";

const Wrapper = styled.div<{ $activeState: boolean }>`
  width: fit-content;
  height: fit-content;

  padding: 6px 12px;
  border: 1px solid #f2f2f2;
  border-radius: 30px;

  font-family: AppleSDGothicNeo;
  font-weight: 400;
  font-size: 14px;
  color: ${(props) => (props.$activeState ? "#ffffff" : "#6d6d6d")};

  background: ${(props) => (props.$activeState ? "#82b0f4" : "#fffff")};

  margin-right: 8px;
  margin-bottom: 8px;

  cursor: pointer;
`;

interface Props {
  ctyId: number;
  ctyCd: string;
  ctyNm: string;
  country: CountryType[];
  setCountry: React.Dispatch<React.SetStateAction<CountryType[]>>;
}

const CountryBox = ({ ctyId, ctyCd, ctyNm, country, setCountry }: Props) => {
  let activeState: boolean = country.filter((el: CountryType) => el.ctyCd === ctyCd).length > 0 ? true : false;

  const handleClickBox = () => {
    if (activeState) {
      // country 임시 배열
      let tempArr: CountryType[] = [...country];
      // 선택한 국가가 있는 배열 위치
      let elPos: number = 0;

      // 일치한 국가의 인덱싱을 elPos에 할당
      tempArr.forEach((el: CountryType, idx: number) => {
        if (el.ctyCd === ctyCd) {
          elPos = idx;
        }
      });

      // 해당 국가 - 배열에서 제거
      tempArr.splice(elPos, 1);
      // 상태 업데이트
      setCountry(tempArr);
    } else {
      // country 임시 배열
      let tempArr: CountryType[] = [...country];
      // 선택 국가 배열에 추가
      tempArr.push({ ctyId: ctyId, ctyCd: ctyCd, ctyNm: ctyNm });
      // 상태 업데이트
      setCountry(tempArr);
    }
  };

  return (
    <Wrapper onClick={handleClickBox} $activeState={activeState}>
      {ctyNm}
    </Wrapper>
  );
};

export default CountryBox;
