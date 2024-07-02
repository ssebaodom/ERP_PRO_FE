import { Input, message, Modal } from "antd";
import React, { useRef, useState } from "react";

const PrintRetailModal = ({ item, isOpen, onClose }) => {
  const { so_ct, ngay_ct, ma_kh, ten_kh, t_tt } = item;

  const inputPassword = useRef("");
  const [password, setPassword] = useState("123ABC");
  const [messageApi, contextHolder] = message.useMessage();

  const handleOK = async () => {
    if (password === inputPassword?.current?.input?.value || "") {
      messageApi.success("In thành công !");
      const to = await setTimeout(() => {
        onClose();
      }, 1500);
    } else messageApi.warning("Sai mật khẩu !");
  };

  return (
    <Modal
      centered
      open={isOpen}
      destroyOnClose={true}
      onCancel={onClose}
      onOk={handleOK}
    >
      {contextHolder}
      <p className="primary_bold_text text-lg line-height-4">In đơn hàng</p>
      <div className="retail-customer-info mb-2">
        <div>
          <span>Số chứng từ: </span>
          <b className="sub_text_color">{so_ct}</b>
        </div>
        <div>
          <span>Ngày chứng từ: </span>
          <b className="sub_text_color">{ngay_ct}</b>
        </div>
        <div>
          <span>Khách hàng: </span>
          <b className="sub_text_color">
            {ma_kh} - {ten_kh}
          </b>
        </div>
        <div>
          <span>Tiền thanh toán: </span>
          <b className="sub_text_color">{t_tt}</b>
        </div>
      </div>
      <div>
        <label>Nhập mật khẩu</label>
        <Input.Password
          ref={inputPassword}
          required
          minLength={8}
          placeholder="Nhập mật khẩu"
        />
      </div>
    </Modal>
  );
};

export default PrintRetailModal;
