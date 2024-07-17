import { Alert, Avatar, Drawer } from "antd";
import React, { useEffect, useState } from "react";
import LoadingComponents from "../../../Loading/LoadingComponents";
import PerformanceTable from "../../../ReuseComponents/PerformanceTable/PerformanceTable";
import { fetchRetailOderDetail } from "../../Store/Actions/RetailOrderActions";
import "./DetailRetailViewer.css";

const DetailRetailViewer = ({ isOpen, onClose, itemKey }) => {
  const { stt_rec } = itemKey;

  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState({});

  const getData = async () => {
    setIsLoading(true);
    const result = await fetchRetailOderDetail({
      stt_rec,
    });
    setData(result);
    console.log("result", result);
    setIsLoading(false);
  };

  useEffect(() => {
    if (isOpen) {
      getData();
    }
    return () => {
      setIsLoading(true);
    };
  }, [isOpen]);

  return (
    <Drawer
      title={`Thông tin đơn hàng`}
      placement="right"
      width={"80%"}
      open={isOpen}
      bodyStyle={{
        position: "relative",
      }}
      onClose={() => {
        onClose();
      }}
      destroyOnClose={true}
    >
      {isLoading ? (
        <LoadingComponents text={"Đang tải..."} size={50} loading={isLoading} />
      ) : (
        <div className="flex gap-3 h-full w-full detail__retail__order__Container">
          <div className="detail__retail__order__Left flex gap-3 flex-column pr-2 pl-2 pt-1 pb-1 overflow-auto">
            <div className="detail__retail__Userinfo flex flex-column align-items-center justify-content-center gap-2 p-2 flex-shrink-0">
              <Avatar size={72}>
                {data?.master?.ten_kh || "Không có dữ liệu"}
              </Avatar>
              <div className="text-center">
                <b className="text-xl">
                  {data?.master?.ten_kh || "Không có dữ liệu"}
                </b>
                <div>
                  <span>Tel: </span>
                  <b className="sub_text_color">
                    {data?.master?.dien_thoai || "Không có dữ liệu"}
                  </b>
                </div>
                <div>
                  <span>Add: </span>
                  <b className="sub_text_color">
                    {data?.master?.dia_chi || "Không có dữ liệu"}
                  </b>
                </div>
                <div>
                  <span>Điểm: </span>{" "}
                  <b className="danger_text_color">
                    {data?.master?.diem_so || 0}
                  </b>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 font-bold">Thông tin đơn hàng</p>

              <div className="retail_bill_info detail__retail__PaymentInfo p-2">
                <div className="flex justify-content-between gap-2 align-items-center pl-1 pr-1">
                  <span className="w-6 flex-shrink-0">
                    Tổng tiền ({data?.master?.t_so_luong || 0} sản phẩm):
                  </span>
                  <span className="primary_bold_text line-height-16 white-space-normal">
                    {data?.master?.t_tien || 0}
                  </span>
                </div>

                <div className="flex justify-content-between gap-2 align-items-center pl-1 pr-1">
                  <span className="w-6 flex-shrink-0">Tổng thuế:</span>
                  <span className="primary_bold_text line-height-16 white-space-normal">
                    {data?.master?.t_thue || 0}
                  </span>
                </div>
                <div className="flex justify-content-between gap-2 align-items-center pl-1 pr-1">
                  <span className="w-6 flex-shrink-0">Tổng chiết khấu:</span>
                  <span className="primary_bold_text line-height-16 white-space-normal">
                    {data?.master?.t_ck || 0}
                  </span>
                </div>
                <div className="flex justify-content-between gap-2 align-items-center pl-1 pr-1">
                  <span className="w-6 flex-shrink-0">Voucher sd:</span>
                  <span className="primary_bold_text line-height-16 white-space-normal">
                    {data?.master?.so_voucher || ""}
                  </span>
                </div>

                <div className="flex justify-content-between gap-2 align-items-center pl-1 pr-1">
                  <span className="w-6 flex-shrink-0">Ngày tạo:</span>
                  <span className="primary_bold_text line-height-16 white-space-normal">
                    {data?.master?.ngay_ct || "Không có dữ liệu"}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <p className="mb-2 font-bold">Thông tin giao hàng</p>

              <div className="retail_bill_info detail__retail__PaymentInfo p-2">
                <div className="pl-1 pr-1">
                  <span className="white-space-normal">
                    {data?.master?.ten_nguoi_n ||
                      data?.master?.ten_kh ||
                      "Không rõ"}
                  </span>
                </div>
                <div className="pl-1 pr-1">
                  <span>
                    {data?.master?.dien_thoai_n ||
                      data?.master?.dien_thoai ||
                      "Không có dữ liệu"}
                  </span>
                </div>
                <div className="pl-1 pr-1">
                  <span className="white-space-normal">
                    {data?.master?.dia_chi_n ||
                      data?.master?.dia_chi ||
                      "Không có dữ liệu"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-column gap-3 w-full min-w-0">
            <Alert
              message={
                data?.master?.status == "1" || data?.master?.status == "2"
                  ? "Đơn hàng đã được xác nhận thành công"
                  : data?.master?.status == "3"
                  ? "Đơn hàng đã bị huỷ"
                  : "Đơn hàng đang chờ xác nhận"
              }
              type={
                data?.master?.status == "1" || data?.master?.status == "2"
                  ? "success"
                  : data?.master?.status == "3"
                  ? "error"
                  : "warning"
              }
              showIcon
            />

            <div className="h-full min-h-0 shadow_3">
              <PerformanceTable
                selectable={false}
                columns={data?.columns || []}
                data={data?.detail || []}
                isLoading={isLoading}
              />
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
};

export default DetailRetailViewer;
