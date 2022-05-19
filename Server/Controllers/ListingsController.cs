using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Server.Models;

namespace Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ListingsController : ControllerBase
    {
        private readonly AirBNBContext _context;

        public ListingsController(AirBNBContext context)
        {
            _context = context;
        }

        // GET: api/Listings
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Listing>>> GetListings()
        {
          if (_context.Listings == null)
          {
              return NotFound();
          }
            return await _context.Listings.Take(5).ToListAsync();
        }

        // GET: api/Listings/2818
        [HttpGet("{id}")]
        public async Task<ActionResult<Listing>> GetListing(int id)
        {
          if (_context.Listings == null)
          {
              return NotFound();
          }
            var listing = await _context.Listings.FindAsync(id);

            if (listing == null)
            {
                return NotFound();
            }

            return listing;
        }
    }
}
