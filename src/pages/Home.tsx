import React from "react";
import Navbar from "../components/Navbar";
import { Globe } from "lucide-react";
import Card from "../components/ui/Card";
import { useNavigate } from "react-router";
import { useGetProtocols } from "../api/hooks";
import Header from "../components/Header";
import Why from "../components/Why";
import About from "../components/About";

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
  }));

  return (
    <div className="flex flex-col bg-dark-secondary">
      <Header />
      <div className="flex flex-col items-center justify-center pb-20">
        <About />
        <Why />
        <div className="flex flex-col items-center justify-center">
          {protocols?.map((protocol) => (
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
      <Navbar />
    </div>
  );
}
