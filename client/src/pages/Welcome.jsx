import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import CheckIcon from "@mui/icons-material/Check";
import GitHubIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Slide } from "react-awesome-reveal";

export default function Welcome() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const year = new Date().getFullYear();

  const openMenu = () => {
    setShowMobileMenu(true);
  };
  const closeMenu = () => {
    setShowMobileMenu(false);
  };

  return (
    <>
      <div className="parent relative overflow-y-scroll overflow-x-hidden w-screen h-screen">
        {showMobileMenu && (
          <div className="mobile-menu visible lg:invisible fixed top-0 right-0 z-50 max-w-50vw w-vw40 h-auto bg-white">
            <div className="w-full h-16 py-1.5 px-0 m-0 text-blue border-b-2 border-b-grey flex flex-row items-center">
              <CloseIcon className="text-6xl" onClick={closeMenu} />
            </div>
            <ul className="menu-ul my-2 mx-0">
              <li>
                <a className="link-mobile" href="#home">
                  Home
                </a>
              </li>
              <li>
                <a className="link-mobile" href="#about">
                  About
                </a>
              </li>
              <li>
                <a className="link-mobile" href="#features">
                  Features
                </a>
              </li>
              <li>
                <a className="link-mobile" href="#developer">
                  Developer
                </a>
              </li>
              <li>
                <a className="link-mobile" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        )}
        <nav className="hd fixed z-40 w-full h-16 flex flex-row justify-center border-b-2 border-b-grey bg-white py-1 px-6">
          <div className="logo-div relative w-1/4 overflow-hidden">
            <img
              className="absolute transform -translate-x-1/2 -translate-y-1/2 left-1/2 md:left-24 sm:left-1/2 lg:left-24  top-1/2 w-40"
              src="assets/logo-blue.png"
              alt="logo"
            />
          </div>
          <div className="w-3/4 flex flex-row items-center">
            <div className="w-3/4 flex flex-row justify-center  invisible  lg:visible">
              <ul className="flex flex-row text-blue">
                <li className="text-lg mx-6 ">
                  <a href="#home">Home</a>
                </li>
                <li className="text-lg mx-6 ">
                  <a href="#about">About</a>
                </li>
                <li className="text-lg mx-6 ">
                  <a href="#developer">Developer</a>
                </li>
                <li className="text-lg mx-6 ">
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>
            <div className="w-1/4 flex flex-row justify-end">
              <div className="visible">
                <NavLink
                  className="mr-2 text-blue text-sm lg:text-lg"
                  to="/login"
                >
                  Login
                </NavLink>
              </div>
              <div className="visible">
                <NavLink
                  className="mr-2 bg-blue text-white text-sm lg:text-lg text-center rounded-md py-1 lg:py-2 px-3 lg:px-8"
                  to="/register"
                >
                  Register
                </NavLink>
              </div>
              <div className="ml-6 lg:ml-0">
                <button
                  onClick={openMenu}
                  className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 text-blue visible lg:invisible"
                >
                  <MenuIcon fontSize="large" />
                </button>
              </div>
            </div>
          </div>
        </nav>
        <section
          id="home"
          className="w-full h-auto flex flex-col lg:flex-row px-6 mt-16 pt-5 lg:pt-10 bg-white"
        >
          <Slide direction="left">
            <div
              className="w-full sm:text-center md:text-center lg:text-left lg:flex
            lg:flex-col lg:justify-center"
            >
              <h1 className="h-text text-7xl md:text-8xl sm:text-8xl font-jost text-blue">
                <span className="block md:inline sm:inline lg:block mr-5">
                  YOUR
                </span>
                <span className="block md:inline sm:inline lg:block">
                  DIGITAL
                </span>
                <span className="block">NOTEBOOK</span>
              </h1>
              <p className="h-p text-blue text-md my-2">
                Recap is more than a notebook, it's better. It's digital.
              </p>
              <a
                className="h-a text-sm font-semibold text-blue"
                href="/register"
              >
                Get Started
                <ArrowRightAltIcon />
              </a>
            </div>
          </Slide>

          <Slide direction="right">
            <div className="w-full block md:hidden sm:hidden lg:block relative">
              <img
                className="h-img w-96 md:w-1/2 mb-0 lg:w-500"
                src="assets/lapPhone.png"
                alt="laptop"
              />
            </div>
          </Slide>
          <Slide direction="right">
            <div className="w-full hidden md:block sm:block lg:hidden relative md:text-center">
              <img
                className="w-500 mb-0 mt-5 mx-auto lg:w-500"
                src="assets/laptop.png"
                alt="laptop"
              />
            </div>
          </Slide>
        </section>
        <div className="w-full h-auto bg-white -mb-1 p-0">
          <svg
            className="w-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
          >
            <path
              fill="rgba(9, 55, 121, 1)"
              fillOpacity="1"
              d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
        <section id="about" className="sec-2 w-full h-auto py-10 -mb-1">
          <Slide direcition="left">
            <h1 className="headings white-stroke text-6xl sm:text-7xl md:text-8xl -ml-5 font-jost text-white opacity-75">
              ABOUT RECAP
            </h1>
          </Slide>
          <div className="w-full h-auto flex flex-col  lg:flex-row-reverse px-6 mt-2 lg:mt-0">
            <div className="w-full lg:w-1/2 flex flex-row justify-center">
              <Slide direction="right">
                <img
                  className="w-full sm:w-400 lg:w-500"
                  src="assets/Notebook-rafiki.png"
                  alt="laptop"
                />
              </Slide>
            </div>
            <div className="w-full lg:w-1/2 flex flex-row items-center">
              <Slide direction="left">
                <p className="text-white text-lg md:text-3xl lg:text-4xl">
                  Recap is a digital note-keeping app that allows you to save
                  your notes on the go. It makes everyday note taking easy and
                  organized.
                </p>
              </Slide>
            </div>
          </div>
        </section>
        <section
          id="features"
          className="w-full h-auto sec-3 py-0 pb-10 bg-white"
        >
          <div className="w-full h-30  p-0 transform rotate-180">
            <svg
              className="w-full p-0"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill="rgba(0, 212, 255, 1)"
                fillOpacity="1"
                d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,250.7C1248,256,1344,288,1392,304L1440,320L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          <Slide direction="right">
            <h1 className="headings text-6xl sm:text-7xl md:text-8xl -mr-2 font-jost text-blue text-right">
              FEATURES
            </h1>
          </Slide>
          <div className="w-full h-auto flex flex-col lg:flex-row px-6 mt-2 lg:mt-0">
            <div className="w-full h-auto lg:w-1/2 flex flex-row justify-center">
              <div className="w-full h-auto relative text-center">
                <img
                  className="hand-img w-60 absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 z-10 sm:w-80 md:w-80 lg:w-96"
                  src="assets/Hand.png"
                  alt="laptop"
                />

                <svg
                  id="sw-js-blob-svg"
                  viewBox="0 0 100 100"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient
                      id="sw-gradient"
                      x1="0"
                      x2="1"
                      y1="1"
                      y2="0"
                    >
                      <stop
                        id="stop1"
                        stopColor="rgba(9, 55, 121, 1)"
                        offset="0%"
                      ></stop>
                      <stop
                        id="stop2"
                        stopColor="rgba(0, 212, 255, 1)"
                        offset="100%"
                      ></stop>
                    </linearGradient>
                  </defs>
                  <path
                    fill="url(#sw-gradient)"
                    d="M23.8,-28.8C30.7,-22.5,36.3,-14.9,38.7,-6.1C41.1,2.7,40.2,12.7,35.3,19.4C30.3,26.2,21.1,29.6,11.7,33.6C2.3,37.6,-7.4,42.2,-16.4,40.8C-25.4,39.3,-33.7,31.8,-36.2,23C-38.8,14.2,-35.5,4.3,-33,-5.1C-30.5,-14.4,-28.6,-23.2,-23.3,-29.9C-17.9,-36.5,-8.9,-41.1,-0.3,-40.8C8.4,-40.5,16.8,-35.2,23.8,-28.8Z"
                    width="100%"
                    height="100%"
                    transform="translate(50 50)"
                    strokeWidth="0"
                    className=" transition-all duration-300 ease-in-out delay-0"
                  ></path>
                </svg>
              </div>
            </div>
            <div className="w-full lg:w-1/2 flex flex-row lg:items-center items-start justify-center">
              <ul className="features-text text-2xl lg:text-4xl text-blue flex flex-col lg:flex-col md:flex-row">
                <Slide direction="right">
                  <div className="m-0 p-0 md:mr-5">
                    <li className="my-4 font-semibold">
                      <CheckIcon /> Create Notes
                    </li>
                    <li className="my-4 font-semibold">
                      <CheckIcon /> Edit your Notes
                    </li>
                    <li className="my-4 font-semibold">
                      <CheckIcon /> Create Collections
                    </li>
                  </div>
                  <div>
                    <li className="mt-0 mb-4 md:my-4 lg:mt-0 font-semibold">
                      <CheckIcon /> Add Notes to your Collection
                    </li>
                    <li className="my-4 font-semibold">
                      <CheckIcon /> Search for a Note
                    </li>
                  </div>
                </Slide>
              </ul>
            </div>
          </div>
        </section>
        <section id="developer" className="sec-4 bg-blue w-full h-auto">
          <div>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
              <path
                fill="#ffffff"
                fillOpacity="1"
                d="M0,288L40,266.7C80,245,160,203,240,197.3C320,192,400,224,480,202.7C560,181,640,107,720,96C800,85,880,139,960,138.7C1040,139,1120,85,1200,58.7C1280,32,1360,32,1400,32L1440,32L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
              ></path>
            </svg>
          </div>
          <Slide direction="left">
            <h1 className="headings white-stroke text-6xl sm:text-7xl md:text-8xl -ml-5 font-jost text-white opacity-75">
              DEVELOPER
            </h1>
          </Slide>
          <div className="px-4 py-4 flex flex-col lg:flex-row">
            <div className="w-full lg:w-1/2 flex flex-row justify-center overflow-hidden my-10">
              <Slide direction="left">
                {" "}
                <div className="w-300 lg:w-400 h-300 lg:h-400 bg-white flex flex-row justify-center items-center rounded-md">
                  <div className="img-box w-full rounded-md p-3 border-4 border-white shadow-md">
                    <img
                      className="rounded-md"
                      src="assets/img2.jpg"
                      alt="developer"
                    />
                  </div>
                </div>
              </Slide>
            </div>
            <div className="w-full lg:w-1/2 flex flex-col justify-center">
              <Slide direction="right">
                <div className="w-full flex flex-col justify-center">
                  <p className="text-lg text-white lg:text-3xl block">
                    Hi, I am Amara, a full-stack web developer. I developed
                    Recap as my first full-stack App. It was fun to develop
                    because I learnt alot along the way.
                  </p>
                  <p className=" mt-4  text-lg text-white lg:text-3xl block">
                    Feel free to test it out or even use it; And don't forget to
                    leave a feedback.
                  </p>
                </div>
                <div id="contact" className="w-full flex flex-col mt-7">
                  <div className="w-auto flex flex-row">
                    <h2 className="bg-white text-blue font-semibold px-3">
                      GET IN TOUCH:
                    </h2>
                  </div>
                  <div className="flex flex-row w-auto h-auto my-4">
                    <a
                      className="text-white  mr-4"
                      href="https://www.linkedin.com/in/amara-a-kamara-006944261/"
                    >
                      <LinkedInIcon />
                    </a>
                    <a
                      className="text-white  mr-4"
                      href="https://github.com/rozo-dev"
                    >
                      <GitHubIcon />
                    </a>
              
                  </div>
                </div>
              </Slide>
            </div>
          </div>
        </section>
        <footer className="text-center bg-white shadow-md py-4 px-4">
          <p className="text-blue mx-0">copyright @ amara {year}</p>
        </footer>
      </div>
    </>
  );
}
