using Microsoft.AspNetCore.Mvc;
using Server.Models;

namespace Server.Repositories;

public interface IListingsRepository
{
    Task<List<SummaryListing>> GetListings(FilterParameters parameters);
    Task<Listing?> GetListing(int id);
    Task<Neighbourhoods?> GetNeighbourhood();
    Task<Stats?> GetStats();
}

