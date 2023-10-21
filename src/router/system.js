import Accounts from "../components/SystemOptions/Pages/Accounts/Accounts";
import GroupPermissions from "../components/SystemOptions/Pages/GroupPermissions/GroupPermissions";
import UnitPermissions from "../components/SystemOptions/Pages/UnitPermissions/UnitPermissions";
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
        claims: "Permissions.system.permissions",
        path: "UsersPermissions",
        element: <UserPermissions />,
        children: [],
      },
      {
        label: "Phân quyền nhóm",
        claims: "Permissions.system.permissions",
        path: "GroupPermissions",
        element: <GroupPermissions />,
        children: [],
      },
      {
        label: "Phân quyền đơn vị",
        claims: "Permissions.system.permissions",
        path: "UnitPermissions",
        element: <UnitPermissions />,
        children: [],
      },

      {
        label: "Tài khoản",
        claims: "Permissions.system.accounts",
        path: "Accounts",
        element: <Accounts />,
        children: [],
      },

      {
        label: "Duyệt chứng từ",
        claims: "Permissions.voucher.approve",
        path: "VoucherApprove",
        element: <span>Duyệt chứng từ ở đây</span>,
        children: [],
      },
    ],
  },
];

export default systemRoutes;
