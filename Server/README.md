# AirBNB - Server
Powered by ASP.NET Core API & Docker

## Starting the project
- Copy the contents of ``.env.example`` to your own ``.env`` file
- Restore installed dependencies with ``dotnet restore``
- Start the Docker Container Deamon with ``docker compose up -d``
- Build the project 

## Endpoints
| Endpoint       | Description                            | Status             |
|----------------|----------------------------------------|--------------------|
| /Listings      | Return all Listings (Summarized)       | :white_check_mark: |
| /Listings/{id} | Returns a specific Listing based of Id | :white_check_mark: |

## Scaffolding
- Generate models based of a database (credentials should be equal to env file): ``dotnet ef dbcontext scaffold "Server=localhost;Database=<DATABASE_HERE>;User Id=sa;password=<PASSWORD_HERE>;Trusted_Connection=False" Microsoft.EntityFrameworkCore.SqlServer -o Models``
- Generate controllers based of a model: `` dotnet-aspnet-codegenerator controller -name <OUTPUT_NAME_HERE> -async -api -m <MODEL_HERE> -dc <DBCONTEXT_HERE> -outDir Controllers``



