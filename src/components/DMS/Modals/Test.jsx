import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import useLocalStorage from "use-local-storage";
const Test = () => {
  const [state, setstate] = useState("");
  const [qrSource, setQrSource] = useLocalStorage("QRimg", "");
  const [isTransfering, setIsTransfering] = useState(false);

  useEffect(() => {
    if (qrSource) {
      setIsTransfering(false);
      console.log("Storage Changed:", qrSource);
    }
    return () => {};
  }, [qrSource]);

  useEffect(() => {
    return () => {
      setQrSource("");
    };
  }, []);

  return (
    <div>
      <span>Mạch</span>
      <Modal
        forceRender
        closable={false}
        footer
        centered
        onCancel={() => {
          setIsTransfering(false);
        }}
        open={isTransfering}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
      >
        <img
          onLoad={(e) => {
            setIsTransfering(true);
          }}
          src={qrSource}
        />
      </Modal>
    </div>
  );
};

export default Test;
