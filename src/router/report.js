import CheckinReport from "../components/Report/Pages/CheckinReport/CheckinReport";
import ReportLayout from "../components/Report/Pages/ReportLayout/ReportLayout";

const reportsRoute = [
  {
    label: "Báo cáo",
    claims: "Permissions.reports",
    path: "reports",
    element: <ReportLayout />,
    children: [
      {
        label: "Báo cáo viếng thăm",
        claims: "Permissions.reports.checkin",
        path: "checkin",
        children: [],
        element: <CheckinReport />,
      },
    ],
  },
];

export default reportsRoute;
