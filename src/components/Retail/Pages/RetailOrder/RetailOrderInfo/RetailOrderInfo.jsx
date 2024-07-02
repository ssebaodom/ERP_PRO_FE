import { FileImageOutlined } from "@ant-design/icons";
import { uuidv4 } from "@antv/xflow-core";
import {
  Button,
  Form,
  Image,
  InputNumber,
  message,
  Segmented,
  Select,
  Tooltip,
} from "antd";
import _ from "lodash";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Column } from "react-base-table";
import { useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import { filterKeyHelper } from "../../../../../app/Functions/filterHelper";
import {
  getAllRowKeys,
  getAllValueByColumn,
  getAllValueByRow,
  getCellName,
  getRowKey,
} from "../../../../../app/Functions/getTableValue";
import RenderPerformanceTableCell from "../../../../../app/hooks/RenderPerformanceTableCell";
import { quantityFormat } from "../../../../../app/Options/DataFomater";
import SelectNotFound from "../../../../../Context/SelectNotFound";
import { getUserInfo } from "../../../../../store/selectors/Selectors";
import PerformanceTable from "../../../../ReuseComponents/PerformanceTable/PerformanceTable";
import { multipleTablePutApi } from "../../../../SaleOrder/API";
import RetailOrderListModal from "../../../Modals/RetailOrderListModal/RetailOrderListModal";
import {
  setCurrentRetailOrder,
  setRetailOrderList,
  setRetailOrderScanning,
} from "../../../Store/Actions/RetailOrderActions";
import { getRetailOrderState } from "../../../Store/Selectors/RetailOrderSelectors";
import RetailPaidInfo from "../RetailPaidInfo/RetailPaidInfo";

const columns = [
  {
    key: "image",
    title: "Ảnh",
    dataKey: "image",
    width: 60,
    align: Column.Alignment.CENTER,
    resizable: false,
    frozen: Column.FrozenDirection.LEFT,
    cellRenderer: ({ cellData }) =>
      cellData ? (
        <Image
          className="border-circle"
          title=""
          style={{ height: 40 }}
          src={cellData}
          alt="SSE"
        ></Image>
      ) : (
        <FileImageOutlined
          style={{
            fontSize: "35px",
          }}
        />
      ),
  },

  {
    key: "ten_vt",
    title: "Tên vật tư",
    dataKey: "ten_vt",
    className: "flex-1",
    headerClassName: "flex-1",
    width: 100,
    resizable: false,
    sortable: false,
    type: "TextArea",
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <RenderPerformanceTableCell
          rowKey={rowData?.id}
          column={column}
          cellData={cellData}
        />
      );
    },
  },

  {
    key: "ma_vt",
    title: "Mã vật tư",
    dataKey: "ma_vt",
    width: 0,
    resizable: false,
    sortable: false,
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <RenderPerformanceTableCell
          rowKey={rowData?.id}
          column={column}
          cellData={cellData}
        />
      );
    },
  },

  {
    key: "ma_kho",
    title: "Kho",
    dataKey: "ma_kho",
    width: 100,
    resizable: false,
    sortable: false,
    editable: true,
    controller: "dmkho_lookup",
    type: "AutoComplete",
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <RenderPerformanceTableCell
          rowKey={rowData?.id}
          column={column}
          cellData={cellData}
        />
      );
    },
  },

  {
    key: "dvt",
    title: "Đơn vị",
    dataKey: "dvt",
    width: 80,
    resizable: false,
    sortable: false,
    editable: true,
    type: "dvt",
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <RenderPerformanceTableCell
          rowData={rowData}
          rowKey={rowData?.id}
          column={column}
          cellData={cellData}
        />
      );
    },
  },

  {
    key: "so_luong",
    title: "Số lượng",
    dataKey: "so_luong",
    width: 100,
    resizable: false,
    sortable: false,
    editable: true,
    type: "Numeric",
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <RenderPerformanceTableCell
          rowKey={rowData?.id}
          column={column}
          cellData={cellData}
        />
      );
    },
  },

  {
    key: "don_gia",
    title: "Đơn giá",
    dataKey: "don_gia",
    width: 110,
    resizable: false,
    sortable: false,
    editable: true,
    type: "Numeric",
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <RenderPerformanceTableCell
          rowKey={rowData?.id}
          column={column}
          cellData={cellData}
        />
      );
    },
  },
];

const RetailOrderInfo = ({ orderKey }) => {
  const [itemForm] = Form.useForm();

  const [data, setData] = useState([]);
  const [selectedRowkeys, setSelectedRowkeys] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchOptions, setsearchOptions] = useState([]);
  const [searchColapse, setSearchColapse] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOptionsFiltered, setsearchOptionsFiltered] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({
    ma_kh: "",
    ten_kh: "",
    dien_thoai: "",
    diem: 0,
    ma_nt: "VND",
    ty_gia: 1,
    quy_doi_diem: 1,
    tong_tien: 0,
    thue_suat: 0,
    tong_thue: 0,
    tong_sl: 0,
    tl_ck: 0,
    tong_ck: 0,
    voucher: "",
    tien_voucher: 0,
    tong_tt: 0,
    tien_mat: 0,
    tien_the: 0,
    chuyen_khoan: 0,
  });
  const [taxOptions, setTaxOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [isOpenOrderList, setIsOpenOrderList] = useState(false);

  const searchInputRef = useRef(null);

  const { listOrder, currentOrder, isScanning } =
    useSelector(getRetailOrderState);
  const { id: userId, storeId, unitId } = useSelector(getUserInfo);

  /////// Orde List functions //////////////

  const handleOrderListModal = useCallback(() => {
    setIsOpenOrderList(!isOpenOrderList);
  }, [isOpenOrderList]);

  /////// Calculations functions////////////

  const handleCalculatorPayment = async () => {
    const changedValues = { ...itemForm.getFieldsValue() };

    const allData = getAllRowKeys(changedValues).map((item) => {
      return getAllValueByRow(item, changedValues);
    });

    const tong_sl = await getAllValueByColumn("so_luong", changedValues).reduce(
      (Sum, num) => Sum + num,
      0
    );

    const tong_tien = await allData.reduce((Sum, item) => {
      return Sum + parseFloat(item.so_luong) * parseFloat(item.don_gia);
    }, 0);

    const tong_ck = (tong_tien * paymentInfo.tl_ck) / 100;
    const tong_thue = (tong_tien * paymentInfo.thue_suat) / 100;

    const tong_tt = tong_tien + tong_thue - tong_ck || 0;

    const calculated = {
      ...paymentInfo,
      tong_sl,
      tong_tien,
      tong_tt,
      tong_ck,
      tong_thue,
    };
    setPaymentInfo(calculated);
  };

  useEffect(() => {
    handleCalculatorPayment();
  }, [JSON.stringify(data), JSON.stringify(paymentInfo)]);

  ///////////orther functions /////

  //reset Form
  const handleResetForm = useCallback(() => {
    setData([]);
    setPaymentInfo({ ...paymentInfo });
  }, []);

  // Xử lý khi thu gọn tìm kiếm
  const handleCollapseOptions = (key) => {
    const currentCollaps = [...searchColapse];
    if (currentCollaps.includes(key)) {
      currentCollaps.splice(
        currentCollaps.findIndex((item) => item === key),
        1
      );
      setSearchColapse([...currentCollaps]);
    } else setSearchColapse([...currentCollaps, key]);
  };

  // Lấy data khách hàng mà vật tư
  const fetchItemsNCustomers = ({ searchValue }) => {
    setsearchOptions([]);
    multipleTablePutApi({
      store: "Api_search_items_N_customers",
      param: {
        searchValue: filterKeyHelper(searchValue),
        unitId,
        storeId,
        userId,
      },
      data: {},
    }).then(async (res) => {
      if (res.responseModel?.isSucceded) {
        const results = [
          {
            key: "VT",
            label: <span>Vật tư</span>,
            title: "Vật tư",
            options: [..._.first(res.listObject)],
          },
          {
            key: "KH",
            label: <span>Khách hàng</span>,
            title: "Khách hàng",
            options: [..._.last(res.listObject)],
          },
        ];

        setSearchLoading(false);
        setsearchOptions([...results]);
      }
    });
  };

  // Lấy các setting cho phiếu
  const fetchRetailOptions = () => {
    multipleTablePutApi({
      store: "Api_get_retail_options",
      param: {
        userId,
      },
      data: {},
    }).then((res) => {
      if (res.responseModel?.isSucceded) {
        setCurrencyOptions(res?.listObject[0] || []);
        setTaxOptions(res?.listObject[1] || []);
        setPaymentInfo({
          ...paymentInfo,
          quy_doi_diem: parseInt(_.first(res?.listObject[2])?.val) || 0,
        });
      }
    });
  };

  // Lấy thông tin vật tư
  const handleFetchItemInfo = async ({ barcode, ma_vt, stock }) => {
    var results = {};
    await multipleTablePutApi({
      store: "Api_get_item_info",
      param: {
        barcode,
        ma_vt,
        UnitID: unitId,
        StoreID: storeId,
        StockID: stock || "",
        Currency: paymentInfo?.ma_nt,
        userId,
      },
      data: {},
    }).then((res) => {
      if (res.responseModel?.isSucceded) {
        if (_.isEmpty(_.first(res.listObject))) {
          message.warning("Barcode không tồn tại!");
          return;
        }

        const { ma_vt, ten_vt, ma_kho, dvt, gia } = _.first(
          _.first(res.listObject)
        );

        if (barcode) {
          handleAddRowData({
            ma_vt,
            ten_vt,
            ma_kho,
            image: "",
            dvt,
            so_luong: 1,
            don_gia: gia || "0",
          });
          return;
        }
        if (ma_vt) {
          results = {
            ma_vt,
            ma_kho,
            dvt,
            gia,
          };
        }
      }
    });

    return results;
  };

  // Tìm kiếm vật tư khi vào chế đọ barcode
  const handleSearchItemInfo = useDebouncedCallback((barcode) => {
    setSearchLoading(true);
    handleFetchItemInfo({ barcode, ma_vt: "", stock: "" });
    setSearchValue("");
  }, 20);

  // Tìm kiếm thông tin khách hàng và vật tư
  const handleSearchValue = useDebouncedCallback((searchValue) => {
    fetchItemsNCustomers({ searchValue });
  }, 400);

  // Set khách hàng khi thêm mới
  const handleAddCustomerComplete = useCallback(
    ({ ma_kh, ten_kh, dien_thoai }) => {
      setPaymentInfo({
        ...paymentInfo,
        ma_kh,
        ten_kh,
        dien_thoai,
        diem: 0,
      });
    },
    [paymentInfo]
  );

  //////////table functions//////////
  const handleAddOrder = async () => {
    const curListOrder = [...listOrder];
    if (curListOrder.length >= 4) {
      message.warning("Giới hạn là 4 đơn hàng");
      return;
    }
    curListOrder.push(uuidv4());

    await setRetailOrderList(curListOrder);
    setCurrentRetailOrder(_.last(curListOrder));
  };

  const handleDeleteOrder = (key) => {
    const curListOrder = [...listOrder];
    curListOrder.splice(
      curListOrder.findIndex((item) => item === key),
      1
    );
    setCurrentRetailOrder(
      currentOrder === key ? _.last(curListOrder) : currentOrder
    );
    setRetailOrderList(curListOrder);
  };

  const handleAddRowData = ({ ma_vt, ten_vt, image, ma_kho, dvt, don_gia }) => {
    setData([
      ...data,
      {
        id: uuidv4(),
        ma_vt,
        ten_vt,
        image,
        ma_kho,
        dvt,
        so_luong: 1,
        don_gia: don_gia || "0",
      },
    ]);
  };

  const handleRemoveRowData = () => {
    const filteredData = [...data].filter(
      (item) => !selectedRowkeys.includes(item?.id)
    );

    setData(filteredData);
  };

  const handleSelectedRowKeyChange = useCallback((keys) => {
    setSelectedRowkeys(keys);
  }, []);

  const handleSelectChange = (key, params) => {
    if (params.data.type === "VT") {
      const { value, label, dvt, gia, ma_kho } = params.data;
      handleAddRowData({
        ma_vt: value,
        ten_vt: label,
        image: "https://pbs.twimg.com/media/FfgUqSqWYAIygwN.jpg",
        ma_kho: ma_kho,
        dvt,
        don_gia: gia,
      });
    }

    if (params.data.type === "KH") {
      const { value, label, dien_thoai, diem } = params.data;
      setPaymentInfo({
        ...paymentInfo,
        ma_kh: value,
        ten_kh: label,
        dien_thoai,
        diem,
      });
    }
  };

  const SegmentedRender = (item, index) => {
    return (
      <div className="flex align-items-center">
        <span>{`Đơn hàng ${index + 1}`}</span>
        {item !== 1 && (
          <i
            className="pi pi-times-circle ml-2 danger_text_color"
            onClick={() => {
              handleDeleteOrder(item);
            }}
          ></i>
        )}
      </div>
    );
  };

  ////////Form Functions
  const handleChangeValue = async (cellChanged, allCells) => {
    const cellName = getCellName(_.first(Object.keys(cellChanged)));
    const cellValue = _.first(Object.values(cellChanged));
    const changedRowKey = getRowKey(_.first(Object.keys(cellChanged)));
    const rowValues = getAllValueByRow(changedRowKey, allCells);
    const allCellsValues = getAllValueByColumn(cellName, allCells);

    switch (cellName) {
      case "ma_kho":
        await handleFetchItemInfo({
          barcode: "",
          ma_vt: rowValues?.ma_vt,
          stock: cellValue,
        }).then((res) => {
          itemForm.setFieldValue(`${changedRowKey}_don_gia`, res?.gia || "0");
        });
        break;

      default:
        break;
    }
    handleCalculatorPayment();
  };

  ///////Scanning//////
  // const handleScanning = useMemo(() => {
  //   return async (e) => {
  //     const data =
  //       e?.clipboardData?.getData("text") ||
  //       "http://localhost:3000/RO/Reatailorder";

  //     setSearchValue("");
  //     await handleAddRowData({
  //       ma_vt: data,
  //       ten_vt: data,
  //       ma_kho: "TEST",
  //       image: "",
  //       dvt: "Chiếc",
  //       don_gia: 9999,
  //     });
  //   };
  // }, [data]);

  // useEffect(() => {
  //   if (isScanning && currentOrder === orderKey) {
  //     window.addEventListener("paste", handleScanning);
  //   }

  //   return () => {
  //     if (isScanning) window.removeEventListener("paste", handleScanning);
  //   };
  // }, [isScanning, JSON.stringify(data)]);

  // Search
  useEffect(() => {
    if (!_.isEmpty(searchOptions)) {
      const rawOptions = _.cloneDeep(searchOptions);

      const filteredOptions = rawOptions.map((item) => {
        if (searchColapse.includes(item.key)) {
          item.options.length = 0;
        }
        return item;
      });

      setsearchOptionsFiltered([...filteredOptions] || []);
    }
    return () => {};
  }, [JSON.stringify(searchOptions), JSON.stringify(searchColapse)]);

  useEffect(() => {
    fetchRetailOptions();
  }, []);

  return (
    <div className="h-full min-h-0 flex gap-1">
      <div className="h-full min-h-0 w-full min-w-0 flex flex-column gap-1">
        <div
          className="h-full min-h-0 overflow-hidden border-round-md flex flex-column"
          style={{ background: "#fff" }}
        >
          <div
            className="w-full p-2 flex gap-5 align-items-center"
            style={{ background: "white" }}
          >
            <div
              className="flex gap-2"
              style={{
                width: "28rem",
                flexShrink: 0,
              }}
            >
              <Select
                ref={searchInputRef}
                className="w-full"
                value={null}
                searchValue={searchValue}
                popupMatchSelectWidth={false}
                showSearch
                placeholder="Tìm kiếm..."
                allowClear
                onDropdownVisibleChange={(value) => {
                  if (!value) setSearchColapse([]);
                }}
                notFoundContent={SelectNotFound(searchLoading, searchOptions)}
                defaultActiveFirstOption={false}
                suffixIcon={false}
                filterOption={false}
                onChange={handleSelectChange}
                onFocus={() => {
                  if (_.isEmpty(searchOptions) && !isScanning) {
                    fetchItemsNCustomers({ searchValue: "" });
                  } else {
                    setSearchLoading(true);
                  }
                }}
                optionLabelProp="value"
                onSearch={(e) => {
                  setSearchValue(e);
                  if (isScanning) {
                    handleSearchItemInfo(e);
                    return;
                  }
                  handleSearchValue(e);
                }}
                listHeight={500}
              >
                {searchOptionsFiltered.map((group, index) => (
                  <Select.OptGroup
                    key={index}
                    label={
                      <div className="flex justify-content-between align-items-center">
                        <b className="primary_color">{group?.label}</b>
                        <i
                          className={`pi pi-angle-${
                            searchColapse.includes(group.key) ? "down" : "up"
                          } cursor-pointer`}
                          onClick={() => {
                            handleCollapseOptions(group.key);
                          }}
                        ></i>
                      </div>
                    }
                  >
                    {group.options.map((item) => (
                      <Select.Option
                        key={`${group.key}-${item.value}`}
                        value={`${group.key}-${item.value}`}
                        label={item.label}
                        data={item}
                      >
                        <div
                          className="flex align-items-center gap-2"
                          onMouseDown={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                          }}
                        >
                          <Image
                            preview={false}
                            role="img"
                            width={30}
                            src={
                              "https://i2.wp.com/genshinbuilds.aipurrjects.com/genshin/characters/hu_tao/image.png?strip=all&quality=100"
                            }
                          />
                          <span>{item.label}</span>
                        </div>
                      </Select.Option>
                    ))}
                  </Select.OptGroup>
                ))}
              </Select>

              <Button
                className="default_button shadow_3"
                onClick={() => {
                  setsearchOptions([]);
                  setsearchOptionsFiltered([]);
                  setRetailOrderScanning(!isScanning);
                  if (!isScanning) searchInputRef.current.focus();
                }}
              >
                <i
                  className={`pi pi-qrcode ${
                    isScanning ? "success_text_color" : "danger_text_color"
                  }`}
                  style={{ fontWeight: "bold" }}
                ></i>
              </Button>
            </div>

            <div className="Retail_order_tabs_container justify-content-end align-items-center w-full min-w-0 flex gap-2">
              <Segmented
                value={currentOrder}
                options={listOrder.map((item, index) => {
                  return {
                    label: SegmentedRender(item, index),
                    value: item,
                  };
                })}
                onChange={(value) => {
                  setRetailOrderScanning(false);
                  setCurrentRetailOrder(value);
                }}
              />
              <Button shape="circle" onClick={handleAddOrder}>
                <i className="pi pi-plus sub_text_color"></i>
              </Button>
            </div>
          </div>

          <div className="h-full min-h-0 ">
            <Form
              form={itemForm}
              component={false}
              initialValues={{}}
              onValuesChange={handleChangeValue}
            >
              <PerformanceTable
                reverseIndex
                selectable
                columns={columns}
                data={data}
                onSelectedRowKeyChange={handleSelectedRowKeyChange}
              />
            </Form>
          </div>
        </div>
        <div
          className="border-round-md flex p-2 align-items-center justify-content-between"
          style={{
            height: "3.15rem",
            flexShrink: 0,
            background: "#fff",
          }}
        >
          <div className="flex gap-2">
            <Tooltip placement="topRight" title="Xoá dữ liệu">
              <Button
                className="default_button"
                danger
                onClick={handleRemoveRowData}
              >
                <i className="pi pi-trash" style={{ fontWeight: "bold" }}></i>
              </Button>
            </Tooltip>

            <Tooltip placement="topRight" title="Khuyến mãi">
              <Button className="default_button pointer-events-none opacity-30">
                <i
                  className="pi pi-gift danger_text_color"
                  style={{ fontWeight: "bold" }}
                ></i>
              </Button>
            </Tooltip>

            <Tooltip placement="topRight" title="Thanh toán">
              <Button
                className="default_button"
                onClick={() => {
                  window.open(
                    `${window.location.origin}/transfer`,
                    "Thanh toán",
                    "screenX=1,screenY=1,left=1,top=1,menubar=0,height=" +
                      screen.height +
                      ",width=" +
                      screen.width
                  );
                }}
              >
                <i
                  className="pi pi-credit-card primary_color"
                  style={{ fontWeight: "bold" }}
                ></i>
              </Button>
            </Tooltip>

            <Tooltip placement="topRight" title="Danh sách đơn">
              <Button onClick={handleOrderListModal} className="default_button">
                <i
                  className="pi pi-list sub_text_color"
                  style={{ fontWeight: "bold" }}
                ></i>
              </Button>
            </Tooltip>
          </div>

          <div className="flex gap-3">
            <div>
              <b className="primary_bold_text mr-1">Thuế :</b>
              <Select
                style={{ width: "6rem" }}
                defaultValue={0}
                options={taxOptions}
                onChange={(e) => {
                  setPaymentInfo({
                    ...paymentInfo,
                    thue_suat: e,
                  });
                }}
              />
            </div>

            <div>
              <span className="primary_bold_text mr-1">Chiết khấu :</span>
              <InputNumber
                defaultValue={0}
                controls={false}
                min="0"
                max="100"
                style={{ width: "5rem" }}
                step={quantityFormat}
                onChange={(e) => {
                  setPaymentInfo({
                    ...paymentInfo,
                    tl_ck: e,
                  });
                }}
              />
            </div>
            <Select
              style={{ width: "8rem" }}
              defaultValue={1}
              options={currencyOptions}
              onChange={(e, option) => {
                setPaymentInfo({
                  ...paymentInfo,
                  ty_gia: e,
                  ma_nt: option.label,
                });
              }}
            />
          </div>
        </div>
      </div>
      <RetailPaidInfo
        itemForm={itemForm}
        paymentInfo={paymentInfo}
        onChangeCustomer={handleAddCustomerComplete}
        onResetForm={handleResetForm}
      />
      <RetailOrderListModal
        isOpen={isOpenOrderList}
        onClose={handleOrderListModal}
      />
    </div>
  );
};

export default memo(RetailOrderInfo);
