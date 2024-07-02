import VNnum2words from "vn-num2words";

const quantityFormat = "0.01";
const datetimeFormat = "DD/MM/YYYY";
const datetimeFormat2 = "DD-MM-YYYY";
const PriceFormat = "0.01";

function num2words(num) {
  try {
    var result = VNnum2words(num);
    var first = result.charAt(0);
    first = first.toUpperCase();
    result = result.slice(1);
    result = first + result;
    return result;
  } catch (error) {
    return "Không";
  }
}

export {
  quantityFormat,
  datetimeFormat2,
  datetimeFormat,
  PriceFormat,
  num2words,
};
