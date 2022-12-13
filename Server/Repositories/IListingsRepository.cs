using Microsoft.AspNetCore.Mvc;
using Server.Models;

namespace Server.Repositories;

public interface IListingsRepository
{
    Task<ActionResult<IEnumerable<SummaryListing>>> GetListings();
    Task<Listing?> GetListing(int id);

    Task<Stats?> GetStats();
}

