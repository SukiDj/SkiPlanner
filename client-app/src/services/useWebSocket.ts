import { useEffect, useState } from "react";
import { websocketService } from "./websocketService";
import { useStore } from "../stores/store";

export const useWebSocket = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const {userStore} = useStore();
  const {curentUser} = userStore;

  useEffect(() => {
    websocketService.connectWebSocket(curentUser!.id);

    const unsubscribe = websocketService.onMessage((msg) => {
      setMessages((prev) => [msg, ...prev]);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return messages;
};
