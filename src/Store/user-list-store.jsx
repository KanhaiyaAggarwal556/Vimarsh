import { createContext, useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";

UsersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const UserList = createContext({
  userList: [],
  fetching: false,
  addUser: () => {},
  deleteUser: () => {},
  updateUser: () => {},
  getUserById: () => {},
});

const UserListReducer = (currUserList, action) => {
  let newUserList = currUserList;
  if (action.type === "DELETE_USER") {
    newUserList = currUserList.filter(
      (user) => user.userId !== action.payload.userId
    );
  } else if (action.type === "ADD_USER") {
    newUserList = [action.payload, ...currUserList];
  } else if (action.type === "UPDATE_USER") {
    newUserList = currUserList.map((user) =>
      user.userId === action.payload.userId ? action.payload : user
    );
  } else if (action.type === "ADD_INITIAL_USERS") {
    newUserList = action.payload.users;
  }
  return newUserList;
};

export default function UsersProvider({ children }) {
  const [userList, dispatchUserList] = useReducer(UserListReducer, []);
  const [fetching, setFetching] = useState(false);

  const addInitialUsers = (users) => {
    dispatchUserList({
      type: "ADD_INITIAL_USERS",
      payload: {
        users,
      },
    });
  };

  const addUser = async (
    userId,
    username,
    email,
    contactNumber = null,
    UsersProfilePic = null
  ) => {
    const newUser = {
      userId,
      username,
      email,
      contactNumber,
      UsersProfilePic:
        UsersProfilePic ||
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    };

    try {
      const response = await fetch("https://twooter-backend.onrender.com/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      if (response.ok) {
        const createdUser = await response.json();
        dispatchUserList({
          type: "ADD_USER",
          payload: createdUser,
        });
        return createdUser;
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to create user");
      }
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  };

  const updateUser = async (userId, updatedData) => {
    try {
      // Note: You'll need to implement PUT /api/users/:userId in your backend
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        dispatchUserList({
          type: "UPDATE_USER",
          payload: updatedUser,
        });
        return updatedUser;
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update user");
      }
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  };

  const deleteUser = async (userId) => {
    try {
      // Note: You'll need to implement DELETE /api/users/:userId in your backend
      const response = await fetch(
        `http://localhost:3000/api/users/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        dispatchUserList({
          type: "DELETE_USER",
          payload: {
            userId,
          },
        });
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete user");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      throw error;
    }
  };

  const getUserById = (userId) => {
    return userList.find((user) => user.userId === userId);
  };

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    setFetching(true);

    fetch("http://localhost:3000/api/users", { signal })
      .then((res) => res.json())
      .then((data) => {
        // Handle the API response - users are returned directly as array
        const users = Array.isArray(data) ? data : data.UserData || [];

        addInitialUsers(users);
        setFetching(false);
      })
      .catch((error) => {
        if (error.name !== "AbortError") {
          console.error("Error fetching users:", error);
          setFetching(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <UserList.Provider
      value={{
        userList,
        fetching,
        addUser,
        deleteUser,
        updateUser,
        getUserById,
      }}
    >
      {children}
    </UserList.Provider>
  );
}
