import styled from "styled-components";
import useExchageFullDateFormat from "../../hooks/useExchangeFullDateFormat";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState } from "react";

const Wrapper = styled.div<{ $pathName: string; $scrapYn: boolean }>`
  width: 100%;
  height: fit-content;
  background: #ffffff;
  cursor: pointer;

  border-radius: 8px;

  padding: 10px 20px 10px 20px;
  margin-bottom: 8px;

  /* 스크랩 페이지에서 스크랩 해제를 눌렀을 때, 화면에서 사라져야한다. */
  display: ${(props) => (props.$pathName === "/scrap" && props.$scrapYn === false ? "none" : "flex")};
  flex-direction: column;
`;

const FirstRow = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;

  margin-bottom: 8px;

  > p {
    width: 100%;
    font-family: AppleSDGothicNeo;
    font-size: 18px;
    font-weight: 600;
    text-align: left;
    line-height: 28px;

    /* 2줄 이상부터는 말줄임 설정 */
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  > img {
    width: 16px;
    height: 16px;
    margin: 6px 4px 6px 11px;
    cursor: pointer;
  }
`;

const SecondRow = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: start;

  > p {
    font-family: AppleSDGothicNeo;
    font-size: 13px;
    font-weight: 400;
    color: #000000;
  }

  > div {
    width: fit-content;
    height: fit-content;

    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    > p {
      max-width: 140px;

      @media screen and (max-width: 500px) {
        max-width: 100px;
      }

      @media screen and (max-width: 400px) {
        max-width: 80px;
      }

      @media screen and (max-width: 300px) {
        max-width: 40px;
      }
      width: fit-content;

      font-family: AppleSDGothicNeo;
      font-size: 13px;
      font-weight: 400;
      color: #000000;

      margin-right: 8px;

      /* 길어질 경우 말줄임 */
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }
`;

interface Props {
  title: string;
  source: string;
  reporter: { firstname: string; lastname: string }[];
  date: string;
  url: string;

  scrapIdArr: string[];
  setScrapIdArr: React.Dispatch<React.SetStateAction<string[]>>;
}

const Content = ({ title, source, reporter, date, url, scrapIdArr, setScrapIdArr }: Props) => {
  // 스크랩 해제 클릭 여부
  const [scrapYn, setScrapYn] = useState<boolean>(true);

  // 현재 경로
  const pathName = window.location.pathname;

  const handleClickContent = () => {
    window.location.href = url;
  };

  const handleClickScrap = (e: React.MouseEvent) => {
    e.stopPropagation();

    // localStrorage의 string에서 배열로 변환
    let idArr = JSON.parse(localStorage.getItem("scrap") || "[]");

    // 이미 스크랩 되어 있다면
    if (scrapIdArr.includes(url)) {
      // 해당 기사가 있는 인덱스 파악
      let idx = idArr.indexOf(url);

      // splice로 해당 기사 제거
      idArr.splice(idx, 1);

      // 상태 업데이트
      setScrapIdArr(idArr);

      // 문자열로 전환
      let idStr = JSON.stringify(idArr);

      // localStorage에 저장
      localStorage.setItem("scrap", idStr);

      // 스크랩 해제 여부 상태 전환
      setScrapYn(false);

      // toast 알림 보여주기
      toast.success("스크랩 해제되었습니다.", {
        autoClose: 1500,
        position: "top-center",
      });
    }
    // 스크랩 되어있지 않다면
    else {
      // 클릭한 기사 id와 merge
      let mergeIdArr = [...idArr, url];

      // 상태 업데이트
      setScrapIdArr(mergeIdArr);

      // 문자열로 전환
      let idStr = JSON.stringify(mergeIdArr);

      // localStorage에 저장
      localStorage.setItem("scrap", idStr);

      // toast 알림 보여주기
      toast.success("스크랩 되었습니다.", {
        autoClose: 1500,
        position: "top-center",
      });
    }
  };

  return (
    <Wrapper $pathName={pathName} $scrapYn={scrapYn} onClick={handleClickContent}>
      {/* 제목, 스크랩 */}
      <FirstRow>
        <p>{title}</p>
        <img src={scrapIdArr.includes(url) ? "/images/star_active.png" : "/images/star_inActive.png"} alt="scrap_icon" onClick={handleClickScrap} />
      </FirstRow>

      {/* 언론사, 기자, 발행일자 */}
      <SecondRow>
        <div>
          <p>{source ? source : "unknown"}</p>
          <p>
            {reporter.length === 0
              ? "unknown"
              : reporter.length > 1
              ? `${reporter[0].firstname} 기자 외 ${reporter.length - 1}명`
              : `${reporter[0].firstname} 기자`}
          </p>
        </div>
        <p>{useExchageFullDateFormat(new Date(date))}</p>
      </SecondRow>
    </Wrapper>
  );
};

export default Content;
