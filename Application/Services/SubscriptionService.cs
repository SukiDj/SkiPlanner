using System.Net.WebSockets;
using System.Text;

namespace Application.Services
{
    public class SubscriptionService
    {
        private readonly Dictionary<string, List<WebSocket>> _subscriptions = new();

        public void Subscribe(string skiResort, WebSocket socket)
        {
            if (!_subscriptions.ContainsKey(skiResort))
                _subscriptions[skiResort] = new List<WebSocket>();

            _subscriptions[skiResort].Add(socket);
        }

        public async Task NotifySubscribersAsync(string skiResort, string message)
        {
            if (_subscriptions.TryGetValue(skiResort, out var subscribers))
            {
                foreach (var socket in subscribers.Where(s => s.State == WebSocketState.Open))
                {
                    var buffer = Encoding.UTF8.GetBytes(message);
                    await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
                }
            }
        }
    }
}