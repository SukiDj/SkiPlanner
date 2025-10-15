import { toast } from 'react-toastify';

let socket: WebSocket | null = null;

export const connectWebSocket = () => {
  if (socket && socket.readyState === WebSocket.OPEN) return;

 
  socket = new WebSocket('ws://localhost:5001/ws'); 
  socket.onopen = () => {
    console.log(' WebSocket connected');
  };

  socket.onmessage = (event) => {
    try {
      const message = event.data;
      console.log(' Notifikacija:', message);

      toast.info(message, {
        position: 'top-right',
        autoClose: 4000,
        theme: 'colored',
      });
    } catch (err) {
      console.error(' Greska pri parsiranju poruke:', err);
    }
  };

  socket.onclose = () => {
    console.warn(' WebSocket disconnected, pokušavam ponovo...');
    setTimeout(connectWebSocket, 3000);
  };

  socket.onerror = (err) => {
    console.error(' WebSocket error:', err);
    socket?.close();
  };
};
