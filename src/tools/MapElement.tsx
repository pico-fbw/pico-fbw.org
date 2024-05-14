import { Fragment, useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { DragEndEvent, LatLng, LeafletMouseEvent, Map } from 'leaflet';
import { Transition, Switch, Menu } from '@headlessui/react';
import {
    Cog6ToothIcon,
    GlobeAmericasIcon,
    MapIcon,
    MapPinIcon,
    PlusIcon,
    Square3Stack3DIcon,
} from '@heroicons/react/24/outline';
import calculateDistance from '../helpers/calculateDistance';
import classNames from '../helpers/classNames';
import { Flightplan, flightplanToMarkers, markersToFlightplan } from '../helpers/flightplan';
import Settings from '../helpers/settings';
import Alert from '../elements/Alert';
import { NavLink } from 'react-router-dom';

function MapClickHandler({ onClick }: { onClick: (e: LeafletMouseEvent) => void }) {
    useMapEvents({
        click(e) {
            onClick(e);
        },
    });

    return null;
}

const layers = [
    {
        id: 0,
        name: 'Google Satellite',
        attribution: 'Imagery &copy; Google Satellite Imagery Sources',
        link: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        icon: GlobeAmericasIcon,
    },
    {
        id: 1,
        name: 'Google Hybrid',
        attribution: 'Imagery &copy; Google Satellite Imagery Sources, Map data &copy; 2023 Google',
        link: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        icon: Square3Stack3DIcon,
    },
    {
        id: 2,
        name: 'Google Map',
        attribution: 'Map data &copy; 2023 Google',
        link: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        icon: MapIcon,
    },
    {
        id: 3,
        name: 'OpenStreetMap',
        attribution:
            'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> and contributors',
        link: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        icon: MapPinIcon,
    },
];

export interface Marker {
    id: number;
    position: LatLng;
    alt: number;
    speed: number;
    drop: boolean;
}

function MapElement() {
    const [markers, setMarkers] = useState<Marker[]>([]);
    const [polyline, setPolyline] = useState<LatLng[]>([]);
    const [editID, setEditID] = useState<number | null>(null);
    const [fplanJson, setFplanJson] = useState(String);
    const [showJson, setShowJson] = useState(false);
    const [loadingJson, setLoadingJson] = useState(false);
    const [errorJson, setErrorJson] = useState(false);
    const uploadTriggered = useRef(false);
    const [map, setMap] = useState<Map | null>(null);
    const [mapLink, setMapLink] = useState(layers[0].link);
    const [mapAttribution, setMapAttribution] = useState(layers[0].attribution);
    const [defaultAlt, setDefaultAlt] = useState(20);
    const [defaultSpeed] = useState(Number(Settings.get('defaultSpeed')));

    const markerIcon = L.icon({
        iconUrl: '../../marker-icon.png',
        shadowUrl: '../../marker-shadow.png',
        iconSize: [25, 41],
        shadowSize: [41, 41],
        iconAnchor: [12.5, 38],
        shadowAnchor: [12.5, 38],
    });

    function updateMarkers(newMarkers: Marker[]) {
        setLoadingJson(true);
        let fplan: Flightplan;
        try {
            fplan = markersToFlightplan(newMarkers);
        } catch (e) {
            console.error('Error parsing markers:', (e as Error).message);
            setErrorJson(true);
            setLoadingJson(false);
            return;
        }
        setFplanJson(JSON.stringify(fplan));
        setMarkers(newMarkers);
        setLoadingJson(false);
    }

    const handleMapClick = (e: LeafletMouseEvent) => {
        const { latlng } = e;
        const newMarker = {
            id: markers.length + 1,
            position: latlng,
            alt: defaultAlt,
            speed: defaultSpeed,
            drop: false,
        };
        updateMarkers([...markers, newMarker]);
        setPolyline([...polyline, latlng]);
    };

    const handleMarkerDragEnd = (id: number, e: DragEndEvent) => {
        const updatedMarkers = markers.map(marker => {
            if (marker.id === id) {
                return {
                    ...marker,
                    //I dont know how to do this right

                    position: e.target.getLatLng(),
                };
            }
            return marker;
        });
        updateMarkers(updatedMarkers);

        setPolyline(updatedMarkers.map(marker => marker.position));
    };

    const removeMarker = (id: number) => {
        const updatedMarkers = markers.filter(marker => marker.id !== id);
        const shiftedMarkers = updatedMarkers.map((marker, index) => ({
            ...marker,
            id: index + 1,
        }));
        updateMarkers(shiftedMarkers);
        setPolyline(shiftedMarkers.map(marker => marker.position));
        setEditID(null);
    };

    const markerEditMode = (id: number, map: Map | null) => {
        if (map) {
            const marker = markers.find(marker => marker.id === id);
            map.setView(marker ? marker.position : ({ lat: 0, lng: 0 } as LatLng), 19);
        }
        setEditID(id);
    };

    const getMarkerById = (id: number): { position: LatLng; alt: number; speed: number; drop: boolean } => {
        const marker = markers.find(marker => marker.id === id);

        let latitude = 0,
            longitude = 0,
            altitude = 0;
        if (marker) {
            altitude = Math.min(Math.max(marker.alt, -5), 400);
            latitude = Math.min(Math.max(marker.position.lat, -90), 90);
            longitude = Math.min(Math.max(marker.position.lng, -180), 180);
        }

        return marker
            ? {
                  position: { lat: latitude, lng: longitude } as LatLng,
                  alt: altitude,
                  speed: marker.speed,
                  drop: marker.drop,
              }
            : { position: { lat: 0, lng: 0 } as LatLng, alt: 0, speed: 0, drop: false };
    };

    const setMarker = (id: number, lat: number, lng: number, alt: number, speed: number, drop: boolean): void => {
        const updatedMarkers = markers.map(marker => {
            if (marker.id === id) {
                return {
                    ...marker,
                    position: { lat, lng } as LatLng,
                    alt: alt,
                    speed: speed,
                    drop: drop,
                };
            }
            return marker;
        });
        updateMarkers(updatedMarkers);
        setPolyline(updatedMarkers.map(marker => marker.position));
    };

    const validateAndClamp = (value: number, min: number, max: number): number => {
        if (isNaN(value)) {
            return min;
        }
        return Math.min(Math.max(value, min), max);
    };

    const uploadJson = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = () => {
            const file = input.files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    try {
                        const newMarkers = flightplanToMarkers(reader.result as string);
                        updateMarkers(newMarkers);
                        setPolyline(newMarkers.map(marker => marker.position));
                        uploadTriggered.current = true;
                    } catch (e) {
                        console.error(e);
                        setShowJson(true);
                        setErrorJson(true);
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
        input.remove();
    };

    const copyJson = () => {
        navigator.clipboard.writeText(fplanJson);
    };

    const downloadJson = () => {
        const a = document.createElement('a');
        const file = new Blob([fplanJson], { type: 'application/json' });
        a.href = URL.createObjectURL(file);
        const date = new Date().toISOString().split('T')[0];
        a.download = `fplan_${date}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    useEffect(() => {
        if (uploadTriggered.current) {
            markerEditMode(1, map);
            uploadTriggered.current = false;
        }
    }, [markers]);

    useEffect(() => {
        const index = parseInt(Settings.get('defaultMap'));
        setMapLink(layers[index].link);
    }, []);

    return (
        <div className={'w-full h-full bg-gray-900 relative'}>
            <MapContainer
                style={{ height: '500px', position: 'relative' }}
                center={[20, 0]}
                zoom={2}
                scrollWheelZoom={true}
                zoomAnimation={true}
                ref={setMap}
            >
                <TileLayer attribution={mapAttribution} url={mapLink} />
                <MapClickHandler onClick={handleMapClick} />
                {markers.map(marker => (
                    <Marker
                        key={marker.id}
                        position={marker.position}
                        icon={markerIcon}
                        draggable={true}
                        eventHandlers={{
                            dragend: (e: DragEndEvent) => handleMarkerDragEnd(marker.id, e),
                            click: () => markerEditMode(marker.id, map),
                        }}
                    ></Marker>
                ))}
                {polyline.length > 1 && <Polyline positions={polyline} color="#a21caf" />}
            </MapContainer>
            <div className="border-white/5 border-b py-2">
                <div className="flex items-center my-auto h-6">
                    <div className="flex-auto my-auto flex ml-3">
                        <label htmlFor="alt" className="text-gray-300 mr-3 md:hidden">
                            Alt:
                        </label>
                        <label htmlFor="alt" className="text-gray-300 mr-3 hidden md:block">
                            Altitude:
                        </label>
                        {/* Styling is still bad on this slider because...sliders are just awful to style (please fix this Tailwind/CSS in general) but it looks okay for now */}
                        <input
                            type="range"
                            name="alt"
                            min={-5}
                            max={400}
                            step={5}
                            className="h-6 rounded-full appearance-none bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all px-1"
                            value={defaultAlt}
                            onChange={event => setDefaultAlt(Number(event.target.value))}
                        />
                        {defaultAlt === -5 ? (
                            <span className="ml-2 inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30 transition-all">
                                Hold
                            </span>
                        ) : (
                            <span className="my-auto text-gray-300 ml-3 transition-all">{defaultAlt}ft</span>
                        )}
                    </div>
                    {/* settings dropdown */}
                    <div className="ml-5 sm:mt-0 flex-none mr-3 my-auto flex">
                        <PlusIcon
                            className="text-gray-500 w-6 h-6 mr-2 cursor-pointer hover:text-gray-400 duration-150 transition-all"
                            onClick={() => {
                                if (!map) {
                                    return;
                                }
                                const newMarker = {
                                    id: markers.length + 1,
                                    position: map.getCenter(),
                                    alt: defaultAlt,
                                    speed: defaultSpeed,
                                    drop: false,
                                };
                                updateMarkers([...markers, newMarker]);
                                setPolyline([...polyline, map.getCenter()]);
                                setEditID(markers.length + 1);
                            }}
                        />

                        <Menu as="div" className="relative inline-block text-left my-auto">
                            <div className="flex">
                                <Menu.Button>
                                    <Cog6ToothIcon className="text-gray-500 w-6 h-6 cursor-pointer hover:text-gray-400 duration-150 transition-all" />
                                </Menu.Button>
                            </div>
                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute py-1 right-0 z-10 divide-y divide-gray-700 mt-2 w-56 origin-top-right rounded-md bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                                    <div className="py-1">
                                        {layers.map(layer => (
                                            <Menu.Item key={layer.id}>
                                                {({ active }) => (
                                                    <a
                                                        onClick={() => {
                                                            setMapLink(layer.link);
                                                            setMapAttribution(layer.attribution);
                                                            Settings.set('defaultMap', layer.id.toString());
                                                        }}
                                                        className={classNames(
                                                            active || mapLink === layer.link
                                                                ? 'bg-gray-700 text-gray-100'
                                                                : 'text-gray-400',
                                                            'group flex items-center px-4 py-2 text-sm',
                                                        )}
                                                    >
                                                        <layer.icon
                                                            className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300"
                                                            aria-hidden="true"
                                                        />
                                                        {layer.name}
                                                    </a>
                                                )}
                                            </Menu.Item>
                                        ))}
                                    </div>
                                    <div className="py-1">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <NavLink
                                                    to={'/tools/settings'}
                                                    className={classNames(
                                                        active ? 'bg-gray-700 text-gray-100' : 'text-gray-400',
                                                        'group flex items-center px-4 py-2 text-sm',
                                                    )}
                                                >
                                                    <Cog6ToothIcon
                                                        className="mr-3 h-5 w-5 text-gray-400 group-hover:text-gray-300"
                                                        aria-hidden="true"
                                                    />
                                                    More Settings
                                                </NavLink>
                                            )}
                                        </Menu.Item>
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>
                    </div>
                </div>
            </div>
            {/* edit waypoint dock */}
            <Transition
                show={!!editID}
                enter="transition-opacity duration-250"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-250"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
            >
                <div className="flex transition-all duration-150 border-white/5 border-b">
                    <div className="mx-auto my-4">
                        <div className="md:col-span-2">
                            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-3xl sm:grid-cols-12">
                                <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:tracking-tight sm:col-span-1 my-auto">
                                    #{editID}
                                </h2>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="latitude"
                                        className="block text-sm font-medium leading-6 text-white"
                                    >
                                        Latitude
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="latitude"
                                            id="latitude"
                                            className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                            value={getMarkerById(editID ?? -1).position.lat}
                                            onChange={e => {
                                                const newLat = validateAndClamp(Number(e.target.value), -90, 90);
                                                setMarker(
                                                    editID ?? -1,
                                                    newLat,
                                                    getMarkerById(editID ?? -1).position.lng,
                                                    getMarkerById(editID ?? -1).alt,
                                                    getMarkerById(editID ?? -1).speed,
                                                    getMarkerById(editID ?? -1).drop,
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="longitude"
                                        className="block text-sm font-medium leading-6 text-white"
                                    >
                                        Longitude
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="longitude"
                                            id="longitude"
                                            className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                            value={getMarkerById(editID ?? -1).position.lng}
                                            onChange={e => {
                                                const newLng = validateAndClamp(Number(e.target.value), -180, 180);
                                                setMarker(
                                                    editID ?? -1,
                                                    getMarkerById(editID ?? -1).position.lat,
                                                    newLng,
                                                    getMarkerById(editID ?? -1).alt,
                                                    getMarkerById(editID ?? -1).speed,
                                                    getMarkerById(editID ?? -1).drop,
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="altitude"
                                        className="block text-sm font-medium leading-6 text-white"
                                    >
                                        Altitude
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            min={-5}
                                            max={400}
                                            name="altitude"
                                            id="altitude"
                                            className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                            value={getMarkerById(editID ?? -1).alt}
                                            onChange={e => {
                                                const newAlt = validateAndClamp(Number(e.target.value), -5, 400);
                                                setMarker(
                                                    editID ?? -1,
                                                    getMarkerById(editID ?? -1).position.lat,
                                                    getMarkerById(editID ?? -1).position.lng,
                                                    newAlt,
                                                    getMarkerById(editID ?? -1).speed,
                                                    getMarkerById(editID ?? -1).drop,
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-2">
                                    <label htmlFor="speed" className="block text-sm font-medium leading-6 text-white">
                                        Speed
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="number"
                                            min={1}
                                            max={100}
                                            name="speed"
                                            id="speed"
                                            className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                            value={getMarkerById(editID ?? -1).speed}
                                            onChange={e => {
                                                const newSpeed = validateAndClamp(Number(e.target.value), 1, 100);
                                                setMarker(
                                                    editID ?? -1,
                                                    getMarkerById(editID ?? -1).position.lat,
                                                    getMarkerById(editID ?? -1).position.lng,
                                                    getMarkerById(editID ?? -1).alt,
                                                    newSpeed,
                                                    getMarkerById(editID ?? -1).drop,
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-1">
                                    <label htmlFor="drop" className="block text-sm font-medium leading-6 text-white">
                                        Drop
                                    </label>
                                    <div className="ml-2 mt-3">
                                        <input
                                            type="checkbox"
                                            name="drop"
                                            id="drop"
                                            className="h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all checked:border-indigo-500 checked:bg-indigo-500 checked:before:bg-indigo-500"
                                            checked={getMarkerById(editID ?? -1).drop}
                                            onChange={e => {
                                                setMarker(
                                                    editID ?? -1,
                                                    getMarkerById(editID ?? -1).position.lat,
                                                    getMarkerById(editID ?? -1).position.lng,
                                                    getMarkerById(editID ?? -1).alt,
                                                    getMarkerById(editID ?? -1).speed,
                                                    e.target.checked,
                                                );
                                            }}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeMarker(editID ?? -1)}
                                    className="sm:col-span-2 mt-auto rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </Transition>
            <div className="bg-gray-900">
                <div className="mx-auto max-w-7xl">
                    <div className="bg-gray-900 py-10">
                        <div className="px-4 sm:px-6 lg:px-8">
                            <div className="sm:flex sm:items-center">
                                <div className="sm:flex-auto">
                                    <h1 className="text-base font-semibold leading-6 text-white">Waypoints</h1>
                                    <p className="mt-2 text-sm text-gray-300">
                                        A list of all waypoints in your flightplan
                                    </p>
                                </div>
                                <div className="mt-4 sm:ml-16 sm:mt-0 flex">
                                    <Switch.Group as="div" className="flex items-center">
                                        <Switch
                                            checked={showJson}
                                            onChange={setShowJson}
                                            className={classNames(
                                                showJson ? 'bg-indigo-600' : 'bg-white/5',
                                                'relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2',
                                            )}
                                        >
                                            <span
                                                aria-hidden="true"
                                                className={classNames(
                                                    showJson ? 'translate-x-5' : 'translate-x-0',
                                                    'pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-all duration-200 ease-in-out',
                                                )}
                                            />
                                        </Switch>
                                        <Switch.Label as="span" className="ml-3 text-sm">
                                            <span className="font-medium text-white">Show JSON</span>
                                        </Switch.Label>
                                    </Switch.Group>
                                </div>
                            </div>
                            <div className="mt-8 flow-root">
                                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                        {markers.length < 2 && !errorJson ? (
                                            <Alert type="info" className="flex mx-4 sm:mx-6 lg:mx-0">
                                                Please create at least 2 waypoints
                                                <span className="hidden md:block">, or&nbsp;</span>
                                                <a
                                                    className="hidden md:block cursor-pointer hover:text-sky-500"
                                                    onClick={uploadJson}
                                                >
                                                    click to upload a flightplan
                                                </a>
                                            </Alert>
                                        ) : showJson ? (
                                            <>
                                                {loadingJson ? (
                                                    <div className="relative w-full">
                                                        <img
                                                            src="../../loading.gif"
                                                            alt="Loading..."
                                                            className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto"
                                                        />
                                                    </div>
                                                ) : (
                                                    <>
                                                        {errorJson ? (
                                                            <Alert type="danger" className="mx-4 sm:mx-6 lg:mx-0">
                                                                Error generating JSON, please try again later
                                                            </Alert>
                                                        ) : (
                                                            <div className="relative w-full">
                                                                <textarea
                                                                    name="longitude"
                                                                    id="longitude"
                                                                    value={fplanJson}
                                                                    readOnly
                                                                    className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                                                />
                                                                {showJson && markers.length >= 2 && (
                                                                    <>
                                                                        <button
                                                                            type="button"
                                                                            onClick={copyJson}
                                                                            className="mt-3 w-full rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 cursor-pointer"
                                                                        >
                                                                            Copy
                                                                        </button>
                                                                        <button
                                                                            type="button"
                                                                            onClick={downloadJson}
                                                                            className="mt-3 w-full rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 cursor-pointer"
                                                                        >
                                                                            Download
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        )}
                                                    </>
                                                )}
                                            </>
                                        ) : (
                                            <table className="min-w-full divide-y divide-gray-700">
                                                <thead>
                                                    <tr>
                                                        <th
                                                            scope="col"
                                                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-white sm:pl-0"
                                                        >
                                                            ID
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                                        >
                                                            <div className="hidden md:block">Latitude</div>
                                                            <div className="md:hidden">Lat.</div>
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                                        >
                                                            <div className="hidden md:block">Longitude</div>
                                                            <div className="md:hidden">Long.</div>
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                                        >
                                                            <div className="hidden md:block">Distance</div>
                                                            <div className="md:hidden">Dist.</div>
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                                        >
                                                            <div className="hidden md:block">Altitude</div>
                                                            <div className="md:hidden">Alt.</div>
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                                        >
                                                            Speed
                                                        </th>
                                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                                            <span className="sr-only">Edit</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-800">
                                                    {markers.map((marker, index) => {
                                                        let distanceToPrevious;
                                                        if (index > 0) {
                                                            const previousMarker = markers[index - 1];
                                                            distanceToPrevious = calculateDistance(
                                                                marker.position.lat,
                                                                marker.position.lng,
                                                                previousMarker.position.lat,
                                                                previousMarker.position.lng,
                                                            );
                                                        }

                                                        return (
                                                            <tr key={marker.id}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                                                                    {marker.id}
                                                                    {marker.drop ? <i> (drop)</i> : ''}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                    <div className="hidden md:block">
                                                                        {marker.position.lat}
                                                                    </div>
                                                                    <div className="md:hidden">
                                                                        {`${marker.position.lat.toFixed(4)}...`}
                                                                    </div>
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                    <div className="hidden md:block">
                                                                        {marker.position.lng}
                                                                    </div>
                                                                    <div className="md:hidden">
                                                                        {`${marker.position.lng.toFixed(4)}...`}
                                                                    </div>
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                    {distanceToPrevious || ''}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                    {marker.alt === -5 ? (
                                                                        <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
                                                                            Hold
                                                                        </span>
                                                                    ) : (
                                                                        <>{marker.alt}ft</>
                                                                    )}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                    <>{marker.speed}kts</>
                                                                </td>
                                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                                    <a
                                                                        onClick={() => markerEditMode(marker.id, map)}
                                                                        className="text-indigo-400 hover:text-indigo-300 cursor-pointer"
                                                                    >
                                                                        Edit
                                                                        <span className="sr-only">, {marker.id}</span>
                                                                    </a>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MapElement;
