import React from "react";
import { Link } from "react-router";
export default function Navbar() {
  const links = [
    {
      to: "/",
      label: "GG.Vpn",
    },
    {
      to: "/profile",
      label: "Profile",
    },
  ];
  return (
    <div className="w-full flex justify-between items-center p-4 text-2xl">
      {links.map((link) => (
        <Link
          to={link.to}
          key={link.label}
          className="text-black px-4 py-2 rounded-md relative transition-all duration-300 
                before:content-[''] before:absolute before:left-0 before:bottom-1 before:w-0 before:h-[2px] before:bg-lavender before:transition-all before:duration-300 hover:before:w-full"
        >
          {link.label}
        </Link>
      ))}
    </div>
  );
}
