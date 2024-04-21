import Home from "../pages/Home";
import Scrap from "../pages/Scrap";

interface routeType {
  path: string;
  element: React.ReactNode;
}

const route: routeType[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/scrap",
    element: <Scrap />,
  },
];

export default route;
