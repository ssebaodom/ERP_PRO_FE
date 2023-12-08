import KPIDashboard from "../components/KPI/Pages/Dashboard/KPIDashboard";
import KPIPerformList from "../components/KPI/Pages/KPIPerformList/KPIPerformList";
import KPIPlans from "../components/KPI/Pages/KPIPlans/KPIPlans";
const kpiRoutes = [
  {
    label: "KPI",
    claims: "Permissions.KPI",
    path: "KPI",
    children: [],
  },
  {
    label: "Tổng hợp KPI",
    claims: "Permissions.KPI.Dashboard",
    path: "KPI/Dashboard",
    parent: "KPI",
    element: <KPIDashboard />,
  },
  {
    label: "Danh sách thực hiện KPI",
    claims: "Permissions.KPI.KPIPerformList",
    path: "KPI/PerformList",
    parent: "KPI",
    element: <KPIPerformList />,
  },
  {
    label: "Kế hoạch KPI",
    claims: "Permissions.KPI.KPIPlans",
    path: "KPI/KPIPlans",
    parent: "KPI",
    element: <KPIPlans />,
  },
];

export default kpiRoutes;
