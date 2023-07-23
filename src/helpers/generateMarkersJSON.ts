import { LatLng } from 'leaflet';

const url = 'https://alt.pico-fbw.org';

async function toMSL(locations: number[][]): Promise<number[]> {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(locations),
    });

    if (!response.ok) {
        throw new Error(`Failed to fetch MSL data with error ${response.status}`);
    }

    const data = await response.json();
    if (data.some((value: number | null) => value === null || value < 0)) {
        throw new Error('Failed to fetch MSL data in some locations');
    }

    return data;
}

export default async (markers: { id: number; position: LatLng; alt: number }[]): Promise<string> => {
    try {
        const locations = markers.map(marker => [marker.position.lat, marker.position.lng]);
        const altitudes = await toMSL(locations);

        const waypoints = markers.map((marker, i) => {
            const alt = marker.alt + altitudes[i] * 3.28084; // MSL alt = AGL + point MSL (converted from meters to feet)
            return {
                lat: marker.position.lat,
                lng: marker.position.lng,
                alt: alt,
            };
        });

        const json = JSON.stringify({
            version: '1.0',
            version_fw: '0.0.1',
            waypoints,
        });

        return json;
    } catch (error) {
        return '';
    }
};
