import React from "react";
import { STATISTICS_ICONS } from "../../../../utils/constants";

const Statistics = ({ type = "SO" || "OL" || "PO" || "DT", value = 99999 }) => {
  return (
    <div className="dashboard__general__statistic__items">
      <div className="dashboard__general__statistic__icon">
        <img src={STATISTICS_ICONS[type].icon} alt="voucher" />
      </div>
      <div className="dashboard__general__statistic__details">
        <p className="dashboard__general__statistic__title">
          {STATISTICS_ICONS[type].title}
        </p>
        <span className="dashboard__general__statistic__data">{value}</span>
      </div>
    </div>
  );
};

export default Statistics;
