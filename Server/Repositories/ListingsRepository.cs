using Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Globalization;

namespace Server.Repositories;

public class ListingsRepository : IListingsRepository
{
	private readonly AirBNBContext _context;

	public ListingsRepository(AirBNBContext context)
	{
		_context = context;
	}

    public async Task<ActionResult<IEnumerable<SummaryListing>>> GetListings()
    {
        return await _context.Listings.Select(listing => new SummaryListing
        {
            Id = listing.Id,
            Name = listing.Name,
            HostName = listing.HostName,
            Neighbourhood = listing.NeighbourhoodCleansed,
            Latitude = listing.Latitude,
            Longitude = listing.Longitude,
            Price = listing.Price,
            ReviewScoresRating = listing.ReviewScoresRating
        }).ToListAsync();
    }

    public async Task<Listing?> GetListing(int id)
    {
        return await _context.Listings.FindAsync(id);
    }
}


