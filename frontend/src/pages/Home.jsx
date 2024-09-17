import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import TaskCard from "../components/TaskCard";
import { AuthContext } from "../context/AuthProvider";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function Home() {
  const [user, setUser] = useState({});
  const [tasks, setTasks] = useState([]);

  const { isLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const token = localStorage.getItem("token") || cookies.get("token");

    if (!token) {
      navigate("/signin");
      return;
    }

    // Fetch posts when component mounts
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/tasks/getTasks`, {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });

        console.log("tasks", response.data.data);
        setTasks(response.data.data);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${BASE_URL}/users/getUser`, {
          withCredentials: true,
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        console.log("user", response.data.data);
        setUser(response.data.data);
      } catch (error) {
        if (error.response) {
          toast.error(error.response.data.message);
        } else {
          toast.error(error.message);
        }
      }
    };

    fetchUser();
    fetchPosts();
  }, [navigate, isLoggedIn]);

  return (
    <div className="">
      <div className="container mx-auto ">
        <div className="pt-32 flex flex-col items-center">
          <div className="max-w-[22rem] rounded-sm">
            <div className="mb-4">
              <h1 className="text-grey-darkest text-xl font-bold">Todo List</h1>
            </div>
            {tasks.length > 0 ? (
              tasks.map((task, index) => {
                return <TaskCard task={task} key={index} user={user} />;
              })
            ) : (
              <p>No posts available</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
