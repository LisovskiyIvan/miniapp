import React from "react";
import Navbar from "../components/Navbar";
import { Globe } from "lucide-react";
import Card from "../components/ui/Card";
import { useNavigate } from "react-router";
import { useGetProtocols } from "../api/hooks";

export default function Home() {
  const navigate = useNavigate();
  const { data: protocolsData } = useGetProtocols();
  console.log(protocolsData);
  const protocols = protocolsData?.protocols?.map((protocol) => ({
    title: protocol.name,
    description:
      protocol.description ||
      `${protocol.name} протокол для безопасного VPN соединения`,
    icon: <Globe size={28} />,
    key: protocol.id.toString(),
  })) || [
    {
      title: "OpenVPN",
      description:
        "OpenVPN is a free and open-source software application that implements the OpenVPN protocol, which allows users to establish secure and encrypted connections to remote servers.",
      icon: <Globe size={28} />,
      key: "openvpn",
    },
  ];

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
