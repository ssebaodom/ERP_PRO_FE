import { Modal } from "antd";
import React, { memo } from "react";

const RetailPaymentConfirm = ({ onOk, isOpen, onClose }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title="Xác nhận thanh toán"
      destroyOnClose={true}
      cancelText="Đóng"
      onOk={() => {
        onOk();
      }}
      onCancel={onClose}
      centered
    >
      <span>Vui lòng kiểm tra lại các thông tin trước khi thanh toán</span>
    </Modal>
  );
};

export default memo(RetailPaymentConfirm);
