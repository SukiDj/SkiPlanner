// import { useEffect, useState } from "react";

// const WebSocketNotifications = () => {
//     const [messages, setMessages] = useState<string[]>([]);

//     useEffect(() => {
//         const token = localStorage.getItem("jwt");
//         if (!token) return;

//         const socket = new WebSocket(`wss://localhost:5001/ws?token=${token}`);

//         socket.onopen = () => {
//             console.log("🔌 WebSocket povezan!");
//         };

//         socket.onmessage = (event) => {
//             console.log("📩 Primljena poruka:", event.data);
//             setMessages((prev) => [event.data, ...prev]);
//         };

//         socket.onerror = (error) => {
//             console.error("❌ WebSocket greška:", error);
//         };

//         socket.onclose = () => {
//             console.log("🔌 WebSocket zatvoren.");
//         };

//         return () => {
//             socket.close();
//         };
//     }, []);

//     return (
//         <div style={{ position: "fixed", bottom: 10, right: 10, maxWidth: 300 }}>
//             <h4>📢 Notifikacije</h4>
//             <ul style={{ listStyle: "none", padding: 0 }}>
//                 {messages.map((msg, index) => (
//                     <li key={index} style={{ background: "#eee", marginBottom: 8, padding: 8, borderRadius: 4 }}>
//                         {msg}
//                     </li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default WebSocketNotifications;


import { useWebSocket } from "../../services/useWebSocket";

const WebSocketNotifications = () => {
  const messages = useWebSocket();

  return (
    <div style={{ position: "fixed", bottom: 10, right: 10, maxWidth: 300 }}>
      <h4>📢 Notifikacije</h4>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {messages.map((msg, index) => (
          <li
            key={index}
            style={{
              background: "#eee",
              marginBottom: 8,
              padding: 8,
              borderRadius: 4,
            }}
          >
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WebSocketNotifications;
