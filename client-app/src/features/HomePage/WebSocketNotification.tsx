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
