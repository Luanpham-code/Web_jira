import React from "react";
import { Layout } from "antd";
import {
  AppstoreOutlined,
  ProjectOutlined,
  FileAddOutlined,
  DeploymentUnitOutlined,
  FileSearchOutlined,
  FileOutlined,
  BarChartOutlined,
  AppstoreAddOutlined,
} from "@ant-design/icons";
import { Outlet, Link } from "react-router-dom";

const { Content } = Layout;

const HomeTemplate = () => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar xanh bên trái */}
      <div className="w-16 bg-[#0747a6] flex flex-col items-center py-4 space-y-6">
        <Link
          to="/createtask"
          className="text-white text-sm text-center hover:bg-blue-700 px-2 py-2 rounded w-full"
        >
          + Create task
        </Link>
        <button className="text-white text-sm hover:bg-blue-700 px-2 py-2 rounded w-full">
          🔍 Search
        </button>
      </div>

      {/* Sidebar chính */}
      <div className="w-56 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <h2 className="font-bold text-sm">CyberLearn.vn</h2>
          <p className="text-xs text-gray-500">Report bugs</p>
        </div>

        <nav className="flex-1 p-2">
          <ul className="space-y-1 text-sm">
            <li>
              <Link
                to="/"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <AppstoreOutlined />
                Cyber Board
              </Link>
            </li>
            <li>
              <Link
                to="/projectmanagement"
                className="flex items-center gap-2 px-3 py-2 rounded bg-blue-50 text-blue-600"
              >
                <ProjectOutlined />
                Project management
              </Link>
            </li>
            <li>
              <Link
                to="/createproject"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <FileAddOutlined />
                Create project
              </Link>
            </li>
            <li>
              <Link
                to="/usermanagement"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <AppstoreOutlined />
                User management
              </Link>
            </li>
            <hr className="my-2" />

            <li>
              <Link
                to="/releases"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <DeploymentUnitOutlined />
                Releases
              </Link>
            </li>
            <li>
              <Link
                to="/issues"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <FileSearchOutlined />
                Issues and filters
              </Link>
            </li>
            <li>
              <Link
                to="/pages"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <FileOutlined />
                Pages
              </Link>
            </li>
            <li>
              <Link
                to="/reports"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <BarChartOutlined />
                Reports
              </Link>
            </li>
            <li>
              <Link
                to="/components"
                className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-100"
              >
                <AppstoreAddOutlined />
                Components
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Content chính */}
      <div className="flex-1 p-4 bg-gray-50">
        <Content>
          <Outlet />
        </Content>
      </div>
    </div>
  );
};

export default HomeTemplate;
