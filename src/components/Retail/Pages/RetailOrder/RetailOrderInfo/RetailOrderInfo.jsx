import { FileImageOutlined } from "@ant-design/icons";
import { uuidv4 } from "@antv/xflow-core";
import { Button, Form, Image, message, Segmented, Select } from "antd";
import _ from "lodash";
import React, { memo, useCallback, useEffect, useMemo, useState } from "react";
import { Column } from "react-base-table";
import { useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import { filterKeyHelper } from "../../../../../app/Functions/filterHelper";
import {
  getAllRowKeys,
  getAllValueByColumn,
  getAllValueByRow,
} from "../../../../../app/Functions/getTableValue";
import RenderPerformanceTableCell from "../../../../../app/hooks/RenderPerformanceTableCell";
import SelectNotFound from "../../../../../Context/SelectNotFound";
import { getUserInfo } from "../../../../../store/selectors/Selectors";
import PerformanceTable from "../../../../ReuseComponents/PerformanceTable/PerformanceTable";
import { multipleTablePutApi } from "../../../../SaleOrder/API";
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
        <Image title="" style={{ height: 40 }} src={cellData} alt="SSE"></Image>
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
    width: 120,
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
    title: "Đơn vị tính",
    dataKey: "dvt",
    width: 100,
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
  const [searchOptions, setsearchOptions] = useState([]);
  const [searchColapse, setSearchColapse] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchOptionsFiltered, setsearchOptionsFiltered] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState({
    ma_kh: "",
    ten_kh: "",
    dien_thoai: "",
    diem: 0,
    tong_tien: 0,
    tong_thue: 0,
    tong_sl: 0,
    tong_ck: 0,
    voucher: "",
    tien_voucher: 0,
    tong_tt: 0,
  });

  const { listOrder, currentOrder, isScanning } =
    useSelector(getRetailOrderState);
  const { id: userId } = useSelector(getUserInfo);

  /////// Calculations functions//////////////

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

    const tong_tt =
      tong_tien + paymentInfo.tong_thue - paymentInfo.tong_ck || 0;

    const calculated = { ...paymentInfo, tong_sl, tong_tien, tong_tt };
    setPaymentInfo(calculated);
  };

  useEffect(() => {
    handleCalculatorPayment();
  }, [JSON.stringify(data)]);

  ///////////orther functions /////
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

  const fetchItemsNCustomers = ({ searchValue }) => {
    setSearchLoading(true);
    setsearchOptions([]);
    multipleTablePutApi({
      store: "Api_search_items_N_customers",
      param: {
        searchValue: filterKeyHelper(searchValue),
        userId,
      },
      data: {},
    }).then((res) => {
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

  const handleSearchItem = useDebouncedCallback((searchValue) => {
    fetchItemsNCustomers({ searchValue });
  }, 400);

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
    console.log(params.data);
    if (params.data.type === "VT") {
      const { value, label, dvt, gia } = params.data;
      handleAddRowData({
        ma_vt: value,
        ten_vt: label,
        image: "https://pbs.twimg.com/media/FfgUqSqWYAIygwN.jpg",
        ma_kho: "KVT",
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
  const handleChangeValue = (key, value) => {
    console.log(key);
    console.log(value);
    handleCalculatorPayment();
  };

  ///////Scanning//////
  const handleScanning = useMemo(() => {
    return (e) => {
      const data = e.clipboardData.getData("text");
      handleAddRowData({
        ma_vt: data,
        ten_vt: data,
        ma_kho: "TEST",
        image: "",
        dvt: "Chiếc",
        don_gia: 9999,
      });
    };
  }, [data]);

  useEffect(() => {
    if (isScanning && currentOrder === orderKey) {
      window.addEventListener("paste", handleScanning);
    }

    return () => {
      if (isScanning) window.removeEventListener("paste", handleScanning);
    };
  }, [isScanning, JSON.stringify(data)]);

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

  return (
    <div className="h-full min-h-0 flex gap-1">
      <div className="h-full min-h-0 w-full min-w-0 flex flex-column gap-1">
        <div
          className="h-full min-h-0 overflow-hidden border-round-md"
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
                className="w-full"
                value={null}
                popupMatchSelectWidth={false}
                showSearch
                placeholder="Tìm kiếm..."
                allowClear
                onDropdownVisibleChange={(value) => {
                  if (!value) setSearchColapse([]);
                }}
                notFoundContent={SelectNotFound(searchLoading, searchOptions)}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={handleSelectChange}
                onClick={() => {
                  if (_.isEmpty(searchOptions)) {
                    fetchItemsNCustomers({ searchValue: "" });
                  }
                }}
                optionLabelProp="value"
                onSearch={handleSearchItem}
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
                        key={item.value}
                        value={item.value}
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
                  setRetailOrderScanning(!isScanning);
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
          <Form
            form={itemForm}
            component={false}
            initialValues={{}}
            onValuesChange={handleChangeValue}
          >
            <PerformanceTable
              selectable
              columns={columns}
              data={data}
              onSelectedRowKeyChange={handleSelectedRowKeyChange}
            />
          </Form>
        </div>
        <div
          className="border-round-md flex gap-2 p-2 "
          style={{
            height: "3.15rem",
            flexShrink: 0,
            background: "aliceblue",
          }}
        >
          <Button className="default_button">
            <i
              className="pi pi-pencil warning_text_color"
              style={{ fontWeight: "bold" }}
            ></i>
          </Button>

          <Button
            className="default_button"
            danger
            onClick={handleRemoveRowData}
          >
            <i className="pi pi-trash" style={{ fontWeight: "bold" }}></i>
          </Button>

          <Button className="default_button">
            <i
              className="pi pi-print sub_text_color"
              style={{ fontWeight: "bold" }}
            ></i>
          </Button>

          <Button className="default_button">
            <i
              className="pi pi-angle-left sub_text_color"
              style={{ fontWeight: "bold" }}
            ></i>
          </Button>

          <Button className="default_button">
            <i
              className="pi pi-angle-right sub_text_color"
              style={{ fontWeight: "bold" }}
            ></i>
          </Button>
        </div>
      </div>
      <RetailPaidInfo itemForm={itemForm} paymentInfo={paymentInfo} />
    </div>
  );
};

export default memo(RetailOrderInfo);
