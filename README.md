## 뉴스조회사이트

### 📌 프로젝트 소개
데스크탑 뷰보다는 모바일 뷰의 웹앱 또는 모바일 앱이 증가함에서 따라, 모바일 뷰 기반의 프로젝트를 구현해보고 싶었습니다. <br />
또한, 페이지네이션 기능에서 버튼식 보다는 무한스크롤 형태가 UX를 더 향상시켜주기 때문에 무한스크롤을 집중적으로 구현해보고 싶었고, 그 중, React-Query의 무한스크롤 훅인 useInfiniteQuery를 사용하여 구현에 도전해보고자 프로젝트를 진행하였습니다.

기사 데이터는 New York Times의 Article Search API를 사용하였습니다.

---
### 📌 기능 소개
#### 1️⃣ 기사 데이터 조회 및 무한스크롤
![May-07-2024 14-44-19](https://github.com/hun0613/news-project/assets/106587166/a4638798-a699-4916-9610-bb8a9670762c)

```javascript
return await axios.get(
    `/svc/search/v2/articlesearch.json?api-key=${process.env.REACT_APP_NYT_API_KEY}&sort=newest&page=${pageParam}${dateQuery}${fqQuery1}`,
    {
      baseURL: process.env.REACT_APP_NYT_API_ADDRESS,
    }
  );
```
New York Times의 Article Search API에 Get 요청을 통해 기사데이터를 받아왔고, page 파라미터를 통해 0부터 순차적으로 페이지네이션을 구현했습니다. <br />
<br />
여기서 스크롤이 가장 하단에 도달했음을 감지하는 부분은 react hook 중 IntersectionObserver를 사용하여 구현하였고, 가장 하단 도달 시 react-query의 useInfiniteQuery 훅을 사용하여 페이지 + 1 및 api 요청으로 다음 페이지의 데이터를 받아왔습니다. <br />

작동 방식은 <br />
1. 가장 하단에 있는 요소가 화면에 출현했는가? (여기서 요소의 몇 %가 보였을 때 감지할지는 IntersectionObserver의 옵션인 threshold를 0 ~ 1 사이의 값으로 설정하기에 따라 결정)
2. 만약 실행중인 api가 없다면 useInfiniteQuery의 fetchNextPage 실행
3. 실행 시 getNextPageParam이 실행되면서 현재 페이지 + 1 값을 파라미터로 보내 응답을 받아온다.
4. 만약 받아온 응답의 데이터 리스트가 10개 (한 페이지에 보여줄 기사 갯수) 미만이라면 다음 요청을 보내지 않는다. (마지막 페이지)

위의 과정으로 실행됩니다.

<br /><br />
#### 2️⃣ 필터링 검색
![필터](https://github.com/hun0613/news-project/assets/106587166/92d7cd0c-fc3f-47bc-8253-9b02aafa9973)

뉴스기사는 헤드라인 별, 날짜 별, 국가 별로 검색이 가능합니다. <br />

헤더부분의 각 영역을 클릭하여 필터링 모달을 활성화시키고, 전체 데이터 조회 시에는 초기화면과 같이 회색으로 비활성화 되어있지만, 검색조건이 추가되었을 시에는 푸른색으로 활성화되고 검색 키워드가 표시되게 됩니다. <br />

각 검색조건들이 너무 길어져 ui가 깨지는 현상을 방지하기 위해, 너무 길어질 경우 말줄임표를 활용하여 축약되도록 구현하였습니다.

```javascript
  // 날짜 쿼리
  let dateQuery = date ? `&begin_date=${date.replaceAll("-", "")}&end_date=${date.replaceAll("-", "")}` : "";
  // 국가, 헤드라인 쿼리
  let fqQuery1 = `&fq=${country.length > 0 ? `glocations:(${makedCountry})` : ""}${country.length > 0 && headline ? " AND " : ""}${headline ? `headline:("${headline}")` : ""}${(country.length > 0 || headline) && scrapIdArr ? " AND " : ""}${scrapIdArr ? `web_url:(${makedScrapId})` : ""}`;
```
api 호출 함수에서 만약 검색조건이 없다면 쿼리 파라미터에 빈 값이 들어감으로써 전체데이터를 받아오지만, 검색조건이 있을 시 해당 조건들을 api 파라미터 요구사항에 맞춰 가공한 뒤 쿼리 파라미터에 추가하여 필터링 된 데이터를 받아오게 됩니다.

<br /><br />
#### 3️⃣ 스크랩
![스크랩](https://github.com/hun0613/news-project/assets/106587166/df9227ec-d5e8-4526-823c-77b3491d4856)

게시글의 우측에 있는 별표를 클릭 시 스크랩이 되고, 하다 탭바의 스크랩 탭으로 이동하여 스크랩 된 게시글을 확인할 수 있습니다. <br />
스크랩 페이지에서 별표를 다시 클릭 시, 스크랩이 해제되며 스크랩 페이지에서 바로 삭제됩니다. <br />

게시글의 id 역할을 해주는 web_url을 배열에 저장 후, 해당 요소의 web_url이 배열이 포함되어있는지 아닌지에 따라 스크랩 여부를 표시합니다. <br />

![image](https://github.com/hun0613/news-project/assets/106587166/46e64e71-0f47-46d7-9f02-f98247630786)

이 때, 웹페이지가 닫혀도 스크랩 정보는 남아있도록 하기위해서 localStorage에 해당 배열을 json 형태로 저장하여 사용합니다.

---
### 📌 적용 기술 스택
#### 📎 React
지속적으로 기사 콘텐츠가 업데이트 되고, 필터링 및 검색을 통한 업데이트가 자주 발생하는 서비스의 특성 상, 서버사이드 랜더링 통해 서버에 지속적으로 부하를 주는 것 보다는, 클라이언트 사이드에서 콘텐츠를 빠르게 업데이트 해 주는 것이 좋을 것이라고 생각했습니다.

#### 📎 TypeScript
JavaScript를 사용했을 때, 개발과정에서 예기치않은 변수의 타입으로 인해 런타임에러가 발생할 가능성을 고려해야 했습니다. <br />
특히, api 요청 시 들어은 response 데이터가 예측하지 못한 타입으로 들어왔을 경우나, 필터링 모달의 input에 다른 타입의 데이터가 들어올 경우, 런타임에러가 발생하기 때문에, 모든 상황에 대해서 타입을 명확히하여 개발 과정에서 런타임에러를 확실히 방지할 수 있는 TypeScript를 사용했습니다.

#### 📎 React_Query
React-Query를 사용한 가장 큰 이유는 무한스크롤을 구현할 수 있는 React-Query의  useInfiniteQuery 훅을 사용하기 위해서 입니다.

무한스크롤을 구현하기 위해 굳이 여러 상태를 만들지 않아도 되고, useInfiniteQuery 훅의 옵션 중 select를 사용하여, 원하는 형태의 객체로 불필요하게 클라이언트 상태를 만들지 않고 서버 상태를 바로 관리 및 사용할 수 있기 때문에 사용하였습니다.

그리고, React-Query의 캐싱 기능에 대해서도, 페이지가 언마운트되고 다시 마운트되는 상황 (ex.기사글 페이지에서 뒤로가기로 프로덕트에 돌아온 상황)에서 캐시 데이터를 활용해 불필요한 api 호출을 줄일 수 있다는 장점이 있어서 사용하게 되었습니다.

#### 📎 Zustand
컴포넌트 간 Props drilling으로 인하여 데이터 흐름을 예측하기 힘든 상황을 방지하고자 Flux 패턴을 사용하고 비교적 디렉토리 구조 및 사용법이 간단한 Zustand를 사용하였습니다.

#### 📎 Styled-Component
개발 생산성 및 재사용성을 증대시키기 위해 각 컴포넌트를 작은 단위로 쪼개는 작업을 진행했는데, 적절한 이름으로 지정된 스타일 태그를 활용하여 코드의 가독성을 확보하고, 스타일 태그에 props를 전달하여 조건부 스타일 적용을 할 수 있다는 장점을 가지고 있는 Styled-Components를 프로젝트에 적용 시킨다면, 훨씬 더 편하게 가독성 및 재사용성을 확보할 수 있다고 생각해서 사용하게 되었습니다. 

#### 📎 Vercel
자동으로 repository에 push가 발생하면 자동 배포되는 ci/cd도 제공해주기 때문에, 추후 2차 개발 또는 버그이슈가 발생했을 때, 빠르게 대응할 수 있다는 점이 가장 큰 장점으로 다가왔습니다. <br />
그리고 빌드과정에서와 런타임 상황에서의 로그를 실시간으로 제공해주기 때문에 그 점도, 시스템을 유지보수 해나가는데 또는 버그의 원인을 분석할 때 정말 간편한 점이고 생각했습니다.

---
### 📌 회고
이번 프로젝트를 통해, 무한스크롤 구현에 필요한 IntersectionObserver 훅과 react-query의 useInfiniteQuery를 깊이 분석해보는 기회를 가질 수 있었습니다. <br />
이를 통해 react-query의 캐싱메모리를 활용하여 좀 더 나은 성능의 무한 스크롤을 구현할 수 있어서 개발자로서 한층 더 성장한 느낌을 받응 수 있었고, 그동안 회사에서나 개인프로젝트에서 Tailwind CSS만 써서, Styled-Components에 대한 감각이 많이 사라져있는 상황이었는데, 이번 프로젝트를 통해서 Styled-Components에 대한 감각을 다시 살릴 수 있어서 좋았습니다.

