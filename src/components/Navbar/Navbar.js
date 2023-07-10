import { useContext, useEffect, useMemo, useRef, useState } from "react";
import "./Navbar.css";
import { useDispatch } from "react-redux";
import { UilSearch, UilBell, UilApps } from "@iconscout/react-unicons";

import { UnorderedListOutlined } from "@ant-design/icons";
import { Link, useNavigate, redirect } from "react-router-dom";
import { AutoComplete, Input, Dropdown, Menu, Modal, Space } from "antd";
import router, { navbarObject } from "../../router/routes";
import jwt from "../../utils/jwt";
import { setClaims } from "../../store/reducers/claimsSlice";
import { NotifiContext } from "../../Context/NotifiProvider";
import useFireStore from "../../app/hooks/sendNotify";
import sse__logo from "../../Icons/sse__logo.svg";
import options__icon from "../../Icons/options__icon.svg";

const Navbar = () => {
  const [options, setOptions] = useState([]);
  const [resultsSearchModal, setResultsSearchModal] = useState([]);
  const [isOpenSearchModal, setOpenSearchModal] = useState(false);
  const [inputSearchModal, setInputSearchModal] = useState("");
  const [navbarSelectedKey, setnavbarSelectedKey] = useState("");
  const [navbarItems, setNavbarItems] = useState(
    navbarObject.map((item) => {
      if (item?.children?.length > 0) {
        // item.onTitleClick = () => {
        //   handleNavbarClick(item.children[0]);
        // };
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
    })
  );

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

  const handleOkSearchModal = () => {
    setOpenSearchModal(false);
    setInputSearchModal("");
    setResultsSearchModal([]);
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
    dispatch(setClaims(jwt.getClaims()));
  }, []);

  const homeRoutes = [
    {
      name: "Login nè",
      claims: "Produce.login",
      path: "/",
    },
    {
      name: "Home nè",
      claims: "Produce.home",
      path: "/home",
      children: [],
    },
    {
      name: "Todo nè",
      claims: "Produce.login.todo",
      path: "todo",
    },
    {
      name: "Mạch Hưng nè",
      claims: "Produce.login.todo.mach_hung",
      path: "mach_hung",
      element: <div>Hello world!</div>,
    },
    {
      name: "invoice ne",
      path: "/invoices",
    },
    {
      name: "Goosc",
      path: "*",
    },
  ];

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
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.youtube.com/watch?v=kdVeYgGtO3Q&ab_channel=Tr%C3%BAcNh%C3%A2n"
        >
          Cài đặt
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.youtube.com/watch?v=kdVeYgGtO3Q&ab_channel=Tr%C3%BAcNh%C3%A2n"
        >
          Liên hệ
        </a>
      ),
    },
    {
      key: "3",
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.youtube.com/watch?v=kdVeYgGtO3Q&ab_channel=Tr%C3%BAcNh%C3%A2n"
        >
          lịch sử hoạt động
        </a>
      ),
    },
    {
      key: "4",
      label: <Link onClick={handleLogout}>Logout</Link>,
      danger: true,
    },
  ];
  const searchResult = (query) => {
    const results = homeRoutes.filter((item) =>
      item.name.toLocaleLowerCase().includes(query.toLocaleLowerCase())
    );
    return results.map((result, idx) => {
      const category = `${query}`;
      return {
        value: result.name,
        label: (
          <Link to={result.path}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <span>{result.name}</span>
            </div>
          </Link>
        ),
      };
    });
  };

  const handleSearch = (value) => {
    setOptions(value ? searchResult(value) : []);
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

  const onSelect = (value) => {
    const results = homeRoutes.filter((item) => item.name == value);
    router.navigate(results[0].path);
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
            <span className="default_header_label">DMS</span>
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
            width: "86%",
            userSelect: "none",
          }}
          overflowedIndicator={
            <span style={{ color: "#1677ff" }}>Mở rộng ...</span>
          }
        />
      </div>
      {/* <div className="first_navbar_row_center">
          <AutoComplete
            dropdownMatchSelectWidth={252}
            style={{
              width: 350,
            }}
            options={options}
            onSelect={onSelect}
            onSearch={handleSearch}
          >
            <Input
              size="middle"
              className="navbar_input_search"
              placeholder="Tìm kiếm..."
              prefix={<UilSearch size="18" color="#1677ff" />}
            />
          </AutoComplete>
        </div> */}
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
              <UilBell size="30" color="#1677ff"></UilBell>
            </Dropdown>
          </li>
        </ul>
      </div>

      {/* <div className="sec_navbar_row">
        <div className="sec_navbar_row_left">
          <Dropdown menu={{ items: currentActions }} trigger={["click"]}>
            <UilApps size="30px" color="#1677ff" />
          </Dropdown>
          <Menu
            className="sec_navbar_row_right"
            mode="horizontal"
            items={navbarItems}
            onSelect={handleNavbarClick}
            selectedKeys={navbarSelectedKey}
            style={{
              height: "30px",
              lineHeight: "30px",
              backgroundColor: "transparent",
              marginLeft: "40px",
            }}
            overflowedIndicator={
              <span style={{ color: "#1677ff" }}>Mở rộng ...</span>
            }
          />
        </div>
        <div className="dxa">
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
        </div>
      </div> */}

      <Modal
        className="modal_home_search"
        open={isOpenSearchModal}
        onOk={handleOkSearchModal}
        onCancel={handleCancelSearchModal}
        closable={false}
        okButtonProps={{ style: { display: "none" } }}
        cancelButtonProps={{ style: { display: "none" } }}
        style={{ top: 100, padding: 0 }}
        width={400}
      >
        <div className="search_modal_search_bar_container">
          <div className="search_modal_search_bar">
            <Input
              style={{ maxWidth: "500px", minWidth: "100px" }}
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
            {resultsSearchModal.map((item, index) => (
              <div key={index} className="modal_search_results_item">
                {item.label}
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Navbar;
