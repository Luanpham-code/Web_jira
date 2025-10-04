// import React from "react";
// import { Outlet } from "react-router-dom";

// const AuthTemplate = () => {
//   return (
//     <div>
//       <Outlet />
//     </div>
//   );
// };

// export default AuthTemplate;
import React from "react";
import { Outlet } from "react-router-dom";

const AuthTemplate = () => {
  return (
    <div>
      <Outlet />  {/* render login, register */}
    </div>
  );
};

export default AuthTemplate;