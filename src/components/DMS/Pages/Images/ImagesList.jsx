import React, { useRef } from "react";
import "./ImagesList.css";
import { useEffect, useState } from "react";
import { ApiGetTaskList } from "../../API";
import { Button, Input } from "antd";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ModalDetailImages from "../../Modals/ModalDetailImages/ModalDetailImages";

const ImagesList = () => {
  // initialize #########################################################################

  const { state } = useLocation()

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

  //functions #########################################################################

  const handleLoad = (event) => {
    // console.log(event.target.naturalHeight);
    // console.log(event.target.naturalWidth);
    // console.log(event.target.naturalWidth / event.target.naturalHeight);
    // console.log(event.target);
    // const ratio = event.target.naturalWidth / event.target.naturalHeight;
    // if (ratio > 1.5) {
    //   event.target.classList.add("images__width");
    // }
    // if (ratio < 0.8) {
    //   event.target.classList.add("images__height");
    // }
  };

  const refreshData = () => {
    setPagination({ ...pagination, pageindex: 1, current: 1 });
    if (pagination.pageindex === 1) {
      setLoading(true);
      getdata();
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
          <Input
            style={{
              width: "210px",
              height: "30px",
            }}
            size="middle"
            className="default_input"
            placeholder="Tìm kiếm..."
          />
          <Button
            style={{ borderRadius: "4px", height: "30px" }}
            className="default_button"
          >
            <span style={{ fontWeight: "bold" }}>Nâng cao</span>
          </Button>
        </div>
      </div>

      <div className="images_list" onLoad={handleLoad}>
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
    </div>
  );
};

export default ImagesList;
