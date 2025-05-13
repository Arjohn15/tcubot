import { Link } from "react-router-dom";

const AdminHeader = () => {
  return (
    <header className="flex justify-between items-center border-b-2 border-gray-half px-[2rem] py-[0.5rem]">
      <div>
        <a href="/">
          <img
            src="/images/logos/tcubot-main-logo.png"
            alt="TCUbot main logo"
            width={120}
          />
        </a>
      </div>
      <h1 className="text-red text-xl font-bold">Admin Dashboard</h1>
      <span>
        <Link to={"/"}>
          <span className="font-bold w-max text-red block hover:cursor-pointer hover:underline">
            Log in as user
          </span>
        </Link>
      </span>
    </header>
  );
};

export default AdminHeader;
