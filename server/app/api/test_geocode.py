from fastapi import APIRouter, Query
import requests

router = APIRouter()

@router.get("/geocode/")
def geocode_location(location: str = Query(..., description="Location name to geocode")):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": location,
        "format": "json",
        "limit": 1
    }
    headers = {
        "User-Agent": "jiseti-app"  # Required by Nominatim
    }

    response = requests.get(url, params=params, headers=headers)
    
    if response.status_code != 200:
        return {"error": "Failed to fetch coordinates"}

    data = response.json()
    if not data:
        return {"error": "No coordinates found for this location"}

    return {
        "location": location,
        "latitude": float(data[0]["lat"]),
        "longitude": float(data[0]["lon"])
    }
