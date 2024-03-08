import { Avatar, Button, Col, Divider, List, Popover } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { formStatus } from "../../../../../utils/constants";
import emitter from "../../../../../utils/emitter";
import {
  addPromotionSaleOrderInfo,
  resetSaleOrder,
  setActionSaleOrder,
  setPromotionSaleOrderInfo,
} from "../../../Store/Sagas/SaleOrderActions";
import { getSaleOrderInfo } from "../../../Store/Selector/Selector";
import AddSaleOrderPromotion from "./AddSaleOrderPromotion/AddSaleOrderPromotion";

const PaymentSaleOrder = () => {
  const [promotionList, setPromotionList] = useState([]);
  const curentData = useSelector(getSaleOrderInfo);
  const { action, promotionItemsInfo, loading } = useSelector(getSaleOrderInfo);

  const handleDeletePromotionItem = (key) => {
    setPromotionSaleOrderInfo(
      promotionList.filter((item) => item.ma_vt !== key) || []
    );
    // setPromotionList(promotionList.filter((item) => item.ma_vt !== key) || []);
  };

  const handleAddbutton = async () => {
    await setActionSaleOrder(formStatus.ADD);
  };

  const handleSave = async () => {
    await emitter.emit("HANDLE_SALE_ORDER_SAVE");

    // await setActionSaleOrder(formStatus.SAVED);
  };

  useEffect(() => {
    if (action === formStatus.SAVED) {
      console.log(curentData);
    }
    return () => {};
  }, [JSON.stringify(action)]);

  useEffect(() => {
    setPromotionList(promotionItemsInfo || []);
    return () => {
      setPromotionList([]);
    };
  }, [promotionItemsInfo]);

  useEffect(() => {
    emitter.on("HANDLE_ADD_SALE_ORDER_PROMOTION", (item) => {
      addPromotionSaleOrderInfo(item);
    });
    return () => {
      emitter.removeAllListeners();
      resetSaleOrder();
    };
  }, []);

  const promotionItems = (item) => {
    return (
      <div>
        <p>
          Kho:{" "}
          <span className="primary_bold_text text-sm">
            {item?.ten_kho || ""}
          </span>
        </p>
        <p className=" primary_bold_text">
          {item?.so_luong || 0} {item?.dvt || ""}
        </p>
      </div>
    );
  };

  const popoverContent = (item) => {
    return (
      <div className="flex gap-2">
        <Button
          className="default_button"
          danger
          onClick={(event) => handleDeletePromotionItem(item?.ma_vt)}
        >
          <i className="pi pi-trash" style={{ fontWeight: "bold" }}></i>
        </Button>
      </div>
    );
  };

  return (
    <Col span={5} className="flex flex-column h-full min-h-0 gap-3">
      <div
        className="w-full h-full min-h-0 p-2 border-round-lg flex flex-column gap-2"
        style={{ background: "white" }}
      >
        <div className="flex w-full justify-content-between align-items-center">
          <span className="primary_bold_text">Hàng tặng</span>

          <AddSaleOrderPromotion
            emitterEvent={"HANDLE_ADD_SALE_ORDER_PROMOTION"}
          />
        </div>

        <div className="h-full min-h-0 flex flex-column gap-2">
          <div className="h-full min-h-0 overflow-auto">
            <List
              loading={loading}
              itemLayout="horizontal"
              dataSource={promotionList}
              renderItem={(item, index) => (
                <List.Item className="user__item">
                  <Popover
                    placement="bottomLeft"
                    content={popoverContent(item)}
                    trigger="click"
                  >
                    <List.Item.Meta
                      className="pr-1"
                      avatar={<Avatar>{item?.ten_vt?.substr(0, 1)}</Avatar>}
                      title={item?.ten_vt}
                      description={promotionItems(item)}
                    />
                  </Popover>
                </List.Item>
              )}
            />
          </div>

          <Divider
            style={{ margin: "0" }}
            orientation={"left"}
            orientationMargin={0}
          >
            <span className="primary_bold_text">Thanh toán</span>
          </Divider>

          <div>
            <div className="clear-both line-height-22">
              <p className="text-float-left">Tổng thành tiền:</p>
              <p className="text-float-right primary_bold_text">100.000.000</p>
            </div>

            <div className="clear-both line-height-22">
              <p className="text-float-left">Tổng số lượng:</p>
              <p className="text-float-right primary_bold_text">10</p>
            </div>

            <div className="clear-both line-height-22">
              <p className="text-float-left">Tổng chiết khấu:</p>
              <p className="text-float-right primary_bold_text">10.000.000</p>
            </div>

            <div className="clear-both line-height-22">
              <p className="text-float-left">Tổng thuế:</p>
              <p className="text-float-right primary_bold_text">10.000.000</p>
            </div>

            <div className="clear-both line-height-22">
              <p className="text-float-left">Tổng thanh toán:</p>
              <p className="text-float-right primary_bold_text">100.000.000</p>
            </div>
          </div>
        </div>
      </div>

      <div
        className="flex gap-2 p-2 border-round-lg justify-content-evenly flex-wrap"
        style={{ background: "white" }}
      >
        {action === formStatus.ADD && (
          <Button
            type="primary"
            className="default_primary_button"
            className="default_button"
            onClick={handleSave}
          >
            <i
              className="pi pi-check"
              style={{
                fontWeight: "bold",
                color: "white",
                fontSize: "0.99rem",
              }}
            ></i>
          </Button>
        )}

        {action !== formStatus.ADD && (
          <Button className="default_button" onClick={handleAddbutton}>
            <i
              className="pi pi-plus sub_text_color"
              style={{ fontWeight: "bold" }}
            ></i>
          </Button>
        )}

        <Button className="default_button">
          <i
            className="pi pi-pencil warning_text_color"
            style={{ fontWeight: "bold" }}
          ></i>
        </Button>
        <Button className="default_button" danger>
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
    </Col>
  );
};

export default PaymentSaleOrder;
