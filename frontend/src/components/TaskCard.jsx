import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function TaskCard({ task, user }) {
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const completeTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.patch(
        `${BASE_URL}/tasks/complete/${id}`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("complete task", response);

      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(`${BASE_URL}/tasks/delete/${id}`, {
        withCredentials: true,
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      toast.success(response.data.message);
      navigate("/");
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    }
  };

  return (
    <>
      <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
        <div
          className={`  rounded shadow shadow-xl p-3 mb-4 w-full lg:w-3/4 lg:max-w-lg ${
            task.isCompleted ? "bg-zinc-300" : "bg-white"
          }`}
        >
          <div>
            <div className="flex  items-center justify-between">
              <h3
                className={`text-lg font-semibold ${
                  task.isCompleted ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </h3>
              <div className={`items-center ${user.role == "user" ? "hidden" : "flex"}`}>
                <p>
                  By : <span>@{user.name}</span>
                </p>
              </div>
            </div>
            <div className="flex mb-4 items-center">
              <p className={`text-md ${task.isCompleted ? "line-through text-gray-400" : ""}`}>
                {task.description}
              </p>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex justify-center items-center">
                <p className="text-sm font-semibold text-gray-600">
                  Status :{" "}
                  <span className={task.isCompleted ? "text-green-500" : "text-red-500"}>
                    {task.isCompleted ? " Done" : " Pending"}
                  </span>
                </p>
              </div>
              <div className="flex justify-center items-center rounded">
                <p className="text-sm font-semibold text-gray-600">
                  Status :{" "}
                  <span
                    className={
                      task.category == "high"
                        ? "text-red-500"
                        : task.category == "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }
                  >
                    {task.category}
                  </span>
                </p>
              </div>
              <div className="flex justify-center items-center">
                <button
                  className={`flex-no-shrink px-1 mr-2 border-2 rounded hover:text-white text-sm  ${
                    task.isCompleted
                      ? "text-gray-600 border-gray-600 hover:bg-gray-600"
                      : "text-green-600 border-green-600 hover:bg-green-600"
                  }`}
                  onClick={() => completeTask(task._id)}
                >
                  {task.isCompleted ? "Not Done" : " Done"}
                </button>
                <button
                  className="flex-no-shrink px-1 text-sm border-2 rounded text-red-600 border-red-600 hover:text-white hover:bg-red-600"
                  onClick={() => deleteTask(task._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

TaskCard.propTypes = {
  task: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
};
