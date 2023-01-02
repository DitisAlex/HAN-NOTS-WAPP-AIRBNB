using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Identity.Web.Resource;
using Newtonsoft.Json;
using Server.Models;
using Server.Repositories;
using System.Reflection;
using System.Text;

namespace Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ListingsController : ControllerBase
    {
        private readonly IListingsRepository _listingsRepository;
        private readonly IDistributedCache _cache;

        public ListingsController(IListingsRepository listingsRepository, IDistributedCache cache)
        {
            _listingsRepository = listingsRepository;
            _cache = cache;
        }

        // GET: api/Listings
        [HttpGet]
        public async Task<List<SummaryListing>> GetListings([FromQuery] FilterParameters parameters)
        {
            StringBuilder cacheKey = new StringBuilder("listings", 50);

            if (parameters.Neighbourhood != null)
            {
                cacheKey.Append("-neighbourhood=" + parameters.Neighbourhood);
            }
            if (parameters.PriceFrom != null)
            {
                cacheKey.Append("-priceFrom=" + parameters.PriceFrom);
            }
            if (parameters.PriceTo != null)
            {
                cacheKey.Append("-priceTo=" + parameters.PriceTo);
            }
            if (parameters.ReviewsFrom != null)
            {
                cacheKey.Append("-reviewsFrom=" + parameters.ReviewsFrom);
            }
            if (parameters.ReviewsTo != null)
            {
                cacheKey.Append("-reviewsTo=" + parameters.ReviewsTo);
            }

            if(cacheKey.ToString() != "listings")
            {
                var cachedListings = await _cache.GetStringAsync(cacheKey.ToString());

                if (cachedListings != null)
                {
                    Console.WriteLine($"Found {cacheKey} in Cache!");

                    return JsonConvert.DeserializeObject<List<SummaryListing>>(cachedListings);
                } else
                {
                    var listings = await _listingsRepository.GetListings(parameters);

                    var cacheEntryOptions = new DistributedCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromMinutes(10));

                    await _cache.SetStringAsync(cacheKey.ToString(), JsonConvert.SerializeObject(listings), cacheEntryOptions);
                    Console.WriteLine($"Set {cacheKey} in Cache!");
                    return listings;
                }
            } else
            {
                var listings = await _listingsRepository.GetListings(parameters);

                return listings;
            }
        }

        // GET: api/Listings/2818
        [HttpGet("{id}")]
        public async Task<ActionResult<Listing>> GetListing(int id)
        {
            StringBuilder cacheKey = new StringBuilder("listings", 50);

            cacheKey.Append("-id=" + id);

            var cachedListing = await _cache.GetStringAsync(cacheKey.ToString());

            if (cachedListing != null)
            {
                Console.WriteLine($"Found {cacheKey} in Cache!");

                return Ok(JsonConvert.DeserializeObject<Listing>(cachedListing));
            }
            else
            {
                var listing = await _listingsRepository.GetListing(id);

                if (listing == null)
                {
                    return NotFound();
                }

                var cacheEntryOptions = new DistributedCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromMinutes(10));

                await _cache.SetStringAsync(cacheKey.ToString(), JsonConvert.SerializeObject(listing), cacheEntryOptions);
                Console.WriteLine($"Set {cacheKey} in Cache!");
                return Ok(listing);
            }
        }

        [HttpGet]
        [Route("neighbourhoods")]
        public async Task<ActionResult<Neighbourhoods>> GetNeighbourhoods()
        {
            var cacheKey = "neighbourhoods"; 
            var cachedNeighbourhoods = await _cache.GetStringAsync(cacheKey);

            if (cachedNeighbourhoods != null)
            {
                Console.WriteLine($"Found {cacheKey} in Cache!");

                return Ok(JsonConvert.DeserializeObject<Neighbourhoods>(cachedNeighbourhoods));
            } else
            {
                var neighbourhoods = await _listingsRepository.GetNeighbourhood();
                var cacheEntryOptions = new DistributedCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromMinutes(10));

                await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(neighbourhoods), cacheEntryOptions);
                Console.WriteLine($"Set {cacheKey} in Cache!");
                return Ok(neighbourhoods);
            }
        }

        [HttpGet]
        [Route("stats")]
        [Authorize(Roles = "MyAppAdministratorsGroup")]
        public async Task<ActionResult<Stats>> GetStats()
        {
            var cacheKey = "stats";
            var cachedStats = await _cache.GetStringAsync(cacheKey);

            if (cachedStats != null)
            {
                Console.WriteLine($"Found {cacheKey} in Cache!");

                return Ok(JsonConvert.DeserializeObject<Stats>(cachedStats));
            }
            else
            {
                var stats = await _listingsRepository.GetStats();
                var cacheEntryOptions = new DistributedCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromMinutes(10));

                await _cache.SetStringAsync(cacheKey, JsonConvert.SerializeObject(stats), cacheEntryOptions);
                Console.WriteLine($"Set {cacheKey} in Cache!");
                return Ok(stats);
            }
        }
    }
}
