import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Cookies from "universal-cookie";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";

const cookies = new Cookies();

export default function Profile() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [id, setId] = useState("");

  const { setIsLoggedIn, setLogInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token") || cookies.get("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${BASE_URL}/users/getUser`, {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        // console.log(response.data);

        setName(response.data.data.name);
        setEmail(response.data.data.email);
        setId(response.data.data._id);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    fetchUser();
  }, []);

  const sendData = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");

      let user = !password.trim() === "" ? { name, email, password } : { name, email };

      const response = await axios.patch(`${BASE_URL}/users/update/${id}`, user, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      toast.success(response.data.message);
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const deleteUser = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(`${BASE_URL}/users/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      localStorage.removeItem("token");
      localStorage.removeItem("id");

      // Attempt to remove cookies with specific attributes
      cookies.remove("token", { path: "/", sameSite: "None", secure: true });
      cookies.remove("token");

      setIsLoggedIn(false);
      setLogInUser({});
      toast.success(response.data.message);
      navigate("/signin");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <div className=" bg-[url(./assets/images/main_bg.jfif)] bg-no-repeat bg-cover h-screen">
      <div className="container mx-auto ">
        <div className="flex justify-center items-center h-screen">
          <div className="bg-red-100 p-10 rounded-md text-center">
            <h2 className="mb-5 text-xl font-semibold text-gray-600">Edit Your Profile Here-</h2>
            <form className="flex flex-col gap-2" onSubmit={sendData}>
              <input
                className="mb-3 p-2 rounded-sm"
                type="text"
                placeholder="Username"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <input
                className="mb-3 p-2 rounded-sm"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
              <input
                className="mb-3 p-2 rounded-sm"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <button className=" bg-blue-500 text-white rounded-md py-1 my-4" type="submit">
                Save Change
              </button>
            </form>
            <button
              className=" bg-red-500 text-white rounded-md py-1 px-16 mt-4"
              onClick={deleteUser}
            >
              Delete User
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
