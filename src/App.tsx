import styled from "styled-components";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TabBar from "./components/common/TabBar";
import FilterModal from "./components/common/FilterModal";
import { useFilterModalState } from "./store/store";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import route from "./routes/route";

const Wrapper = styled.div`
  max-width: 560px; /* 데스크탑일 경우 width 제한 (560px 이내는 반응형) */
  width: 100vw;
  min-height: 100vh;
  height: fit-content;
  background: #f0f1f4;
  position: relative; /* 하단 탭바 absolute 속성을 고려한 설정 */
`;

function App() {
  const { modalState } = useFilterModalState();

  return (
    <>
      <ToastContainer />
      <Router>
        <Wrapper>
          {/* 필터 모달 */}
          {modalState ? <FilterModal /> : null}
          {/* content body (route) */}
          <Routes>
            {route.map((routeEl) => {
              return <Route key={routeEl.path} path={routeEl.path} element={routeEl.element} />;
            })}
          </Routes>

          {/* tabbar */}
          <TabBar />
        </Wrapper>
      </Router>
    </>
  );
}

export default App;
