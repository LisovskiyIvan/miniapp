import { Download, Globe, User } from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router";
import { motion } from "motion/react";

export default function Navbar() {
  const location = useLocation();
  const links = [
    {
      to: "/",
      label: "Home",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      to: "/choose-config",
      label: "VPN",
      icon: <Download className="h-5 w-5" />,
    },
    {
      to: "/profile",
      label: "Профиль",
      icon: <User className="h-5 w-5" />,
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full bg-dark-secondary border-t border-gray-500 z-50 py-2">
      <div className="flex justify-around relative">
        {links.map((link) => {
          const isActive = location.pathname === link.to;
          return (
            <Link
              to={link.to}
              key={link.label}
              className="relative flex flex-col items-center py-2 px-4 rounded-lg"
              style={{ minWidth: 0, textAlign: "center" }}
            >
              {/* Скользящий индикатор активного состояния */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-blue-50 rounded-lg"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                />
              )}

              {/* Анимированная подсветка при hover */}
              <motion.div
                className="absolute inset-0 bg-gray-100 rounded-lg opacity-0"
                whileHover={{ opacity: isActive ? 0 : 0.1 }}
                transition={{ duration: 0.2 }}
              />

              {/* Контент ссылки */}
              <motion.div
                className="relative z-10 flex flex-col items-center"
                initial={false}
                animate={{
                  scale: isActive ? 1.05 : 1,
                  color: isActive ? "#2563eb" : "#000000",
                }}
                whileHover={{
                  scale: isActive ? 1.05 : 1.02,
                  color: isActive ? "#2563eb" : "#6b7280",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{
                  type: "spring",
                  stiffness: 400,
                  damping: 25,
                }}
              >
                {/* Анимированная иконка */}
                <motion.div
                  animate={{
                    y: isActive ? -2 : 0,
                    rotateY: isActive ? 360 : 0,
                  }}
                  transition={{
                    y: { type: "spring", stiffness: 400, damping: 25 },
                    rotateY: { duration: 0.6, ease: "easeInOut" },
                  }}
                  className="mb-1"
                >
                  {link.icon}
                </motion.div>

                {/* Анимированный текст */}
                <motion.span
                  className="text-xs"
                  animate={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label}
                </motion.span>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
