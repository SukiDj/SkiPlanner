using System.Net.WebSockets;
using System.Text;
using StackExchange.Redis;
using Microsoft.AspNetCore.Http;
using Domain;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;


namespace Application.Services
{
    public class WebSocketService
    {
        private readonly RedisService _redis;
        private readonly SubscriptionService _subscriptions;

        public WebSocketService(RedisService redis, SubscriptionService subscriptions)
        {
            _redis = redis;
            _subscriptions = subscriptions;
        }

        public async Task HandleConnectionAsync(HttpContext context, WebSocket socket)
        {
            var userId = context.Request.Query["userId"].ToString();

            if (string.IsNullOrEmpty(userId))
            {
                await socket.CloseAsync(WebSocketCloseStatus.PolicyViolation, "Korisnik nije prosleđen", CancellationToken.None);
                return;
            }

            List<SkijalisteRedis> skijalista = await _redis.GetUserSubscriptionsAsync(userId);
            foreach (SkijalisteRedis sk in skijalista)
            {
                _subscriptions.AddConnection(sk.Ime, socket);

                // Kada Redis objavi poruku, prosledi kroz WebSocket
                _redis.SubscribeToNotifications(sk.Ime, async (ch, msg) =>
                {
                    await _subscriptions.NotifySubscribersAsync(sk.Ime, msg);
                });
            }

            var buffer = new byte[1024 * 4];
            while (socket.State == WebSocketState.Open)
            {
                var result = await socket.ReceiveAsync(buffer, CancellationToken.None);


                if (result.MessageType == WebSocketMessageType.Text)
                {
                    var message = Encoding.UTF8.GetString(buffer, 0, result.Count);

                    // Ako frontend pošalje poruku da osveži pretplate
                    if (message.StartsWith("refresh_subscriptions", StringComparison.OrdinalIgnoreCase))
                    {

                        // Ukloni stare WebSocket konekcije
                        _subscriptions.RemoveConnection(socket);

                        // Ponovo preuzmi listu pretplata iz Redis baze
                        var skijalista2 = await _redis.GetUserSubscriptionsAsync(userId);

                        // Reaktiviraj pretplate
                        foreach (var sk in skijalista2)
                        {
                            _subscriptions.AddConnection(sk.Ime, socket);
                            _redis.SubscribeToNotifications(sk.Ime, async (ch, msg) =>
                            {
                                await _subscriptions.NotifySubscribersAsync(sk.Ime, msg);
                            });
                        }

                        continue;
                    }
                }


                if (result.MessageType == WebSocketMessageType.Close)
                    break;
            }

            _subscriptions.RemoveConnection(socket);
            await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Connection closed", CancellationToken.None);
        
        }
    }
}
