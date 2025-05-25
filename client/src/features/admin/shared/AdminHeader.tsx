import { Link } from "react-router-dom";

const AdminHeader = () => {
  return (
    <header className="flex justify-between items-center border-b-2 border-gray-half px-[2rem] py-[0.5rem] max-sm:p-[1rem]">
      <div className="max-sm:hidden">
        <a href="/">
          <img
            src="/images/logos/tcubot-main-logo(2).png"
            alt="TCUbot main logo"
            width={120}
          />
        </a>
      </div>
      <h1 className="text-red text-base md:text-xl whitespace-nowrap font-bold">
        Admin Dashboard
      </h1>
      <span>
        <Link to={"/"}>
          <span className="font-bold w-max text-red block hover:cursor-pointer hover:underline max-sm:text-xs">
            Log in as user
          </span>
        </Link>
      </span>
    </header>
  );
};

export default AdminHeader;
