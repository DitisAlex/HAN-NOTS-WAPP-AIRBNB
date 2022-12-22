namespace Server.Models
{
    public class Neighbourhoods
    {
        public List<AllNeighbourhoods> AllNeighbourhoods { get; set; }
    }
    public class AllNeighbourhoods
    {
        public string? Name { get; set; } = "";
    }
}
