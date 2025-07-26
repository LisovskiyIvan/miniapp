import React from "react";
import Navbar from "../components/Navbar";
import { userAtom } from "../stores/userStore";
import { useAtomValue } from "jotai";


export default function Profile() {
  const user = useAtomValue(userAtom);
  return (
    <div className="flex flex-col h-screen bg-dark-secondary">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
        <h1 className="text-2xl font-bold text-white">{user?.first_name}</h1>
        <h1 className="text-2xl font-bold text-white">{user?.id}</h1>
      </div>
    </div>
  );
}