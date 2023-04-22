import React, { useEffect, useState } from 'react'
import KPIOptions from '../../Modals/KPIOptions/KPIOptions';
import { Bar } from '@ant-design/plots';
import { DatePicker } from "antd";
import dayjs from "dayjs";
import router from '../../../../router/routes';

const { RangePicker } = DatePicker;

const KPISaleIn = () => {
    const data = [
        {
          label: 'Mon.',
          type: 'series1',
          value: 2800,
        },
        {
          label: 'Mon.',
          type: 'series2',
          value: 2260,
        },
        {
          label: 'Tues.',
          type: 'series1',
          value: 1800,
        },
        {
          label: 'Tues.',
          type: 'series2',
          value: 1300,
        },
        {
          label: 'Wed.',
          type: 'series1',
          value: 950,
        },
        {
          label: 'Wed.',
          type: 'series2',
          value: 900,
        },
        {
          label: 'Thur.',
          type: 'series1',
          value: 500,
        },
        {
          label: 'Thur.',
          type: 'series2',
          value: 390,
        },
        {
          label: 'Fri.',
          type: 'series1',
          value: 170,
        },
        {
          label: 'Fri.',
          type: 'series2',
          value: 100,
        },
      ];
      const config = {
        data,
        isGroup: true,
        xField: 'value',
        yField: 'label',
        seriesField: 'type',
        dodgePadding: 4,
        intervalPadding: 20,
        label: {
          // 可手动配置 label 数据标签位置
          position: 'middle',
          // 'left', 'middle', 'right'
          // 可配置附加的布局方法
          layout: [
            // 柱形图数据标签位置自动调整
            {
              type: 'interval-adjust-position',
            }, // 数据标签防遮挡
            {
              type: 'interval-hide-overlap',
            }, // 数据标签文颜色自动调整
            {
              type: 'adjust-color',
            },
          ],
        },
      };
  
    return (
      <div className="KPICheckin page_2_side_default">
        <KPIOptions selectedKey={router.state.location.pathname.slice(1,99)} />
        <div className="KPICheckin_container page_2_side_default_right">
          <div className="page_2_side_default_right_tools">
            <RangePicker
              format="YYYY/MM/DD"
            />
          </div>
          <h1>Biểu đồ KPI Salein</h1>
            <Bar {...config} />
        </div>
      </div>
    );
  };
export default KPISaleIn