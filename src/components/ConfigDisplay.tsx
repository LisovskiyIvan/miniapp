import { useState } from "react";
import {
  Download,
  Copy,
  Check,
  Calendar,
  User,
  Server,
  Send,
} from "lucide-react";
import Button from "./ui/Button";
import { UserConfig, useSendConfigToTelegram } from "../api/hooks";
import { userAtom } from "../stores/userStore";
import { useAtomValue } from "jotai";
interface ConfigDisplayProps {
  config: UserConfig;
  onClose: () => void;
}

export default function ConfigDisplay({ config }: ConfigDisplayProps) {
  const [copied, setCopied] = useState(false);
  const sendConfigToTelegram = useSendConfigToTelegram();
  const user = useAtomValue(userAtom);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const downloadConfig = () => {
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

  const copyConfig = async () => {
    try {
      await navigator.clipboard.writeText(config.config_content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Ошибка при копировании:", err);
    }
  };

  const handleSendToTelegram = async () => {
    if (!user?.id) {
      return;
    }

    try {
      await sendConfigToTelegram.mutateAsync({
        configId: config.id,
        chatId: user.tgId,
      });
    } catch {
      alert("Ошибка при отправке файла в Telegram");
    }
  };

  return (
    <div className="space-y-4">
      {/* Информация о конфигурации */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <User className="w-5 h-5 text-blue-500" />
          <div>
            <p className="text-sm text-gray-600">Имя конфигурации</p>
            <p className="font-medium">{config.config_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Calendar className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm text-gray-600">Создана</p>
            <p className="font-medium">{formatDate(config.created_at)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <Server className="w-5 h-5 text-purple-500" />
          <div>
            <p className="text-sm text-gray-600">Сервер</p>
            <p className="font-medium">{config.server_country || "Неизвестно"}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
          <div
            className={`w-3 h-3 rounded-full ${
              config.is_active ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <div>
            <p className="text-sm text-gray-600">Статус</p>
            <p className="font-medium">
              {config.is_active ? "Активна" : "Неактивна"}
            </p>
          </div>
        </div>
      </div>

      {/* Кнопки действий */}
      <div className="flex gap-3 flex-wrap">
        <Button
          onClick={downloadConfig}
          className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-2 py-2 rounded-md flex-1"
        >
          <Download className="w-4 h-4" />
          Скачать конфигурацию
        </Button>

        <Button
          onClick={copyConfig}
          className="flex items-center gap-2 bg-gray-500 hover:bg-gray-600 text-white px-2 py-2 rounded-md flex-1"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              Скопировано!
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              Копировать
            </>
          )}
        </Button>

        <Button
          onClick={handleSendToTelegram}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-2 py-2 rounded-md flex-1"
        >
          <Send className="w-4 h-4" />
          Отправить в Telegram
        </Button>
      </div>

      {/* Содержимое конфигурации */}
      <div className="mt-4">
        <h3 className="text-lg font-semibold mb-2">Содержимое конфигурации</h3>
        <div
          className="bg-gray-100 p-4 rounded-lg cursor-pointer"
          onClick={copyConfig}
        >
          <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
            {config.config_content}
          </pre>
        </div>
      </div>

      {/* Инструкции */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg mb-8">
        <h4 className="font-semibold text-blue-800 mb-2">
          Инструкции по использованию:
        </h4>
        <ol className="text-sm text-blue-700 space-y-1">
          <li>1. Скачайте конфигурационный файл (.ovpn)</li>
          <li>2. Установите OpenVPN клиент на ваше устройство</li>
          <li>3. Импортируйте скачанный файл в OpenVPN клиент</li>
          <li>4. Подключитесь к VPN серверу</li>
        </ol>
      </div>
    </div>
  );
}
