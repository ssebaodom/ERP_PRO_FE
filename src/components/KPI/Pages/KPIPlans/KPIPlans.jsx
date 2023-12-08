import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import HeaderTableBar from "../../../ReuseComponents/HeaderTableBar";
import KPIPlansDetail from "../../Modals/KPIPlansDetail/KPIPlansDetail";
import { setCurrentItem, setIsOpenModal } from "../../Store/Actions/KPIPlans";
import { getKPIPlansState } from "../../Store/Selectors/Selectors";
import "./KPIPlans.css";

const fakeData = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14];

const KPIPlans = () => {
  const KPIPlansState = useSelector(getKPIPlansState);

  const handleOpenDetailModal = (item) => {
    setIsOpenModal(true);
    setCurrentItem({ id: item });
  };

  return (
    <div className="page_default KPI__list">
      <HeaderTableBar
        name={"KPI"}
        title={"Kế hoạch KPI của nhân viên"}
        // changePaginations={changePaginations}
        totalResults={10}
      />
      <div className="h-full KPI__list__container KPI__Employees__container">
        {fakeData.map((item, index) => (
          <div
            key={index}
            className="default_rectangle KPI__statistic__rectangle KPI__Employee"
            onClick={() => {
              handleOpenDetailModal(item);
            }}
          >
            <div className="KPI__Employee__avartar">
              <Avatar
                size={55}
                icon={<UserOutlined style={{ fontSize: "45px" }} />}
              />
            </div>
            <div>
              <div className="KPI__detail__container">
                <p className="KPI__detail__label">Nhân viên: </p>
                <p className="KPI__detail__value primary_bold_text">
                  Mạch Hải Hưng
                </p>
              </div>
              <div className="KPI__detail__container">
                <p className="KPI__detail__label">Đơn vị: </p>
                <p className="KPI__detail__value primary_bold_text">
                  Công ty SSE
                </p>
              </div>

              <div className="KPI__detail__container">
                <p className="KPI__detail__label">Số kế hoạch: </p>
                <p className="KPI__detail__value primary_bold_text">5</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <KPIPlansDetail />
    </div>
  );
};

export default KPIPlans;
