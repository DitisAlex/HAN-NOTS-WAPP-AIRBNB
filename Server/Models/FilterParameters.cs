namespace Server.Models
{
    public partial class FilterParameters
    {
        public string? Neighbourhood { get; set; }
        public int? PriceFrom { get; set; }
        public int? PriceTo { get; set; }
        public int? ReviewsFrom { get; set; }
        public int? ReviewsTo { get; set; }
    }
}
