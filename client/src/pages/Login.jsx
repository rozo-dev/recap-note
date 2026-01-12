import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const api_base = process.env.REACT_APP_API_URL;

export default function Login() {
  const { setIsAuthenticated, setJwtToken } = useAuth();

  const { setUserID } = useUser();
  const [loginInfo, setLoginInfo] = useState({
    email: "kamaraamara8507@gmail.com",
    password: "12345Note@",
  });
  const navigate = useNavigate();

  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [showError]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setLoginInfo((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  function handleSubmit(event) {
    event.preventDefault();
    fetch(api_base + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        username: loginInfo.email,
        password: loginInfo.password,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.authenticated) {
          setJwtToken(res.token.toString());
          localStorage.setItem("jwtToken", JSON.stringify(res.token));
          setIsAuthenticated(res.authenticated);
          const uid = res.user._id.toString();
          setUserID(uid);
          localStorage.setItem("userID", JSON.stringify(uid));
          navigate("/home", { replace: true });
        } else {
          setIsAuthenticated(res.authenticated);
          setShowError(true);
          setErrorMessage(res.message);
        }
      })
      .catch((error) => {
        console.error(error.message);
      });
  }

  return (
    <div className="container-full w-screen h-screen absolute p-0 m-0 overflow-hidden">
      <div className="flex flex-row w-full h-full m-0 p-0">
        <div className="w-full h-full basis-full text-center md:relative md:bg-white md:overflow-hidden lg:relative lg:bg-white lg:overflow-hidden md:w-full md:h-full md:basis-1/2 lg:w-full lg:h-full lg:basis-1/2">
          <div className="flex flex-col justify-center items-center absolute inset-0 m-auto max-w-80vw max-h-80vh w-80vw h-80vh text-center lg:w-500 md:w-400 lg:h-auto md:h-auto lg:py-5 lg:px-7 md:p-3 text-blue">
            <div className="w-60">
              <img
                className="hidden lg:block"
                src="assets/logo-blue.png"
                alt="logo"
              />
              <img
                className="block lg:hidden"
                src="assets/logoPng.png"
                alt="logo"
              />
            </div>
            <form
              onSubmit={handleSubmit}
              method="post"
              className="logReg-form bg-white w-full h-auto rounded-lg mt-5 mx-0 mb-8 py-7 px-5"
            >
              <div>
                <h2 className="lg:text-2xl md:text-xl font-jost text-2xl">
                  WELCOME BACK
                </h2>
                <p className="text-sm md:text-xs lg:text-sm">
                  Enter your login infos below to gain access.
                </p>
              </div>
              {showError && (
                <div>
                  <p className="text-sm md:text-xs text-red">{errorMessage}</p>
                </div>
              )}
              <div className="input">
                <input
                  onChange={handleChange}
                  id="login-email"
                  name="email"
                  type="text"
                  value={loginInfo.email}
                  autoComplete="on"
                  placeholder="Enter your email"
                  className="w-full py-2 px-2"
                  required
                />
              </div>

              <div className="input my-2.5 border-1 border-grey rounded-md">
                <div className="w-full flex flex-row py-2 px-2">
                  <input
                    onChange={handleChange}
                    id="current-password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={loginInfo.password}
                    autoComplete="off"
                    placeholder="Enter your password"
                    required
                    className="w-full focus:outline-none"
                  />
                  <a
                    href="#/"
                    onClick={togglePasswordVisibility}
                    className=" bg-white px-2.5"
                  >
                    {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </a>
                </div>
              </div>
              <button
                className="rounded-lg w-full py-1.5 px-0 text-base font-normal text-white cursor-pointer font-poppins"
                type="submit"
              >
                Login
              </button>
            </form>
            <div>
              <NavLink
                className="text-white md:text-blue lg:text-blue no-underline text-xs font-medium lg:text-sm md:text-sm"
                to="/register"
              >
                Don't have an account? Let's make you one!
              </NavLink>
            </div>
            <div className="mt-5">
              <NavLink
                className="text-white md:text-blue lg:text-blue no-underline text-xs font-bold lg:text-sm md:text-sm"
                to="/"
              >
                <ArrowRightAltIcon className="transform -scale-x-150 mr-1" />
                Go To Home
              </NavLink>
            </div>
          </div>
        </div>
        <div className="item-1 item-1 invisible md:visible lg:visible md:relative lg:relative md:overflow-hidden lg:overflow-hidden md:bg-cover lg:bg-cover md:w-full md:h-full md:basis-1/2 lg:w-full lg:h-full lg:basis-1/2 ">
          <img
            className="logReg-img lg:w-full lg:h-full md:w-full md:h-full object-cover"
            src="https://img.freepik.com/free-photo/top-view-two-decorative-books-with-blue-background_23-2147615018.jpg?w=996&t=st=1699355256~exp=1699355856~hmac=47ec45eee711403415323c5e737340a08b37153ea8118984f17a8aa014319f89"
            alt="note book"
          />
        </div>
      </div>
    </div>
  );
}
