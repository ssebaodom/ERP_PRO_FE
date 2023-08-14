import { lazy } from "react";
import Home from "../pages/Home/Home";
import App from "../App";
import Invoices from "../pages/Invoices";
import KPIChecin from "../components/KPI/Pages/KPICheckin/KPIChecin";
import KPISaleIn from "../components/KPI/Pages/KPISaleIn/KPISaleIn";
import HDMH from "../components/Invoices/Pages/HDMH/HDMH";
import HDBH from "../components/Invoices/Pages/HDBH/HDBH";
import Errorpage from "../components/Error/Errorpage";
import TimeKeepingSchedule from "../components/HR/Pages/TimeKeepingSchedule/TimeKeepingSchedule";
import TimeKeepingDetail from "../components/HR/Pages/TimeKeepingScheduleDetail/TimeKeepingDetail";
import Dashboard from "../pages/Dashboard/Pages/Dashboard";
import taskRoutes from "./task";
import TourList from "../components/DMS/Pages/Tour/TourList";
import documentsRoutes from "./document";
import ticketRoutes from "./ticket";
import DMSCustomerList from "../components/DMS/Pages/DMSCustomerList/DMSCustomerList";
import imageRoutes from "./images";
import System from "../pages/System/Pages/System";
import systemRoutes from "./system";

const Login = lazy(() =>
  import("../pages/Login/Login")
);

const homeRoutes = [
  {
    label: "Login nè",
    claims: "Produce.login",
    path: "/login",
    element: <Login />,
    index: true,
  },
  {
    label: "Home nè",
    claims: "Produce.home",
    path: "/",
    element: <App />,
    children: [
      {
        label: "Dashboard",
        claims: "Produce.dshboard",
        path: "Dashboard",
        element: <Dashboard />,
        children: [],
      },
      ...taskRoutes,
      {
        label: "Danh mục tuyến",
        claims: "Produce.tour",
        path: "tour",
        element: <TourList />,
      },
      // {
      //   label: "Hoá đơn",
      //   claims: "Produce.invoice",
      //   path: "invoices",
      //   children: [],
      // },
      // {
      //   label: "Hoá đơn mua hàng",
      //   claims: "Produce.invoice.abc",
      //   path: "invoices/HDMH",
      //   parent: "invoices",
      //   element: <HDMH />,
      // },
      // {
      //   label: "Hoá đơn bán hàng",
      //   claims: "Produce.invoice.abc",
      //   path: "invoices/HDBH",
      //   parent: "invoices",
      //   element: <HDBH />,
      // },
      // {
      //   label: "HR",
      //   claims: "Produce.HR",
      //   path: "HR",
      //   children: [],
      // },
      // {
      //   label: "Bảng chấm công",
      //   claims: "Produce.HR.Schedule",
      //   path: "HR/Schedule",
      //   parent: "HR",
      //   element: <TimeKeepingSchedule />,
      // },
      // {
      //   label: "Bảng chấm công chi tiết",
      //   claims: "Produce.HR.ScheduleDetail",
      //   path: "HR/ScheduleDetail",
      //   parent: "HR",
      //   element: <TimeKeepingDetail />,
      // },

      // {
      //   label: "KPI",
      //   claims: "Produce.KPI",
      //   path: "KPI",
      //   children: [],
      // },
      // {
      //   label: "KPI Viếng thăm",
      //   claims: "Produce.KPI.Checkin",
      //   path: "KPI/Checkin",
      //   parent: "KPI",
      //   element: <KPIChecin />,
      // },
      // {
      //   label: "KPI Doanh thu",
      //   claims: "Produce.KPI.SO",
      //   path: "KPI/SO",
      //   parent: "KPI",
      //   element: <KPISaleIn />,
      // },
      // {
      //   label: "KPI Viếng thăm",
      //   claims: "Produce.KPI.Checkin",
      //   path: "KPI/Checkin3",
      //   parent: "KPI",
      //   element: <KPIChecin />,
      // },
      // {
      //   label: "KPI Quần què gì đó",
      //   claims: "Produce.KPI.Checkin",
      //   path: "KPI/Checkin4",
      //   parent: "KPI",
      //   element: <KPIChecin />,
      // },
      // {
      //   label: "KPI Viếng thăm",
      //   claims: "Produce.KPI.Checkin",
      //   path: "KPI/Checkin5",
      //   parent: "KPI",
      //   element: <KPIChecin />,
      // },
      // {
      //   label: "KPI Viếng thăm",
      //   claims: "Produce.KPI.Checkin",
      //   path: "KPI/Checkin6",
      //   parent: "KPI",
      //   element: <KPIChecin />,
      // },
      // {
      //   label: "KPI Viếng thăm",
      //   claims: "Produce.KPI.Checkin",
      //   path: "KPI/Checkin7",
      //   parent: "KPI",
      //   element: <KPIChecin />,
      // },
      ...documentsRoutes,
      ...ticketRoutes,
      {
        label: "Khách hàng DMS",
        claims: "Produce.DMSCustomer",
        path: "DMSCustomer",
        element: <DMSCustomerList />,
      },
      ...imageRoutes,
      ...systemRoutes,
    ],
  },
  {
    path: "*",
    element: <Errorpage />,
  },
];

export default homeRoutes;
