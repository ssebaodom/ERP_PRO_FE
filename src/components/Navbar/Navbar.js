import { UilSearch } from "@iconscout/react-unicons";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "./Navbar.css";

import { Dropdown, Input, Menu, Modal } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { getRoutesAccess } from "../../app/Functions/getRouteAccess";
import options__icon from "../../Icons/options__icon.svg";
import sse__logo from "../../Icons/sse__logo.svg";
import router, { routes } from "../../router/routes";
import { setClaims, setIsBackgrouds } from "../../store/reducers/claimsSlice";
import jwt from "../../utils/jwt";

const Navbar = () => {
  const [resultsSearchModal, setResultsSearchModal] = useState([]);
  const [isOpenSearchModal, setOpenSearchModal] = useState(false);
  const [inputSearchModal, setInputSearchModal] = useState("");
  const [navbarSelectedKey, setnavbarSelectedKey] = useState("");
  const [navbarItems, setNavbarItems] = useState();
  const [searchFunctions, setSearchFunctions] = useState([]);

  const renderNavbar = (navItems) => {
    const renderedNavbar = navItems.map((item) => {
      if (item?.children?.length == 0) {
        item.label = <span className="navbar_child_route">{item.label}</span>;
        delete item.children;
      }

      if (item?.children?.length > 0) {
        item.onTitleClick = () => {
          handleNavbarClick(item.children[0]);
        };
        item.children.map((child) => {
          child.label = (
            <span className="navbar_child_route dark_grey_text_color">
              {child.label}
            </span>
          );
        });
      } else {
        item.onTitleClick = () => {
          handleNavbarClick(item);
        };
      }
      return item;
    });
    return renderedNavbar;
  };

  // firebase to send notifications
  // const serviceNotifyParams = useMemo(() => {
  //   if (navbarItems) return { colection: "Notify", type: "all" };
  // }, [navbarItems]);

  // const servicePushNotifyParams = useMemo(() => {
  //   if (navbarItems) return { colection: "Notify", type: "changes" };
  // }, [navbarItems]);

  // const getNotify = useFireStore(
  //   serviceNotifyParams.colection,
  //   serviceNotifyParams.type
  // );
  // const pushNotify = useFireStore(
  //   serviceNotifyParams.colection,
  //   serviceNotifyParams.type
  // );

  // function usePrevious(value) {
  //   const ref = useRef();
  //   useEffect(() => {
  //     ref.current = value;
  //   });
  //   return ref.current;
  // }
  // const prevAmount = usePrevious(getNotify);

  // useEffect(() => {
  //   if (getNotify && getNotify.length > 0 && prevAmount.length > 0) {
  //     console.log(getNotify);
  //   }

  //   if (pushNotify.length > 0) {
  //     console.log(pushNotify);
  //   }
  // }, [getNotify, pushNotify]);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOpenSearchModal = () => {
    setOpenSearchModal(true);
  };

  const handleCancelSearchModal = () => {
    setOpenSearchModal(false);
    setInputSearchModal("");
    setResultsSearchModal([]);
  };
  const handleLogout = async () => {
    await jwt.resetAccessToken();
    await dispatch(setClaims([]));
    await await router.navigate("/login");
  };
  const handleNavbarClick = (item) => {
    setnavbarSelectedKey(item.key);
    navigate(
      item?.item?.props?.path ? `${item.item.props.path}` : `${item.path}`
    );
  };
  const handleLogo = () => {
    setnavbarSelectedKey("");
    if (!router.state.location.pathname.includes("Dashboard")) navigate("/");
  };
  useEffect(() => {
    dispatch(setClaims(jwt.getClaims() ? jwt.getClaims() : {}));
    async function fetchData() {
      const navitems = await getRoutesAccess(routes);
      setNavbarItems(await renderNavbar(navitems.nestedRoutes || []));

      setSearchFunctions((item) => {
        return (item = navitems.flatRoutes.filter(
          (item) => !item.children || !item?.children?.length > 0
        ));
      });
    }
    fetchData();
  }, []);

  const a = [
    {
      key: "Thông báo 1",
    },
    {
      key: "Thông báo 2",
    },
    {
      key: "Thông báo 3",
    },
    {
      key: "Thông báo 4",
    },
    {
      key: "Thông báo 5",
    },
  ];

  const notifications = [
    {
      key: "1",
      label: (
        <div className="navbar_notification_dropdown">
          {a.map((item, index) => {
            return (
              <a
                key={index}
                className="navbar_notification_dropdown_item"
                target="_blank"
                rel="noopener noreferrer"
                href="https://www.youtube.com/watch?v=kdVeYgGtO3Q&ab_channel=Tr%C3%BAcNh%C3%A2n"
              >
                <h1 className="navbar_notification_dropdown_item_title">
                  {item.key}
                </h1>
                <span className="navbar_notification_dropdown_item_content">
                  {item.key}
                </span>
              </a>
            );
          })}
        </div>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "Cài đặt",
    },
    {
      key: "contact",
      label: <Link to={"contact"}>Liên hệ</Link>,
    },
    {
      key: "3",
      label: "lịch sử hoạt động",
    },
    {
      key: "4",
      label: <Link onClick={handleLogout}>Logout</Link>,
      danger: true,
    },
  ];
  const searchResult = (query) => {
    const results = searchFunctions.filter((item) =>
      item.label.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );
    return results.map((result, idx) => {
      const category = `${query}`;
      return {
        value: result.label,
        label: (
          <div
            className="modal_search_results_item"
            onClick={() => handleSelectFuntion(result.path)}
          >
            <span>{result.label}</span>
          </div>
        ),
      };
    });
  };

  const handleSearchInModal = (value) => {
    setResultsSearchModal(value ? searchResult(value) : []);
  };

  const currentActions = [
    {
      key: "1",
      label: "Hoạt động thường xuyên",
      children: [
        {
          key: "1.1",
          label: "Logout",
        },
        {
          key: "1.2",
          label: "signin",
        },
      ],
    },
    {
      key: "2",
      label: <div onClick={handleOpenSearchModal}>Mở rộng</div>,
    },
  ];

  const handleSelectFuntion = (path) => {
    router.navigate(path);
    handleCancelSearchModal();
  };

  const handleSetBackground = () => {
    dispatch(setIsBackgrouds(true));
  };

  return (
    <div className="navbar">
      <div className="first_navbar_row_left">
        <div className="navbar_logo_functions">
          <img
            src={sse__logo}
            alt="SSE giải pháp phần mềm doanh nghiệp"
            onClick={handleLogo}
            color="red"
          ></img>
          <div className="navbar_search_function">
            <img
              src={options__icon}
              alt="SSE giải pháp phần mềm doanh nghiệp"
              onClick={handleOpenSearchModal}
              color="red"
            ></img>
            <span
              onClick={handleSetBackground}
              className="default_header_label"
            >
              DMS
            </span>
          </div>
        </div>

        <Menu
          mode="horizontal"
          items={navbarItems}
          className="navbar_routes"
          onSelect={handleNavbarClick}
          selectedKeys={navbarSelectedKey}
          style={{
            height: "30px",
            lineHeight: "30px",
            border: "none",
            width: "85%",
            userSelect: "none",
          }}
          overflowedIndicator={
            <span style={{ color: "#1677ff" }}>Mở rộng ...</span>
          }
        />
      </div>
      <div className="first_navbar_row_right">
        <ul>
          <li>
            <div className="navbar_avatar_container">
              <Dropdown
                menu={{ items: items }}
                overlayClassName="navbar_avatar_dropdown"
                placement="bottomRight"
                trigger={["click"]}
              >
                <img
                  className="navbar_avatar"
                  src="https://i.ex-cdn.com/mgn.vn/files/content/2023/02/14/hutao-yelan-banner-revenue-1-1657.jpg"
                  alt=""
                />
              </Dropdown>
            </div>
          </li>
          <li>
            <Dropdown
              menu={{ items: notifications }}
              overlayClassName="navbar_notification_dropdown_container"
              placement="bottomRight"
              trigger={["click"]}
            >
              <i
                className="pi pi-bell"
                style={{ fontSize: "22px", fontWeight: "bold" }}
              ></i>
            </Dropdown>
          </li>
        </ul>
      </div>

      <Modal
        className="modal_home_search"
        open={isOpenSearchModal}
        onCancel={handleCancelSearchModal}
        closable={false}
        title="Tìm kiếm"
        okButtonProps={{ style: { display: "none" } }}
        cancelText="Đóng"
        centered
        width={600}
      >
        <div className="search_modal_search_bar_container">
          <div className="search_modal_search_bar">
            <Input
              id="navbar_input_search"
              className="navbar_input_search"
              placeholder="Tìm kiếm..."
              value={inputSearchModal}
              onChange={(e) => {
                setInputSearchModal(e.target.value);
                handleSearchInModal(e.target.value);
              }}
              prefix={<UilSearch size="18" color="#1677ff" />}
            />
          </div>
          <div className="modal_search_results">
            {resultsSearchModal.length === 0 && !inputSearchModal && (
              <p>
                Tìm gì đó{" "}
                <i className="pi  pi-comments" style={{ fontSize: "26px" }}></i>
              </p>
            )}

            {resultsSearchModal.length === 0 && inputSearchModal && (
              <p>Không có chức năng tương ứng</p>
            )}

            {resultsSearchModal.map((item, index) => (
              <>{item.label}</>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Navbar;
