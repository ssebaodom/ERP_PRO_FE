import { Column } from "@ant-design/plots";
import { Progress } from "antd";
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

const Dashboard = () => {
  const userInfo = useSelector(getUserInfo);

  const color = ["#E2E4EE", "#D5D7E2", "#4779CF"];
  const data = [
    {
      month: "1",
      sales: 38,
      index: 1,
    },
    {
      month: "2",
      sales: 48,
      index: 2,
    },
    {
      month: "3",
      sales: 58,
      index: 3,
    },
  ];

  const config = {
    data,
    xField: "month",
    yField: "sales",
    columnStyle: {
      radius: [10, 10, 0, 0],
    },
    color: ({ month }) => {
      var curColor = "";
      data.map((item, index) => {
        if (item.month === month) {
          return (curColor = color[index]);
        }
      });
      return curColor;
    },

    tooltip: {
      showTitle: false,
      formatter: (data) => {
        return { name: `Tháng: ${data.month}`, value: `${data.sales} đơn` };
      },
      domStyles: {
        "g2-tooltip": {
          width: "max-content",
        },
      },
    },
  };

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
        <span className="default_header_label">Số liệu chung</span>
        <div className="dashboard__simple__chart__items__container">
          <div className="dashboard__simple__chart__tag">
            <div className="dashboard__simple__chart__tag__title">
              Đơn hàng bán
            </div>
            <div className="dashboard__simple__chart__tag__details">
              <div className="dashboard__simple__chart__tag__details__chart">
                <Column className="dashboard__simple__chart" {...config} />
              </div>
              <div className="dashboard__simple__chart__tag__details__data">
                <p>
                  <span className="dashboard__general__statistic__data">
                    100{" "}
                  </span>{" "}
                  Đơn
                </p>
                <p>
                  <span>*</span> {-3.5} %
                </p>
                <p>Tháng trước {" 69,96 tỷ"}</p>
              </div>
            </div>
          </div>
          <div className="dashboard__simple__chart__tag">
            <div className="dashboard__simple__chart__tag__title">
              Doanh thu
            </div>
            <div className="dashboard__simple__chart__tag__details">
              <div className="dashboard__simple__chart__tag__details__chart">
                <Column className="dashboard__simple__chart" {...config} />
              </div>
              <div className="dashboard__simple__chart__tag__details__data">
                <p>
                  <span className="dashboard__general__statistic__data">
                    100{" "}
                  </span>{" "}
                  Đơn
                </p>
                <p>
                  <span>*</span> 3.5%
                </p>
                <p>Tháng trước {" 69,96 tỷ"}</p>
              </div>
            </div>
          </div>
          <div className="dashboard__simple__chart__tag">
            <div className="dashboard__simple__chart__tag__title">
              Khách hàng mới
            </div>
            <div className="dashboard__simple__chart__tag__details">
              <div className="dashboard__simple__chart__tag__details__chart">
                <Column className="dashboard__simple__chart" {...config} />
              </div>
              <div className="dashboard__simple__chart__tag__details__data">
                <p>
                  <span className="dashboard__general__statistic__data">
                    100{" "}
                  </span>{" "}
                  Đơn
                </p>
                <p>
                  <span>*</span> 3.5%
                </p>
                <p>Tháng trước {" 69,96 tỷ"}</p>
              </div>
            </div>
          </div>
          <div className="dashboard__simple__chart__tag">
            <div className="dashboard__simple__chart__tag__title">Độ phủ</div>
            <div className="dashboard__simple__chart__tag__details">
              <div className="dashboard__simple__chart__tag__details__chart">
                <Progress
                  strokeLinecap="round"
                  type="circle"
                  size={100}
                  strokeWidth={13}
                  showInfo={false}
                  percent={75}
                />
              </div>
              <div className="dashboard__simple__chart__tag__details__data">
                <p>
                  <span className="dashboard__general__statistic__data">
                    100{" "}
                  </span>{" "}
                  Đơn
                </p>
                <p>
                  <span>*</span> 3.5%
                </p>
                <p>Tháng trước {" 69,96 tỷ"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="dashboard__simple__chart__container">
        <span className="default_header_label">Bán hàng</span>

        {React.createElement(require("./Report/DashboardReport").default)}
      </div>
    </div>
  );
};

export default Dashboard;
