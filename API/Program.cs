using Neo4jClient;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(opt =>{
    opt.AddPolicy("CorsPolicy", policy => {
        policy.AllowAnyHeader().AllowAnyMethod().WithOrigins("http://localhost:3000");
    });
});

// Učitavanje konfiguracije iz appsettings.json
var neo4jConfig = builder.Configuration.GetSection("Neo4j");

// Registracija Neo4jClient-a
builder.Services.AddSingleton<IGraphClient>(_ =>
{
    var client = new BoltGraphClient(
        neo4jConfig["Uri"], 
        neo4jConfig["Username"], 
        neo4jConfig["Password"]
    );
    client.ConnectAsync().Wait();
    return client;
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CorsPolicy");

app.UseAuthorization();

app.MapControllers();

app.Run();
