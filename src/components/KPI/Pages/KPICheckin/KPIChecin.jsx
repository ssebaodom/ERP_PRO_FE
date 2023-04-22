import React, { useEffect, useState } from "react";
import KPIOptions from "../../Modals/KPIOptions/KPIOptions";
import { Column } from "@ant-design/plots";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import router from "../../../../router/routes";
import { useSelector } from "react-redux";
import { getTestText } from "../../../../store/selectors/Selectors";

const { RangePicker } = DatePicker;

const KPIChecin = () => {
  const [data, setData] = useState([]);
  const [SEDate, setSEDate] = useState([]);

  const testText = useSelector(getTestText)

  const [text,setText] = useState(testText?testText:'MH')

  const onRangeChange = (dates, dateStrings) => {
    setSEDate(dateStrings)
  };

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    fetch(
      "https://gw.alipayobjects.com/os/antfincdn/PC3daFYjNw/column-data.json"
    )
      .then((response) => response.json())
      .then((json) => setData(json))
      .catch((error) => {
        console.log("fetch data failed", error);
      });
  };
  const config = {
    data,
    xField: "city",
    yField: "value",
    seriesField: "type",
    isGroup: true,
    columnStyle: {
      radius: [10, 10, 0, 0],
    },
  };

  return (
    <div className="KPICheckin page_2_side_default">
      <KPIOptions selectedKey={router.state.location.pathname.slice(1,99)} />
      <div className="KPICheckin_container page_2_side_default_right">
        <div className="page_2_side_default_right_tools">
          <span>{text}</span>
          <RangePicker
            format="YYYY/MM/DD"
            onChange={onRangeChange}
          />
        </div>
        <h1>Biểu đồ KPI checkin</h1>
        <Column {...config} />
      </div>
    </div>
  );
};

export default KPIChecin;
