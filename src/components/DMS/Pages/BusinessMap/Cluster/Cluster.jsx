import React from "react";
import "./Cluster.css";

const Cluster = ({ value, style, onClick, children }) => {
  return (
    <div className="cluster-marker" style={style} onClick={onClick}>
      {value}
      {children}
    </div>
  );
};

export default Cluster;
