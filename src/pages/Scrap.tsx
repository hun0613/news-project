import styled from "styled-components";
import { useScrapFilterStore, useFilterModalState } from "../store/store";
import Header from "../components/common/Header";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { BeatLoader } from "react-spinners";
import getArticles from "../api/getArticles";
import useIntersectionObserver from "../hooks/useIntersectionObserver";
import Content from "../components/common/Content";

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 30px;

  > .target {
    width: 100%;
    height: 1px;
  }
`;

const NoDataWrapper = styled.div`
  width: 100%;
  height: 100vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  > button {
    width: 80%;
    height: 60px;

    border-radius: 16px;
    border: 0px solid transparent;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: #3478f6;

    font-family: AppleSDGothicNeo;
    font-weight: 600;
    font-size: 16px;
    color: #ffffff;

    cursor: pointer;
  }
`;

const ContentArea = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  margin-bottom: 20px;

  > img {
    width: 36px;
    height: auto;
    margin-bottom: 8px;
  }

  > p {
    font-family: AppleSDGothicNeo;
    font-weight: 600;
    font-size: 18px;
    color: #6d6d6d;
  }
`;

const ContentWrapper = styled.div`
  width: 100%;
  height: fit-content;

  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;

  padding: 20px 20px 85px 20px;
`;

const Caution = styled.div<{ $case: string }>`
  width: 100%;
  height: ${(props) => (props.$case === "null" ? "calc(100vh - 85px - 60px - 30px)" : props.$case === "exceed" ? "fit-content" : null)};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 20px;

  > img {
    width: 36px;
    height: auto;
    opacity: 0.4;
    margin-bottom: 8px;
  }

  > p {
    font-family: AppleSDGothicNeo;
    font-weight: 600;
    font-size: 18px;
    color: #6d6d6d;
  }

  > button {
    width: 40%;
    height: fit-content;

    padding: 14px;
    margin-top: 8px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    background: #3478f6;
    border-radius: 16px;
    border-color: transparent;

    font-family: AppleSDGothicNeo;
    font-size: 16px;
    font-weight: 600;
    color: #ffffff;

    cursor: pointer;
  }
`;

const Loading = styled.div<{ $case: string }>`
  width: 100%;
  height: ${(props) => (props.$case === "null" ? "calc(100vh - 85px - 60px - 30px)" : props.$case === "notNull" ? "fit-content" : null)};

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Scrap = () => {
  const navigate = useNavigate();

  // 스크랩 화면 필터 정보
  const { headline, date, country } = useScrapFilterStore();
  // 모달 상태
  const { setModalState } = useFilterModalState();

  /** 필터 변경 케이스 임을 알려주는 상태 ("필터 적용하기" 버튼 클릭 시 true로 변함) */
  const { modalClickState, setModalClickState } = useFilterModalState();

  // 스크랩 정보 상태
  const [scrapIdArr, setScrapIdArr] = useState<string[]>(JSON.parse(localStorage.getItem("scrap") || "[]"));
  // 무한 스크롤 api 요청 시, url로 들어갈 scrap 정보의 초기 값
  const [initScrapIdArr, setInitScrapIdArr] = useState<string[]>(JSON.parse(localStorage.getItem("scrap") || "[]"));

  const queryClient = useQueryClient();

  // react-query 무한 스크롤 api 요청
  const { data, isFetching, fetchNextPage, hasNextPage, isError } = useInfiniteQuery({
    queryKey: ["scrap"],
    /** 필터 변경 상황에서는 업데이트 된 스크랩 정보가 들어가야 함 / 필터 변경 상황이 아닌 경우에는 무한스크롤을 대비하여 스크랩 초기값이 들어가야 함 */
    queryFn: ({ pageParam }) => getArticles({ headline, date, country, scrapIdArr: modalClickState ? scrapIdArr : initScrapIdArr }, pageParam - 1),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const nextPage = allPages.length + 1;
      return lastPage.data.response.docs.length < 10 ? undefined : nextPage;
    },
    select: (data) => {
      return {
        articles: data?.pages.flatMap((page) => page.data.response.docs),
      };
    },
    refetchOnWindowFocus: false,
    // scrap 데이터가 있으면 랜더링 되자마자 fetch, 아니면 fetch하지 않는다.
    enabled: scrapIdArr.length > 0 ? true : false,
  });

  // 재요청 버튼 시 refetch
  const handleClickRefresh = () => {
    fetchNextPage();
  };

  // 무한 스크롤 이벤트 탐지용
  const { setTarget } = useIntersectionObserver({ hasNextPage, fetchNextPage, isFetching });

  useEffect(() => {
    // y 스크롤바 때문에 x스크롤 생기는 현상 방지
    document.body.style.overflowX = "hidden";

    /** 필터 변경 시에만 캐시 초기화 (현재는 페이지 랜더링 시 캐시 무효화 되도록 설정 - 추후 요구사항에 따라 적용) */
    // if (modalClickState) {
    //   // 캐시 초기화
    //   queryClient.removeQueries();
    // }

    return () => {
      // 캐시 초기화
      queryClient.removeQueries();
      // 모달 닫기
      setModalState(false);
      /** 페이지 언마운트 시 필터 변경 외 상황에서는 캐시무효화 되지 않도록
       * (현재는 페이지 랜더링 시 캐시 무효화 되도록 설정 - 추후 요구사항에 따라 적용) */
      setModalClickState(false);
    };
  }, [headline, date, country]);

  return (
    <Wrapper>
      {/* header */}
      {scrapIdArr.length > 0 ? <Header headline={headline} date={date} country={country} /> : null}

      {scrapIdArr.length > 0 ? (
        <>
          {/* contents area */}
          <ContentWrapper>
            {/* 게시글이 존재하지 않을 때 경고 */}
            {data && data?.articles.length === 0 ? (
              <Caution $case={"null"}>
                <img src="/images/caution_icon.png" alt="caution_icon" />
                <p>게시글이 존재하지 않습니다.</p>
              </Caution>
            ) : null}

            {/* api로 받은 기사 데이터 뿌려주기 */}
            {data?.articles &&
              data.articles.map((el, idx) => {
                return (
                  <Content
                    key={idx}
                    title={el.headline.main}
                    source={el.source}
                    reporter={el.byline.person}
                    date={el.pub_date}
                    url={el.web_url}
                    scrapIdArr={scrapIdArr}
                    setScrapIdArr={setScrapIdArr}
                  />
                );
              })}

            {/* 로딩중 */}
            {!data && isFetching ? (
              // 기존 받아온 데이터가 없는 경우
              <Loading $case="null">
                <BeatLoader />
              </Loading>
            ) : data && data?.articles.length > 0 && isFetching ? (
              // 기존 받아온 데이터가 있는 경우
              <Loading $case="notNull">
                <BeatLoader />
              </Loading>
            ) : null}

            {/* 분당 요청 횟수를 초과했을 때 */}
            {!data && !isFetching && isError ? (
              // 기존 받아온 데이터가 없을 때
              <Caution $case={"null"}>
                <img src="/images/caution_icon.png" alt="caution_icon" />
                <p>1분 후 다시 시도해주세요.</p>
                <button type="button" onClick={handleClickRefresh}>
                  재요청
                </button>
              </Caution>
            ) : data && !isFetching && isError ? (
              // 기존 받아온 데이터가 있을 때
              <Caution $case={"exceed"}>
                <img src="/images/caution_icon.png" alt="caution_icon" />
                <p>1분 후 다시 시도해주세요.</p>
                <button type="button" onClick={handleClickRefresh}>
                  재요청
                </button>
              </Caution>
            ) : null}
          </ContentWrapper>
          {/* 무한스크롤 최하단 요소 */}
          {!isError ? <div className="target" ref={setTarget}></div> : null}
        </>
      ) : (
        <NoDataWrapper>
          <ContentArea>
            <img src="/images/scrap_icon.png" alt="scrap_icon" />
            <p>저장된 스크랩이 없습니다.</p>
          </ContentArea>
          <button onClick={() => navigate("/")}>스크랩 하러 가기</button>
        </NoDataWrapper>
      )}
    </Wrapper>
  );
};

export default Scrap;
