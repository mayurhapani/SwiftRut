import PropTypes from "prop-types";
import axios from "axios";
import { toast } from "react-toastify";
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";

export default function TaskCard({ task, user }) {
  const navigate = useNavigate();

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  // const addComment = async (post) => {
  //   try {
  //     const response = await axios.post(
  //       `${BASE_URL}/post/addComment/${post._id}`,
  //       { comment },
  //       {
  //         withCredentials: true,
  //         headers: {
  //           Authorization: "Bearer " + localStorage.getItem("token"),
  //         },
  //       }
  //     );
  //     setComment("");
  //     setCommentCount(commentCount + 1);
  //     toast.success(response.data.message);
  //   } catch (error) {
  //     if (error.response) {
  //       toast.error(error.response.data.message);
  //     } else {
  //       toast.error(error.message);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (myPostId == post._id && newCommentAdd) {
  //     setCommentCount(commentCount + 1);
  //     setNewCommentAdd(false);
  //   }

  //   if (myPostId === post._id && delComment) {
  //     if (commentCount > 0) {
  //       setCommentCount(commentCount - 1);
  //     }
  //     setDelComment(false);
  //   }
  // }, [
  //   newCommentAdd,
  //   delComment,
  //   commentCount,
  //   myPostId,
  //   post._id,
  //   setNewCommentAdd,
  //   setDelComment,
  // ]);

  return (
    <>
      <div className="h-100 w-full flex items-center justify-center bg-teal-lightest font-sans">
        <div className="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
          
          <div>
            <div className="flex mb-4 items-center">
              <p className="w-full text-grey-darkest">
                Add another component to Tailwind Components
              </p>
              <button className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green border-green hover:bg-green">
                Done
              </button>
              <button className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red hover:text-white hover:bg-red">
                Remove
              </button>
            </div>
            <div className="flex mb-4 items-center">
              <p className="w-full line-through text-green">
                Submit Todo App Component to Tailwind Components
              </p>
              <button className="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-grey border-grey hover:bg-grey">
                Not Done
              </button>
              <button className="flex-no-shrink p-2 ml-2 border-2 rounded text-red border-red hover:text-white hover:bg-red">
                Remove
              </button>
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
