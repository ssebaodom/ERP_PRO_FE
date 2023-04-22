import React from "react";
import HROptions from "../../Modals/HROptions";
import { Button, Table, Image, DatePicker,Checkbox } from "antd";
import router from "../../../../router/routes";
import { useState } from "react";
import { ApiGetTimekeepingSchedule } from "../../API";
import { useEffect } from "react";
import ResizableAntdTable from "resizable-antd-table";
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const { RangePicker } = DatePicker;

const TimeKeepingSchedule = () => {

  const handletest = (e,key)=>{
    console.log(key)
  }



  const [tableColumn, setTableColumn] = useState([]);
  const [data, setData] = useState([]);
  const [tableParams, setTableParams] = useState({
    year: 2023,
    month: 1,
    pagecount: 10,
    pageindex: 1,
  });
  const [pagination, setPagination] = useState({
    position: ["bottomLeft"],
    className: "default_pagination_bar",
  });

  const fetchData = (params) => {
    ApiGetTimekeepingSchedule(params).then((res) => {
      setPagination({
        ...pagination,
        current: tableParams.pageindex,
        pageSize: tableParams.pagecount,
        total: res.totalpages * tableParams.pagecount,
      });
      const tableData = res.datas.map((item, index) => {
        item.key = index;
        item = { ...item, ...item.schedule };
        console.log(item);
        return item;
      });
      setData(tableData);

      setTableColumn([
        {
          title: "Mã nhân viên",
          dataIndex: "employee",
          render: (employee) => `${employee.ma_nv}`,
        },
        {
          title: "Tên nhân viên",
          dataIndex: "employee",
          textWrap: "word-break",
          render: (employee) => `${employee.ho_nv} ${employee.ten_nv}`,
        },
      ]);

      Object.keys(res.datas[0].schedule).map((key) => {
        setTableColumn((old) => {
          return (old = [
            ...old,
            {
              title: <span> <Checkbox onChange={(e)=>handletest(e,key)}></Checkbox>{parseInt(key) + 1}</span>,
              dataIndex: key,
              textWrap: "word-break",
              render: (checked) => (
                <div>
                  {checked.checkin && (
                    <Button
                      icon={<EditOutlined style={{ color: "black" }} />}
                    />
                  )}
                  {checked.absent && (
                    <Button
                      icon={
                        <DeleteOutlined
                          style={{ color: "red", background: "none" }}
                        />
                      }
                    />
                  )}
                  {checked.permit && (
                    <Button icon={<EyeOutlined style={{ color: "black" }} />} />
                  )}
                </div>
              ),
            },
          ]);
        });
      });
    });
  };

  useEffect(() => {
    fetchData(tableParams);
  }, [tableParams]);

  return (
    <div className="page_2_side_default">
      <HROptions selectedKey={router.state.location.pathname.slice(1, 99)} />
      <div className="page_2_side_default_right">
        <div className="page_2_side_default_right_tools">
          <RangePicker
            format="YYYY/MM/DD"
            // onChange={onRangeChange}
          />
        </div>
        <div className="page_2_side_default_right_details">
          <Table
            columns={tableColumn}
            onHeaderCell={(columns) => console.log(columns)}
            // rowKey={(record) => record.login.uuid}
            dataSource={data}
            className={"default_table"}
            rowClassName={"defaultTableRow"}
            pagination={pagination}
          />
        </div>
      </div>
    </div>
  );
};

export default TimeKeepingSchedule;
