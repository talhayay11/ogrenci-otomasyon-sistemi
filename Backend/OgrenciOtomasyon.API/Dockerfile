# Use the official .NET 9 runtime as base image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

# Use the official .NET 9 SDK for building
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY ["OgrenciOtomasyon.API.csproj", "."]
RUN dotnet restore "OgrenciOtomasyon.API.csproj"
COPY . .
WORKDIR "/src"
RUN dotnet build "OgrenciOtomasyon.API.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "OgrenciOtomasyon.API.csproj" -c Release -o /app/publish

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "OgrenciOtomasyon.API.dll"]
