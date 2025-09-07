from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests, math, os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ORS_API_KEY = os.getenv("ORS_API_KEY")

class RouteRequest(BaseModel):
    source: list  # [lat, lon]
    destination: list  # [lat, lon]from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests, math, os

app = FastAPI()

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

ORS_API_KEY = os.getenv("ORS_API_KEY")

class RouteRequest(BaseModel):
    source: list  # [lat, lon]
    destination: list  # [lat, lon]

# Haversine fallback
def haversine(lat1, lon1, lat2, lon2):
    R = 6371
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi / 2) ** 2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    return R * (2 * math.atan2(math.sqrt(a), math.sqrt(1 - a)))

@app.post("/api/route")
async def get_route(data: RouteRequest):
    src_lat, src_lon = data.source
    dst_lat, dst_lon = data.destination

    # --- Try OpenRouteService ---
    if ORS_API_KEY:
        try:
            url = "https://api.openrouteservice.org/v2/directions/driving-car"
            headers = {"Authorization": ORS_API_KEY, "Content-Type": "application/json"}
            body = {
                "coordinates": [[src_lon, src_lat], [dst_lon, dst_lat]],
                "instructions": False,
                "geometry_simplify": False
            }
            resp = requests.post(url, json=body, headers=headers, timeout=15)
            route = resp.json()

            if "features" in route:
                coords = route["features"][0]["geometry"]["coordinates"]
                distance_km = route["features"][0]["properties"]["segments"][0]["distance"] / 1000
                return {"distance_km": distance_km, "route_coords": coords}
        except Exception as e:
            print("ORS Exception:", e)

    # --- Try OSRM public server ---
    try:
        url = f"http://router.project-osrm.org/route/v1/driving/{src_lon},{src_lat};{dst_lon},{dst_lat}?overview=full&geometries=geojson"
        resp = requests.get(url, timeout=15)
        data_osrm = resp.json()
        if "routes" in data_osrm and len(data_osrm["routes"]) > 0:
            coords = data_osrm["routes"][0]["geometry"]["coordinates"]
            distance_km = data_osrm["routes"][0]["distance"] / 1000
            return {"distance_km": distance_km, "route_coords": coords}
    except Exception as e:
        print("OSRM Exception:", e)

    # --- Fallback to straight line (Haversine) ---
    distance_km = haversine(src_lat, src_lon, dst_lat, dst_lon)
    return {
        "distance_km": distance_km,
        "route_coords": [[src_lon, src_lat], [dst_lon, dst_lat]],  # straight line
    }

