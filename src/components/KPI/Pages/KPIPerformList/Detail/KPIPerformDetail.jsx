import { Line } from "@ant-design/plots";
import { Modal } from "antd";
import React, { memo, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setIsOpenModal } from "../../../Store/Actions/KPIPerforms";
import { getKPIPerformState } from "../../../Store/Selectors/Selectors";
import "./../KPIPerformList.css";

const KPIPerformDetail = () => {
  const [data, setData] = useState([]);
  const KPIPerformState = useSelector(getKPIPerformState);

  const handleCloseModal = () => {
    setIsOpenModal(false);
  };

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch(
      "https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json"
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  const config = {
    data,
    padding: "auto",
    xField: "Date",
    yField: "scales",
    xAxis: {
      // type: 'timeCat',
      tickCount: 5,
    },
    smooth: true,
  };

  return (
    <Modal
      open={KPIPerformState.isOpenModal}
      onCancel={handleCloseModal}
      centered
      okButtonProps={{ style: { display: "none" } }}
      cancelButtonProps={{ style: { display: "none" } }}
      width={800}
      destroyOnClose
      title="Chi tiết "
    >
      <Line {...config} />
      <div className="KPI__modal__detail__container">
        <div>
          <span className="primary_bold_text">Thông tin KPI</span>
          <div className="KPI__detail__container">
            <p className="KPI__detail__label">Nhân viên</p>
            <p className="KPI__detail__value primary_bold_text">
              Mạch Hải Hưng
            </p>
          </div>
          <div className="KPI__detail__container">
            <p className="KPI__detail__label">Ngày bắt đầu</p>
            <p className="KPI__detail__value primary_bold_text">
              1/1/2023 - 30/1/2023
            </p>
          </div>
          <div className="KPI__detail__container">
            <p className="KPI__detail__label">Nhóm KPI</p>
            <p className="KPI__detail__value primary_bold_text">
              KPI trọng tâm doanh thu
            </p>
          </div>
          <div className="KPI__detail__container">
            <p className="KPI__detail__label">Đơn vị</p>
            <p className="KPI__detail__value primary_bold_text">Công ty SSE</p>
          </div>
          <div className="KPI__detail__container">
            <p className="KPI__detail__label">Diễn giải</p>
            <p className="KPI__detail__value primary_bold_text">
              Tính doanh thu dựa trên đơn hàng bán
            </p>
          </div>
        </div>
        <div>
          <span className="primary_bold_text">Chi tiết hoạt động</span>
          <div className="KPI__detail__container">
            <p className="KPI__detail__label">Tình trạng</p>
            <p className="KPI__detail__value primary_bold_text success_text_color">
              Vượt chỉ tiêu 🙌🙌🙌
            </p>
          </div>
          <div className="KPI__detail__container">
            <p className="KPI__detail__label">Kế hoạch</p>
            <p className="KPI__detail__value primary_bold_text">1000000000</p>
          </div>
          <div className="KPI__detail__container">
            <p className="KPI__detail__label">Thực hiện</p>
            <p className="KPI__detail__value primary_bold_text">500000000</p>
          </div>
          <div className="KPI__detail__container">
            <p className="KPI__detail__label">Ngày thực hiện tốt nhất</p>
            <p className="KPI__detail__value primary_bold_text">
              15/01/2023 - 2000000
            </p>
          </div>
          <div className="KPI__detail__container">
            <p className="KPI__detail__label">Ngày thực hiện thấp nhất</p>
            <p className="KPI__detail__value primary_bold_text">
              02/01/2023 - 200000
            </p>
          </div>
          <div className="KPI__detail__container">
            <p className="KPI__detail__label">Ngày hoàn thành KPI</p>
            <p className="KPI__detail__value primary_bold_text">29/01/2023</p>
          </div>
          <div className="KPI__detail__container">
            <p className="KPI__detail__label">Vượt chỉ tiêu</p>
            <p className="KPI__detail__value primary_bold_text">
              1000000 - 10%
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default memo(KPIPerformDetail);
