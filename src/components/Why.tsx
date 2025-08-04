
import { Shield, Globe, Wifi, Sparkles, Lock, Eye } from "lucide-react";
import { motion } from "motion/react";

const features = [
  {
    icon: Shield,
    title: "Защита приватности",
    description:
      "Скрывайте свой IP-адрес и шифруйте интернет-трафик для полной анонимности.",
    bgColor: "bg-gradient-to-br from-blue-100 to-blue-200",
    iconColor: "text-blue-600",
    accentColor: "rgba(59, 130, 246, 0.2)",
    delay: 0.2,
  },
  {
    icon: Globe,
    title: "Доступ к мировому контенту",
    description:
      "Обходите гео-ограничения и получайте доступ к сайтам и сервисам по всему миру.",
    bgColor: "bg-gradient-to-br from-green-100 to-green-200",
    iconColor: "text-green-600",
    accentColor: "rgba(34, 197, 94, 0.2)",
    delay: 0.4,
  },
  {
    icon: Wifi,
    title: "Безопасность в общественных WiFi",
    description:
      "Оставайтесь в безопасности при подключении к публичным сетям и точкам доступа.",
    bgColor: "bg-gradient-to-br from-yellow-100 to-orange-200",
    iconColor: "text-yellow-600",
    accentColor: "rgba(245, 158, 11, 0.2)",
    delay: 0.6,
  },
];

export default function Why() {
  return (
    <motion.div
      className="max-w-xl w-[90%] mx-auto bg-white rounded-xl shadow-xl p-6 mt-6 mb-6 overflow-hidden relative"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 20,
        delay: 0.8,
      }}
    >
      {/* Декоративные фоновые элементы */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(12)].map((_, index) => (
          <motion.div
            key={`bg-particle-${index}`}
            className={`absolute w-2 h-2 rounded-full ${
              index % 4 === 0
                ? "bg-yellow-400"
                : index % 4 === 1
                ? "bg-pink-400"
                : index % 4 === 2
                ? "bg-green-400"
                : "bg-blue-400"
            }`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              scale: [0, 1.2, 0],
              opacity: [0, 0.9, 0],
              rotate: 360,
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <motion.h2
        className="text-2xl font-bold text-center mb-8 bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 bg-clip-text text-transparent"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 20,
          delay: 1.0,
        }}
      >
        Зачем использовать VPN?
      </motion.h2>

      <div className="flex flex-col gap-6 relative">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            className="flex items-start gap-4 relative"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 1.2 + feature.delay,
            }}
          >
            {/* Иконка с анимациями */}
            <motion.div
              className={`${feature.bgColor} rounded-full p-4 flex items-center justify-center relative z-10 shadow-lg`}
              animate={{
                y: [0, -3, 0],
              }}
              transition={{
                y: {
                  duration: 3 + index * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            >
              {/* Орбитальные частицы вокруг иконки */}
              {[...Array(3)].map((_, particleIndex) => (
                <motion.div
                  key={`particle-${index}-${particleIndex}`}
                  className={`absolute w-2 h-2 rounded-full ${
                    particleIndex === 0
                      ? "bg-yellow-300"
                      : particleIndex === 1
                      ? "bg-pink-300"
                      : "bg-cyan-300"
                  }`}
                  style={{
                    top: "50%",
                    left: "50%",
                    transformOrigin: `${20 + particleIndex * 8}px center`,
                  }}
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 3 + particleIndex,
                    repeat: Infinity,
                    ease: "linear",
                    delay: particleIndex * 0.3,
                  }}
                />
              ))}

              {/* Иконка с вращением */}
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.5,
                }}
              >
                <feature.icon className={`w-7 h-7 ${feature.iconColor}`} />
              </motion.div>

              {/* Пульсирующий эффект */}
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-white opacity-30"
                animate={{
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.4,
                }}
              />
            </motion.div>

            {/* Текстовый контент */}
            <motion.div
              className="flex-1 relative z-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4 + feature.delay }}
            >
              <motion.h3 className="text-lg font-semibold text-black mb-2">
                {feature.title}
              </motion.h3>
              <motion.p
                className="text-gray-700 leading-relaxed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.6 + feature.delay }}
              >
                {feature.description}
              </motion.p>
            </motion.div>

            {/* Декоративные звездочки */}
            {[...Array(3)].map((_, sparkIndex) => (
              <motion.div
                key={`spark-${index}-${sparkIndex}`}
                className={`absolute ${
                  sparkIndex === 0
                    ? "text-yellow-400"
                    : sparkIndex === 1
                    ? "text-pink-400"
                    : "text-purple-400"
                }`}
                style={{
                  top: `${20 + Math.random() * 60}%`,
                  right: `${10 + Math.random() * 30}%`,
                }}
                animate={{
                  scale: [0, 1.5, 0],
                  opacity: [0, 1, 0],
                  rotate: 360,
                }}
                transition={{
                  duration: 1.5 + Math.random() * 1.5,
                  repeat: Infinity,
                  delay: Math.random() * 2 + index * 0.3,
                }}
              >
                <Sparkles className="w-4 h-4" />
              </motion.div>
            ))}
          </motion.div>
        ))}
      </div>

      {/* Анимированная нижняя полоска */}
      <motion.div
        className="mt-6 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-yellow-500 rounded-full"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: 1.5,
          delay: 2.0,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "left" }}
      />

      {/* Плавающие дополнительные иконки */}
      <motion.div
        className="absolute top-4 right-4 text-blue-300 opacity-50"
        animate={{
          rotate: 360,
          scale: [1, 1.2, 1],
        }}
        transition={{
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Lock className="w-4 h-4" />
      </motion.div>

      <motion.div
        className="absolute bottom-4 left-4 text-green-300 opacity-50"
        animate={{
          rotate: -360,
          y: [0, -5, 0],
        }}
        transition={{
          rotate: { duration: 15, repeat: Infinity, ease: "linear" },
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <Eye className="w-4 h-4" />
      </motion.div>
    </motion.div>
  );
}
