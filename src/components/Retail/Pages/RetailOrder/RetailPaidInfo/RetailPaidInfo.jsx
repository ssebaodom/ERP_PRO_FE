import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  LoadingOutlined
} from "@ant-design/icons";

import {
  Button,
  Input,
  InputNumber,
  message as messageAPI,
  Spin,
  Switch
} from "antd";
import _ from "lodash";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import useLocalStorage from "use-local-storage";
import {
  getAllRowKeys,
  getAllValueByRow
} from "../../../../../app/Functions/getTableValue";
import { formatCurrency } from "../../../../../app/hooks/dataFormatHelper";
import { num2words } from "../../../../../app/Options/DataFomater";
import { getUserInfo } from "../../../../../store/selectors/Selectors";
import { multipleTablePutApi } from "../../../../SaleOrder/API";
import AdvanceRetailPayment from "../../../Modals/AdvanceRetailPayment/AdvanceRetailPayment";

import AddCustomerPopup from "../AddCustomerPopup/AddCustomerPopup";

const { Search } = Input;
const RetailPaidInfo = ({
  itemForm,
  paymentInfo,
  onChangeCustomer,
  onResetForm,
}) => {
  const [message, contextHolder] = messageAPI.useMessage();

  const [paymentData, setPaymentData] = useState({});
  const [paymentQR, setPaymentQR] = useLocalStorage("QRimg", "");
  const [change, setChange] = useState(0);
  const [voucher, setVoucher] = useState({
    voucherId: "",
    tl_ck: 0,
    tien_ck: 0,
  });

  const [voucherStatus, setVoucherStatus] = useState({
    currentVoucher: "",
    loading: false,
    valid: false,
  });
  const [isUsePoint, setIsUsePoint] = useState(false);
  const [isOpenAdvancePayment, setIsOpenAdvancePayment] = useState(false);

  const { id: userId, storeId, unitId } = useSelector(getUserInfo);

  // Lưu phiếu
  const handleSave = useCallback(
    async (paymentMethods, paymentMethodInfo) => {
      const data = { ...itemForm.getFieldsValue() };
      const master = {
        tien_mat: paymentMethods ? 0 : paymentData.tong_tt,
        ...paymentData,
        ...paymentMethodInfo,
        httt: paymentMethods || "tien_mat",
      };

      const detailData = [];

      getAllRowKeys(data).map((item) => {
        return detailData.push(getAllValueByRow(item, data));
      });

      console.log("master", master);
      console.log("Detail", detailData);

      if (_.isEmpty(detailData)) {
        message.warning("Vui lòng thêm vật tư !");
        return;
      }

      if (_.isEmpty(master?.ma_kh)) {
        message.warning("Mã khách hàng trống!");
        return;
      }

      if (master?.chuyen_khoan > 0) {
        setPaymentQR(
          `https://img.vietqr.io/image/970436-0551000325525-print.png?amount=${
            master?.chuyen_khoan || 0
          }&addInfo=TEST&accountName=MACH%20HAI%20HUNG&randon=${Math.floor(
            Math.random() * 10000
          )}`
        );
      }

      await multipleTablePutApi({
        arandomnumber: Math.floor(Math.random() * 10000),
        store: "Api_create_retail_order",
        param: {
          UnitID: unitId,
          StoreID: storeId,
          userId,
        },
        data: {
          master: [
            {
              ...master,
              voucher: voucher.voucherId,
              sd_diem: isUsePoint ? 1 : 0,
            },
          ],
          detail: detailData,
        },
      }).then((res) => {
        console.log("res", res);
        onResetForm();
      });
    },
    [paymentData, voucher]
  );

  // Xác thực voucher
  const handleFindVoucher = useDebouncedCallback(async (e) => {
    const value = e.target.value;
    if (value) {
      setVoucherStatus({
        ...voucherStatus,
        currentVoucher: value,
        loading: true,
      });
      await multipleTablePutApi({
        store: "Api_check_Voucher_valid",
        param: {
          voucherId: value,
          customerId: paymentData?.ma_kh || "",
          unitId,
          storeId,
          userId,
        },
        data: {},
      }).then((res) => {
        if (res?.responseModel?.isSucceded) {
          if (!_.isEmpty(_.first(res?.listObject))) {
            const { tl_ck, tien_ck } = _.first(_.first(res?.listObject));

            setVoucher({
              voucherId: value,
              tien_ck,
              tl_ck,
            });

            setVoucherStatus({
              ...voucherStatus,
              currentVoucher: value,
              valid: true,
              loading: false,
            });

            return;
          }
        }

        setVoucherStatus({
          ...voucherStatus,
          currentVoucher: value,
          valid: false,
          loading: false,
        });
      });

      return;
    }
    setVoucherStatus({
      ...voucherStatus,
      currentVoucher: value,
      valid: false,
      loading: false,
    });
  }, 300);

  // Set khách hàng khi thêm mới
  const handleAddCustomerComplete = useCallback(
    ({ ma_kh, ten_kh, dien_thoai }) => {
      onChangeCustomer({
        ma_kh,
        ten_kh,
        dien_thoai,
      });
    },
    [paymentData]
  );

  // Tính toán thông tin thanh toán khi có sự thay đổi
  const CalFinalPayment = () => {
    var finalPay = paymentInfo?.tong_tt;
    var tien_voucher = 0;

    tien_voucher = voucher?.tl_ck
      ? (voucher?.tl_ck * paymentInfo?.tong_tien) / 100
      : voucher?.tien_ck;

    finalPay = finalPay - tien_voucher;

    if (isUsePoint) {
      finalPay = finalPay - paymentInfo?.diem * paymentInfo?.quy_doi_diem;
    }

    setPaymentData({
      ...paymentInfo,
      tong_tt: finalPay < 0 ? 0 : finalPay,
      tien_voucher: tien_voucher,
    });
  };

  const handleCloseAdvancePayment = useCallback(() => {
    setIsOpenAdvancePayment(false);
  }, []);

  // Lắng nghe sự thay đổi tham số để tính toán
  useEffect(() => {
    if (!_.isEmpty(paymentInfo)) {
      CalFinalPayment();
    }
    return () => {};
  }, [paymentInfo, isUsePoint, voucher]);

  useEffect(() => {
    return () => {
      setPaymentQR("");
    };
  }, []);

  return (
    <div
      className="border-round-lg overflow-hidden flex flex-column align-items-center justify-content-between"
      style={{ width: "23rem", flexShrink: 0, background: "white" }}
    >
      <div className="retail_info_container overflow-y-auto p-2 w-full min-w-0">
        <div className="flex justify-content-between mb-3">
          <span className="primary_bold_text text-lg line-height-4">
            Thông tin khách hàng:
          </span>
          <AddCustomerPopup onSave={handleAddCustomerComplete} />
        </div>

        <div
          className="retail-customer-info relative"
          style={{ minHeight: 60 }}
        >
          {paymentData?.ma_kh ? (
            <>
              <p className="">
                <b>{paymentData?.ma_kh}</b> -{" "}
                {paymentData?.ten_kh || "Không có dữ liệu"}
              </p>
              <p className="">
                {paymentData?.dien_thoai?.trim() || "Không có số điện thoại"}
              </p>
              <div>
                <span className="primary_bold_text">
                  {formatCurrency(paymentData?.diem || 0)} điểm{" "}
                </span>
                {isUsePoint && (
                  <b className="danger_text_color">
                    -
                    {paymentData?.diem <=
                    paymentInfo?.tong_tt / paymentInfo?.quy_doi_diem
                      ? paymentData?.diem
                      : paymentInfo?.tong_tt / paymentInfo?.quy_doi_diem}
                  </b>
                )}
              </div>
            </>
          ) : (
            <b className="abs_center sub_text_color">Không có dữ liệu</b>
          )}
        </div>

        <p className="primary_bold_text text-lg line-height-4">
          Thông tin thanh toán:
        </p>

        <div className="retail_bill_info">
          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">
              Tổng tiền ({paymentData?.tong_sl || 0} sản phẩm):
            </span>
            <span className="primary_bold_text line-height-16 white-space-normal">
              {formatCurrency(
                (paymentData?.tong_tien / (paymentData?.ty_gia || 1)).toFixed(
                  2
                ) || 0
              )}
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Tổng thuế:</span>
            <span className="primary_bold_text">
              {formatCurrency(
                (paymentData?.tong_thue / (paymentData?.ty_gia || 1)).toFixed(
                  2
                ) || 0
              )}
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Tổng chiết khấu:</span>
            <span className="primary_bold_text">
              {formatCurrency(
                (paymentData?.tong_ck / (paymentData?.ty_gia || 1)).toFixed(
                  2
                ) || 0
              )}
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Voucher:</span>
            <span className="primary_bold_text">
              <Input
                status={
                  !voucherStatus.valid &&
                  voucherStatus.currentVoucher &&
                  !voucherStatus.loading
                    ? "error"
                    : null
                }
                onChange={handleFindVoucher}
                allowClear
                placeholder="Mã Voucher"
                suffix={
                  voucherStatus.loading ? (
                    <Spin
                      indicator={
                        <LoadingOutlined
                          style={{
                            fontSize: 14,
                          }}
                          spin
                        />
                      }
                    />
                  ) : !voucherStatus.valid && voucherStatus.currentVoucher ? (
                    <CloseCircleTwoTone twoToneColor={"red"} />
                  ) : voucherStatus.valid && voucherStatus.currentVoucher ? (
                    <CheckCircleTwoTone twoToneColor="#52c41a" />
                  ) : null
                }
              />
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Tiền voucher:</span>
            <span className="primary_bold_text">
              {formatCurrency(
                (
                  (paymentData?.tien_voucher || 0) / (paymentData?.ty_gia || 1)
                ).toFixed(2) || 0
              )}
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Sử dụng điểm:</span>
            <Switch
              checked={isUsePoint}
              onChange={(e) => {
                setIsUsePoint(e);
              }}
            />
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Thanh toán:</span>
            <span className="primary_bold_text">
              {formatCurrency(
                (paymentData?.tong_tt / (paymentData?.ty_gia || 1)).toFixed(
                  2
                ) || 0
              )}
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Bằng chữ:</span>
            <span className="primary_bold_text line-height-16 white-space-normal">
              {num2words(
                parseInt(
                  (paymentData?.tong_tt / (paymentData?.ty_gia || 1)).toFixed(2)
                ) || 0
              )}
            </span>
          </div>

          <div className="flex justify-content-between gap-2 align-items-center">
            <span className="w-6 flex-shrink-0">Khách đưa:</span>
            <InputNumber
              controls={false}
              min="0"
              className="w-full"
              placeholder="0"
              onChange={(e) => {
                setChange(
                  e - paymentData?.tong_tt < 0 ? 0 : e - paymentData?.tong_tt
                );
              }}
            />
          </div>
        </div>

        <div className="flex justify-content-between gap-2 align-items-center">
          <span className="w-6 flex-shrink-0">Trả lại:</span>
          <span className="primary_bold_text danger_text_color">
            {formatCurrency(change)}
          </span>
        </div>
      </div>

      <div className="retail_action_container flex gap-2 p-2 w-full">
        <Button
          className="w-fit"
          onClick={() => {
            setIsOpenAdvancePayment(true);
          }}
        >
          Nâng cao
        </Button>

        <Button
          className="w-full min-w-0"
          onClick={() => {
            handleSave();
          }}
        >
          Thanh toán
        </Button>
      </div>
      <AdvanceRetailPayment
        isOpen={isOpenAdvancePayment}
        total={formatCurrency(
          (paymentData?.tong_tt / (paymentData?.ty_gia || 1)).toFixed(2) || 0
        )}
        onClose={handleCloseAdvancePayment}
        onSave={handleSave}
      />

      {contextHolder}
    </div>
  );
};

export default memo(RetailPaidInfo);
