import { useState } from "react";

const Test = () => {
  const [viewport, setViewport] = useState({
    width: 400,
    height: 400,
    latitude: 37.7577,
    longitude: -122.4376,
    zoom: 8,
  });
  return <div>a</div>;
};

export default Test;
