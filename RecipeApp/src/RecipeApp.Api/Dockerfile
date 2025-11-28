FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy project folders explicitly so files end up at /src/RecipeApp.Core and /src/RecipeApp.Api
COPY src/RecipeApp.Core/ ./RecipeApp.Core/
COPY src/RecipeApp.Api/ ./RecipeApp.Api/

# Restore for the API project (uses the ProjectReference to the Core project)
RUN dotnet restore "RecipeApp.Api/RecipeApp.Api.csproj"

# Build & publish the API
WORKDIR /src/RecipeApp.Api
RUN dotnet publish "RecipeApp.Api.csproj" -c Release -o /app/publish

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS runtime
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:80

COPY --from=build /app/publish .
EXPOSE 80

ENTRYPOINT ["dotnet", "RecipeApp.Api.dll"]