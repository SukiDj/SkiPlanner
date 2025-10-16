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
            // string skiResort = context.Request.Query["skiResort"];
            // if (string.IsNullOrEmpty(skiResort))
            // {
            //     await socket.CloseAsync(WebSocketCloseStatus.InvalidPayloadData, "Missing skiResort parameter", CancellationToken.None);
            //     return;
            // }

            // _subscriptions.AddConnection(skiResort, socket);

            // // 🔔 Kada Redis objavi poruku, prosledi kroz WebSocket
            // _redis.SubscribeToNotifications(skiResort, async (ch, msg) =>
            // {
            //     await _subscriptions.NotifySubscribersAsync(skiResort, msg);
            // });

            // var buffer = new byte[1024 * 4];
            // while (socket.State == WebSocketState.Open)
            // {
            //     var result = await socket.ReceiveAsync(buffer, CancellationToken.None);
            //     if (result.MessageType == WebSocketMessageType.Close)
            //         break;
            // }

            // _subscriptions.RemoveConnection(socket);
            // await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Connection closed", CancellationToken.None);

            // // 2. nacin
            // // ➕ Dodaj svakog klijenta u globalnu listu
            // _subscriptions.AddGlobalConnection(socket);

            // // 📡 Pretplati se na globalni Redis kanal
            // _redis.SubscribeToNotifications("global", async (ch, msg) =>
            // {
            //     await _subscriptions.NotifyAllAsync(msg);
            // });

            // var buffer = new byte[1024 * 4];
            // while (socket.State == WebSocketState.Open)
            // {
            //     var result = await socket.ReceiveAsync(buffer, CancellationToken.None);
            //     if (result.MessageType == WebSocketMessageType.Close)
            //         break;
            // }

            // // ❌ Ukloni konekciju pri prekidu
            // _subscriptions.RemoveConnection(socket);
            // await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Connection closed", CancellationToken.None);

            // 3. nacin
            //var userId = context.User?.FindFirst(ClaimTypes.NameIdentifier).Value;
            //var userId = "8d6a1931-58bb-4de5-b468-1dfcaed37a42";
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
                if (result.MessageType == WebSocketMessageType.Close)
                    break;
            }

            _subscriptions.RemoveConnection(socket);
            await socket.CloseAsync(WebSocketCloseStatus.NormalClosure, "Connection closed", CancellationToken.None);
        
        }
    }
}
