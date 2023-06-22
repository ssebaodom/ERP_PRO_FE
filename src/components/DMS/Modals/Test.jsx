import { Button, Input, QRCode, Space } from "antd";
import React from "react";
import { useState } from "react";
import sse__logo from "../../../Icons/sse__logo.svg";

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
    </Space>
  );
};

export default Test;
