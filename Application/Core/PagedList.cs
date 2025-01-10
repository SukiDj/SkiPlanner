using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Application.Core
{
    public class PagedList<T> : List<T>//nas tip liste kojem cemo da dodamo funkcionalnost za paginisanje, genericki jer ce da se primenjuje na obilaske ili korisnike ili sta god prikazujes diko 
    {
        public int CurrentPage { get; set; }
        public int TotalPages { get; set; }
        public int PageSize { get; set; }
        public int TotalCount { get; set; }

        public PagedList(IEnumerable<T> items, int count, int pageNumber, int pageSize)//items su elementi nase liste
        {
            CurrentPage = pageNumber;
            TotalPages = (int)Math.Ceiling(count / (double)pageSize);//sracunam odmah koliko ce da bude strana, npr ako je brojelemenata 10 a velicina strane 4, delim double da dobijem razlomljen broj i onda Ceiling vrati najveci sledeci celi broj i toliko ima strana, u ovom primeru 3
            PageSize = pageSize;
            TotalCount = count;
            AddRange(items);//dodajem nove elemente na kraj liste
        }

        public static async Task<PagedList<T>> CreateAsync(IQueryable<T> source, int pageNumber, int pageSize)//source su podaci koje cemo da procitamo iz baze u formi upita
        {
            var count = await source.CountAsync();//da znam unapred kolko ce da bude ukupno podataka da bi mogo da odradim paginiranje na osnovu toga, u sustini kao da izvrsavam ovaj upit za source dva puta, jednom da vidim kolko elementa drugi put da ih ucitam
            if(pageNumber < 1) pageNumber = 1;
            var items = await source.Skip((pageNumber - 1) * pageSize).Take(pageSize).ToListAsync();//kao ucitanvanje prvih pageSize elemenata iz niza, pa drugih pageSize elemenata itd
            return new PagedList<T>(items, count, pageNumber, pageSize);
        }
    }
}