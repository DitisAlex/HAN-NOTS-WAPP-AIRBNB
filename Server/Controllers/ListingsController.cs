using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Identity.Web.Resource;
using Newtonsoft.Json;
using Server.Models;
using Server.Repositories;
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
        public async Task<ActionResult<List<SummaryListing>>> GetListings([FromQuery] FilterParameters parameters)
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

            Console.WriteLine(cacheKey);

            var cachedListings = await _cache.GetStringAsync(cacheKey.ToString());

            if(cachedListings != null)
            {
                Console.WriteLine("Found in cache!");
                return Ok(JsonConvert.DeserializeObject(cachedListings));
            } else
            {
                var listings = await _listingsRepository.GetListings(parameters);

                var cacheEntryOptions = new DistributedCacheEntryOptions().SetSlidingExpiration(TimeSpan.FromMinutes(5));

                await _cache.SetStringAsync(cacheKey.ToString(), JsonConvert.SerializeObject(cachedListings), cacheEntryOptions);
                Console.WriteLine("Set in cache!");

                return Ok(listings);
            }
        }

        // GET: api/Listings/2818
        [HttpGet("{id}")]
        public async Task<ActionResult<Listing>> GetListing(int id)
        {
            var listing = await _listingsRepository.GetListing(id);

            if (listing == null)
            {
                return NotFound();
            }
            return Ok(listing);
        }

        [HttpGet]
        [Route("neighbourhoods")]
        public async Task<ActionResult<Neighbourhoods>> GetNeighbourhoods()
        {
            var neighbourhoods = await _listingsRepository.GetNeighbourhood();
            return Ok(neighbourhoods);
        }

        [HttpGet]
        [Route("stats")]
        [AllowAnonymous]
        [Authorize(Roles = "MyAppAdministratorsGroup")]
        public async Task<ActionResult<List<Stats>>> GetStats()
        {
            var stats = await _listingsRepository.GetStats();

            return Ok(stats);
        }
    }
}
