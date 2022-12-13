using System;
using System.Collections.Generic;

namespace Server.Models
{
    public class Stats
    {
        public List<ListingsPerNeighbourhood> ListingsPerNeighbourhood { get; set; }
        public List<ListingsPerProperty> ListingsPerProperty { get; set; }
        public int? TotalAvailable { get; set; }
    }

    public class ListingsPerNeighbourhood
    {
        public string? Neighbourhood { get; set; } = "";
        public int? TotalListings { get; set; }
        public int? AverageReviewScore { get; set; }
        public int? AverageAvailability30 { get; set; }
        public int? AverageAvailability60 { get; set; }
        public int? AverageAvailability90 { get; set; }
        public int? AverageAvailability365 { get; set; }
    }

    public class ListingsPerProperty
    {
        public string? Type { get; set; } = "";
        public int? Count {  get; set; }
    }
}
