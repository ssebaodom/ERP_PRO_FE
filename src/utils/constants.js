import acceptPerson from "../Icons/accept__person.svg";
import addVoucher from "../Icons/add__voucher.svg";
import cart from "../Icons/cart.svg";
import location from "../Icons/location.svg";

export const APP_CONFIG = {
  debug: true,
  apiUrl: process.env.REACT_APP_ROOT_API,
};

export const formStatus = {
  ADD: "ADD",
  EDIT: "EDIT",
  VIEW: "VIEW",
};

export const FILE_EXTENSION = {
  EXCEL: "EXCEL",
  PDF: "PDF",
  CSV: "CSV",
  OTHER: "OTHER",
};

export const STATISTICS_ICONS = {
  SO: {
    title: "Đơn hàng bán",
    icon: addVoucher,
  },
  OL: {
    title: "nghỉ phép",
    icon: acceptPerson,
  },
  PO: {
    title: "Đơn hàng mua",
    icon: cart,
  },
  DT: {
    title: "Điểm bán",
    icon: location,
  },
  BT: {
    title: "Test",
    icon: location,
  },
};

export const SIMPLECHARTS = {
  SO: {
    title: "Đơn hàng bán",
    type: "column",
    store: "",
  },
  FS: {
    title: "Doanh thu",
    type: "column",
  },
  NB: {
    title: "Khách hàng mới",
    type: "column",
    store: "",
  },
  MC: {
    title: "Độ phủ",
    type: "circle",
    store: "",
  },
  TEST: {
    title: "test",
    type: "circle",
    store: "",
  },
};
