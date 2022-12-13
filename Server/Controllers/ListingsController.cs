using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web.Resource;
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
            return Ok(listing);
        }

        [HttpGet]
        [Route("stats")]
        [Authorize(Roles = "MyAppAdministratorsGroup")]
        public async Task<ActionResult<List<Stats>>> GetStats()
        {
            var stats = await _listingsRepository.GetStats();

            return Ok(stats);
        }
    }
}
