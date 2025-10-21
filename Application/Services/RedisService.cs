using StackExchange.Redis;
using Newtonsoft.Json;
using Domain;
using Microsoft.Extensions.Logging;
using System.Collections.Concurrent;

namespace Application.Services
{
    public class RedisService
    {
        private readonly IConnectionMultiplexer _redisConnection;
        private readonly ILogger<RedisService> _logger;

        private readonly ConcurrentDictionary<string, bool> _redisSubscribedResorts = new(StringComparer.OrdinalIgnoreCase);

        public RedisService(IConnectionMultiplexer redisConnection, ILogger<RedisService> logger)
        {
            _redisConnection = redisConnection;
            _logger = logger;
        }

        private IDatabase Database => _redisConnection.GetDatabase();
        private ISubscriber Subscriber => _redisConnection.GetSubscriber();

        public async Task SetSkijalisteAsync(string ime, SkijalisteRedis skijaliste)
        {
            string json = JsonConvert.SerializeObject(skijaliste);
            await Database.StringSetAsync($"skijaliste:{ime.ToLowerInvariant()}", json);
        }

        public async Task<IEnumerable<string>> GetAllKeysAsync(string pattern)
        {
            var server = _redisConnection.GetServer(_redisConnection.GetEndPoints().First());
            return server.Keys(pattern: pattern).Select(k => k.ToString());
        }

        public async Task<SkijalisteRedis> GetSkijalisteForAllAsync(string ime)
        {
            var value = await Database.StringGetAsync(ime.ToLowerInvariant());
            if (value.IsNullOrEmpty) return default;
            return JsonConvert.DeserializeObject<SkijalisteRedis>(value);
        }

        public async Task<SkijalisteRedis> GetSkijalisteAsync(string ime)
        {
            var value = await Database.StringGetAsync($"skijaliste:{ime.ToLowerInvariant()}");
            if (value.IsNullOrEmpty) return default;
            return JsonConvert.DeserializeObject<SkijalisteRedis>(value);
        }

        public async Task<bool> DeleteSkijalisteAsync(string ime)
        {
            return await Database.KeyDeleteAsync($"skijaliste:{ime.ToLowerInvariant()}");
        }

        // Pub/Sub
        public async Task PublishNotificationAsync(string skiResort, string message)
        {
            await Subscriber.PublishAsync(skiResort.ToLowerInvariant(), message);
        }

        public void SubscribeToNotifications(string skiResort, Func<RedisChannel, RedisValue, Task> handler)
        {
            //Subscriber.Subscribe(skiResort.ToLowerInvariant(), async (channel, msg) => await handler(channel, msg));

            var key = skiResort.ToLowerInvariant();

            // spreči višestruku pretplatu
            if (_redisSubscribedResorts.ContainsKey(key))
                return;

            _redisSubscribedResorts[key] = true;

            Subscriber.Subscribe(key, async (channel, msg) => await handler(channel, msg));
        }

        public void EnsureSubscribed(string skiResort, Func<RedisChannel, RedisValue, Task> handler)
        {
            if (_redisSubscribedResorts.ContainsKey(skiResort.ToLowerInvariant()))
                return;

            _redisSubscribedResorts[skiResort.ToLowerInvariant()] = true;

            Subscriber.Subscribe(skiResort.ToLowerInvariant(), async (channel, msg) =>
            {
                await handler(channel, msg);
            });

            _logger.LogInformation($"Redis pretplata aktivirana za skijalište: {skiResort}");
        }


        public async Task AddSubscriptionAsync(string userId, string skiResort)
        {
            await Database.SetAddAsync($"subscriptions:{userId}", skiResort.ToLowerInvariant());
        }

        public async Task RemoveSubscriptionAsync(string userId, string skiResort)
        {
            await Database.SetRemoveAsync($"subscriptions:{userId}", skiResort.ToLowerInvariant());
        }

        public async Task<List<SkijalisteRedis>> GetUserSubscriptionsAsync(string userId)
        {
            var values = await Database.SetMembersAsync($"subscriptions:{userId}");
            var result = new List<SkijalisteRedis>();

            foreach (var v in values)
            {
                var key = $"skijaliste:{v.ToString().ToLowerInvariant()}";
                var json = await Database.StringGetAsync(key);

                if (!json.IsNullOrEmpty)
                {
                    try
                    {
                        var skijaliste = JsonConvert.DeserializeObject<SkijalisteRedis>(json);
                        if (skijaliste != null)
                            result.Add(skijaliste);
                    }
                    catch (Exception ex)
                    {
                        _logger.LogError(ex, $"Greška pri deserijalizaciji skijališta: {v}");
                    }
                }
            }

            return result;
        }

    }
}
