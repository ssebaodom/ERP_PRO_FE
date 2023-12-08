import { Statistic } from "antd";
import { ProgressBar } from "primereact/progressbar";
import React from "react";
import HeaderTableBar from "../../../ReuseComponents/HeaderTableBar";
import {
  setCurrentItem,
  setIsOpenModal,
} from "../../Store/Actions/KPIPerforms";
import KPIPerformDetail from "./Detail/KPIPerformDetail";
import "./KPIPerformList.css";

const fakeData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const KPIPerformList = () => {
  const handleOpenDetailModal = (item) => {
    setIsOpenModal(true);
    setCurrentItem({ id: item });
  };

  return (
    <div className="page_default KPI__list">
      <HeaderTableBar
        name={"KPI"}
        title={"Danh sách thực hiện KPI"}
        // changePaginations={changePaginations}
        totalResults={10}
      />
      <div className="h-full KPI__list__container">
        {fakeData.map((item, index) => (
          <div
            key={index}
            className="default_rectangle flex flex-column justify-content-between KPI__statistic__rectangle"
            onClick={() => {
              handleOpenDetailModal(item);
            }}
          >
            <div>
              <Statistic
                className="KPI__statistic"
                title="Báo cáo vị trí 1"
                valueStyle={{
                  color: "#4779CF",
                }}
                value={Math.floor(Math.random() * 1000000) + 100}
              />
              <div className="KPI__detail__container">
                <p className="KPI__detail__label">Nhân viên: </p>
                <p className="KPI__detail__value primary_bold_text">
                  Mạch Hải Hưng
                </p>
              </div>
              <div className="KPI__detail__container">
                <p className="KPI__detail__label">Hiệu lực: </p>
                <p className="KPI__detail__value primary_bold_text">10/2023</p>
              </div>
              <div className="KPI__detail__container">
                <p className="KPI__detail__label">Kế hoạch :</p>
                <p className="KPI__detail__value primary_bold_text">1000000</p>
              </div>
            </div>
            <div>
              <span className="dark_grey_text_color">
                Tiến độ: <b>60/100</b>
              </span>
              <ProgressBar
                pt={{
                  value: {
                    style: {
                      background: "linear-gradient(to right, #657194, #4779CF)",
                    },
                  },
                }}
                value={60}
                style={{ height: "6px" }}
                showValue={false}
              ></ProgressBar>
            </div>
          </div>
        ))}
      </div>

      <KPIPerformDetail key={"KPIDetail"} />
    </div>
  );
};

export default KPIPerformList;
