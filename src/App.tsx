import React, { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";
import Home from "./pages/Home";
import { init, retrieveLaunchParams, viewport } from "@telegram-apps/sdk";
import Profile from "./pages/Profile";
import { useSetAtom } from "jotai";
import { userAtom } from "./stores/userStore";
import ChooseConfig from "./pages/ChooseConfig";
import { useCreateUser } from "./api/hooks";
import OpenVPN from "./pages/OpenVPN";

init();
viewport.mount();

viewport.expand();
function App() {
  const setUser = useSetAtom(userAtom);
  const createUserMutation = useCreateUser();

  useEffect(() => {
    const { tgWebAppData } = retrieveLaunchParams();
    setUser({
      id: tgWebAppData?.user?.id ?? 0,
      firstname: tgWebAppData?.user?.first_name ?? "",
      username: tgWebAppData?.user?.username ?? "",
      language_code: tgWebAppData?.user?.language_code ?? "",
    });

    // Используем TanStack Query для создания пользователя
    if (
      tgWebAppData?.user?.id &&
      tgWebAppData?.user?.username &&
      tgWebAppData?.user?.first_name
    ) {
      createUserMutation.mutate({
        user_id: tgWebAppData.user.id,
        username: tgWebAppData.user.username,
        firstname: tgWebAppData.user.first_name,
        activate_trial: true,
        trial_days: 7,
      });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/choose-config" element={<ChooseConfig />} />
        <Route path="/ovpn" element={<OpenVPN />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
