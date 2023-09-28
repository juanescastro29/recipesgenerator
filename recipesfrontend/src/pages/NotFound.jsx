import { Link } from "react-router-dom";
import Poio2 from "../assets/poio2.png";

const NotFound = () => {
  return (
    <div className="hero min-h-screen bg-base-100" data-theme="business">
      <div className="hero-content flex-col lg:flex-row space-x-16">
        <img
          src={Poio2}
          alt="logo"
          className="max-w-sm rounded-lg shadow-2xl"
        />
        <div>
          <h1 className="text-5xl font-bold">404 Not Found</h1>
          <p className="py-6">Something went wrong.</p>
          <Link className="btn btn-primary" to={"/"}>Go Home</Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
