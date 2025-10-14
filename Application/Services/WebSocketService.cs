using System.Net.WebSockets;
using System.Text;
using StackExchange.Redis;
using Microsoft.AspNetCore.Http;

namespace Application.Services
{
    public class WebSocketService
    {
        // private readonly SubscriptionService _subscriptionService;

        // public WebSocketService(SubscriptionService subscriptionService)
        // {
        //     _subscriptionService = subscriptionService;
        // }

        // public async Task HandleWebSocketAsync(HttpContext context)
        // {
        //     if (context.WebSockets.IsWebSocketRequest)
        //     {
        //         var skiResort = context.Request.Query["skiResort"];

        //         if (string.IsNullOrWhiteSpace(skiResort))
        //         {
        //             context.Response.StatusCode = 400;
        //             await context.Response.WriteAsync("Missing 'skiResort' query parameter.");
        //             return;
        //         }
                
        //         var socket = await context.WebSockets.AcceptWebSocketAsync();
        //         _subscriptionService.Subscribe(skiResort, socket);

        //         var buffer = new byte[1024 * 4];
        //         while (socket.State == WebSocketState.Open)
        //         {
        //             var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);
        //             if (result.MessageType == WebSocketMessageType.Close)
        //             {
        //                 await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Closing", CancellationToken.None);
        //             }
        //         }
        //     }
        // }

        private readonly RedisService _redis;
        private readonly SubscriptionService _subscriptions;

        public WebSocketService(RedisService redis, SubscriptionService subscriptions)
        {
            _redis = redis;
            _subscriptions = subscriptions;
        }

        public async Task HandleConnectionAsync(HttpContext context, WebSocket socket)
        {
            string skiResort = context.Request.Query["skiResort"];
            if (string.IsNullOrEmpty(skiResort))
            {
                await socket.CloseAsync(WebSocketCloseStatus.InvalidPayloadData, "Missing skiResort parameter", CancellationToken.None);
                return;
            }

            _subscriptions.AddConnection(skiResort, socket);

            // 🔔 Kada Redis objavi poruku, prosledi kroz WebSocket
            _redis.SubscribeToNotifications(skiResort, async (ch, msg) =>
            {
                await _subscriptions.NotifySubscribersAsync(skiResort, msg);
            });

            var buffer = new byte[1024 * 4];
            while (socket.State == WebSocketState.Open)
            {
                var result = await socket.ReceiveAsync(buffer, CancellationToken.None);
                if (result.MessageType == WebSocketMessageType.Close)
                    break;
            }

            _subscriptions.RemoveConnection(socket);
            await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Connection closed", CancellationToken.None);
        }
    }
}