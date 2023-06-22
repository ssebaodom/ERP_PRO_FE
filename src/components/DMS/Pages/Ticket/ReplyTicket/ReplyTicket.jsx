import React from "react";
import "./ReplyTicket.css";
import { useEffect, useState } from "react";
import { ApiGetTicketList } from "../../../API";
import { Avatar, Button, Card, Input, Segmented, Space } from "antd";
import dayjs from "dayjs";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  SendOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const ReplyTicket = () => {
  // initialize #########################################################################
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const [tableColumns, setTableColumns] = useState([]);
  const [tableParams, setTableParams] = useState({
    orderby: "ma_kh",
    ma_kh: "",
    ten_kh: "",
    ten_nvbh: "",
    ma_nv: "",
  });
  const [pagination, setPagination] = useState({
    pageindex: 1,
    pageSize: 10,
  });
  const [totalResults, setTotalResults] = useState(0);
  const [ticketData, setTicketData] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  //functions #########################################################################

  const refreshData = () => {
    setPagination({ ...pagination, pageindex: 1, current: 1 });
    if (pagination.pageindex === 1) {
      setLoading(true);
      getdata();
    }
  };

  const getdata = () => {
    ApiGetTicketList({ ...tableParams, ...pagination }).then((res) => {
      setTicketData(res.data.data);
      setSelectedItem(res.data.data[0]);
    });
  };

  const handleClickItem = (item) => {
    console.log(item);
    setSelectedItem(item);
  };

  const handleEditReply = () => {
    setIsEditing(true);
  };

  const handleEditReplyCancel = () => {
    setIsEditing(false);
  };

  const handleEditReplySave = () => {
    setIsEditing(false);
  };

  const handleDeleteReply = () => {
    console.log("DELETE");
    refreshData();
    setIsEditing(false);
  };

  // effectively #########################################################################
  useEffect(() => {
    console.log('Changed')
    setLoading(true);
    getdata();
  }, [JSON.stringify(tableParams), JSON.stringify(pagination)]);

  return (
    <div className="page_2_side_default">
      <div
        className="page_2_side_default_left ticket__container"
        style={{ flex: "0.4" }}
      >
        <div className="ticket__tools_bar">
          <Input
            style={{
              width: "150px",
              height: "30px",
            }}
            size="middle"
            className="default_input"
            placeholder="Tìm kiếm..."
          />

          <Segmented
            options={[
              {
                value: "Checked",
                icon: <CheckCircleOutlined style={{ color: "#5cb85c" }} />,
              },
              {
                value: "UnChecked",
                icon: (
                  <ExclamationCircleOutlined style={{ color: "#ffcc00" }} />
                ),
              },
            ]}
          />
        </div>

        <div className="ticket__container__detail">
          {ticketData.map((item, index) => (
            <div
              key={index}
              className={`ticket__card ${
                item.id_ticket === selectedItem.id_ticket
                  ? "ticket__selected"
                  : ""
              }`}
              onClick={(e) => {
                handleClickItem(item);
              }}
            >
              <div className="ticket__info__container">
                <div className="ticket__customer__info">
                  <Avatar
                    size={"large"}
                    style={{
                      backgroundColor: "#fde3cf",
                      color: "#f56a00",
                      verticalAlign: "middle",
                      flexShrink: 0,
                    }}
                  >
                    {item?.ma_kh.substr(0, 1)}
                  </Avatar>
                  <span>
                    Khách hàng:{" "}
                    <span
                      className="main_text_color"
                      style={{ fontWeight: "bold" }}
                    >
                      {item.ten_kh ? item.ten_kh.trim() : ""}
                    </span>
                  </span>
                </div>
                <div className="ticket__info">
                  <p>Loại: {item.ten_loai ? item.ten_loai.trim() : ""}</p>
                  <p>Ngày: {dayjs(item.time).format("DD/MM/YYYY")}</p>
                </div>
              </div>
              <div className="ticket__detail__container">
                <span>{item.dien_giai.trim()}</span>
              </div>
              <span className="right_icon">></span>
            </div>
          ))}
        </div>
      </div>

      <div
        className="page_2_side_default_right  right__side__ticket__detail"
        style={{ flex: "0.6", padding: "16px", background: "#fff" }}
      >
        <div className="detail__info__customer__container">
          <Space
            direction="horizontal"
            style={{
              justifyContent: "space-between",
              borderBottom: "1px solid #657194",
              paddingBottom: "10px",
            }}
            align="start"
          >
            <Space className="detail__customer" align="start">
              <Avatar
                size={50}
                style={{
                  backgroundColor: "#fde3cf",
                  color: "#f56a00",
                  verticalAlign: "middle",
                  flexShrink: 0,
                }}
              >
                {selectedItem.ma_kh ? selectedItem.ma_kh.substr(0, 1) : ""}
              </Avatar>
              <Space direction="vertical">
                <span>
                  Mã khách:{" "}
                  <span
                    className="main_text_color"
                    style={{ fontWeight: "bold" }}
                  >
                    {selectedItem.ma_kh}
                  </span>
                </span>
                <span>
                  Tên khách:{" "}
                  <span
                    className="main_text_color"
                    style={{ fontWeight: "bold" }}
                  >
                    {selectedItem.ten_kh
                      ? selectedItem.ten_kh
                      : "Không có dữ liệu"}
                  </span>
                </span>
              </Space>
            </Space>
            <Space direction="vertical">
              <span>
                Loại :{" "}
                <span
                  className="main_text_color"
                  style={{ fontWeight: "bold" }}
                >
                  {selectedItem.ten_loai
                    ? selectedItem.ten_loai
                    : "Không có dữ liệu"}
                </span>
              </span>
              <span>
                Ngày :{" "}
                <span
                  className="main_text_color"
                  style={{ fontWeight: "bold" }}
                >
                  {selectedItem.time
                    ? dayjs(selectedItem.time).format("DD/MM/YYYY")
                    : "Không có dữ liệu"}
                </span>
              </span>
              <span>
                Giờ :{" "}
                <span
                  className="main_text_color"
                  style={{ fontWeight: "bold" }}
                >
                  {selectedItem.time
                    ? dayjs(selectedItem.time).format("HH:mm:ss")
                    : "Không có dữ liệu"}
                </span>
              </span>
            </Space>
          </Space>

          <Space
            className="detail__description__container"
            direction="vertical"
          >
            <span className="default_header_label">Nội dung :</span>
            <span>{selectedItem.dien_giai}</span>
          </Space>

          <Space
            direction="vertical"
            className={`${selectedItem.status == 0 ? "hidden" : ""}`}
          >
            <Space
              style={{
                justifyContent: "space-between",
                width: "100%",
                paddingBottom: "15px",
              }}
              align="start"
            >
              <span className="default_header_label">Phản hồi :</span>
              <Space direction="vertical">
                <span>
                  Nhân viên :{" "}
                  <span
                    className="main_text_color"
                    style={{ fontWeight: "bold" }}
                  >
                    {selectedItem.ten_nvbh2
                      ? selectedItem.ten_nvbh2
                      : "Không có dữ liệu"}
                  </span>
                </span>
                <span>
                  Ngày :{" "}
                  <span
                    className="main_text_color"
                    style={{ fontWeight: "bold" }}
                  >
                    {selectedItem.time2
                      ? dayjs(selectedItem.time2).format("DD/MM/YYYY HH:mm:ss")
                      : "Không có dữ liệu"}
                  </span>
                </span>
              </Space>
            </Space>
            <div
              className={`reply__contain ${isEditing ? "reply__editing" : ""}`}
            >
              {isEditing ? (
                <Input.TextArea
                  style={{ width: "100%" }}
                  autoSize={{
                    minRows: 1,
                    maxRows: 6,
                  }}
                  value={selectedItem.phan_hoi}
                  placeholder="Nội dung..."
                ></Input.TextArea>
              ) : (
                <span>{selectedItem.phan_hoi}</span>
              )}

              {isEditing ? (
                <Space>
                  <Button
                    onClick={handleEditReplyCancel}
                    shape="circle"
                    icon={<CloseOutlined />}
                  />
                  <Button
                    onClick={handleEditReplySave}
                    type="primary"
                    shape="circle"
                    icon={<SaveOutlined />}
                  />
                </Space>
              ) : (
                <Space>
                  <Button
                    className="edit__reply__btn"
                    onClick={handleEditReply}
                    type="primary"
                    shape="circle"
                    icon={<EditOutlined />}
                  />
                  <Button
                    className="edit__reply__btn"
                    onClick={handleDeleteReply}
                    danger
                    shape="circle"
                    icon={<DeleteOutlined />}
                  />
                </Space>
              )}
            </div>
          </Space>
        </div>

        <div className="reply__ticket__container">
          <Input.TextArea
            style={{ width: "100%" }}
            autoSize={{
              minRows: 1,
              maxRows: 6,
            }}
            placeholder="Nội dung..."
          ></Input.TextArea>
          <Button type="primary" shape="circle" icon={<SendOutlined />} />
        </div>
      </div>
    </div>
  );
};

export default ReplyTicket;
