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
            var token = context.Request.Query["token"].ToString();

            if (string.IsNullOrEmpty(token))
            {
                await socket.CloseAsync(WebSocketCloseStatus.PolicyViolation, "Token nije prosleđen", CancellationToken.None);
                return;
            }

            var handler = new JwtSecurityTokenHandler();
            JwtSecurityToken jwtToken;

            try
            {
                jwtToken = handler.ReadJwtToken(token);
            }
            catch
            {
                await socket.CloseAsync(WebSocketCloseStatus.PolicyViolation, "Neispravan token", CancellationToken.None);
                return;
            }

            var userId = jwtToken.Claims.FirstOrDefault(c => c.Type == "nameid")?.Value;

            Console.WriteLine("");
            Console.WriteLine($"✅ Korisnik {userId} povezan na WebSocket");
            Console.WriteLine("");

            if (string.IsNullOrEmpty(userId))
            {
                await socket.CloseAsync(WebSocketCloseStatus.PolicyViolation, "Nevalidan korisnik", CancellationToken.None);
                return;
            }

            List<SkijalisteRedis> skijalista = await _redis.GetUserSubscriptionsAsync(userId);
            foreach (SkijalisteRedis sk in skijalista)
            {
                _subscriptions.AddConnection(sk.Ime, socket);

                // 🔔 Kada Redis objavi poruku, prosledi kroz WebSocket
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
                        Console.WriteLine($"🔁 Osvežavam pretplate za korisnika {userId}...");

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

                        // Pošalji potvrdu nazad
                        // var msg = Encoding.UTF8.GetBytes("✅ Pretplate osvežene");
                        // await socket.SendAsync(msg, WebSocketMessageType.Text, true, CancellationToken.None);

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
