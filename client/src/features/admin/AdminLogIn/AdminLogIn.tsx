import TextField from "@mui/material/TextField";
import { Button, IconButton, InputAdornment } from "@mui/material";
import { useEffect, useState } from "react";
import { LuEyeOff } from "react-icons/lu";
import { LuEye } from "react-icons/lu";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../shared/AdminHeader";

const HOST = import.meta.env.VITE_API_URL;

const AdminLogIn = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [serverMessage, setServerMessage] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(): Promise<void> {
    try {
      const res = await axios.post(`${HOST}/auth/login/admin`, {
        username,
        password,
      });

      localStorage.setItem("token-admin", res.data.token);
      navigate("/admin/dashboard");
    } catch (err: any) {
      setServerMessage(err.response.data.message);
    }
  }

  useEffect(() => {
    const checkAdminAccess = async () => {
      const token = localStorage.getItem("token-admin");

      if (token) {
        try {
          const res = await axios.get(`${HOST}/auth/admin-login-auth`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (res.status === 200) {
            navigate("/admin/dashboard");
          }
        } catch (err: any) {
          console.error(err.response.data.message);
        }
      }
    };

    checkAdminAccess();
  }, []);

  return (
    <>
      <AdminHeader />
      <div className="grow-1 flex items-center justify-center max-sm:grow-0 max-sm:mt-[11.5rem] max-sm:text-xs">
        <div className="w-[25vw] border-2 border-gray-half px-[1.5rem] py-[2rem] rounded-lg grid gap-y-5 max-sm:w-[85vw]">
          <div>
            <TextField
              id="admin-username"
              label="Username"
              variant="outlined"
              fullWidth
              onChange={(e) => setUsername(e.target.value)}
              sx={{
                "@media (max-width: 640px)": {
                  "& .MuiInputBase-input": {
                    fontSize: "0.85rem",
                  },
                },
              }}
            />
          </div>
          <div>
            <TextField
              id="admin-password"
              label="Password"
              variant="outlined"
              type={showPassword ? "text" : "password"}
              fullWidth
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <LuEye /> : <LuEyeOff />}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                "@media (max-width: 640px)": {
                  "& .MuiInputBase-input": {
                    fontSize: "0.85rem",
                  },
                },
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>
          <div>
            {serverMessage && (
              <p className="text-red text-center text-sm pb-[1rem] max-sm:text-xs">
                {serverMessage}
              </p>
            )}
            <Button
              variant="contained"
              sx={{
                color: "white",
                textTransform: "none",
                padding: "0.75rem 0 0.75rem 0",
              }}
              fullWidth
              type="submit"
              onClick={handleSubmit}
            >
              <span className="text-lg max-sm:text-sm">Log In</span>
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogIn;
