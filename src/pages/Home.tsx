import React from "react";
import { invoice } from "@telegram-apps/sdk";
import Navbar from "../components/Navbar";
import { userAtom } from "../stores/userStore";
import { useAtomValue } from "jotai";
import { Globe } from "lucide-react";
import Card from "../components/ui/Card";
import { useNavigate } from "react-router";

const protocols = [
  {
    title: "OpenVPN",
    description:
      "OpenVPN is a free and open-source software application that implements the OpenVPN protocol, which allows users to establish secure and encrypted connections to remote servers.",
    icon: <Globe size={28} />,
    key: "openvpn",
  },
  // {
  //   title: "WireGuard",
  //   description:
  //     "WireGuard is a free and open-source software application that implements the WireGuard protocol, which allows users to establish secure and encrypted connections to remote servers.",
  //   icon: <Globe size={28} />,
  //   key: "wireguard",
  // },
];

export default function Home() {
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();

  // const handleClick = async () => {
  //   try {
  //     // Явно указываем абсолютный путь и метод GET
  //     const res = await fetch(
  //       "/api/create_invoice?title=Test&description=Test&payload=test&price=1",
  //       {
  //         method: "GET",
  //         headers: {
  //           Accept: "application/json",
  //         },
  //       }
  //     );

  //     // Проверяем статус ответа
  //     if (!res.ok) {
  //       console.error(
  //         "Ошибка при получении инвойса:",
  //         res.status,
  //         res.statusText
  //       );
  //       return;
  //     }

  //     // Пробуем распарсить JSON
  //     let data;
  //     try {
  //       data = await res.json();
  //     } catch (jsonError) {
  //       console.error("Ошибка парсинга JSON:", jsonError);
  //       return;
  //     }

  //     if (!data.invoice) {
  //       console.error("В ответе нет поля invoice:", data);
  //       return;
  //     }

  //     try {
  //       const res2 = await invoice.open(data.invoice, "url");
  //       if (res2 == "paid") {
  //         const res3 = await fetch(
  //           "/api/subscriptions?user_id=" + user?.id + "&days=30",
  //           {
  //             method: "POST",
  //             headers: {
  //               Accept: "application/json",
  //             },
  //           }
  //         );
  //         console.log(res3);
  //       }
  //     } catch (error) {
  //       console.error("Ошибка при открытии инвойса:", error);
  //     }

  //     // setData(data); // если нужно сохранить данные в state
  //   } catch (error) {
  //     console.error("Ошибка при запросе инвойса:", error);
  //   }
  // };

  return (
    <div className="flex flex-col h-screen bg-dark-secondary">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="flex flex-col items-center justify-center">
          {protocols.map((protocol) => (
            <Card
              title={protocol.title}
              description={protocol.description}
              icon={protocol.icon}
              key={protocol.key}
              onClick={() => {
                navigate("/choose-config");
              }}
            />
          ))}
        </div>
        <div className="text-lg">More protocols coming soon</div>
      </div>
    </div>
  );
}
