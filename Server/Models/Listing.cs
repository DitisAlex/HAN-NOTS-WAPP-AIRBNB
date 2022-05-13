using System;
using System.Collections.Generic;

namespace Server.Models
{
    public partial class Listing
    {
        public Listing()
        {
            Reviews = new HashSet<Review>();
        }

        public int Id { get; set; }
        public string ListingUrl { get; set; } = null!;
        public double ScrapeId { get; set; }
        public DateTime LastScraped { get; set; }
        public string Name { get; set; } = null!;
        public string Summary { get; set; } = null!;
        public string Space { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string ExperiencesOffered { get; set; } = null!;
        public string NeighborhoodOverview { get; set; } = null!;
        public string Notes { get; set; } = null!;
        public string Transit { get; set; } = null!;
        public string Access { get; set; } = null!;
        public string Interaction { get; set; } = null!;
        public string HouseRules { get; set; } = null!;
        public string? ThumbnailUrl { get; set; }
        public string? MediumUrl { get; set; }
        public string PictureUrl { get; set; } = null!;
        public string? XlPictureUrl { get; set; }
        public int HostId { get; set; }
        public string HostUrl { get; set; } = null!;
        public string? HostName { get; set; }
        public DateTime? HostSince { get; set; }
        public string? HostLocation { get; set; }
        public string? HostAbout { get; set; }
        public string? HostResponseTime { get; set; }
        public string? HostResponseRate { get; set; }
        public string? HostAcceptanceRate { get; set; }
        public string? HostIsSuperhost { get; set; }
        public string? HostThumbnailUrl { get; set; }
        public string? HostPictureUrl { get; set; }
        public string? HostNeighbourhood { get; set; }
        public int? HostListingsCount { get; set; }
        public int? HostTotalListingsCount { get; set; }
        public string? HostVerifications { get; set; }
        public string? HostHasProfilePic { get; set; }
        public string? HostIdentityVerified { get; set; }
        public string? Street { get; set; }
        public string? Neighbourhood { get; set; }
        public string? NeighbourhoodCleansed { get; set; }
        public string? NeighbourhoodGroupCleansed { get; set; }
        public string? City { get; set; }
        public string? State { get; set; }
        public string? Zipcode { get; set; }
        public string? Market { get; set; }
        public string? SmartLocation { get; set; }
        public string? CountryCode { get; set; }
        public string? Country { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string? IsLocationExact { get; set; }
        public string? PropertyType { get; set; }
        public string? RoomType { get; set; }
        public int? Accommodates { get; set; }
        public double? Bathrooms { get; set; }
        public int? Bedrooms { get; set; }
        public int? Beds { get; set; }
        public string? BedType { get; set; }
        public string? Amenities { get; set; }
        public string? SquareFeet { get; set; }
        public string? Price { get; set; }
        public string? WeeklyPrice { get; set; }
        public string? MonthlyPrice { get; set; }
        public string? SecurityDeposit { get; set; }
        public string? CleaningFee { get; set; }
        public int? GuestsIncluded { get; set; }
        public string? ExtraPeople { get; set; }
        public int? MinimumNights { get; set; }
        public int? MaximumNights { get; set; }
        public string? CalendarUpdated { get; set; }
        public string? HasAvailability { get; set; }
        public int? Availability30 { get; set; }
        public int? Availability60 { get; set; }
        public int? Availability90 { get; set; }
        public int? Availability365 { get; set; }
        public DateTime? CalendarLastScraped { get; set; }
        public int? NumberOfReviews { get; set; }
        public DateTime? FirstReview { get; set; }
        public DateTime? LastReview { get; set; }
        public int? ReviewScoresRating { get; set; }
        public int? ReviewScoresAccuracy { get; set; }
        public int? ReviewScoresCleanliness { get; set; }
        public int? ReviewScoresCheckin { get; set; }
        public int? ReviewScoresCommunication { get; set; }
        public int? ReviewScoresLocation { get; set; }
        public int? ReviewScoresValue { get; set; }
        public string RequiresLicense { get; set; } = null!;
        public string? License { get; set; }
        public string? JurisdictionNames { get; set; }
        public string InstantBookable { get; set; } = null!;
        public string IsBusinessTravelReady { get; set; } = null!;
        public string CancellationPolicy { get; set; } = null!;
        public string RequireGuestProfilePicture { get; set; } = null!;
        public string RequireGuestPhoneVerification { get; set; } = null!;
        public int CalculatedHostListingsCount { get; set; }
        public double? ReviewsPerMonth { get; set; }

        public virtual ICollection<Review> Reviews { get; set; }
    }
}
