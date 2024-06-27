import React from "react";
import logo from "./assets/logo.svg";

const Header = () => {
  return (
    // <header className="bg-black text-white p-4 flex items-center relative w-full">
    <header className="fixed top-0 left-0 w-full  py-2 px-4 flex justify-between items-center  bg-background ">
      {/* Square SVG Icon - img tag */}
      <img src={logo} alt="Square SVG Icon" className="h-12 mr-2 ml-6" />

      {/* Thin Slate-50 line */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-zinc-800"></div>
    </header>
  );
};

export default Header;
