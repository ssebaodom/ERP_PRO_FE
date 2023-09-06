import store from "../../store";

const getRoutesAccess = async (routes) => {
  const infoData = store.getState().claimsReducer.claims;

  const infoDataKeys = Object.keys(infoData);
  const claims = await infoDataKeys.filter((currKey) => {
    if (currKey.includes("Permissions.")) return infoData[currKey];
  });

  const functionRoutes = routes.filter((item) => item.path == "/")[0].children;

  let homeRoute = functionRoutes.filter((item) => {
    if (claims.includes(item.claims)) {
      return item;
    }
  });

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
    return item;
  });

  return [...homeRoute];
};

export { getRoutesAccess };
