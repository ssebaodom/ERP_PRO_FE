import TaskList from "../components/DMS/Pages/Task/TaskList";
import Home from "../pages/Home/Home";
import Invoices from "../pages/Invoices";


const taskRoutes = [
  {
    label: "Công việc",
    claims: "Produce.task",
    path: "task",
    element: <Home />,
    children: [],
  },
  {
    label: "Danh mục công việc",
    claims: "Produce.task.dmcongviec",
    path: "task/tasklist",
    parent: "task",
    element: <TaskList />,
  },
];


export default taskRoutes