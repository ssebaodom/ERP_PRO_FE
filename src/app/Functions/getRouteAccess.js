import store from "../../store";

const nestedArray = (raw) => {
  var data = [...raw],
    tree = (function (data, root) {
      var t = {};
      data.forEach((o) => {
        Object.assign((t[o.path] = t[o.path] || {}), o);
        t[o.parent] = t[o.parent] || {};
        t[o.parent].children = t[o.parent].children || [];
        t[o.parent].children.push(t[o.path]);
      });
      return t[root]?.children || [];
    })(data, undefined);
  const final = tree;
  return final;
};

const getRoutesAccess = async (routes) => {
  const userData = store.getState().claimsReducer.claims;

  const claims = Object.keys(userData).filter((key) => {
    if (key.includes("Permissions.")) return userData[key];
  });

  const validRoutes = routes.filter((item) => item.path == "/");
  const allRoutes = [..._.first(validRoutes).children];

  const userRoute =
    userData?.RoleId == "1"
      ? [...allRoutes]
      : allRoutes.filter((route) => claims.includes(route.claims));

  userRoute.map((route) => {
    route.key = route.path;
    if (
      route.parent &&
      userRoute.findIndex((item) => item.path == route.parent) < 0
    ) {
      const parentRoute = allRoutes.find((item) => item.path == route.parent);
      delete parentRoute.children;
      userRoute.push(parentRoute);
    } else if (!route.parent) {
      route.children = [];
    }
  });

  const nestedRoutes = [...nestedArray(userRoute)];
  // await homeRoute.map((item, index) => {
  //   item.key = item.path;
  //   if (item.parent) {
  //     homeRoute.map((item2) => {
  //       if (item2.path === item.parent) {
  //         item2.children.push(item);
  //         homeRoute = homeRoute.filter((item3) => item3.path !== item.path);
  //       }
  //       return item;
  //     });
  //   } else {
  //     item.children = [];
  //   }
  //   return item;
  // });
  return {
    nestedRoutes: nestedRoutes || [],
    flatRoutes: userRoute,
  };
};

export { getRoutesAccess };
