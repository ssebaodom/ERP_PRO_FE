import VNnum2words from "vn-num2words";

const quantityFormat = "0.01";
const datetimeFormat = "DD/MM/YYYY";
const PriceFormat = "0.01";

function num2words(num) {
  return VNnum2words(num);
}

export { quantityFormat, datetimeFormat, PriceFormat, num2words };
