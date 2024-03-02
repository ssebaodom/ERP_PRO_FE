import ReactECharts from "echarts-for-react";
import React from "react";
import {
  getBarOption,
  getCircleOption,
} from "../../../../app/Options/SimpleChartOptions";

const barData = [120, 200, 150, 80, 70, 110, 130, 130, 130, 130, 130, 200];
const barCatagory = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];

const barOptions = getBarOption(barData, barCatagory);

const circleData = [
  {
    value: 20,
    name: "20%",
  },
];

const circleOptions = getCircleOption(circleData);

const SimpleChart = ({ chartId, type, numCharts }) => {
  return (
    <div className="dashboard__simple__chart__tag__details">
      <div className="dashboard__simple__chart__tag__details__chart h-full">
        <ReactECharts
          style={{ height: "100%", width: "100%" }}
          option={type === "bar" ? barOptions : circleOptions}
        />
      </div>
      <div className="dashboard__simple__chart__tag__details__data">
        <p>
          <span className="dashboard__general__statistic__data primary_bold_text">
            100{" "}
          </span>
          Đơn
        </p>
        <p className="success_text_color">
          <i className={`${100 > 0 ? "pi pi-caret-up" : "pi pi-caret-down"}`} />
          {100} %
        </p>
        <p>Tháng trước {" 69,96 tỷ"}</p>
      </div>
    </div>
  );
};

export default SimpleChart;
