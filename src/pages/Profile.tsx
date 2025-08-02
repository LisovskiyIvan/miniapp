import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { userAtom } from "../stores/userStore";
import { useAtomValue } from "jotai";
import Modal from "../components/ui/Modal";
import ConfigDisplay from "../components/ConfigDisplay";
import Alert from "../components/ui/Alert";
import { Download, Calendar, User, Server, Eye, Trash2 } from "lucide-react";
import Button from "../components/ui/Button";

interface ConfigData {
  id: number;
  subscription_id: number;
  config_name: string;
  created_at: string;
  config_content: string;
  is_active: boolean;
}

export default function Profile() {
  const user = useAtomValue(userAtom);
  const [configs, setConfigs] = useState<ConfigData[]>([]);
  const [selectedConfig, setSelectedConfig] = useState<ConfigData | null>(null);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchUserConfigs();
    }
  }, [user?.id]);

  const fetchUserConfigs = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch(`/api/vpn/${user?.id}/all`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Ошибка при загрузке конфигураций");
      }

      const data = await response.json();
      setConfigs(data.configs || []);
    } catch (err) {
      console.error("Ошибка при загрузке конфигураций:", err);
      setError("Не удалось загрузить конфигурации");
    } finally {
      setIsLoading(false);
    }
  };

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

  const handleViewConfig = (config: ConfigData) => {
    setSelectedConfig(config);
    setShowConfigModal(true);
  };

  const handleDeleteConfig = async (configId: number) => {
    if (!confirm("Вы уверены, что хотите удалить эту конфигурацию?")) {
      return;
    }

    try {
      const response = await fetch(`/api/vpn/${configId}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
        },
      });

      if (response.ok) {
        // Обновляем список конфигураций
        setConfigs(configs.filter((config) => config.id !== configId));
      } else {
        setError("Ошибка при удалении конфигурации");
      }
    } catch (err) {
      console.error("Ошибка при удалении конфигурации:", err);
      setError("Ошибка при удалении конфигурации");
    }
  };

  const downloadConfig = (config: ConfigData) => {
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

  if (isLoading) {
    return (
      <div className="flex flex-col h-screen bg-dark-secondary">
        <Navbar />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-lg">Загрузка профиля...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-dark-secondary">
      <Navbar />

      <div className="flex-1 p-4 overflow-y-auto">
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
                {user?.first_name || user?.username || "Пользователь"}
              </h1>
              <p className="text-gray-600">ID: {user?.id}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800">
                Всего конфигураций
              </h3>
              <p className="text-2xl font-bold text-blue-600">
                {configs.length}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800">Активных</h3>
              <p className="text-2xl font-bold text-green-600">
                {configs.filter((config) => config.is_active).length}
              </p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-semibold text-purple-800">Неактивных</h3>
              <p className="text-2xl font-bold text-purple-600">
                {configs.filter((config) => !config.is_active).length}
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
            configs.map((config) => (
              <div
                key={config.id}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {config.config_name}
                      </h3>
                      <div
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          config.is_active
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {config.is_active ? "Активна" : "Неактивна"}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{formatDate(config.created_at)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Server className="w-4 h-4" />
                        <span>Подписка #{config.subscription_id}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>ID: {config.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
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
                      onClick={() => handleDeleteConfig(config.id)}
                      className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-md text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                      Удалить
                    </Button>
                  </div>
                </div>
              </div>
            ))
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
    </div>
  );
}
