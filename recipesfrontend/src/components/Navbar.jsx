import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="navbar bg-base-100" data-theme="business">
      <Link className="btn btn-ghost normal-case text-xl">Recipe Generator</Link>
    </div>
  );
};

export default Navbar;
