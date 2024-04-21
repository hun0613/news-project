import { InfiniteQueryObserverResult } from "@tanstack/react-query";
import { useEffect, useState } from "react";

interface Props {
  // target의 가시성 퍼센티지
  threshold?: number;
  // 가져올 다음페이지가 있는지 여부
  hasNextPage: boolean | undefined;
  // 다음페이지 불러오기
  fetchNextPage: () => Promise<InfiniteQueryObserverResult>;
  // api 요청 상태
  isFetching: boolean;
}

const useIntersectionObserver = ({ threshold = 1, hasNextPage, fetchNextPage, isFetching }: Props) => {
  // 관찰 요소 (scroll div의 최하단 요소) -> 이게 스크롤 하단에 닿는 지 추적
  const [target, setTarget] = useState<HTMLDivElement | null | undefined>(null);

  // target이 최하단에 닿았을 때 실행되는 콜백함수
  const observerCallback: IntersectionObserverCallback = (entries) => {
    entries.forEach((entry) => {
      // target이 교차되고 (화면에 관찰), 다음페이지가 있다면 다음페이지 호출
      if (entry.isIntersecting && hasNextPage && !isFetching) {
        fetchNextPage();
      }
    });
  };

  useEffect(() => {
    if (!target) return;

    // intersection observer 인스턴스 생성
    const observer = new IntersectionObserver(observerCallback, {
      threshold,
    });

    // 타겟 관찰 시작
    observer.observe(target);

    // 관찰 멈춤 (불필요한 메모리 누수 방지)
    return () => observer.unobserve(target);
  }, [observerCallback, threshold, target]);

  return { setTarget };
};

export default useIntersectionObserver;
