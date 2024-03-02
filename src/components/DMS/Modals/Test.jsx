import ReactECharts from "echarts-for-react";
import React from "react";

let mapdata = require("../../../app/Data/VietNamDataMap.json");
const color = [
  "rgb(255,255,217)",
  "rgb(237,248,177)",
  "rgb(199,233,180)",
  "rgb(127,205,187)",
  "rgb(65,182,196)",
  "rgb(29,145,192)",
  "rgb(34,94,168)",
  "rgb(12,44,132)",
];

const option = {
  tooltip: {
    trigger: "item",
  },
  legend: {
    top: "5%",
    left: "center",
  },
  series: [
    {
      name: "Access From",
      type: "pie",
      radius: ["40%", "70%"],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: "#fff",
        borderWidth: 2,
      },
      label: {
        show: false,
        position: "center",
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 40,
          fontWeight: "bold",
        },
      },
      labelLine: {
        show: false,
      },
      data: [
        { value: 1048, name: "Search Engine" },
        { value: 735, name: "Direct" },
        { value: 580, name: "Email" },
        { value: 484, name: "Union Ads" },
        { value: 300, name: "Video Ads" },
      ],
    },
  ],
};

const options2 = {
  tooltip: {
    trigger: "item",
    axisPointer: {
      type: "shadow",
      label: {
        show: true,
      },
    },
  },
  legend: {},
  xAxis: {
    type: "category",
    data: ["1", "2", "3"],
  },
  yAxis: {
    type: "value",
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: "bar",
      itemStyle: {
        borderRadius: [999, 999, 0, 0],
      },
    },
  ],
};

const Test = () => {
  // const [data, setData] = useState(mapdata);
  // const config = {
  //   map: {
  //     type: "mapbox",
  //     style: "blank",
  //     // center: [120.19382669582967, 30.258134],
  //     zoom: 2,
  //     pitch: 0,
  //   },
  //   source: {
  //     data: data,
  //     parser: {
  //       type: "geojson",
  //     },
  //   },
  //   autoFit: true,
  //   // color: {
  //   //   value: color,
  //   //   scale: {
  //   //     type: "quantile",
  //   //   },
  //   // },

  //   label: {
  //     visible: true,
  //     field: "Name_VI",
  //     style: {
  //       fill: "#000",
  //       opacity: 0.8,
  //       fontSize: 10,
  //       stroke: "#fff",
  //       strokeWidth: 1.5,
  //       textAllowOverlap: false,
  //       padding: [8, 8],
  //     },
  //   },
  //   style: {
  //     opacity: 1,
  //     stroke: "rgb(93,112,146)",

  //     lineWidth: 0.6,
  //     lineOpacity: 1,
  //   },
  //   state: {
  //     active: true,
  //     select: true,
  //   },
  //   tooltip: {
  //     items: ["Name_VI", "ISO3166_2_CODE"],
  //   },
  //   zoom: {
  //     position: "bottomright",
  //   },
  //   legend: {
  //     position: "bottomleft",
  //     color: color,
  //   },
  // };

  return (
    <div>
      {/* <AreaMap {...config} /> */}
      <ReactECharts option={option} />;
      <ReactECharts option={options2} />;
    </div>
  );
};

export default Test;
