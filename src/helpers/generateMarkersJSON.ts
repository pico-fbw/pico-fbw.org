import { LatLng } from 'leaflet';

export default (markers: { id: number; position: LatLng; alt: number }[]): string => {
    const waypoints = markers.map(marker => {
        return {
            lat: marker.position.lat,
            lng: marker.position.lng,
            alt: marker.alt,
        };
    });

    const json = JSON.stringify({
        version: '1.0',
        version_fw: '0.0.1',
        waypoints,
    });

    return json;
};
