using StackExchange.Redis;
using Newtonsoft.Json;
using Domain;

namespace Application.Services
{
    public class RedisService
    {
        private readonly IConnectionMultiplexer _redisConnection;
        private readonly IDatabase _database;

        public RedisService(IConnectionMultiplexer redisConnection)
        {
            _redisConnection = redisConnection;
            _database = _redisConnection.GetDatabase();

            // if (_redisConnection.IsConnected)
            // {
            //     Console.WriteLine("Povezano sa Redis serverom!");
            // }
            // else
            // {
            //     Console.WriteLine("Ne može da se poveže sa Redis serverom.");
            // }
        }

        public async Task SetValueAsync(string key, string value)
        {
            var db = _redisConnection.GetDatabase();
            await db.StringSetAsync(key, value);
        }

        public async Task<string> GetValueAsync(string key)
        {
            var db = _redisConnection.GetDatabase();
            return await db.StringGetAsync(key);
        }
        // Dodavanje ili ažuriranje podataka za skijalište
        public async Task SetSkijalisteAsync(string key, SkijalisteRedis skijaliste)
        {
            var jsonData = JsonConvert.SerializeObject(skijaliste);
            await _database.StringSetAsync(key, jsonData);
        }

        // Dohvatanje podataka za skijalište
        public async Task<SkijalisteRedis> GetSkijalisteAsync(string key)
        {
            var jsonData = await _database.StringGetAsync(key);
            return jsonData.IsNullOrEmpty ? null : JsonConvert.DeserializeObject<SkijalisteRedis>(jsonData);
        }

        public async Task<IEnumerable<string>> GetAllKeysAsync(string pattern)
        {
            var server = _redisConnection.GetServer(_redisConnection.GetEndPoints().First());
            return server.Keys(pattern: pattern).Select(k => k.ToString());
        }

        public async Task<bool> DeleteSkijalisteAsync(string ime)
        {
            return await _database.KeyDeleteAsync($"skijaliste:{ime}");
        }


        // Slanje real-time obaveštenja
        public async Task PublishNotificationAsync(string channel, string message)
        {
            var publisher = _redisConnection.GetSubscriber();
            await publisher.PublishAsync(channel, message);
        }

        // Subscribe na Redis kanal za obaveštenja
        public void SubscribeToNotifications(string channel, Action<string> onMessage)
        {
            var subscriber = _redisConnection.GetSubscriber();
            subscriber.Subscribe(channel, (ch, message) => onMessage(message));
        }

        // ovo izbaciti
        public async Task<List<string>> GetAllRankedSkiResorts(string kriterijum)
        {
            // Dohvata sva skijališta sortirana po rangu od najvišeg ka najnižem
            var skijalista = await _database.SortedSetRangeByRankAsync($"rangiranje:{kriterijum}", 0, -1, Order.Descending);
            return skijalista.Select(s => s.ToString()).ToList();
        }

    }
}
