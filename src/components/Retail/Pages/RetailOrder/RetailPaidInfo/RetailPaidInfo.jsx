import { Button, Input, InputNumber, message, Switch } from "antd";
import _ from "lodash";
import React, { memo, useEffect, useState } from "react";
import {
  getAllRowKeys,
  getAllValueByRow,
} from "../../../../../app/Functions/getTableValue";
import { formatCurrency } from "../../../../../app/hooks/dataFormatHelper";
import { num2words } from "../../../../../app/Options/DataFomater";
import AddCustomerPopup from "../AddCustomerPopup/AddCustomerPopup";

const { Search } = Input;
const RetailPaidInfo = ({ itemForm, paymentInfo }) => {
  const [paymentData, setPaymentData] = useState({});
  const [change, setChange] = useState(0);

  const handleSave = () => {
    const data = { ...itemForm.getFieldsValue() };
    console.log(data);
    const detailData = [];

    getAllRowKeys(data).map((item) => {
      return detailData.push(getAllValueByRow(item, data));
    });

    if (_.isEmpty(detailData)) {
      message.warning("Vui lòng thêm vật tư !");
      return;
    }

    console.log("SAVED", detailData);
  };

  useEffect(() => {
    if (!_.isEmpty(paymentInfo)) {
      console.log(paymentInfo);

      setPaymentData(paymentInfo);
    }
    return () => {};
  }, [paymentInfo]);

  return (
    <div
      className="border-round-lg overflow-hidden flex flex-column align-items-center justify-content-between"
      style={{ width: "23rem", flexShrink: 0, background: "white" }}
    >
      <div className="retail_info_container overflow-y-auto p-2 w-full min-w-0">
        <div className="flex justify-content-between mb-3">
          <span className="primary_bold_text text-lg line-height-4">
            Thông tin khách hàng:
          </span>
          <AddCustomerPopup />
        </div>

        <div
          className="retail-customer-info relative"
          style={{ minHeight: 60 }}
        >
          {paymentData?.ma_kh ? (
            <>
              <p className="">
                <b>{paymentData?.ma_kh}</b> -{" "}
                {paymentData?.ten_kh || "Không có dữ liệu"}
              </p>
              <p className="">
                {paymentInfo?.dien_thoai?.trim() || "Không có số điện thoại"}
              </p>
              <p className="primary_bold_text">
                {formatCurrency(paymentData?.diem || 0)} điểm
              </p>
            </>
          ) : (
            <b className="abs_center sub_text_color">Không có dữ liệu</b>
          )}
        </div>

        <p className="primary_bold_text text-lg line-height-4">
          Thông tin thanh toán:
        </p>

        <div className="retail_bill_info">
          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">
              Tổng tiền ({paymentData?.tong_sl || 0} sản phẩm):
            </span>
            <span className="primary_bold_text line-height-16 white-space-normal">
              {formatCurrency(paymentData?.tong_tien || 0)}
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Tổng thuế:</span>
            <span className="primary_bold_text">
              {formatCurrency(paymentData?.tong_thue || 0)}
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Tổng chiết khấu:</span>
            <span className="primary_bold_text">
              {formatCurrency(paymentData?.tong_ck || 0)}
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Voucher:</span>
            <span className="primary_bold_text">
              <Input placeholder="Mã Voucher" />
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Tiền voucher:</span>
            <span className="primary_bold_text">{formatCurrency(0)}</span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Sử dụng điểm:</span>
            <Switch defaultChecked />
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Thanh toán:</span>
            <span className="primary_bold_text">
              {formatCurrency(paymentData?.tong_tt || 0)}
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Bằng chữ:</span>
            <span className="primary_bold_text line-height-16 white-space-normal">
              {num2words(parseInt(paymentData?.tong_tt) || 0)}
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Khách đưa:</span>
            <InputNumber
              controls={false}
              min="0"
              className="w-full"
              placeholder="0"
              onChange={(e) => {
                setChange(paymentData?.tong_tt - e);
              }}
            />
          </div>
        </div>

        <div className="flex justify-content-between gap-2 align-items-center">
          <span className="w-6 flex-shrink-0">Trả lại:</span>
          <span className="primary_bold_text danger_text_color">
            {formatCurrency(change)}
          </span>
        </div>
      </div>

      <div className="retail-action-container p-2 w-full">
        <Button className="w-full" onClick={handleSave}>
          Thanh toán
        </Button>
      </div>
    </div>
  );
};

export default memo(RetailPaidInfo);