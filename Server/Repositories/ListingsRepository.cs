using Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;

namespace Server.Repositories;

public class ListingsRepository : IListingsRepository
{
	private readonly AirBNBContext _context;

	public ListingsRepository(AirBNBContext context)
	{
		_context = context;
	}

    public async Task<ActionResult<List<SummaryListing>>> GetListings(FilterParameters parameters)
    {
        IQueryable<SummaryListing> listings = _context.Listings.Select(listing => new SummaryListing
        {
            Id = listing.Id,
            Name = listing.Name,
            HostName = listing.HostName,
            Neighbourhood = listing.NeighbourhoodCleansed,
            Latitude = listing.Latitude,
            Longitude = listing.Longitude,
            Price = listing.Price,
            ReviewScoresRating = listing.ReviewScoresRating
        });

        if (!string.IsNullOrEmpty(parameters.Neighbourhood))
        {
            listings = listings.Where(listing => listing.Neighbourhood == parameters.Neighbourhood);
        }

        if (parameters.PriceFrom.HasValue)
        {
            listings = listings.Where(listing => listing.Price >= parameters.PriceFrom);
        }

        if (parameters.PriceTo.HasValue)
        {
            
            listings = listings.Where(listing => listing.Price <= parameters.PriceTo);
        }

        if (parameters.ReviewsFrom.HasValue)
        {
            listings = listings.Where(listing => listing.ReviewScoresRating >= parameters.ReviewsFrom);
        }

        if (parameters.ReviewsTo.HasValue)
        {
            listings = listings.Where(listing => listing.ReviewScoresRating <= parameters.ReviewsTo);
        }

        return await listings.ToListAsync();
    }

    public async Task<Listing?> GetListing(int id)
    {
        return await _context.Listings.FindAsync(id);
    }

    public async Task<Neighbourhoods?> GetNeighbourhood()
    {
        var neighbourhoods = new Neighbourhoods();
        neighbourhoods.AllNeighbourhoods = new List<AllNeighbourhoods>();

        var neighbourhoodList = await _context.Listings
            .GroupBy(l => l.NeighbourhoodCleansed)
            .Select(g => new {
                Neighbourhood = g.Key ?? "Unknown",
            })
            .ToListAsync();

        neighbourhoodList.ForEach(h =>
        {
            neighbourhoods.AllNeighbourhoods.Add(new AllNeighbourhoods
            {
                Name = h.Neighbourhood
            });
        });

        return neighbourhoods;
    }

    public async Task<Stats?> GetStats()
    {
        var stats = new Stats();
        stats.ListingsPerNeighbourhood = new List<ListingsPerNeighbourhood>();
        stats.ListingsPerProperty = new List<ListingsPerProperty>();

        var listingsPerNeighbourhood = await _context.Listings
            .GroupBy(l => l.NeighbourhoodCleansed)
            .Select(g => new { 
                Neighbourhood = g.Key ?? "Unknown", 
                Count = g.Count(), 
                AverageReviewScore = g.Average(y => y.ReviewScoresRating),
                AverageAvailability30 = g.Average(y => y.Availability30), 
                AverageAvailability60 = g.Average(y => y.Availability60), 
                AverageAvailability90 = g.Average(y => y.Availability90), 
                AverageAvailability365 = g.Average(y => y.Availability365)
            })
            .ToListAsync();

        listingsPerNeighbourhood.ForEach(h =>
        {
            stats.ListingsPerNeighbourhood.Add(new ListingsPerNeighbourhood
            {
                Neighbourhood = h.Neighbourhood,
                TotalListings = h.Count,
                AverageReviewScore = (int) h.AverageReviewScore,
                AverageAvailability30 = (int) h.AverageAvailability30,
                AverageAvailability60 = (int) h.AverageAvailability60,
                AverageAvailability90 = (int) h.AverageAvailability90,
                AverageAvailability365 = (int) h.AverageAvailability365,
            });
        });

        var listingsPerProperty = await _context.Listings
            .GroupBy(l => l.PropertyType)
            .Select(g => new
            {
                Type = g.Key ?? "Unknown",
                Count = g.Count()
            })
            .OrderByDescending(g => g.Count)
            .Take(8)
            .ToListAsync();

        listingsPerProperty.ForEach(h =>
        {
            stats.ListingsPerProperty.Add(new ListingsPerProperty
            {
                Type = h.Type,
                Count = h.Count
            });
        });


        stats.TotalAvailable = _context.Listings
            .Count();

        return stats;
    }
}


