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
  const infoData = store.getState().claimsReducer.claims;

  const infoDataKeys = Object.keys(infoData);
  const claims = await infoDataKeys.filter((currKey) => {
    if (currKey.includes("Permissions.")) return infoData[currKey];
  });
  const functionRoutes = await routes.filter((item) => item.path == "/")[0]
    .children;

  let homeRoute = await functionRoutes.filter((item) => {
    if (infoData.RoleId != "1") {
      if (claims.includes(item.claims)) {
        return item;
      }
    } else {
      return item;
    }
  });

  await homeRoute.map((route) => {
    route.key = route.path;
    if (
      route.parent &&
      homeRoute.findIndex((item) => item.path == route.parent) < 0
    ) {
      const parentRoute = {
        ...functionRoutes.filter((item) => item.path == route.parent)[0],
      };
      delete parentRoute.children;
      homeRoute.push(parentRoute);
    } else if (!route.parent) {
      route.children = [];
    }
  });

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
    nestedRoutes: [...(await nestedArray(homeRoute))],
    flatRoutes: homeRoute,
  };
};

export { getRoutesAccess };
