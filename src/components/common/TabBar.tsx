import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  max-width: 560px; /* 데스크탑일 경우 width 제한 (560px 이내는 반응형) */
  width: 100vw;
  height: 85px;
  background: #000000;
  position: fixed;
  /* opacity: 0.5; */
  bottom: 0px;
  border-radius: 30px 30px 0px 0px;
  padding: 20px 80px 20px 80px;
  z-index: 9999;

  /* flex */
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Button = styled.button<{ $btnId: string; $path: string }>`
  width: fit-content;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: transparent;
  border-width: 0;
  cursor: pointer;

  /* font */
  color: ${(props) => (props.$btnId === props.$path ? "#ffffff" : "#6D6D6D")};
  font-family: AppleSDGothicNeo;
  font-weight: 600;
  font-size: 10px;
`;

const ButtonImg = styled.img`
  width: 24px;
  height: 24px;
  color: #ffffff;
  margin-bottom: 10px;
`;

const TabBar = () => {
  const navigate = useNavigate();
  // 현재 경로
  const pathName = window.location.pathname;

  const handleClickBtn = (btnId: number) => {
    // 홈버튼 클릭시
    if (btnId === 0) navigate("/");
    // 스크랩버튼 클릭시
    if (btnId === 1) navigate("/scrap");
  };

  return (
    <Wrapper>
      {/* 홈 버튼 */}
      <Button $btnId={"/"} $path={pathName} onClick={() => handleClickBtn(0)}>
        <ButtonImg src={pathName === "/" ? `images/home_fill.png` : `images/home_unFill.png`} alt="home_icon" />홈
      </Button>
      {/* 스크랩 버튼 */}
      <Button $btnId={"/scrap"} $path={pathName} onClick={() => handleClickBtn(1)}>
        <ButtonImg src={pathName === "/scrap" ? `images/scrap_fill.png` : `images/scrap_unFill.png`} alt="scrap_icon" />
        스크랩
      </Button>
    </Wrapper>
  );
};

export default TabBar;
