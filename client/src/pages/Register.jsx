import React, { useState, useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useUser } from "../contexts/UserContext";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const api_base = process.env.REACT_APP_API_URL;

export default function Register() {
  const { setIsAuthenticated, setJwtToken } = useAuth();
  const { setUserID } = useUser();
  const navigate = useNavigate();

  const [registerInfo, setRegisterInfo] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
  });
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showValidator, setShowValidator] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => {
        setShowError(false);
      }, 2000);

      return () => clearTimeout(timer); // Clear the timer if component unmounts
    }
  }, [showError]);

  //HandleChange
  const handleChange = (event) => {
    const { name, value } = event.target;

    setRegisterInfo((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };

  //HandleSubmit

  function handleSubmit(event) {
    event.preventDefault();

    fetch(api_base + "/register", {
      method: "POST",
      mode: "cors",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        firstName: registerInfo.fName,
        lastName: registerInfo.lName,
        username: registerInfo.email,
        password: registerInfo.password,
      }),
    })
      .then((response) => response.json())
      .then((res) => {
        if (res.authenticated) {
          setIsAuthenticated(res.authenticated);
          setJwtToken(res.token.toString());
          localStorage.setItem("jwtToken", JSON.stringify(res.token));
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
        <div className="item-1 invisible md:visible lg:visible md:relative lg:relative md:overflow-hidden lg:overflow-hidden md:bg-cover lg:bg-cover md:w-full md:h-full md:basis-1/2 lg:w-full lg:h-full lg:basis-1/2">
          <img
            className="logReg-img lg:w-full lg:h-full md:w-full md:h-full md:object-fill"
            src="https://img.freepik.com/free-photo/blue-monday-with-notepad-pen_23-2148745708.jpg?size=626&ext=jpg&ga=GA1.1.243834695.1695278669&semt=ais"
            alt="note book"
          />
        </div>
        <div className=" w-full h-full basis-full text-center md:relative md:bg-white md:overflow-hidden lg:relative lg:bg-white lg:overflow-hidden md:w-full md:h-full md:basis-1/2 lg:w-full lg:h-full lg:basis-1/2">
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
              method="post"
              onSubmit={handleSubmit}
              className="logReg-form bg-white w-full h-auto rounded-lg mt-5 mx-0 mb-8 py-7 px-5"
            >
              <div>
                <h2 className="lg:text-2xl md:text-xl font-jost text-2xl">
                  LET'S GET YOU STARTED
                </h2>
                <p className="text-sm md:text-xs">
                  Enter your infos below to create your account.
                </p>
              </div>
              {showError && (
                <div>
                  <p className="text-sm md:text-xs text-red">{errorMessage}</p>
                </div>
              )}
              <input
                onChange={handleChange}
                id="user-fName"
                name="fName"
                type="text"
                value={registerInfo.fName}
                placeholder="first name"
                autoComplete="on"
                required
                className="input"
              />
              <input
                onChange={handleChange}
                id="user-lName"
                name="lName"
                type="text"
                value={registerInfo.lName}
                placeholder="last name"
                autoComplete="on"
                required
                className="input"
              />
              <input
                onChange={handleChange}
                id="user-email"
                name="email"
                type="text"
                value={registerInfo.email}
                placeholder="email"
                required
                className="input"
              />
              <div className="flex flex-row w-full my-2.5 mx-0 py-1 border-1 border-grey rounded-md">
                <input
                  onChange={handleChange}
                  onClick={() => setShowValidator(true)}
                  id="user-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={registerInfo.password}
                  placeholder="password"
                  autoComplete="off"
                  required
                  className="w-full px-2.5 focus:outline-none"
                />
                <a
                  href="#/"
                  onClick={togglePasswordVisibility}
                  className="w-auto bg-white text-right px-2.5"
                >
                  {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                </a>
              </div>

              {showValidator && (
                <div className="w-full pl-2 text-left mb-2">
                  {registerInfo.password.length < 8 && (
                    <p className="text-xss font-semibold block text-red">
                      password must be atleast 8 characters
                    </p>
                  )}
                  {!/[a-zA-Z]/.test(registerInfo.password) && (
                    <p className="text-xss font-semibold block text-red">
                      password must include atleast one alphabet
                    </p>
                  )}
                  {!/[0-9]/.test(registerInfo.password) && (
                    <p className="text-xss font-semibold block text-red">
                      password must include atleast on number
                    </p>
                  )}
                  {!/[@$!%*?&]/.test(registerInfo.password) && (
                    <p className="text-xss font-semibold block text-red">
                      password must include atleast on special character
                    </p>
                  )}
                </div>
              )}

              <button
                className="rounded-lg w-full py-1.5 px-0 text-base font-normal text-white cursor-pointer font-poppins"
                type="submit"
              >
                Register
              </button>
            </form>
            <div>
              <NavLink
                className="text-white md:text-blue lg:text-blue no-underline text-xs font-medium lg:text-sm md:text-sm "
                to="/login"
              >
                Already have an account? Log In!
              </NavLink>
            </div>
            <div className="mt-3">
              <NavLink
                className="text-white  md:text-blue lg:text-blue no-underline text-xs font-bold lg:text-sm md:text-sm"
                to="/"
              >
                <ArrowRightAltIcon className="transform -scale-x-150 mr-1" />
                Go To Home
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
