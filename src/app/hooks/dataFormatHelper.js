import dayjs from "dayjs";

const format = (data, type) => {
  var formatedData;
  switch (type) {
    case "Datetime":
      formatedData = dayjs(data);
      break;
    case "Numeric":
      formatedData = parseFloat(data);
      break;
    default:
      formatedData = data.trim();
      break;
  }
  return formatedData;
};

const formatData = (data, layout) => {
  const formatedData = {};
  layout.map((item) => {
    return (formatedData[item.field] = format(
      data[`${item.field}`],
      item.type
    ));
  });
  return formatedData;
};

export { formatData };
