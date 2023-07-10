import UserPermissions from "../components/SystemOptions/Pages/UserPermissions/UserPermissions";
import System from "../pages/System/Pages/System";

const systemRoutes = [
  {
    label: "Hệ thống",
    claims: "Produce.system",
    path: "System",
    element: <System />,
    children: [
      {
        label: "Phân quyền tài khoản",
        claims: "Produce.system",
        path: "UsersPermissions",
        element: <UserPermissions />,
        children: [],
      },
    ],
  },
];

export default systemRoutes;
