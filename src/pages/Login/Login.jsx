import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  UserOutlined
} from "@ant-design/icons";
import { UilAnalysis, UilExclamationOctagon } from "@iconscout/react-unicons";
import {
  Button,
  Carousel,
  Checkbox,
  Form,
  Input,
  notification,
  Select,
  Space
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useDebouncedCallback } from "use-debounce";
import router from "../../router/routes";
import { setClaims } from "../../store/reducers/claimsSlice";
import https from "../../utils/https";
import jwt from "../../utils/jwt";
import "./Login.css";

const Login = () => {
  const [loginLoading, setLoginLoading] = useState(false);
  const [user_Name, set_User_Name] = useState("");
  const [password, set_Password] = useState("");
  const [units, set_Units] = useState([{ value: "", label: "Không" }]);
  const [unitSelected, set_UnitSelected] = useState({
    value: "",
    label: "Không",
  });

  const dispatch = useDispatch();
  const handleLoginButton = async () => {
    setLoginLoading(!loginLoading);
    if (!unitSelected?.value || !unitSelected) {
      setLoginLoading(false);
      return notification.warning({
        message: `Vui lòng chọn đơn vị`,
        placement: "topLeft",
        icon: <UilExclamationOctagon size="25" color="#ffba00" />,
      });
    }
    await https
      .post("Authentication/Login", {
        userName: user_Name,
        password: password,
        DVCS: unitSelected.value.toString().trim(),
      })
      .then((res) => {
        setLoginLoading(false);
        if (typeof res.data == "string") {
          if (res?.data?.toLowerCase()?.includes("login failed")) {
            return notification.warning({
              message: `Sai tài khoản hoặc mật khẩu`,
              placement: "topLeft",
              icon: <UilExclamationOctagon size="25" color="#ffba00" />,
            });
          }
        } else {
          jwt.setAccessToken(res.data.token);
          jwt.setRefreshToken(res.data.refreshToken);
          dispatch(setClaims(jwt.saveClaims(res.data.token)));
          router.navigate("/");
          return notification.success({
            message: `Đăng nhập thành công`,
          });
        }
      });
  };

  const onLackInfoLogin = () => {};
  const onEnoughInfo = () => {
    handleLoginButton();
  };

  const handleInputUserName = useDebouncedCallback((userName) => {
    set_User_Name((value) => {
      return (value = userName);
    });
  }, 500);

  useEffect(() => {
    const getUnits = async () => {
      await https
        .get("Authentication/DVCS", {
          username: user_Name,
        })
        .then((res) => {
          if (res.data) {
            const new_Units = [];
            res.data.map((item) => {
              return new_Units.push({ value: item.dvcsCode, label: item.name });
            });
            set_Units(new_Units);
            set_UnitSelected(new_Units[0]);
          } else {
            set_Units([{ value: "", label: "Không" }]);
            set_UnitSelected({ value: "", label: "Không" });
          }
        });
    };
    if (user_Name) {
      getUnits();
    } else {
      set_Units([{ value: "", label: "Không" }]);
      set_UnitSelected({ value: "", label: "Không" });
    }
  }, [user_Name]);

  useEffect(() => {
    if (jwt.checkExistToken()) {
      dispatch(setClaims(jwt.saveClaims(jwt.getAccessToken())));
      router.navigate("/");
    }
  }, [dispatch]);

  const handleChangeUnit = (item) => {
    set_UnitSelected(units.find((unit) => unit.value == item));
  };

  const images = [
    {
      url: "https://static.businessworld.in/article/article_extra_large_image/1641064057_htx5x8_30495_min.jpg",
      alt: "",
    },
    {
      url: "https://balard-consulting.fr/wp-content/uploads/2022/11/ERP_Grand-1024x683.jpeg",
      alt: "",
    },
    {
      url: "https://blog.vault-erp.com/image.axd?picture=/Invoice%20management/Vault_InvoiceMS_Blog_930x620px_01.png",
      alt: "",
    },
    {
      url: "https://mlitqrsemjqz.i.optimole.com/w:auto/h:auto/q:mauto/https://www.technosip.com/wp-content/uploads/2022/05/7054182.jpg",
      alt: "",
    },
  ];

  return (
    <div className="login_container">
      <div className="login_container_left">
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          autoComplete="off"
          className="login_form"
          onFinishFailed={onLackInfoLogin()}
          onFinish={onEnoughInfo}
        >
          <div className="login_logo_container">
            <UilAnalysis
              className="login_logo_company_logo"
              size="70"
              color="#1677ff"
            />
            <span className="login_logo_company_name">
              SS<span style={{ color: "#F57A20" }}>E</span>
            </span>
          </div>
          <div className="login_desciption">
            <h1 className="login_desciption_header">Hí, Chào mừng trở lại</h1>
            {/* <span className="login_desciption_context">
              Mình đợi hơi bị lâu rồi đấy
            </span> */}
          </div>
          <Space className="default_space login_detail" direction="vertical">
            <Space
              direction="vertical"
              className="default_space input_login_info"
              size={"small"}
            >
              <span>Tài khoản</span>
              <Form.Item
                name="username"
                rules={[{ required: true, message: "Vui lòng điền tài khoản" }]}
              >
                <Input
                  style={{
                    width: "100%",
                    padding: "10px 8px",
                  }}
                  onChange={(e) => handleInputUserName(e.target.value)}
                  className="default_input"
                  size="middle"
                  prefix={<UserOutlined />}
                />
              </Form.Item>

              <span>Mật khẩu</span>
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng điền mật khẩu" }]}
              >
                <Input.Password
                  style={{
                    width: "100%",
                    padding: "10px 8px",
                  }}
                  onChange={(e) => set_Password(e.target.value)}
                  className="default_input"
                  size="large"
                  placeholder="Nhập mật khẩu"
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>

              <span>Đơn vị: </span>
              <Select
                style={{
                  width: "100%",
                }}
                size="large"
                className="default_select"
                value={unitSelected}
                options={units}
                onSelect={handleChangeUnit}
              />
            </Space>

            <Space
              direction="horizontal"
              className="default_space"
              style={{
                justifyContent: "space-between",
                width: "100%",
                paddingBottom: "10px",
              }}
            >
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <Button style={{ padding: "0" }} type="link">
                Quên mật khẩu
              </Button>
            </Space>

            <Space direction="vertical" className="default_space login_tools">
              <Form.Item>
                <Button
                  className="default_button"
                  type="primary"
                  htmlType="submit"
                  loading={loginLoading}
                  style={{ flexShrink: "0", color: "white", width: "100%" }}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Space>
          </Space>
        </Form>
      </div>
      <div className="login_container_right">
        <Carousel autoplay draggable effect="fade" autoplaySpeed={2000}>
          {images.map((item, index) => {
            return (
              <div key={index} className="login_images_container">
                <img src={item.url} alt={item.index} className="login_image" />
              </div>
            );
          })}
        </Carousel>
      </div>
    </div>
  );
};

export default Login;
