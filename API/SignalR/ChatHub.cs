using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR;

public class ChatHub : Hub
{
    // private readonly IMediator _mediator;

    // public ChatHub(IMediator mediator)
    // {
    //     _mediator = mediator;
    // }

    // public async Task SendComment(Create.Command command)
    // {
    //     var komentar = await _mediator.Send(command);

    //     await Clients.Group(command.ObilazakId.ToString())
    //         .SendAsync("ReceiveComment", komentar.Value);
    // }

    // public override async Task OnConnectedAsync()
    // {
    //     var httpContext = Context.GetHttpContext();
    //     var obilazakId = httpContext.Request.Query["obilazakId"];// OVAJ STRING MORA DA BUDE TACNO NAPISAN PROVERI DA LI JE TAKO!? - tako je
    //     await Groups.AddToGroupAsync(Context.ConnectionId, obilazakId);
    //     var result = await _mediator.Send(new List.Query{ObilazakId = Guid.Parse(obilazakId)});
    //     await Clients.Caller.SendAsync("LoadComments", result.Value);
    // }
}