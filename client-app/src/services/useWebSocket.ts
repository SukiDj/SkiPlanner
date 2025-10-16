import { useEffect, useState } from "react";
import { websocketService } from "./websocketService";

export const useWebSocket = () => {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    websocketService.connectWebSocket();

    const unsubscribe = websocketService.onMessage((msg) => {
      setMessages((prev) => [msg, ...prev]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return messages;
};
