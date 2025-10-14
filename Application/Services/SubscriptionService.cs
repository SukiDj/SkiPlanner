using System.Collections.Concurrent;
using System.Net.WebSockets;
using System.Text;

namespace Application.Services
{
    public class SubscriptionService
    {
        // private readonly Dictionary<string, List<WebSocket>> _subscriptions = new();

        // public void Subscribe(string skiResort, WebSocket socket)
        // {
        //     if (!_subscriptions.ContainsKey(skiResort))
        //         _subscriptions[skiResort] = new List<WebSocket>();

        //     _subscriptions[skiResort].Add(socket);
        // }

        // public async Task NotifySubscribersAsync(string skiResort, string message)
        // {
        //     if (_subscriptions.TryGetValue(skiResort, out var subscribers))
        //     {
        //         foreach (var socket in subscribers.Where(s => s.State == WebSocketState.Open))
        //         {
        //             var buffer = Encoding.UTF8.GetBytes(message);
        //             await socket.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None);
        //         }
        //     }
        // }

        private readonly ConcurrentDictionary<string, List<WebSocket>> _activeSockets = new();

        public void AddConnection(string skiResort, WebSocket socket)
        {
            _activeSockets.AddOrUpdate(
                skiResort.ToLowerInvariant(),
                _ => new List<WebSocket> { socket },
                (_, list) =>
                {
                    list.Add(socket);
                    return list;
                });
        }

        public void RemoveConnection(WebSocket socket)
        {
            foreach (var kvp in _activeSockets)
            {
                kvp.Value.Remove(socket);
            }
        }

        public async Task NotifySubscribersAsync(string skiResort, string message)
        {
            if (!_activeSockets.TryGetValue(skiResort.ToLowerInvariant(), out var sockets))
                return;

            var buffer = Encoding.UTF8.GetBytes(message);
            var tasks = sockets
                .Where(s => s.State == WebSocketState.Open)
                .Select(s => s.SendAsync(buffer, WebSocketMessageType.Text, true, CancellationToken.None));

            await Task.WhenAll(tasks);
        }
    }
}