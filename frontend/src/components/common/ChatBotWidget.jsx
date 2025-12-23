import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import chatBotService from "../../services/chatBotService";

const ChatBotWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: "Chào bạn! Tôi là trợ lý ảo VRealm. Tôi có thể giúp gì cho bạn?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = { role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await chatBotService.askAI(userMsg.content);

      const botMsg = {
        role: "bot",
        content: res.data.response,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content:
            "Trợ lý AI tạm thời không khả dụng. Vui lòng thử lại sau giây lát!",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Cửa sổ khung chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="mb-4 w-80 md:w-110 h-[510px] bg-gray-900 border border-vr-blue/30 rounded-xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="font-display text-vr-blue font-bold">
                  VRealm AI Support
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-gray-900/90 scrollbar-thin scrollbar-thumb-gray-700">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
                      m.role === "user"
                        ? "bg-gray-700 text-white rounded-tr-none shadow-md shadow-vr-blue/20 border-gray-600"
                        : "bg-gray-800 text-gray-200 rounded-tl-none border border-gray-700"
                    }`}
                  >
                    <div dangerouslySetInnerHTML={{ __html: m.content }} />
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-800 p-3 rounded-2xl rounded-tl-none border border-gray-700">
                    <div className="flex gap-1">
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* Input */}
            <div className="p-3 bg-gray-800 border-t border-gray-700">
              <div className="relative flex items-center">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Hỏi tôi về hệ thống Vrealm Game Zone..."
                  className="w-full bg-gray-900 text-white rounded-full pl-4 pr-12 py-2.5 text-sm border border-gray-700 focus:outline-none focus:border-vr-blue focus:ring-1 focus:ring-vr-blue/50 transition-all"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="absolute right-1.5 p-1.5 text-vr-blue hover:text-white disabled:text-gray-600 transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Nút bật/tắt Chat */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gray-700 hover:bg-vr-blue-light rounded-full flex items-center justify-center shadow-lg shadow-vr-blue/40 transition-all active:scale-90 group"
      >
        {isOpen ? (
          <X
            size={28}
            className="text-white group-hover:rotate-90 transition-transform"
          />
        ) : (
          <MessageCircle
            size={28}
            className="text-white group-hover:scale-115 transition-transform"
          />
        )}
      </button>
    </div>
  );
};

export default ChatBotWidget;
