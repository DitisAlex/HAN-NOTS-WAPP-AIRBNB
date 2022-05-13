using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Calendar
    {
        public int ListingId { get; set; }
        public DateTime Date { get; set; }
        public string Available { get; set; } = null!;
        public string? Price { get; set; }

        public virtual Listing Listing { get; set; } = null!;
    }
}
