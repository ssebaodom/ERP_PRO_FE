import { createBrowserRouter } from "react-router-dom";
import homeRoutes from "./home";

const routes = [...homeRoutes];
const router = createBrowserRouter(routes);

let homeRoute = routes.filter((item) => item.path == "/")[0].children;
homeRoute.map((item, index) => {
  item.key = item.path;
  if (item.parent) {
    homeRoute.map((item2) => {
      if (item2.path === item.parent) {
        item2.children.push(item);
        homeRoute = homeRoute.filter((item3) => item3.path !== item.path);
      }
      return item;
    });
  } else {
    item.children = [];
  }
  //   if (item.children) {
  //     item.onTitleClick = () => {
  //        handleNavbarClick(item);
  //     };
  //   }
  return item;
});

const navbarObject = homeRoute;

export { routes, navbarObject };
export default router;
