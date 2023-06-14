import TaskList from "../components/DMS/Pages/Task/TaskList";
import Test from "../components/DMS/Modals/Test";
import Home from "../pages/Home/Home";
import Invoices from "../pages/Invoices";
import Maps from "../components/DMS/Pages/Maps/Maps";
import TaskTypeList from "../components/DMS/Pages/TaskType/TaskTypeList";
import TaskSchedule from "../components/DMS/Pages/TaskSchedule/TaskSchedule";

const taskRoutes = [
  {
    label: "Công việc",
    claims: "Produce.task",
    path: "task",
    element: <Home />,
    children: [],
  },
  {
    label: "Danh mục lịch công việc",
    claims: "Produce.task.taskSchedule",
    path: "task/taskSchedule",
    parent: "task",
    element: <TaskSchedule />,
  },
  {
    label: "Danh mục công việc",
    claims: "Produce.task.dmcongviec",
    path: "task/tasklist",
    parent: "task",
    element: <TaskList />,
  },
  {
    label: "Danh mục loại công việc",
    claims: "Produce.task.dmloaicongviec",
    path: "task/tasktypelist",
    parent: "task",
    element: <TaskTypeList />,
  },
  {
    label: "Danh mục tesst",
    claims: "Produce.task.dmcongviec",
    path: "task/testt",
    parent: "task",
    element: <Test />,
  },

  {
    label: "Vị trí bất thường",
    claims: "Produce.task.locations.abnormal",
    path: "task/locations/abnormal",
    parent: "task",
    element: <Maps />,
  },
];

export default taskRoutes;
