using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace API.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, int currentPage, int itemsPerPage, int totalItems, int totalPages)
        {
            var paginationHeader = new
            {
                currentPage,
                itemsPerPage,
                totalItems,
                totalPages
            };//da ti omogucim diko da mozes od klijent stranu da pokupis ovaj info kroz header
            response.Headers.Append("Pagination", JsonSerializer.Serialize(paginationHeader));// promena iz add u append!?
        }
    }
}