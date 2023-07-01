import ReplyTicket from "../components/DMS/Pages/Ticket/ReplyTicket/ReplyTicket";
import TicketList from "../components/DMS/Pages/Ticket/TicketList/TicketList";
import TicketType from "../components/DMS/Pages/Ticket/TicketType/TicketType";

const ticketRoutes = [
  {
    label: "Ticket",
    claims: "Produce.ticket",
    path: "ticket",
    children: [],
  },
  {
    label: "Danh mục ticket",
    claims: "Produce.ticket.ticketList",
    path: "ticket/ticketList",
    parent: "ticket",
    element: <TicketList />,
  },
  {
    label: "Phản hồi ticket",
    claims: "Produce.ticket.ticketReply",
    path: "ticket/ticketReply",
    parent: "ticket",
    element: <ReplyTicket />,
  },
  {
    label: "Danh mục loại ticket",
    claims: "Produce.ticket.ticketType",
    path: "ticket/ticketType",
    parent: "ticket",
    element: <TicketType />,
  },
];

export default ticketRoutes;
