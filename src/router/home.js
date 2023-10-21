import { lazy } from "react";
import App from "../App";
import DMSCustomerList from "../components/DMS/Pages/DMSCustomerList/DMSCustomerList";
import TourList from "../components/DMS/Pages/Tour/TourList";
import Errorpage from "../components/Error/Errorpage";
import ApproveInvoice from "../components/Invoices/Pages/ApproveInvoice/ApproveInvoice";
import Dashboard from "../pages/Dashboard/Pages/Dashboard";
import documentsRoutes from "./document";
import imageRoutes from "./images";
import itemsRoute from "./items";
import reportsRoute from "./report";
import SORoutes from "./saleorder";
import systemRoutes from "./system";
import taskRoutes from "./task";
import ticketRoutes from "./ticket";

const Login = lazy(() => import("../pages/Login/Login"));

const homeRoutes = [
  {
    label: "Login nè",
    claims: "Permissions.login",
    path: "/login",
    element: <Login />,
    index: true,
  },
  {
    label: "Home nè",
    claims: "Permissions.home",
    path: "/",
    element: <App />,
    children: [
      {
        label: "Dashboard",
        claims: "Permissions.dashboard",
        path: "Dashboard",
        element: <Dashboard />,
        children: [],
      },
      ...taskRoutes,
      {
        label: "Danh mục tuyến",
        claims: "Permissions.tour",
        path: "tour",
        element: <TourList />,
      },
      // {
      //   label: "Hoá đơn",
      //   claims: "Permissions.invoice",
      //   path: "invoices",
      //   children: [],
      // },
      // {
      //   label: "Hoá đơn mua hàng",
      //   claims: "Permissions.invoice.abc",
      //   path: "invoices/HDMH",
      //   parent: "invoices",
      //   element: <HDMH />,
      // },
      // {
      //   label: "Hoá đơn bán hàng",
      //   claims: "Permissions.invoice.abc",
      //   path: "invoices/HDBH",
      //   parent: "invoices",
      //   element: <HDBH />,
      // },
      // {
      //   label: "HR",
      //   claims: "Permissions.HR",
      //   path: "HR",
      //   children: [],
      // },
      // {
      //   label: "Bảng chấm công",
      //   claims: "Permissions.HR.Schedule",
      //   path: "HR/Schedule",
      //   parent: "HR",
      //   element: <TimeKeepingSchedule />,
      // },
      // {
      //   label: "Bảng chấm công chi tiết",
      //   claims: "Permissions.HR.ScheduleDetail",
      //   path: "HR/ScheduleDetail",
      //   parent: "HR",
      //   element: <TimeKeepingDetail />,
      // },

      // {
      //   label: "KPI",
      //   claims: "Permissions.KPI",
      //   path: "KPI",
      //   children: [],
      // },
      // {
      //   label: "KPI Viếng thăm",
      //   claims: "Permissions.KPI.Checkin",
      //   path: "KPI/Checkin",
      //   parent: "KPI",
      //   element: <KPIChecin />,
      // },
      // {
      //   label: "KPI Doanh thu",
      //   claims: "Permissions.KPI.SO",
      //   path: "KPI/SO",
      //   parent: "KPI",
      //   element: <KPISaleIn />,
      // },
      // {
      //   label: "KPI Viếng thăm",
      //   claims: "Permissions.KPI.Checkin",
      //   path: "KPI/Checkin3",
      //   parent: "KPI",
      //   element: <KPIChecin />,
      // },
      // {
      //   label: "KPI Quần què gì đó",
      //   claims: "Permissions.KPI.Checkin",
      //   path: "KPI/Checkin4",
      //   parent: "KPI",
      //   element: <KPIChecin />,
      // },
      // {
      //   label: "KPI Viếng thăm",
      //   claims: "Permissions.KPI.Checkin",
      //   path: "KPI/Checkin5",
      //   parent: "KPI",
      //   element: <KPIChecin />,
      // },
      // {
      //   label: "KPI Viếng thăm",
      //   claims: "Permissions.KPI.Checkin",
      //   path: "KPI/Checkin6",
      //   parent: "KPI",
      //   element: <KPIChecin />,
      // },
      // {
      //   label: "KPI Viếng thăm",
      //   claims: "Permissions.KPI.Checkin",
      //   path: "KPI/Checkin7",
      //   parent: "KPI",
      //   element: <KPIChecin />,
      // },
      ...documentsRoutes,
      ...ticketRoutes,
      {
        label: "Khách hàng DMS",
        claims: "Permissions.DMSCustomers",
        path: "DMSCustomer",
        element: <DMSCustomerList />,
      },
      ...imageRoutes,
      ...systemRoutes,
      ...SORoutes,
      ...itemsRoute,
      ...reportsRoute,
      {
        label: "Duyệt chứng từ",
        claims: "Permissions.ApproveInvoice",
        path: "ApproveInvoice",
        element: <ApproveInvoice />,
      },
    ],
  },
  {
    path: "*",
    element: <Errorpage />,
  },
];

export default homeRoutes;
