import React, { useState } from "react";
import RenderCells from "../../../app/hooks/renderCells";

const EditableCell = (cell) => {
  return RenderCells(cell);
};

const Test = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const [current, setCurrent] = useState(0);
  const [steps, setSteps] = useState([
    {
      key: 0,
      title: "First",
    },
    {
      key: 1,
      title: "Second",
      content: <span>123421412312</span>,
    },
    {
      key: 2,
      title: "Last",
      content: "Last-content",
    },
  ]);

  const onChange = (value) => {
    console.log("onChange:", value);
    setCurrent(value);
  };

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

  return <div style={{ width: "100%" }}></div>;
};

export default Test;
