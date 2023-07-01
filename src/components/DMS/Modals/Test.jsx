import { Button, Input, QRCode, Result, Space, Table } from "antd";
import React from "react";
import { useState } from "react";
import renderCells from "../../../app/hooks/renderCells";
import sse__logo from "../../../Icons/sse__logo.svg";

const EditableCell = (cell) => {
  return renderCells(cell);
};

const Test = () => {
  const [text, setText] = useState("");

  const [image, setImage] = useState("");

  const printImage = (src) => {
    // var win = window.open("", "");
    // win.document.open();
    window.document.write(
      [
        "<html>",
        "   <head>",
        "   </head>",
        '   <body style="margin:0 auto;text-align:center" onload="window.print()" onafterprint="window.close()">',
        '       <img style="width:100%" src="' + src + '"/>',
        "   </body>",
        "</html>",
      ].join("")
    );
    window.document.close();
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById("myqrcode")?.querySelector("canvas");
    if (canvas) {
      const qrUrl = canvas.toDataURL();
      // const downloadQR = document.createElement("a");
      // downloadQR.download = "QRCode.png";
      // downloadQR.href = qrUrl;
      // document.body.appendChild(downloadQR);
      // downloadQR.click();
      // document.body.removeChild(downloadQR);

      // setImage(qrUrl);

      printImage(qrUrl);
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Tags",
      key: "tags",
    },
  ];

  const data = [];

  let locale = {
    emptyText: (
      <Result
        title="Không có dữ liệu"
        subTitle="Không có dữ liệu nào được tạo, vui lòng thêm hoặc sửa"
      />
    ),
  };

  return (
    <Space direction="vertical" align="center" id="myqrcode">
      <QRCode errorLevel="H" value={text || "-"} icon={sse__logo} />
      <Input
        placeholder="-"
        maxLength={60}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <Button type="primary" onClick={downloadQRCode}>
        Download
      </Button>

      <img src={image} alt="" />

      <Table
        components={{
          body: {
            cell:data.length>0 ? EditableCell:'',
          },
        }}
        locale={locale}
        columns={columns}
        dataSource={data}
      />
    </Space>
  );
};

export default Test;
