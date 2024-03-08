import store from "../../../../store";
import { formStatus } from "../../../../utils/constants";
import { SoFuckingUltimateGetApi2 } from "../../../DMS/API";
import { saleOrderAction } from "../Slice/SaleOrderSlice";

const setSaleOrderLoading = (data) => {
  store.dispatch(saleOrderAction.setLoading(data));
};

const setOpenSaleOrderFilter = (data) => {
  store.dispatch(saleOrderAction.setIsOpenFilter(data));
};

const setSaleOrderCurrentStep = (data) => {
  store.dispatch(saleOrderAction.setCurrentStep(data));
};

const setMasterSaleOrderInfo = (data) => {
  store.dispatch(saleOrderAction.setMasterSaleOrderInfo(data));
};

const setDetailSaleOrderInfo = (data) => {
  store.dispatch(saleOrderAction.setDetailSaleOrderInfo(data));
};

const setPromotionSaleOrderInfo = (data = []) => {
  store.dispatch(saleOrderAction.setPromotionItemsInfo(data));
};

const addPromotionSaleOrderInfo = async (data = {}) => {
  const currentPromos =
    store.getState().saleOrderReducer.promotionItemsInfo || [];
  store.dispatch(
    saleOrderAction.setPromotionItemsInfo([...currentPromos, data])
  );
};

const setPaymentSaleOrderInfo = (data = {}) => {
  store.dispatch(saleOrderAction.setPaymentSaleOrderInfo(data));
};

const setCurrentSaleOrder = async (data) => {
  store.dispatch(saleOrderAction.setCurrentItemId(data));
};

const setActionSaleOrder = async (data) => {
  store.dispatch(saleOrderAction.setAction(data));
};

const fetchSaleOrderList = async (params = {}) => {
  setActionSaleOrder(formStatus.VIEW);
  const data = { columns: [], dataSource: [], totalRecords: 0 };
  await SoFuckingUltimateGetApi2({
    store: "api_sale_order_list",
    data: {
      ...params,
    },
  }).then((res) => {
    data.columns = res?.reportLayoutModel || [];
    var dataSource = res?.data || [];
    dataSource.map((item) => (item.key = item.stt_rec));
    data.dataSource = dataSource || [];
    data.totalRecords = res?.pagegination?.totalRecord || 0;
  });

  store.dispatch(saleOrderAction.setSaleOrderList(data));
  setSaleOrderLoading(false);
};

const fetchSaleOrderInfo = async (key = "") => {
  await SoFuckingUltimateGetApi2({
    store: "api_get_sale_order_info",
    data: {
      stt_rec: key,
    },
  }).then((res) => {
    const resData = _.first(res?.data) || {};
    const paymentInfo = {};
    const masterInfo = {};
    Object.keys(store.getState().saleOrderReducer.paymentInfo).map((item) => {
      paymentInfo[`${item}`] = resData[`${item}`] || null;
    });

    Object.keys(store.getState().saleOrderReducer.masterInfo).map((item) => {
      masterInfo[`${item}`] = resData[`${item}`] || null;
    });

    setMasterSaleOrderInfo(masterInfo);
    setPaymentSaleOrderInfo(paymentInfo);
  });

  await SoFuckingUltimateGetApi2({
    store: "api_get_sale_order_detail",
    data: {
      stt_rec: key,
    },
  }).then((res) => {
    var data = res?.data || [];
    data.map((item) => (item.key = item.stt_rec0));

    const layout = res?.reportLayoutModel.map((item) => {
      if (item.field === "ma_vt") {
        return {
          title: item.name,
          dataIndex: item.field,
          type: item.type,
          editable: true,
          key: item.field,
          reference: "ten_vt",
          controller: "dmvt_lookup",
          required: true,
        };
      }
      if (item.field === "ma_kho") {
        return {
          title: item.name,
          dataIndex: item.field,
          type: item.type,
          editable: true,
          key: item.field,
          reference: "ten_kho",
          controller: "dmkho_lookup",
          required: true,
        };
      }
      if (item.field === "dvt") {
        return {
          title: item.name,
          dataIndex: item.field,
          type: item.type,
          editable: true,
          key: item.field,
          controller: "dmdvt_lookup",
          required: true,
        };
      }

      return {
        title: item.name,
        dataIndex: item.field,
        type: item.type,
        editable: true,
        key: item.field,
      };
    });

    setDetailSaleOrderInfo({ columns: layout || [], data });

    setSaleOrderLoading(false);
  });

  setPromotionSaleOrderInfo([
    {
      ma_vt: "1",
      ten_vt: "Ant Design Title 1",
      ma_kho: "test",
      ten_kho: "Kho Nguyễn Khang",
      so_luong: 123.99,
      dvt: "Cái",
    },
    {
      ma_vt: "2",
      ten_vt: "Ant Design Title 2",
      ten_kho: "Kho test 2",
      so_luong: 123.01,
      dvt: "Chiếc",
    },
    {
      ma_vt: "3",
      ten_vt: "Ant Design Title 3",
      ten_kho: "Kho test 3",
      so_luong: 123.02,
      dvt: "Thùng",
    },
    {
      ma_vt: "4",
      ten_vt: "Ant Design Title 4",
      ten_kho: "Kho test 4",
      so_luong: 123.55,
      dvt: "Chai",
    },
  ]);
};

const resetSaleOrder = async (data) => {
  store.dispatch(saleOrderAction.resetSaleOrder());
};

export {
  setCurrentSaleOrder,
  setActionSaleOrder,
  setMasterSaleOrderInfo,
  setSaleOrderLoading,
  setSaleOrderCurrentStep,
  setDetailSaleOrderInfo,
  setPromotionSaleOrderInfo,
  fetchSaleOrderInfo,
  fetchSaleOrderList,
  setOpenSaleOrderFilter,
  addPromotionSaleOrderInfo,
  setPaymentSaleOrderInfo,
  resetSaleOrder,
};
