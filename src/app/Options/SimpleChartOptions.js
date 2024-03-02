import { CHARTCOLORS } from "../../utils/constants";

function getBarOption(data, catagory) {
  return {
    grid: {
      left: 0,
      right: 0,
      bottom: 0,
      top: 10,
      containLabel: true,
    },
    tooltip: {
      trigger: "item",
      axisPointer: {
        type: "shadow",
        label: {
          show: true,
        },
      },
    },
    xAxis: {
      type: "category",
      data: catagory,
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: data,
        type: "bar",
        itemStyle: {
          borderRadius: [999, 999, 0, 0],
        },
        colorBy: "data",
        color: CHARTCOLORS,
      },
    ],
  };
}

function getCircleOption(data) {
  return {
    series: [
      {
        radius: "100%",
        center: ["50%", "50%"],
        type: "gauge",
        startAngle: 90,
        endAngle: -270,
        pointer: {
          show: false,
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 0,
            borderColor: "#464646",
          },
        },
        axisLine: {
          lineStyle: {
            width: 12,
          },
        },
        splitLine: {
          show: false,
          distance: 0,
          length: 10,
        },
        axisTick: {
          show: false,
        },
        axisLabel: {
          show: false,
        },
        data: data,
        title: {
          fontSize: 20,
          offsetCenter: ["0%", "0%"],
        },
        detail: {
          show: false,
        },
      },
    ],
  };
}

export { getBarOption, getCircleOption };
