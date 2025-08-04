import { useEffect, useState } from "react";
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
import {
  useCreateInvoice,
  useCreateConfig,
  useGetServers,
  Server,
  UserConfig,
  useGetUserActiveConfigs,
} from "../api/hooks";
import Header from "../components/Header";
import { protocolAtom, ProtocolCard } from "../stores/protocolStore";

const days = [
  { label: "3 days", value: "3" },
  { label: "7 days", value: "7" },
  { label: "30 days", value: "30" },
];

const prices = {
  "3": 50,
  "7": 100,
  "30": 150,
};

export default function ChooseConfig() {
  const [selectedProtocol, setSelectedProtocol] = useState<ProtocolCard | null>(
    null
  );
  const [selectedServer, setSelectedServer] = useState<Server | null>(null);
  const [selectedDays, setSelectedDays] = useState<{
    label: string;
    value: string;
  } | null>(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const [configData, setConfigData] = useState<UserConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const user = useAtomValue(userAtom);
  const protocols = useAtomValue(protocolAtom);
  // Используем новые API хуки
  const { data: serversData } = useGetServers();
  // const { data: protocolsData } = useGetProtocols();
  const createInvoiceMutation = useCreateInvoice();
  const createConfigMutation = useCreateConfig();
  const { data: userConfigs } = useGetUserActiveConfigs(user?.tgId || 0);

  const servers = serversData?.servers || [];
  const isFreeTrial =
    user?.free_trial_used && userConfigs?.configs.length === 0;

  useEffect(() => {
    if (selectedDays && selectedProtocol && selectedServer) {
      setTotalPrice(prices[selectedDays.value as keyof typeof prices]);
    } else {
      setTotalPrice(0);
    }
  }, [selectedDays, selectedProtocol, selectedServer]);

  const generateConfig = async () => {
    if (!selectedProtocol || !selectedServer || !selectedDays) {
      setError("Пожалуйста, выберите все параметры");
      return;
    }

    setError(null);

    try {
      // Проверяем, есть ли у пользователя активный пробный период
      // Проверяем, активен ли пробный период
      const hasFreeTrialAvailable =
        user?.free_trial_expires_at &&
        new Date(user?.free_trial_expires_at) > new Date();

      if (hasFreeTrialAvailable && userConfigs?.configs.length === 0) {
        // Создаем бесплатную VPN конфигурацию
        const vpnConfig = await createConfigMutation.mutateAsync({
          user_id: user?.tgId || 0,
          server_id: selectedServer.id,
          protocol_id: selectedProtocol.id,
          config_name: `${selectedProtocol.title}_${
            selectedServer.country
          }_trial_${Date.now()}`,
          duration_days: parseInt(selectedDays.value),
          is_trial: true,
        });
        setConfigData(vpnConfig);
        setShowConfigModal(true);
      } else {
        // Создаем платный инвойс
        const invoiceData = await createInvoiceMutation.mutateAsync({
          title: selectedProtocol.title,
          description: `${selectedProtocol.title} конфигурация на ${selectedDays.value} дней`,
          payload: `${selectedProtocol.key}-${selectedServer.id}-${selectedDays.value}`,
          price: totalPrice,
        });

        if (!invoiceData.invoice) {
          setError("Неверный формат ответа от сервера");
          return;
        }

        // Открываем инвойс в Telegram
        const paymentResult = await invoice.open(invoiceData.invoice, "url");

        if (paymentResult === "paid") {
          // Создаем VPN конфигурацию
          const vpnConfig = await createConfigMutation.mutateAsync({
            user_id: user?.id || 0,
            server_id: selectedServer.id,
            protocol_id: selectedProtocol.id,
            config_name: `${selectedProtocol.title}_${
              selectedServer.country
            }_${Date.now()}`,
            duration_days: parseInt(selectedDays.value),
          });
          setConfigData(vpnConfig);
          setShowConfigModal(true);
        }
      }
    } catch (error) {
      console.error("Ошибка при генерации конфигурации:", error);
      setError("Ошибка при создании конфигурации. Попробуйте еще раз.");
    }
  };

  return (
    <div className="flex flex-col h-screen bg-dark-secondary">
      <Header />
      <div className="flex flex-col items-center justify-center h-screen gap-4 pb-20">
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Выбор протокола */}
        <Select
          options={protocols.map((p) => ({
            label: p.title,
            value: p.id.toString(),
          }))}
          value={selectedProtocol?.id?.toString() || ""}
          onChange={(value) => {
            const protocol = protocols.find((p) => p.id.toString() === value);
            setSelectedProtocol(protocol || null);
          }}
          placeholder="Protocol"
        />

        {/* Выбор сервера */}
        <Select
          options={servers.map((s) => ({
            label: s.country ?? "Unknown",
            value: s.id.toString(),
          }))}
          value={selectedServer?.id?.toString() || ""}
          onChange={(value) => {
            const server = servers.find((s) => s.id.toString() === value);
            setSelectedServer(server || null);
          }}
          placeholder="Server"
        />

        {/* Выбор количества дней */}
        <Select
          options={days}
          value={selectedDays?.value || ""}
          onChange={(value) => setSelectedDays({ label: value, value })}
          placeholder="Amount of days"
        />

        {!isFreeTrial && (
          <div className="text-lg flex flex-row items-center gap-2">
            <span>Total price: {totalPrice} </span>
            <Star className="w-6 h-6 text-yellow-500" />
          </div>
        )}

        <Button
          className="bg-white text-black px-4 py-2 rounded-md"
          onClick={generateConfig}
          disabled={
            createInvoiceMutation.isPending || createConfigMutation.isPending
          }
        >
          <span>
            {createInvoiceMutation.isPending || createConfigMutation.isPending
              ? "Генерация..."
              : "Создать конфигурацию"}
          </span>
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

      <Navbar />
    </div>
  );
}
