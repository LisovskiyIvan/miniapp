import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import { Globe } from "lucide-react";
import Card from "../components/ui/Card";
import { useNavigate } from "react-router";
import Header from "../components/Header";
import Why from "../components/Why";
import About from "../components/About";
import { useGetProtocols } from "../api/hooks";
import { useSetAtom } from "jotai";
import { protocolAtom } from "../stores/protocolStore";

export default function Home() {
  const navigate = useNavigate();
  const { data: protocols } = useGetProtocols();

  const protocolsBase = [
    {
      title: "OpenVPN",
      description:
        "Безопасный протокол с открытым исходным кодом. Очень распространенный и надежный.",
      icon: <Globe size={28} />,
      key: "openvpn",
      path: "/ovpn",
    },
    // {
    //   title: "OpenVPN",
    //   description: "OpenVPN протокол для безопасного VPN соединения",
    //   icon: <Globe size={28} />,
    //   key: "1",
    // },
  ];
  const protocolsToShow = protocols?.protocols
    .map((p) => protocolsBase.find((protocol) => protocol.key === p.name))
    .filter((protocol) => protocol !== undefined)
    .map((protocol) => ({
      ...protocol,
      id: protocols?.protocols.find((p) => p.name === protocol?.key)?.id ?? 0,
    }));

  const setProtocol = useSetAtom(protocolAtom);

  useEffect(() => {
    setProtocol(protocolsToShow ?? []);
  }, [protocolsToShow, setProtocol]);

  return (
    <div className="flex flex-col bg-dark-secondary">
      <Header />
      <div className="flex flex-col items-center justify-center pb-20">
        <About />
        <Why />
        <div className="flex flex-col items-center justify-center">
          {protocolsToShow?.map((protocol) => (
            <Card
              title={protocol.title}
              description={protocol.description ?? ""}
              icon={<Globe size={28} />}
              key={protocol.key}
              onClick={() => {
                navigate(protocol.path);
              }}
            />
          ))}
        </div>
        <div className="mt-6 px-4 py-3 text-blue-800 text-lg font-medium transition-all duration-300 text-center w-[90%]">
          Скоро появятся новые протоколы!
        </div>
      </div>
      <Navbar />
    </div>
  );
}
