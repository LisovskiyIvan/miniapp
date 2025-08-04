import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { userAtom } from "../stores/userStore";
import { useAtomValue } from "jotai";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "../api/client";
import {
  queryKeys,
  useCreateInvoice,
  useSendConfigToTelegram,
} from "../api/hooks";
import Modal from "../components/ui/Modal";
import ConfigDisplay from "../components/ConfigDisplay";
import Alert from "../components/ui/Alert";
import {
  Download,
  Calendar,
  User,
  Server,
  Eye,
  Clock,
  Send,
} from "lucide-react";
import Button from "../components/ui/Button";
import { useGetUserActiveConfigs, UserConfig, Purchase } from "../api/hooks";
import { invoice } from "@telegram-apps/sdk";

export default function Profile() {
  const queryClient = useQueryClient();
  const user = useAtomValue(userAtom);
  const [selectedConfig, setSelectedConfig] = useState<UserConfig | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [renewConfigId, setRenewConfigId] = useState<number | null>(null);
  const createInvoiceMutation = useCreateInvoice();
  const sendConfigToTelegram = useSendConfigToTelegram();
  // Используем новые API хуки
  const {
    data: configsData,
    isLoading,
    error: configsError,
  } = useGetUserActiveConfigs(user?.tgId || 0);

  const configs = configsData?.configs || [];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleViewConfig = (config: UserConfig) => {
    setSelectedConfig(config);
    setShowConfigModal(true);
  };

  const downloadConfig = (config: UserConfig) => {
    const blob = new Blob([config.config_content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${config.config_name}.ovpn`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const renewConfig = useMutation({
    mutationFn: async () => {
      if (!renewConfigId || !user?.id) return;
      const renewData = {
        config_id: renewConfigId,
        user_id: user.id,
        amount: 200, // Здесь нужно указать сумму для продления
        duration_days: 30, // Здесь нужно указать количество дней для продления
      };
      return apiClient.post<{ config: UserConfig; purchase: Purchase }>(
        "/api/renew-config",
        undefined,
        renewData as unknown as Record<string, string | number | boolean>
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.configs });
      setShowRenewModal(false);
      setRenewConfigId(null);
      setError(null);
    },
    onError: (error: Error) => {
      setError(`Ошибка при продлении конфигурации: ${error.message}`);
    },
  });

  async function handleRenewConfig() {
    try {
      const invoiceData = await createInvoiceMutation.mutateAsync({
        title: "Продление конфигурации",
        description: `Продление конфигурации ${selectedConfig?.config_name} на 30 дней`,
        payload: `${renewConfigId}`,
        price: 100,
      });

      if (!invoiceData.invoice) {
        throw new Error("Неверный формат ответа от сервера");
      }

      const paymentResult = await invoice.open(invoiceData.invoice, "url");
      if (paymentResult === "paid") {
        await renewConfig.mutateAsync();
      }
    } catch (error) {
      console.error("Ошибка при создании инвойса:", error);
      setError("Ошибка при создании инвойса");
    }
  }

  const handleSendToTelegram = async (confId: number) => {
    if (!user?.id || !confId) {
      return;
    }

    try {
      await sendConfigToTelegram.mutateAsync({
        configId: confId,
        chatId: user.id,
      });
    } catch {
      alert("Ошибка при отправке файла в Telegram");
    }
  };

  const getDaysLeft = (expiresAt?: string | null) => {
    if (!expiresAt) return "∞";
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffTime = expires.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays < 0) return "истёк";
    if (diffDays === 0) return "сегодня";
    return `через ${diffDays} дн.`;
  };

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-dark-secondary">
        <div className="flex items-center justify-center h-screen pb-20">
          <div className="text-white text-lg">Загрузка профиля...</div>
        </div>
        <Navbar />
      </div>
    );
  }

  if (configsError) {
    console.error("Error loading configs:", configsError);
    return (
      <div className="flex flex-col h-screen bg-dark-secondary">
        <div className="flex items-center justify-center h-screen pb-20">
          <div className="text-white text-lg">
            Ошибка загрузки профиля: {configsError.message}
          </div>
        </div>
        <Navbar />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-dark-secondary">
      <div className="flex-1 p-4 overflow-y-auto pb-20">
        {error && (
          <Alert type="error" message={error} onClose={() => setError(null)} />
        )}

        {/* Информация о пользователе */}
        <div className="bg-white rounded-lg p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {user?.username || "Пользователь"}
              </h1>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Активных</h3>
              <p className="text-2xl font-bold text-green-600">
                {
                  configs.filter((config: UserConfig) => config.is_active)
                    .length
                }
              </p>
            </div>
          </div>
        </div>

        {/* Список конфигураций */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-white mb-4">
            Мои конфигурации
          </h2>

          {configs.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center">
              <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                У вас пока нет конфигураций
              </h3>
              <p className="text-gray-500">
                Создайте свою первую VPN конфигурацию на странице "Создать
                конфигурацию"
              </p>
            </div>
          ) : (
            configs.map((config: UserConfig) => {
              return (
                <div
                  key={config.id}
                  className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                    <div className="flex-1 w-full">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {config.config_name.split("_").slice(0, -1).join(" ")}
                        </h3>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(config.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4" />
                          <span>
                            Сервер: {config.server_country || "Неизвестно"}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4" />
                          <span>ID: {config.id}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Истекает: {getDaysLeft(config.expires_at)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Кнопки действий: теперь обёрнуты в flex-wrap и overflow-x-auto для предотвращения горизонтального скролла всей страницы */}
                    <div className="flex flex-wrap gap-2 md:ml-4 w-full md:w-auto overflow-x-auto">
                      <Button
                        onClick={() => handleViewConfig(config)}
                        className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-md text-sm"
                      >
                        <Eye className="w-4 h-4" />
                        Просмотр
                      </Button>

                      <Button
                        onClick={() => downloadConfig(config)}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm"
                      >
                        <Download className="w-4 h-4" />
                        Скачать
                      </Button>

                      <Button
                        onClick={() => {
                          setRenewConfigId(config.id);
                          setShowRenewModal(true);
                        }}
                        className="flex items-center gap-2 bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-md text-sm"
                      >
                        <Clock className="w-4 h-4" />
                        Продлить
                      </Button>
                      <Button
                        onClick={() => handleSendToTelegram(config.id)}
                        className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded-md text-sm"
                      >
                        <Send className="w-4 h-4" />
                        Отправить в Telegram
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Модальное окно с детальной информацией о конфигурации */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Детали конфигурации"
      >
        {selectedConfig && (
          <ConfigDisplay
            config={selectedConfig}
            onClose={() => setShowConfigModal(false)}
          />
        )}
      </Modal>

      {/* Модальное окно для продления конфигурации */}
      <Modal
        isOpen={showRenewModal}
        onClose={() => {
          setShowRenewModal(false);
          setRenewConfigId(null);
        }}
        title="Продление конфигурации"
      >
        <div className="p-4">
          <p className="text-gray-700 mb-4">
            Вы хотите продлить конфигурацию на 30 дней за 200 звёзд?
          </p>
          <div className="flex justify-end gap-2">
            <Button
              onClick={() => {
                setShowRenewModal(false);
                setRenewConfigId(null);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
            >
              Отмена
            </Button>
            <Button
              onClick={handleRenewConfig}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-md"
              disabled={renewConfig.isPending}
            >
              {renewConfig.isPending ? "Продление..." : "Продлить"}
            </Button>
          </div>
        </div>
      </Modal>

      <Navbar />
    </div>
  );
}
