import React, { useEffect, useState } from "react";
import "./ModalDetailImages.css";
import { Image, Modal, Space } from "antd";

import send_icon from "../../../../Icons/send_icon.svg";
import {
  ApiGetTaskDetail,
  ApiGetTaskMaster,
  SoFuckingUltimateApi,
} from "../../API";

const ModalDetailImages = (props) => {
  const [isOpenModal, setOpenModal] = useState();

  const handleCancelModal = () => {
    setOpenModal(false);
    props.handleCloseModal(false);
  };

  const getDataEdit = (id) => {
    ApiGetTaskMaster({ id: 1, orderby: "id" }).then((res) => {});
  };

  useEffect(() => {
    setOpenModal(props.openModalState);
    if (props.currentRecord && props.openModalState) {
      console.log(props.currentRecord);
      getDataEdit(props.currentRecord ? props.currentRecord : 0);
    }
  }, [JSON.stringify(props)]);

  return (
    <Modal
      className="default_modal detail__image__modal"
      style={{ height: "88vh" }}
      open={isOpenModal}
      onCancel={handleCancelModal}
      closable={false}
      centered
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      width={1000}
    >
      <div className="default_modal_header">
        <span className="default_header_label">Xem ảnh</span>
      </div>
      <div className="default_modal_container">
        <div className="default_modal_group_items">
          <Image
            style={{ flex: "0.6" }}
            src={props.currentRecord.src}
            alt={props.currentRecord.alt}
          />
          <div className="image__detail__info">
            <div>
              <p>
                Tên khách hàng:{" "}
                <span style={{ color: "#5f9df7" }}>cơm bảo trâm</span>
              </p>
              <p>
                Hình thức: <span style={{ color: "#5f9df7" }}>Điểm bán</span>
              </p>
              <p>
                Phân loại: <span style={{ color: "#5f9df7" }}>Nhà hàng</span>
              </p>
              <p>
                Địa chỉ:{" "}
                <span style={{ color: "#5f9df7" }}>
                  Giáp Hải, Giáp Hải, Q. Long Biên, Thành Phố Hà Nội
                </span>
              </p>
              <p>
                Album: <span style={{ color: "#5f9df7" }}>Biển hiệu</span>
              </p>
              <p>
                Chụp bởi: <span style={{ color: "#5f9df7" }}>Vũ Hồng Vân</span>
              </p>
              <p>
                Thời gian tạo:{" "}
                <span style={{ color: "#5f9df7" }}>7/6/2023 4:36:00 PM</span>
              </p>
            </div>
            <div>
              <iframe
                src={`https://maps.google.com/maps?q=20.996257312359095, 105.80254243742307&z=15&output=embed`}
                title="google map projection 1"
                className="gg__map__embed"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDetailImages;
