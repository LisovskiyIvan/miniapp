
import Navbar from "../components/Navbar";
import Card from "../components/ui/Card";
import { Download, Settings, CheckCircle } from "lucide-react";

export default function OpenVPN() {
  return (
    <div className="min-h-screen bg-dark-secondary">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Руководство по OpenVPN</h1>

        <div className="bg-white rounded-lg p-6 shadow-lg mb-8">
          <h2 className="text-xl font-semibold mb-4">Что такое OpenVPN?</h2>
          <p className="text-gray-700 mb-4">
            OpenVPN - это популярный протокол VPN с открытым исходным кодом,
            который обеспечивает безопасное и надежное соединение. Он использует
            современные методы шифрования для защиты вашего интернет-трафика.
          </p>
        </div>

        <h2 className="text-2xl font-semibold mb-4">Шаги для подключения:</h2>

        <div className="space-y-4">
          <Card
            title="1. Скачайте VPN-клиент"
            description="Выберите и установите клиент OpenVPN на ваше устройство. Мы рекомендуем официальный OpenVPN Client или AmneziaVPN."
            icon={<Download className="w-6 h-6" />}
            onClick={() => {}}
          />

          <Card
            title="2. Импортируйте конфигурацию"
            description="После получения .ovpn файла, импортируйте его в ваш VPN-клиент. Обычно это делается через меню 'Импорт' или перетаскиванием файла в приложение."
            icon={<Settings className="w-6 h-6" />}
            onClick={() => {}}
          />

          <Card
            title="3. Подключитесь к VPN"
            description="Нажмите кнопку подключения в вашем VPN-клиенте. При успешном подключении вы увидите соответствующее уведомление."
            icon={<CheckCircle className="w-6 h-6" />}
            onClick={() => {}}
          />
        </div>

        <div className="bg-white rounded-lg p-6 shadow-lg mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Рекомендуемые VPN-клиенты
          </h2>

          <div className="space-y-4">
            <div className="border-b pb-4">
              <h3 className="font-semibold mb-2">OpenVPN Client</h3>
              <p className="text-gray-700">
                Официальный клиент от разработчиков протокола. Доступен для
                Windows, macOS и Linux.
                <a
                  href="https://openvpn.net/client/"
                  className="text-blue-600 hover:text-blue-800 ml-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Скачать
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">AmneziaVPN</h3>
              <p className="text-gray-700">
                Удобный мультипротокольный VPN-клиент с поддержкой OpenVPN и
                других протоколов.
                <a
                  href="https://amnezia.org/"
                  className="text-blue-600 hover:text-blue-800 ml-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Скачать
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-8 mb-16 rounded-lg">
          <p className="text-yellow-700">
            <strong>Важно:</strong> Храните ваш конфигурационный файл .ovpn в
            надежном месте и не передавайте его третьим лицам. Этот файл
            содержит важные данные для подключения к вашему VPN-серверу.
          </p>
        </div>
      </div>
    </div>
  );
}
