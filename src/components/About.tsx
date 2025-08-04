
import { Shield, Wifi, Lock, Zap, Globe, Eye } from "lucide-react";
import { motion } from "motion/react";

export default function About() {
  return (
    <motion.div
      className="flex flex-col items-center justify-center rounded-xl mb-8 mx-auto max-w-xl w-[90%] overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div
        className="w-64 h-64 relative flex items-center justify-center overflow-hidden"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
      >
        {/* Анимированная VPN иконка */}
        <div className="relative">
          {/* Центральный щит */}
          <motion.div
            className="relative z-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full p-6 shadow-2xl"
            initial={{ boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)" }}
            whileHover={{
              scale: 1.1,
              rotate: 5,
              boxShadow: "0 20px 50px rgba(59, 130, 246, 0.5)",
            }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, -10, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              <Shield className="w-16 h-16 text-white" />
            </motion.div>
          </motion.div>

          {/* Анимированные кольца с улучшенными эффектами */}
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`absolute border-2 rounded-full ${
                index === 0
                  ? "border-blue-400 inset-0"
                  : index === 1
                  ? "border-green-400 inset-2"
                  : "border-orange-400 inset-4"
              }`}
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.7, 0, 0.7],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.5,
                ease: "easeInOut",
              }}
            />
          ))}

          {/* Орбитальные частицы */}
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={`particle-${index}`}
              className="absolute w-2 h-2 bg-yellow-400 rounded-full"
              style={{
                top: "50%",
                left: "50%",
                transformOrigin: `${40 + index * 6}px center`,
              }}
              animate={{ rotate: 360 }}
              transition={{
                duration: 3 + index,
                repeat: Infinity,
                ease: "linear",
                delay: index * 0.2,
              }}
            />
          ))}

          {/* Floating иконки с улучшенной анимацией */}
          <motion.div
            className="absolute -top-3 -left-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full p-2.5"
            style={{
              filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))",
            }}
            initial={{
              x: -30,
              y: -30,
              opacity: 0,
            }}
            animate={{
              x: 0,
              y: 0,
              opacity: 1,
              rotate: [0, 10, -10, 0],
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.3,
              rotate: { duration: 3, repeat: Infinity },
            }}
            whileHover={{
              scale: 1.15,
              rotate: 180,
              filter: "drop-shadow(0 8px 25px rgba(34, 197, 94, 0.4))",
            }}
          >
            <Lock className="w-4 h-4 text-white" />
          </motion.div>

          <motion.div
            className="absolute -top-3 -right-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full p-2.5"
            style={{
              filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))",
            }}
            initial={{
              x: 30,
              y: -30,
              opacity: 0,
            }}
            animate={{
              x: 0,
              y: [0, -6, 0],
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.5,
              y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{
              scale: 1.15,
              rotate: -180,
              filter: "drop-shadow(0 8px 25px rgba(249, 115, 22, 0.4))",
            }}
          >
            <Wifi className="w-4 h-4 text-white" />
          </motion.div>

          <motion.div
            className="absolute -bottom-5 -left-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full p-2.5"
            style={{
              filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))",
            }}
            initial={{
              x: -30,
              y: 30,
              opacity: 0,
            }}
            animate={{
              x: [0, 3, -3, 0],
              y: 0,
              opacity: 1,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.7,
              x: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{
              scale: 1.15,
              rotate: 360,
              filter: "drop-shadow(0 8px 25px rgba(168, 85, 247, 0.4))",
            }}
          >
            <Zap className="w-4 h-4 text-white" />
          </motion.div>

          <motion.div
            className="absolute -bottom-5 -right-3 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full p-2.5"
            style={{
              filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))",
            }}
            initial={{
              x: 30,
              y: 30,
              opacity: 0,
            }}
            animate={{
              x: 0,
              y: 0,
              opacity: 1,
              rotate: [0, 15, -15, 0],
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 0.9,
              rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{
              scale: 1.15,
              rotate: -360,
              filter: "drop-shadow(0 8px 25px rgba(99, 102, 241, 0.4))",
            }}
          >
            <Globe className="w-4 h-4 text-white" />
          </motion.div>

          <motion.div
            className="absolute top-1/2 -right-8 transform -translate-y-1/2 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full p-2.5"
            style={{
              filter: "drop-shadow(0 4px 10px rgba(0, 0, 0, 0.1))",
            }}
            initial={{
              x: 30,
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
              y: [0, -8, 0],
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20,
              delay: 1.1,
              y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{
              scale: 1.15,
              rotate: 180,
              filter: "drop-shadow(0 8px 25px rgba(20, 184, 166, 0.4))",
            }}
          >
            <Eye className="w-4 h-4 text-white" />
          </motion.div>

          {/* Магические искры */}
          {[...Array(6)].map((_, index) => (
            <motion.div
              key={`spark-${index}`}
              className="absolute w-1 h-1 bg-yellow-300 rounded-full"
              style={{
                top: `${30 + Math.random() * 40}%`,
                left: `${30 + Math.random() * 40}%`,
              }}
              animate={{
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
                rotate: 360,
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </motion.div>
      <motion.div
        className="flex flex-col items-center justify-center bg-white rounded-xl p-8"
        style={{
          boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
        }}
        initial={{
          y: 50,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          type: "spring",
          stiffness: 200,
          damping: 20,
          delay: 1.5,
        }}
        whileHover={{
          scale: 1.02,
        }}
        variants={{
          hover: {
            filter: "drop-shadow(0 25px 50px rgba(0, 0, 0, 0.1))",
          },
        }}
      >
        <motion.h2
          className="text-xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.7, duration: 0.6 }}
        >
          Ваш ключ к свободному и безопасному интернету!
        </motion.h2>

        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.9, duration: 0.8 }}
        >
          {[
            "Быстро. Надёжно. Анонимно.",
            "Оставайтесь защищёнными в любой точке мира.",
          ].map((text, index) => (
            <motion.p
              key={index}
              className="text-lg text-center text-gray-700 transition-all duration-200 hover:text-indigo-600"
              initial={{ x: index % 2 === 0 ? -30 : 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                delay: 2.1 + index * 0.2,
                duration: 0.6,
                type: "spring",
                stiffness: 200,
              }}
              whileHover={{
                scale: 1.05,
              }}
            >
              {text}
            </motion.p>
          ))}
        </motion.div>

        {/* Декоративные элементы */}
        <motion.div
          className="mt-4 flex space-x-2"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 2.5, type: "spring", stiffness: 200 }}
        >
          {[0, 1, 2].map((index) => (
            <motion.div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === 0
                  ? "bg-blue-500"
                  : index === 1
                  ? "bg-green-500"
                  : "bg-purple-500"
              }`}
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: index * 0.3,
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
