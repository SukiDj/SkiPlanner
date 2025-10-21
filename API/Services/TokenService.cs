using Domain;
using Microsoft.IdentityModel.Tokens;
using Neo4jClient;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace API.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        private readonly IGraphClient _client;
        public TokenService(IConfiguration config, IGraphClient client)
        {
            _config = config;//zbog onog super secret key da ga zamenim u config fajl kasnije
            _client = client;//ovo ako mi treba za role
        }
        public async Task<string> CreateToken(Korisnik korisnik, string Uloga)
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, korisnik.Username),
                new Claim(ClaimTypes.NameIdentifier, korisnik.ID.ToString()),
                new Claim(ClaimTypes.Email, korisnik.Email),
                new Claim(ClaimTypes.Role, Uloga)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["TokenKey"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();

            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }

        public RefreshToken GenerateRefreshToken()
        {
            var randomNumber = new byte[64];
            using var rng = RandomNumberGenerator.Create();
            rng.GetBytes(randomNumber);
            return new RefreshToken
            {
                Token = Convert.ToBase64String(randomNumber),
                Expires = DateTime.UtcNow.AddDays(7)
            };
        }

    }
    
}