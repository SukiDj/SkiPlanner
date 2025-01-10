using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Core
{
    public class PagingParams
    {
        private const int MaxPageSize = 50;//smanji kasnije ovo
        public int PageNumber {get; set;} = 1;//default
        private int _pageSize = 10;//default
        public int PageSize
        {
            get => _pageSize;
            set => _pageSize = (value > MaxPageSize) ? MaxPageSize : value;
        }
        
    }
}