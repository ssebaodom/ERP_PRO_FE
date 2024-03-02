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
  SAVED: "SAVED",
};

export const FILE_EXTENSION = {
  EXCEL: "EXCEL",
  PDF: "PDF",
  CSV: "CSV",
  OTHER: "OTHER",
};
export const STATISTICS_LIMIT = 4;
export const STATISTICS_MIN = 4;
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
export const SIMPLECHARTS_LIMIT = 4;
export const SIMPLECHARTS_MIN = 1;
export const SIMPLECHARTS = {
  SO: {
    title: "Đơn hàng bán",
    type: "bar",
    store: "",
  },
  FS: {
    title: "Doanh thu",
    type: "bar",
  },
  NB: {
    title: "Khách hàng mới",
    type: "bar",
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

export const CHARTCOLORS = [
  "#8BC1F7",
  "#519DE9",
  "#06C",
  "#7CC674",
  "#4CB140",
  "#3ba272",
  "#009596",
  "#B2B0EA",
  "#8481DD",
  "#F6D173",
  "#F0AB00",
  "#C9190B",
];
