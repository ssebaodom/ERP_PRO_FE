import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import accept__person from "../../../Icons/accept__person.svg";
import add__voucher from "../../../Icons/add__voucher.svg";
import cart from "../../../Icons/cart.svg";
import dashboard__hi from "../../../Icons/dashboard__hi.svg";
import location from "../../../Icons/location.svg";
import { getUserInfo } from "../../../store/selectors/Selectors";
import "./Dashboard.css";
import SimpleCharts from "./SimpleCharts/SimpleCharts";

const Dashboard = () => {
  const userInfo = useSelector(getUserInfo);

  const navigate = useNavigate();

  const test = () => {
    navigate("/images/gallary", { state: { id: "MachHung" } });
  };

  return (
    <div className="dashboard page_default">
      <div className="dashboard__general__statistic__container">
        <div
          onClick={test}
          className="dashboard__general__statistic__items--hello dashboard__general__statistic__items"
        >
          <img style={{ flexShrink: "0" }} src={dashboard__hi} alt="icon hi" />
          <span>
            Chào mừng
            <span style={{ fontWeight: "Bold" }}>
              {userInfo.userName ? " " + userInfo.userName + " " : " Unknown "}
            </span>
            đã quay trở lại hệ thống!
          </span>
        </div>
        <div className="dashboard__general__statistic__items">
          <div className="dashboard__general__statistic__icon">
            <img src={add__voucher} alt="voucher" />
          </div>
          <div className="dashboard__general__statistic__details">
            <p className="dashboard__general__statistic__title">Đơn hàng mới</p>
            <span className="dashboard__general__statistic__data">100</span>
          </div>
        </div>
        <div className="dashboard__general__statistic__items">
          <div className="dashboard__general__statistic__icon">
            <img src={cart} alt="voucher" />
          </div>
          <div className="dashboard__general__statistic__details">
            <p className="dashboard__general__statistic__title">
              Đơn hàng bán mới
            </p>
            <span className="dashboard__general__statistic__data">100</span>
          </div>
        </div>
        <div className="dashboard__general__statistic__items">
          <div className="dashboard__general__statistic__icon">
            <img src={location} alt="voucher" />
          </div>
          <div className="dashboard__general__statistic__details">
            <p className="dashboard__general__statistic__title">Điểm bán mới</p>
            <span className="dashboard__general__statistic__data">100</span>
          </div>
        </div>
        <div className="dashboard__general__statistic__items">
          <div className="dashboard__general__statistic__icon">
            <img src={accept__person} alt="voucher" />
          </div>
          <div className="dashboard__general__statistic__details">
            <p className="dashboard__general__statistic__title">Đơn phép mới</p>
            <span className="dashboard__general__statistic__data">100</span>
          </div>
        </div>
      </div>
      <div className="dashboard__simple__chart__container">
        <span className="default_header_label">Báo cáo nhanh</span>
        <SimpleCharts />
      </div>
      <div className="dashboard__simple__chart__container">
        <span className="default_header_label">Bán hàng</span>

        {React.createElement(require("./Report/DashboardReport").default)}
      </div>
    </div>
  );
};

export default Dashboard;
