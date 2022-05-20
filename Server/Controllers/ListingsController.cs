using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Repositories;

namespace Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ListingsController : ControllerBase
    {
        private readonly IListingsRepository _listingsRepository;

        public ListingsController(IListingsRepository listingsRepository)
        {
            _listingsRepository = listingsRepository;
        }

        // GET: api/Listings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<SummaryListing>>> GetListings()
        {
            return await _listingsRepository.GetListings();
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
            return listing;
        }
    }
}
