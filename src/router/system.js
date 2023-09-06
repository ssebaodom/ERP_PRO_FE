import UserPermissions from "../components/SystemOptions/Pages/UserPermissions/UserPermissions";
import System from "../pages/System/Pages/System";

const systemRoutes = [
  {
    label: "Hệ thống",
    claims: "Permissions.system",
    path: "System",
    element: <System />,
    children: [
      {
        label: "Phân quyền tài khoản",
        claims: "Permissions.system",
        path: "UsersPermissions",
        element: <UserPermissions />,
        children: [],
      },
    ],
  },
];

export default systemRoutes;
