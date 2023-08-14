import { Form, Input } from "antd";
import React, { memo } from "react";

const MasterInfoCustomer = ({ action }) => {
  return (
    <div className="split__view__detail__group">
      <div className="split__view__detail__primary__items">
        <div className="default_modal_1_row_items">
          <span className="default_bold_label" style={{ width: "100px" }}>
            Tên khách hàng
          </span>
          <Form.Item
            className="flex-1"
            name="customerName"
            rules={[{ required: true, message: "Điền tên khách hàng" }]}
          >
            <Input
              className={action === "VIEW" ? "default_disable_input" : ""}
              disabled={action === "VIEW" ? true : false}
              placeholder="Nhập tên khách"
            />
          </Form.Item>
        </div>
      </div>
      <div className="split__view__detail__primary__items">
        <div className="split__view__detail__primary__item">
          <span className="default_bold_label" style={{ width: "100px" }}>
            Điện thoại
          </span>

          <Form.Item
            className="flex-1"
            name="phone"
            rules={[{ required: true, message: "Điền số điện thoại" }]}
          >
            <Input
              className={action === "VIEW" ? "default_disable_input" : ""}
              disabled={action === "VIEW" ? true : false}
              placeholder="Nhập số điện thoại"
            />
          </Form.Item>
        </div>
        <div className="default_modal_1_row_items">
          <span className="default_bold_label" style={{ width: "100px" }}>
            Địa chỉ
          </span>

          <Form.Item
            className="flex-1"
            name="address"
            rules={[{ required: true, message: "Điền địa chỉ" }]}
          >
            <Input
              className={action === "VIEW" ? "default_disable_input" : ""}
              disabled={action === "VIEW" ? true : false}
              placeholder="Nhập địa chỉ"
            />
          </Form.Item>
        </div>
      </div>
      <div className="split__view__detail__primary__items">
        <div className="split__view__detail__primary__item">
          <span className="default_bold_label" style={{ width: "100px" }}>
            Ngày sinh
          </span>

          <Form.Item
            className="flex-1"
            name="birthDay"
            rules={[{ required: true, message: "Điền ngày sinh" }]}
          >
            <Input
              className={action === "VIEW" ? "default_disable_input" : ""}
              disabled={action === "VIEW" ? true : false}
              placeholder="Nhập ngày sinh"
            />
          </Form.Item>
        </div>
        <div className="default_modal_1_row_items">
          <span className="default_bold_label" style={{ width: "100px" }}>
            Tên tuyến
          </span>

          <Form.Item
            className="flex-1"
            name="tourName"
            rules={[{ required: true, message: "Điền tuyến" }]}
          >
            <Input
              className={action === "VIEW" ? "default_disable_input" : ""}
              disabled={action === "VIEW" ? true : false}
              placeholder="Nhập tuyến"
            />
          </Form.Item>
        </div>
      </div>
    </div>
  );
};

export default memo(MasterInfoCustomer);
