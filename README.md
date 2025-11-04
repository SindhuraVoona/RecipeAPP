# RecipeApp

Small full-stack recipe application: React UI, .NET Core API, and shared Core models.

## Project layout
- src/recipeapp-ui — React 18 + Vite frontend
- src/RecipeApp.Core — shared models / DTOs (C# .NET 6)
- src/RecipeApp.Api — ASP.NET Core 6 Web API (C# .NET 6)
- tests/RecipeApp.Tests — xUnit tests for controllers/services

## Versions
- Frontend: React 18, Vite
- Backend: .NET 6 (LTS)
- Test SDK: Microsoft.NET.Test.Sdk 17.x for .NET 6
- Password hashing: BCrypt.Net-Next
- HTTP client (UI): axios

- ## How to run (development)
1. API
```bash
cd /Users/macbookpro/Projects/RecipeAPP/RecipeApp/src/RecipeApp.Api
dotnet restore
dotnet run
```
2. UI
```bash
cd /Users/macbookpro/Projects/RecipeAPP/RecipeApp/src/recipeapp-ui
npm install
npm run dev
# open the URL shown by Vite (typically http://localhost:5173)
```

## Add required packages (API & UI)
API:
```bash
cd src/RecipeApp.Api
dotnet add package BCrypt.Net-Next
# for migrations:
dotnet add package Microsoft.EntityFrameworkCore.Design
# ensure JWT package matches .NET target (if explicitly added)
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 6.0.0
```

UI:
```bash
cd src/recipeapp-ui
npm install axios
```
Tests (from tests folder):
```bash
cd tests/RecipeApp.Tests
dotnet add package Microsoft.NET.Test.Sdk --version 17.10.0
dotnet add package xunit --version 2.4.2
dotnet add package xunit.runner.visualstudio --version 2.4.5
dotnet add package Moq --version 4.18.4
dotnet restore
dotnet build
dotnet test
```
