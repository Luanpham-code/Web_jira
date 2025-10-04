import React from "react";
import { useNavigate } from "react-router-dom";

const HeaderPage = () => {
  const navigate = useNavigate();

  return (
    <div className="px-14 py-6 bg-black flex justify-between">
      <div className="text-white text-2xl font-bold">CyberLearn.VN</div>

      <div className="text-white">
        <button
          onClick={() => {
            navigate("/login");
          }}
          className="px-2 py-1 rounded bg-purple-400 "
        >
          Đăng nhập
        </button>
        <button
          onClick={() => {
            navigate("/register");
          }}
          className="ml-2 px-2 py-1 rounded bg-white text-black"
        >
          Đăng ký
        </button>
      </div>
    </div>
  );
};

export default HeaderPage;
