import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import { init, retrieveLaunchParams, viewport} from "@telegram-apps/sdk";
import Profile from "./pages/Profile";
import { useSetAtom } from "jotai";
import { userAtom } from "./stores/userStore";

init();
viewport.mount();

viewport.expand();
function App() {

  const setUser = useSetAtom(userAtom);
  useEffect(() => {
    const { tgWebAppData } = retrieveLaunchParams();
    setUser({
      id: tgWebAppData?.user?.id ?? 0,
      first_name: tgWebAppData?.user?.first_name ?? "",
      username: tgWebAppData?.user?.username ?? "",
      language_code: tgWebAppData?.user?.language_code ?? "",
    });
    createUser(
      tgWebAppData?.user?.id,
      tgWebAppData?.user?.username,
      tgWebAppData?.user?.first_name
    );
  }, [setUser]);

  const createUser = async (
    id: number | undefined,
    username: string | undefined,
    firstname: string | undefined
  ) => {
    if (!id || !username || !firstname) {
      return;
    }

    try {
      const res = await fetch(
        "/api/users?user_id=" +
          id +
          "&username=" +
          username +
          "&firstname=" +
          firstname,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );
      const data = await res.json();
      console.log(data);
      if (!res.ok) {
        console.error(
          "Ошибка при создании пользователя:",
          res.status,
          res.statusText
        );
        return;
      }
    } catch (error) {
      console.error("Ошибка при создании пользователя:", error);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
