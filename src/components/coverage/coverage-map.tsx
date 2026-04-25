"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Fix Leaflet icon issue
import "leaflet/dist/leaflet.css";

if (typeof window !== "undefined") {
    // @ts-expect-error - Property '_getIconUrl' exists but not in type definition
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
        iconRetinaUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
        iconUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
        shadowUrl:
            "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
    });
}

// All 64 Bangladesh districts with coverage data
const coverageData = [
    { district: "Dhaka", lat: 23.8103, lng: 90.4125, covered: "100%" },
    { district: "Chittagong", lat: 22.3569, lng: 91.7832, covered: "95%" },
    { district: "Sylhet", lat: 24.8949, lng: 91.8687, covered: "85%" },
    { district: "Khulna", lat: 22.8456, lng: 89.5403, covered: "90%" },
    { district: "Rajshahi", lat: 24.3745, lng: 88.6042, covered: "80%" },
    { district: "Barisal", lat: 22.701, lng: 90.3693, covered: "75%" },
    { district: "Mymensingh", lat: 24.7471, lng: 90.4203, covered: "85%" },
    { district: "Rangpur", lat: 25.7439, lng: 89.2752, covered: "70%" },
    { district: "Cox's Bazar", lat: 21.4435, lng: 91.9813, covered: "88%" },
    { district: "Gazipur", lat: 23.9809, lng: 90.6667, covered: "98%" },
    { district: "Narayanganj", lat: 23.6445, lng: 90.5, covered: "96%" },
    { district: "Tangail", lat: 24.2513, lng: 89.9188, covered: "82%" },
    { district: "Jashore", lat: 23.165, lng: 88.2081, covered: "78%" },
    { district: "Magura", lat: 23.48, lng: 89.42, covered: "72%" },
    { district: "Narail", lat: 23.18, lng: 89.51, covered: "68%" },
    { district: "Kushtia", lat: 23.9, lng: 88.97, covered: "75%" },
    { district: "Meherpur", lat: 23.76, lng: 88.63, covered: "70%" },
    { district: "Chuadanga", lat: 23.64, lng: 88.842, covered: "66%" },
    { district: "Satkhira", lat: 22.74, lng: 89.07, covered: "82%" },
    { district: "Bagerhat", lat: 22.65, lng: 89.78, covered: "76%" },
    { district: "Pirojpur", lat: 22.57, lng: 90.13, covered: "74%" },
    { district: "Jhalokati", lat: 22.58, lng: 90.18, covered: "72%" },
    { district: "Patuakhali", lat: 22.36, lng: 90.33, covered: "78%" },
    { district: "Bhola", lat: 22.57, lng: 90.67, covered: "70%" },
    { district: "Noakhali", lat: 23.17, lng: 91.1, covered: "84%" },
    { district: "Feni", lat: 23.02, lng: 91.4, covered: "86%" },
    { district: "Comilla", lat: 23.46, lng: 91.19, covered: "92%" },
    { district: "Chandpur", lat: 23.23, lng: 91.68, covered: "88%" },
    { district: "Lakshmipur", lat: 22.9437, lng: 91.1703, covered: "80%" },
    { district: "Habiganj", lat: 24.4769, lng: 91.4172, covered: "82%" },
    { district: "Moulvibazar", lat: 24.48, lng: 91.56, covered: "80%" },
    { district: "Sunamganj", lat: 25.0658, lng: 91.1133, covered: "76%" },
    { district: "Netrokona", lat: 24.88, lng: 90.73, covered: "78%" },
    { district: "Kishoreganj", lat: 24.43, lng: 90.78, covered: "84%" },
    { district: "Sherpur", lat: 25.02, lng: 90.52, covered: "76%" },
    { district: "Jamalpur", lat: 24.93, lng: 91.25, covered: "74%" },
    { district: "Bogra", lat: 24.85, lng: 89.37, covered: "86%" },
    { district: "Naogaon", lat: 24.77, lng: 88.72, covered: "72%" },
    { district: "Natore", lat: 24.42, lng: 88.91, covered: "74%" },
    { district: "Chapainawabganj", lat: 24.56, lng: 88.25, covered: "68%" },
    { district: "Dinajpur", lat: 25.628, lng: 88.64, covered: "70%" },
    { district: "Thakurgaon", lat: 26.13, lng: 88.58, covered: "64%" },
    { district: "Panchagarh", lat: 26.34, lng: 88.55, covered: "62%" },
    { district: "Nilphamari", lat: 25.97, lng: 89.655, covered: "68%" },
    { district: "Lalmonirhat", lat: 25.9192, lng: 89.9845, covered: "66%" },
    { district: "Kurigram", lat: 25.805, lng: 89.636, covered: "64%" },
    { district: "Gaibandha", lat: 25.329, lng: 89.528, covered: "70%" },
    { district: "Sirajganj", lat: 24.45, lng: 89.71, covered: "80%" },
    { district: "Pabna", lat: 23.98, lng: 89.24, covered: "76%" },
    { district: "Barguna", lat: 22.09, lng: 90.11, covered: "68%" },
    { district: "Barisal", lat: 22.701, lng: 90.3693, covered: "77%" },
    { district: "Jhalokati", lat: 22.58, lng: 90.18, covered: "72%" },
    { district: "Gopalganj", lat: 23.0127, lng: 90.4277, covered: "74%" },
    { district: "Khulna", lat: 22.8456, lng: 89.5403, covered: "91%" },
    { district: "Manikganj", lat: 23.86, lng: 90.0, covered: "88%" },
    { district: "Madaripur", lat: 23.6466, lng: 90.1875, covered: "82%" },
    { district: "Rajbari", lat: 23.73, lng: 89.64, covered: "70%" },
    { district: "Shariatpur", lat: 23.26, lng: 90.43, covered: "76%" },
    { district: "Munshiganj", lat: 23.5413, lng: 90.5305, covered: "90%" },
];

import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

// Component that handles map interactions using useMap hook
function MapContent({ filteredDistricts }: { filteredDistricts: typeof coverageData }) {
    const map = useMap();

    useEffect(() => {
        if (filteredDistricts.length === 0) return;

        if (filteredDistricts.length === 1) {
            // Single result - zoom to that location
            const [lat, lng] = [filteredDistricts[0].lat, filteredDistricts[0].lng];
            map.setView([lat, lng], 11, { animate: true });
        } else {
            // Multiple results - fit bounds to all markers
            const bounds = L.latLngBounds(
                filteredDistricts.map((d) => [d.lat, d.lng])
            );
            map.fitBounds(bounds, { padding: [50, 50], animate: true });
        }
    }, [filteredDistricts, map]);

    return (
        <>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />

            {/* Display Markers */}
            {filteredDistricts.map((district, idx) => (
                <Marker key={idx} position={[district.lat, district.lng]}>
                    <Popup>
                        <div className="space-y-2">
                            <h3 className="font-bold text-sm text-foreground">
                                {district.district}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                <strong>Coverage:</strong> {district.covered}
                            </p>
                        </div>
                    </Popup>
                </Marker>
            ))}
        </>
    );
}

export default function CoverageMap() {
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // Search is handled live via input onChange
    };

    if (typeof window === "undefined") {
        return (
            <div className="w-full space-y-4">
                <div className="flex gap-3 max-w-lg">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                        <Input
                            placeholder="Search here"
                            disabled
                            className="pl-10"
                        />
                    </div>
                    <Button disabled>Search</Button>
                </div>
                <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                    <Spinner className="h-8 w-8" />
                </div>
            </div>
        );
    }

    // Filter districts based on search query
    const filteredDistricts = searchQuery.trim()
        ? coverageData.filter((d) =>
            d.district.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : coverageData;

    const bangladeshCenter: [number, number] = [23.685, 90.3563];

    return (
        <div className="w-full space-y-4 p-6">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-lg">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground pointer-events-none" />
                    <Input
                        placeholder="Search here"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 focus:ring-primary focus:border-primary"
                    />
                </div>
                <Button type="submit">Search</Button>
            </form>

            {/* Results info */}
            {searchQuery.trim() && (
                <div className="text-sm text-muted-foreground">
                    Found <span className="font-semibold text-foreground">{filteredDistricts.length}</span> district{filteredDistricts.length !== 1 ? "s" : ""}
                </div>
            )}

            {/* Map Container */}
            <div className="h-96 md:h-[500px] w-full bg-muted relative rounded-lg overflow-hidden border border-border">
                <MapContainer
                    center={bangladeshCenter}
                    zoom={7}
                    scrollWheelZoom={true}
                    className="h-full w-full"
                >
                    <MapContent filteredDistricts={filteredDistricts} />
                </MapContainer>
            </div>
        </div>
    );
}
