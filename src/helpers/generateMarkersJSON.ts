import { Marker } from '../planner/MapElement';
import settings from '../helpers/settings';

const url = 'https://alt.pico-fbw.org';

const cachedAltitudes: number[] = [];

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

export default async (oldMarkers: Marker[], markers: Marker[]): Promise<string> => {
    try {
        const gpsSamples = Number(settings.get(settings.setting.gpsNumOffsetSamples.name));

        if (gpsSamples === 0) {
            const toFetch = markers.filter(
                // Only fetch markers that have a valid altitude and have either changed position or never have had their alt fetched
                marker => {
                    if (marker.alt > 400) {
                        throw new Error('Altitude too high'); // Should be handled earlier so this is an immediate error
                    }

                    const oldMarker = oldMarkers.find(oldMarker => oldMarker.id === marker.id);
                    if (!oldMarker) {
                        return true;
                    }

                    return (
                        marker.alt >= 0 &&
                        (marker.position.lat !== oldMarker.position.lat ||
                            marker.position.lng !== oldMarker.position.lng ||
                            !cachedAltitudes[marker.id])
                    );
                },
            );

            if (toFetch.length > 0) {
                const altitudes = await toMSL(toFetch.map(marker => [marker.position.lat, marker.position.lng]));
                altitudes.forEach((alt, i) => {
                    const marker = markers.find(marker => marker === toFetch[i]);
                    if (marker) {
                        cachedAltitudes[marker.id] = alt * 3.28084; // Conversion from meters to feet
                    }
                });
            }
        } else if (gpsSamples > 0 && gpsSamples <= 100 && !isNaN(gpsSamples)) {
            // Don't fetch any altitude data, that will be done onboard the aircraft
            markers.forEach(marker => {
                cachedAltitudes[marker.id] = 0;
            });
        } else {
            throw new Error('Invalid GPS number of offset samples');
        }

        const waypoints = markers.map(marker => {
            return {
                lat: marker.position.lat,
                lng: marker.position.lng,
                // Preserve hold, otherwise final alt (MSL) = AGL + calculated MSL at point
                alt: marker.alt >= 0 ? cachedAltitudes[marker.id] + marker.alt : marker.alt,
            };
        });

        const json = JSON.stringify({
            version: '1.0',
            version_fw: '0.0.1',
            gps_samples: gpsSamples,
            waypoints,
        });

        return json;
    } catch (error) {
        console.error(`Failed to generate JSON with error: ${error}`);
        return '';
    }
};
