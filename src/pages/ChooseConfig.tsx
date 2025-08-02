import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Select from "../components/ui/Select";
import { Star } from "lucide-react";
import Button from "../components/ui/Button";
import Modal from "../components/ui/Modal";
import ConfigDisplay from "../components/ConfigDisplay";
import Alert from "../components/ui/Alert";
import { invoice } from "@telegram-apps/sdk";
import { useAtomValue } from "jotai";
import { userAtom } from "../stores/userStore";

const options = [
  { label: "OpenVPN", value: "openvpn" },
  { label: "WireGuard", value: "wireguard" },
];

const servers = [
  { label: "Netherlands", value: "nl" },
  // { label: "Server 2", value: "server2" },
  // { label: "Server 3", value: "server3" },
];

const days = [
  { label: "3 days", value: "3" },
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
];

const prices = {
  "3": 1,
  "7": 1,
  "30": 1,
};

export default function ChooseConfig() {
  const [selectedOption, setSelectedOption] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedServer, setSelectedServer] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [selectedDays, setSelectedDays] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [configData, setConfigData] = useState<{
    id: number;
    subscription_id: number;
    config_name: string;
    created_at: string;
    config_content: string;
    is_active: boolean;
  } | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAtomValue(userAtom);

  useEffect(() => {
    if (selectedDays && selectedOption && selectedServer) {
      setTotalPrice(prices[selectedDays.value as keyof typeof prices]);
    } else {
      setTotalPrice(0);
    }
  }, [selectedDays, selectedOption, selectedServer]);

  const generateConfig = async () => {
    console.log(selectedOption, selectedServer, selectedDays);
    if (!selectedOption || !selectedServer || !selectedDays) {
      setError("Пожалуйста, выберите все параметры");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Явно указываем абсолютный путь и метод GET
      const res = await fetch(
        `/api/create_invoice?title=${selectedOption.label}&description=${selectedOption.label}&payload=${selectedOption.value}-${selectedServer.value}-${selectedDays.value}&price=${totalPrice}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      // Проверяем статус ответа
      if (!res.ok) {
        console.error(
          "Ошибка при получении инвойса:",
          res.status,
          res.statusText
        );
        setError("Ошибка при создании инвойса. Попробуйте еще раз.");
        return;
      }

      // Пробуем распарсить JSON
      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error("Ошибка парсинга JSON:", jsonError);
        setError("Ошибка при обработке ответа сервера");
        return;
      }

      if (!data.invoice) {
        console.error("В ответе нет поля invoice:", data);
        setError("Неверный формат ответа от сервера");
        return;
      }

      try {
        const res2 = await invoice.open(data.invoice, "url");
        if (res2 == "paid") {
          const res3 = await fetch(
            "/api/subscriptions?user_id=" + user?.id + "&days=30",
            {
              method: "POST",
              headers: {
                Accept: "application/json",
              },
            }
          );
          if (res3.ok) {
            const res4 = await fetch("/api/vpn?user_id=" + user?.id, {
              method: "POST",
              headers: {
                Accept: "application/json",
              },
            });
            if (res4.ok) {
              const configResponse = await res4.json();
              console.log(configResponse);
              setConfigData(configResponse);
              setShowConfigModal(true);
            }
          }
          console.log(res3);
        }
      } catch (error) {
        console.error("Ошибка при открытии инвойса:", error);
        setError("Ошибка при обработке платежа");
      }
    } catch (error) {
      console.error("Ошибка при запросе инвойса:", error);
      setError("Ошибка сети. Проверьте подключение к интернету");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-dark-secondary">
      <Navbar />
      <div className="flex flex-col items-center justify-center h-screen gap-4">
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}
        <Select
          options={options}
          value={selectedOption?.value || ""}
          onChange={(value) => setSelectedOption({ label: value, value })}
          placeholder="Protocol"
        />
        <Select
          options={servers}
          value={selectedServer?.value || ""}
          onChange={(value) => setSelectedServer({ label: value, value })}
          placeholder="Server"
        />
        <Select
          options={days}
          value={selectedDays?.value || ""}
          onChange={(value) => setSelectedDays({ label: value, value })}
          placeholder="Amount of days"
        />
        <div className="text-lg flex flex-row items-center gap-2">
          <span>Total price: {totalPrice} </span>
          <Star className="w-6 h-6 text-yellow-500" />
        </div>
        <Button
          className="bg-white text-black px-4 py-2 rounded-md"
          onClick={generateConfig}
          disabled={isLoading}
        >
          <span>{isLoading ? "Генерация..." : "Generate config"}</span>
        </Button>
      </div>

      {/* Модальное окно с конфигурацией */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Конфигурация VPN"
      >
        {configData && (
          <ConfigDisplay
            config={configData}
            onClose={() => setShowConfigModal(false)}
          />
        )}
      </Modal>
    </div>
  );
}
