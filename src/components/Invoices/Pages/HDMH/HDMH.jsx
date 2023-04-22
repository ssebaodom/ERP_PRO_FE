import React, { useEffect, useState } from "react";
import { DatePicker, Space } from "antd";
import { Button, Table, Image } from "antd";
import moment from "moment";
import {
  EditOutlined,
  PlusOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { ApiGetTicketList } from "../../API";
import Item from "antd/es/list/Item";
import InvoiceOptions from "../../Modals/InvoiceIOptions/InvoiceOptions";
import router from "../../../../router/routes";
import jwt from "../../../../utils/jwt";
import ResizableAntdTable from "resizable-antd-table";
const { RangePicker } = DatePicker;

const HDMH = () => {
  const [tableColumn, setTableColumn] = useState([]);
  const [data, setData] = useState([]);

  const fetchData = () => {
    ApiGetTicketList().then((res) => {
      const tableData = res.map((item, index) => {
        item.key = index;
        const rawDate = item.time;
        item.time = moment(item.time).format("DD/MM/yyyy");
        if (item.images) {
          item.images = `https://hiepphong-cloud.sse.net.vn/fsdUpload/${moment(
            rawDate
          ).format("yyyy/MM/DD")}/${item.images}.png`;
        }
        return item;
      });
      setData(tableData);

      const resColumn = Object.keys(res[0]);
      resColumn.map((key) => {
        if (key === "images") {
          setTableColumn((old) => {
            return [
              ...old,
              {
                title: "Ảnh",
                dataIndex: key,
                render: (_, record) => <Image src='https://genshin-guide.com/wp-content/uploads/2022/10/22_image.png'/>,
              },
            ];
          });
        } else {
          setTableColumn((old) => {
            return (old = [
              ...old,
              {
                title: key.toUpperCase(),
                dataIndex: key,
      
              },
            ]);
          });
        }
      });
      // Thêm control
      setTableColumn((old) => {
        return (old = [
          ...old,
          {
            title: "operation",
            dataIndex: "operation",
            render: (_, record) =>
              tableData.length >= 1 ? (
                <div className="tableToolsBar">
                  <Button icon={<EditOutlined style={{ color: "black" }} />} />

                  <Button
                    icon={
                      <DeleteOutlined
                        style={{ color: "red", background: "none" }}
                      />
                    }
                  />

                  <Button icon={<EyeOutlined style={{ color: "black" }} />} />
                </div>
              ) : null,
          },
        ]);
      });
    });
  };

  useEffect(() => {
    fetchData();
  }, []);


  const handleTableChange = (pagination, filters, sorter) => {
   

    // `dataSource` is useless since `pageSize` changed
   
  };


  return (
    <div className="page_2_side_default">
      <InvoiceOptions
        selectedKey={router.state.location.pathname.slice(1, 99)}
      />
      <div className="page_2_side_default_right">
        <div className="page_2_side_default_right_tools">
          <Button style={{ width: "100px" }} icon={<PlusOutlined />}>
            Thêm
          </Button>
        </div>
        <div className="page_2_side_default_right_details">
          <ResizableAntdTable
            columns={tableColumn}
            rowKey={(record) => record.key}
            dataSource={data}
            rowClassName={"defaultTableRow"}
            className='default_table'
            pagination={{
              position: ["bottomCenter"],
              className:'default_pagination_bar'
            }}
            onChange={handleTableChange}
          />
        </div>
      </div>
    </div>
  );
};

export default HDMH;
