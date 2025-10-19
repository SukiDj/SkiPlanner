// import { toast } from 'react-toastify';

// let socket: WebSocket | null = null;

// export const connectWebSocket = () => {
//   if (socket && socket.readyState === WebSocket.OPEN) return;

//   const token = localStorage.getItem("jwt");
//   if (!token) return;
 
//   socket = new WebSocket(`wss://localhost:5001/ws?token=${token}`); 
//   socket.onopen = () => {
//     console.log(' WebSocket connected');
//   };

//   socket.onmessage = (event) => {
//     try {
//       const message = event.data;
//       console.log(' Notifikacija:', message);

//       toast.info(message, {
//         position: 'top-right',
//         autoClose: 4000,
//         theme: 'colored',
//       });
//     } catch (err) {
//       console.error(' Greska pri parsiranju poruke:', err);
//     }
//   };

//   socket.onclose = () => {
//     console.warn(' WebSocket disconnected, pokušavam ponovo...');
//     setTimeout(connectWebSocket, 3000);
//   };

//   socket.onerror = (err) => {
//     console.error(' WebSocket error:', err);
//     socket?.close();
//   };
// };

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
