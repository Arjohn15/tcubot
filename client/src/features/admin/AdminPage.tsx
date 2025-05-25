import { Outlet } from "react-router-dom";

const AdminPage = () => {
  return (
    <div className="h-[100vh] flex flex-col max-sm:h-max">
      <Outlet />
    </div>
  );
};

export default AdminPage;
