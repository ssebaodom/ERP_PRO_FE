import { Button, Input, InputNumber, message, Switch } from "antd";
import _ from "lodash";
import React from "react";
import {
  getAllRowKeys,
  getAllValueByRow,
} from "../../../../../app/Functions/getTableValue";
import { formatCurrency } from "../../../../../app/hooks/dataFormatHelper";
import { num2words } from "../../../../../app/Options/DataFomater";

const { Search } = Input;
const RetailPaidInfo = ({ itemForm }) => {
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

  return (
    <div
      className="border-round-lg overflow-hidden flex flex-column align-items-center justify-content-between"
      style={{ width: "23rem", flexShrink: 0, background: "white" }}
    >
      <div className="retail_info_container overflow-y-auto p-2 w-full min-w-0">
        <p className="primary_bold_text text-lg line-height-4">
          Thông tin khách hàng:
        </p>

        <div className="retail-customer-info">
          <p className=" ">
            <b>MHTEST123</b> - Mạch Hải Hưng
          </p>

          <p className=" ">0399209618</p>

          <p className="primary_bold_text">{formatCurrency(100000)} điểm</p>
        </div>

        <p className="primary_bold_text text-lg line-height-4">
          Thông tin thanh toán:
        </p>

        <div className="retail_bill_info">
          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Tổng tiền (6 sản phẩm):</span>
            <span className="primary_bold_text">
              {formatCurrency(10000000000)}
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Tổng thuế:</span>
            <span className="primary_bold_text">{formatCurrency(100000)}</span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Tổng chiết khấu:</span>
            <span className="primary_bold_text">{formatCurrency(100000)}</span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Voucher:</span>
            <span className="primary_bold_text">
              <Input placeholder="Mã Voucher" />
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Tiền voucher:</span>
            <span className="primary_bold_text">{formatCurrency(100000)}</span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Sử dụng điểm:</span>
            <Switch defaultChecked />
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Thanh toán:</span>
            <span className="primary_bold_text">{formatCurrency(100000)}</span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Bằng chữ:</span>
            <span className="primary_bold_text">{num2words(100000)}</span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Khách đưa:</span>
            <InputNumber
              controls={false}
              min="0"
              className="w-full"
              placeholder="0"
            />
          </div>
        </div>

        <div className="flex justify-content-between gap-2 align-items-center">
          <span className="w-6 flex-shrink-0">Trả lại:</span>
          <span className="primary_bold_text danger_text_color">
            {formatCurrency(100000)}
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

export default RetailPaidInfo;
