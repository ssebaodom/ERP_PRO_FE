import CustomerResource from "../components/DMS/Pages/CustomerResource/CustomerResource";
import CustomerClassify from "../components/DMS/Pages/CustomerClassify/CustomerClassify";
import CustomerForm from "../components/DMS/Pages/CustomerForm/CustomerForm";
import CustomerArea from "../components/DMS/Pages/CustomerArea/CustomerArea";

const documentsRoutes = [
  {
    label: "Danh mục từ điển",
    claims: "Produce.documents",
    path: "documents",
    children: [],
  },
  //   {
  //     label: "Danh mục album",
  //     claims: "Produce.documents.dmalbum",
  //     path: "documents/albumslist",
  //     parent: "documents",
  //     element: <span>123abc</span>,
  //   },
  //   {
  //     label: "Danh mục loại công việc",
  //     claims: "Produce.documents.dmloaicv",
  //     path: "documents/tasktypelist",
  //     parent: "documents",
  //     element: <span>123abc</span>,
  //   },
  {
    label: "Danh mục nguồn khách hàng",
    claims: "Produce.documents.customerresource",
    path: "documents/customerresource",
    parent: "documents",
    element: <CustomerResource />,
  },
  {
    label: "Danh mục phân loại",
    claims: "Produce.documents.classifylist",
    path: "documents/classifylist",
    parent: "documents",
    element: <CustomerClassify />,
  },
  {
    label: "Danh mục hình thức",
    claims: "Produce.documents.customerform",
    path: "documents/customerform",
    parent: "documents",
    element: <CustomerForm />,
  },
  {
    label: "Danh mục khu vực",
    claims: "Produce.documents.customerarea",
    path: "documents/customerarea",
    parent: "documents",
    element: <CustomerArea />,
  },
];

export default documentsRoutes;
