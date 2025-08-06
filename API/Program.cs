using System.Net.WebSockets;
using System.Text;
using Application.Services;
using Neo4jClient;
using StackExchange.Redis;
using API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(opt =>
{
    opt.AddPolicy("CorsPolicy", policy =>
    {
        policy.AllowAnyHeader().AllowAnyMethod()
            .WithOrigins("http://localhost:3000", "https://localhost:3000");
    });
});

// Učitavanje konfiguracije iz appsettings.json
var neo4jConfig = builder.Configuration.GetSection("Neo4j");

// Registracija Neo4jClient-a
builder.Services.AddSingleton<IGraphClient>(_ =>
{
    var client = new BoltGraphClient(
        neo4jConfig["Url"],
        neo4jConfig["Username"],
        neo4jConfig["Password"]
    );
    client.ConnectAsync().Wait();
    return client;
});

// Redis registracija
var redisHost = builder.Configuration["Redis:Host"];
var redisPort = builder.Configuration["Redis:Port"];
var redisConnectionString = $"{redisHost}:{redisPort},abortConnect=false";

builder.Services.AddSingleton<IConnectionMultiplexer>(ConnectionMultiplexer.Connect(redisConnectionString));
builder.Services.AddSingleton<RedisService>();
builder.Services.AddSingleton<WebSocketService>();
builder.Services.AddSingleton<SubscriptionService>();
builder.Services.AddScoped<TokenService>();



var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

#region WebSocket
// WebSockets - pocetak
// app.UseWebSockets();
// app.Map("/ws", async context =>
// {
//     if (context.WebSockets.IsWebSocketRequest)
//     {
//         var webSocket = await context.WebSockets.AcceptWebSocketAsync();
//         var redisService = context.RequestServices.GetRequiredService<RedisService>();

//         redisService.SubscribeToNotifications("notifikacije", async (message) =>
//         {
//             if (webSocket.State == WebSocketState.Open)
//             {
//                 var buffer = Encoding.UTF8.GetBytes(message);
//                 await webSocket.SendAsync(new ArraySegment<byte>(buffer), WebSocketMessageType.Text, true, CancellationToken.None);
//             }
//         });

//         // Drži konekciju otvorenom dok je klijent povezan
//         while (webSocket.State == WebSocketState.Open)
//         {
//             await Task.Delay(1000);
//         }
//     }
//     else
//     {
//         context.Response.StatusCode = 400;
//     }
// });
// kraj
#endregion WebSocket

app.UseWebSockets();


app.Use(async (context, next) =>
{
    if (context.Request.Path == "/ws/notifications")
    {
        var wsService = context.RequestServices.GetRequiredService<WebSocketService>();
        await wsService.HandleWebSocketAsync(context);
    }
    else
    {
        await next();
    }
});


app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();

// URL: ed558763.databases.neo4j.io
// Username: neo4j
// Password: 7Qg286T0YdT94NXQd3pSjRoGB7tPQRbrj2pkKxf_-Jc