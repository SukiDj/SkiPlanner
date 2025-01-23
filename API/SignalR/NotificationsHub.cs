using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class NotificationsHub : Hub
    {
        public async Task SendNotification(string message)
        {
            await Clients.All.SendAsync("ReceiveNotification", message);
        }
    }
}