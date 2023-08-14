import { Button, Input, Select, Space } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ApiGetTaskList } from "../../API";
import ModalDetailImages from "../../Modals/ModalDetailImages/ModalDetailImages";
import Filter from "./Filter/Filter";
import "./ImagesList.css";

const ImagesList = () => {
  // initialize #########################################################################

  const { state } = useLocation();

  useEffect(() => {
    console.log(state, "Id ở đây");
  }, [state]);

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableParams, setTableParams] = useState({
    keywords: "",
    orderby: "id",
  });
  const [pagination, setPagination] = useState({
    pageindex: 1,
    pageSize: 10,
  });
  const [totalResults, setTotalResults] = useState(0);
  const [openModalState, setOpenModalState] = useState(false);
  const [currentRecord, setCurrentRecord] = useState({});
  const [isOpenAdvanceFilter, setIsOpenAdvanceFilter] = useState(false);

  //functions #########################################################################

  const refreshData = () => {
    setPagination({ ...pagination, pageindex: 1, current: 1 });
    if (pagination.pageindex === 1) {
      setLoading(true);
    }
  };

  const getdata = () => {
    ApiGetTaskList({ ...tableParams, ...pagination }).then((res) => {
      setData([
        {
          src: "https://image.lag.vn/upload/news/23/02/06/hu-tao-nhung-dieu-thu-vi__1__STJO.jpg",
          alt: "",
        },
        {
          src: "https://fptshop.com.vn/uploads/originals/2022/12/14/638066294641988290_hu-tao-genshin-impact.jpg",
          alt: "",
        },
        {
          src: "https://inkythuatso.com/uploads/thumbnails/800/2022/03/1145723-17-09-22-27.jpg",
          alt: "",
        },
        {
          src: "https://cdn.sforum.vn/sforum/wp-content/uploads/2022/08/hutao-thumb.jpg",
          alt: "",
        },
        {
          src: "https://cdn-img.thethao247.vn/origin_768x0/storage/files/haibui/2022/12/20/cosplay-hutao-trong-genshin-impact-theo-phong-cach-hien-dai-234128.jpeg",
          alt: "",
        },
        {
          src: "https://w0.peakpx.com/wallpaper/251/938/HD-wallpaper-hu-tao-genshin-impact-thumbnail.jpg",
          alt: "",
        },
        {
          src: "https://balard-consulting.fr/wp-content/uploads/2022/11/ERP_Grand-1024x683.jpeg",
          alt: "",
        },
        {
          src: "https://balard-consulting.fr/wp-content/uploads/2022/11/ERP_Grand-1024x683.jpeg",
          alt: "",
        },
        {
          src: "https://balard-consulting.fr/wp-content/uploads/2022/11/ERP_Grand-1024x683.jpeg",
          alt: "",
        },
        {
          src: "https://balard-consulting.fr/wp-content/uploads/2022/11/ERP_Grand-1024x683.jpeg",
          alt: "",
        },
        {
          src: "https://balard-consulting.fr/wp-content/uploads/2022/11/ERP_Grand-1024x683.jpeg",
          alt: "",
        },
        {
          src: "https://balard-consulting.fr/wp-content/uploads/2022/11/ERP_Grand-1024x683.jpeg",
          alt: "",
        },
        {
          src: "https://balard-consulting.fr/wp-content/uploads/2022/11/ERP_Grand-1024x683.jpeg",
          alt: "",
        },
        {
          src: "https://balard-consulting.fr/wp-content/uploads/2022/11/ERP_Grand-1024x683.jpeg",
          alt: "",
        },
        {
          src: "https://balard-consulting.fr/wp-content/uploads/2022/11/ERP_Grand-1024x683.jpeg",
          alt: "",
        },
        {
          src: "https://balard-consulting.fr/wp-content/uploads/2022/11/ERP_Grand-1024x683.jpeg",
          alt: "",
        },
      ]);
    });
  };

  const handleShowDetailImage = (item) => {
    setOpenModalState(true);
    setCurrentRecord(item);
  };

  const handleFilter = useCallback((item) => {
    console.log(item);
  }, []);

  const handleOpenAdvanceFilter = () => {
    setIsOpenAdvanceFilter(true);
  };

  // effectively #########################################################################
  useEffect(() => {
    setLoading(true);
    getdata();
  }, [JSON.stringify(tableParams), JSON.stringify(pagination)]);

  return (
    <div
      className="default_list_layout page_default"
      style={{ height: "auto", paddingBottom: "30px" }}
    >
      <div className="split__view__header__bar">
        <div className="split__view__search__bar">
          <div className="flex gap-3">
            <Input
              style={{
                width: "210px",
                height: "30px",
              }}
              size="middle"
              className="default_input"
              placeholder="Tìm kiếm..."
            />

            <Space>
              <span>Đơn vị: </span>
              <Select
                className="default_select"
                defaultValue="lucy"
                style={{ width: "180px" }}
                options={[
                  { value: "jack", label: "Jack" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" },
                ]}
              />
            </Space>

            <Space>
              <span>Albums: </span>
              <Select
                className="default_select"
                defaultValue="lucy"
                style={{ width: "180px" }}
                options={[
                  { value: "jack", label: "Jack" },
                  { value: "lucy", label: "Lucy" },
                  { value: "Yiminghe", label: "yiminghe" },
                ]}
              />
            </Space>
          </div>

          <Button
            style={{ borderRadius: "4px", height: "30px" }}
            className="default_button"
            onClick={handleOpenAdvanceFilter}
          >
            <span style={{ fontWeight: "bold" }}>Nâng cao</span>
          </Button>
        </div>
      </div>

      <div className="images_list">
        {data.map((item, index) => {
          return (
            <div
              key={index}
              className="image__box"
              onClick={(e) => {
                handleShowDetailImage(item);
              }}
            >
              <img key={index} src={item.src} alt={item.alt}></img>
              <div className="image__box_detail">
                <span>Khách hàng: TienNQ</span>
                <span>Nhân viên: Mạch Hưng</span>
                <span>Lúc: 9:00 - 23/11/2001</span>
              </div>
            </div>
          );
        })}
      </div>
      <ModalDetailImages
        openModalState={openModalState}
        currentRecord={currentRecord}
        handleCloseModal={setOpenModalState}
      />
      <Filter
        isOpenAdvanceFilter={isOpenAdvanceFilter}
        setIsOpenAdvanceFilter={setIsOpenAdvanceFilter}
        onFilter={handleFilter}
      />
    </div>
  );
};

export default ImagesList;
