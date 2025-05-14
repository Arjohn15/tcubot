import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Registrant, { RegistrantType } from "./Registrant";
import AdminAvatar, { AdminAvatarProps } from "../shared/AdminAvatar";
import { MdErrorOutline } from "react-icons/md";
import AdminHeader from "../shared/AdminHeader";
import CircularLoading from "../../../shared/components/LoadingCircular";
import RegistrantOverview from "./RegistrantOverview";
import ManageUsers from "../ManageUsers/ManageUsers";

const AdminDashboard = () => {
  const [registrants, setRegistrants] = useState<RegistrantType[]>([]);
  const [admin, setAdmin] = useState<AdminAvatarProps>({
    first_name: "",
    last_name: "",
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [registrantID, setRegistrantID] = useState<string>("");

  const navigate = useNavigate();

  const fetchedAdminData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/dashboard", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token-admin")}`,
        },
      });

      console.log(res.data.registrants);
      setRegistrants(res.data.registrants);
      setAdmin(res.data.admin);
      console.log(res.data.admin);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);

      const status = err.response?.status;
      if (status === 401 || status === 403) {
        localStorage.removeItem("token");
        navigate("/admin");
      }
      setError("Something went wrong. Please try again later.");
    }
  };

  function handeClickID(id: string): void {
    setRegistrantID(id);
  }

  const registrant = registrants.find(
    (registrant) => registrant._id === registrantID
  );

  useEffect(() => {
    fetchedAdminData();

    const interval = setInterval(() => {
      fetchedAdminData();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (error) {
    return (
      <>
        <AdminHeader />
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="flex items-center gap-2 p-4 text-[rgba(0,0,0,0.5)]">
            <MdErrorOutline className="text-2xl" />
            <span className="text-lg font-medium">
              Something went wrong. Please try again later.
            </span>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <header className="flex items-center justify-between border-b-2 border-gray-half py-[0.5rem] px-[2rem]">
        <div>
          <a href="/">
            <img
              src="/images/logos/tcubot-main-logo(2).png"
              alt="TCUbot main logo"
              width={120}
            />
          </a>
        </div>
        <h1 className="text-red text-base md:text-xl whitespace-nowrap font-bold">Admin Dashboard</h1>
        <AdminAvatar
          first_name={admin.first_name}
          last_name={admin.last_name}
        />
      </header>

      <div className="mx-[2rem] md:mx-[10rem]  m-[1rem] flex flex-col pb-[2rem]">
        <h2 className="heading-two">New register requests</h2>
        <div className="grow-1 flex flex-col lg:flex-row lg:justify-center">
          <div className="w-[100%] lg:w-[40%]">
            <div className="h-[550px] max-h-[550px] overflow-y-auto py-[1rem] border-2 border-gray rounded-lg">
              {loading ? (
                <>
                  <CircularLoading />
                </>
              ) : (
                <>
                  {registrants.length === 0 ? (
                    <div className="h-full flex justify-center items-center">
                      <h2 className="text-lg font-bold text-gray">
                        No register requests
                      </h2>
                    </div>
                  ) : (
                    <ul className="grid gap-y-3 px-[0.5rem]">
                      {registrants.map((registrant) => {
                        const { _id, first_name, last_name } = registrant;
                        return (
                          <li key={_id}>
                            <Registrant
                              isSelected={_id === registrantID}
                              onClickID={handeClickID}
                              first_name={first_name}
                              last_name={last_name}
                              _id={_id}
                            />
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </>
              )}
            </div>
          </div>
          <RegistrantOverview registrant={registrant} />
        </div>
      </div>
      <div className="mx-[2rem] md:mx-[10rem]">
        <ManageUsers />
      </div>
    </>
  );
};

export default AdminDashboard;
