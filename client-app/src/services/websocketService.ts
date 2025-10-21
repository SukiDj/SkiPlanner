import { toast } from "react-toastify";

type MessageCallback = (msg: string) => void;



class WebSocketService {
  private socket: WebSocket | null = null;
  private reconnectTimeout = 3000;
  private isConnecting = false;
  private listeners: MessageCallback[] = [];
  private shouldReconnect = true;

  connectWebSocket(userId:string) {
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.isConnecting)) return;

    // const token = localStorage.getItem("jwt");
    // if (!token) return;
    if(!userId) return;
    this.isConnecting = true;
  this.shouldReconnect = true;
    this.socket = new WebSocket(`wss://localhost:5001/ws?userId=${userId}`);

    this.socket.onopen = () => {
      console.log(" WebSocket connected");
      this.isConnecting = false;
    };

    this.socket.onmessage = (event) => {
      const message = event.data;
      console.log(" Notifikacija:", message);

      toast.info(message, {
        position: "top-right",
        autoClose: 4000,
        theme: "colored",
      });

      this.listeners.forEach((cb) => cb(message));
    };

    this.socket.onclose = () => {
      console.warn(" WebSocket disconnected, reconnecting...");
      this.socket = null;
      this.isConnecting = false;
       if (this.shouldReconnect) {
      setTimeout(() => this.connectWebSocket(userId), this.reconnectTimeout);
       }
    };

    this.socket.onerror = (err) => {
      console.error(" WebSocket error:", err);
      this.socket?.close();
    };
  }

  disconnect() {
    this.socket?.close();
     this.shouldReconnect = false; 
    this.socket = null;
  }

  onMessage(callback: MessageCallback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }
}

export const websocketService = new WebSocketService();
