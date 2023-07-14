import { Fragment, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DragEndEvent, LatLng, LeafletMouseEvent, Map } from 'leaflet';
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
import generateMarkersJSON from '../helpers/generateMarkersJSON';
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
        id: 1,
        name: 'Google Hybrid',
        attribution: 'Imagery &copy; Google Satellite Imagery Sources, Map data &copy; 2023 Google',
        link: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
        icon: Square3Stack3DIcon,
    },
    {
        id: 2,
        name: 'Google Satellite',
        attribution: 'Imagery &copy; Google Satellite Imagery Sources, Map data &copy; 2023',
        link: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}',
        icon: GlobeAmericasIcon,
    },
    {
        id: 3,
        name: 'Google Map',
        attribution: 'Map data &copy; 2023 Google',
        link: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
        icon: MapIcon,
    },
    {
        id: 4,
        name: 'Open Street Map',
        attribution:
            'Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> and contributors',
        link: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
        icon: MapPinIcon,
    },
];

function MapElement() {
    const [markers, setMarkers] = useState<{ id: number; position: LatLng; alt: number }[]>([]);
    const [polyline, setPolyline] = useState<LatLng[]>([]);
    const [editID, setEditID] = useState<number | null>(null);
    const [showJson, setShowJson] = useState(false);
    const [map, setMap] = useState<Map | null>(null);
    const [mapLink, setMapLink] = useState(layers[0].link);
    const [mapAttribution, setMapAttribution] = useState(layers[0].attribution);
    const [defaultAlt, setDefaultAlt] = useState(20);

    const handleMapClick = (e: LeafletMouseEvent) => {
        const { latlng } = e;
        const newMarker = {
            id: markers.length + 1,
            position: latlng,
            alt: defaultAlt,
        };
        setMarkers([...markers, newMarker]);
        setPolyline([...polyline, latlng]);
    };

    function classNames(...classes: string[]) {
        return classes.filter(Boolean).join(' ');
    }

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
        setMarkers(updatedMarkers);

        setPolyline(updatedMarkers.map(marker => marker.position));
    };

    const removeMarker = (id: number) => {
        const updatedMarkers = markers.filter(marker => marker.id !== id);
        const shiftedMarkers = updatedMarkers.map((marker, index) => ({
            ...marker,
            id: index + 1,
        }));
        setMarkers(shiftedMarkers);
        setPolyline(shiftedMarkers.map(marker => marker.position));
        setEditID(null);
    };

    const marketEditMode = (id: number, map: Map | null) => {
        if (map) {
            const marker = markers.find(marker => marker.id === id);
            map.setView(marker ? marker.position : ({ lat: 0, lng: 0 } as LatLng), 19);
        }
        setEditID(id);
    };

    const getPositionById = (id: number): { position: LatLng; alt: number } => {
        const marker = markers.find(marker => marker.id === id);
        return marker
            ? { position: marker.position, alt: marker.alt }
            : { position: { lat: 0, lng: 0 } as LatLng, alt: 0 };
    };

    const setMarkerPosition = (id: number, lat: number, lng: number, alt: number): void => {
        const updatedMarkers = markers.map(marker => {
            if (marker.id === id) {
                return {
                    ...marker,
                    position: { lat, lng } as LatLng,
                    alt: alt,
                };
            }
            return marker;
        });
        setMarkers(updatedMarkers);
        setPolyline(updatedMarkers.map(marker => marker.position));
    };

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
                        draggable={true}
                        eventHandlers={{
                            dragend: (e: DragEndEvent) => handleMarkerDragEnd(marker.id, e),
                            click: () => marketEditMode(marker.id, map),
                        }}
                    ></Marker>
                ))}
                {polyline.length > 1 && <Polyline positions={polyline} color="#a21caf" />}
            </MapContainer>
            <div className="border-white/5 border-b py-2">
                <div className="flex items-center my-auto h-6">
                    <div className="flex-auto my-auto flex ml-2">
                        {/*i dont know how to style this */}
                        <input
                            type="range"
                            min={-5}
                            max={400}
                            step={5}
                            value={defaultAlt}
                            onChange={event => setDefaultAlt(Number(event.target.value))}
                        />
                        {defaultAlt === -5 ? (
                            <span className="ml-1 inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
                                Hold
                            </span>
                        ) : (
                            <span className="my-auto text-gray-300 ml-1">{defaultAlt}ft</span>
                        )}
                    </div>
                    {/* settings dropdown */}
                    <div className="ml-16 sm:mt-0 flex-none mr-2 my-auto flex">
                        <PlusIcon
                            className="text-gray-500 w-6 h-6 mr-1 cursor-pointer hover:text-gray-400 duration-150 transition-all"
                            onClick={() => {
                                if (!map) {
                                    return;
                                }
                                console.log(map.getCenter());
                                const newMarker = {
                                    id: markers.length + 1,
                                    position: map.getCenter(),
                                    alt: defaultAlt,
                                };
                                setMarkers([...markers, newMarker]);
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
                                                    to={'/planner/settings'}
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
            {/* edit paypoint dock */}
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
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="latitude"
                                        className="block text-sm font-medium leading-6 text-white"
                                    >
                                        Latitude
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                            value={getPositionById(editID ? editID : -1).position.lat}
                                            onChange={e => {
                                                const newLat = Number(e.target.value);
                                                if (!isNaN(newLat)) {
                                                    setMarkerPosition(
                                                        editID ? editID : -1,
                                                        newLat,
                                                        getPositionById(editID ? editID : -1).position.lng,
                                                        getPositionById(editID ? editID : -1).alt,
                                                    );
                                                }
                                            }}
                                            name="latitude"
                                            id="latitude"
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-3">
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
                                            value={getPositionById(editID ? editID : -1).position.lng}
                                            onChange={e => {
                                                const newLng = Number(e.target.value);
                                                if (!isNaN(newLng)) {
                                                    setMarkerPosition(
                                                        editID ? editID : -1,
                                                        getPositionById(editID ? editID : -1).position.lat,
                                                        newLng,
                                                        getPositionById(editID ? editID : -1).alt,
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="sm:col-span-3">
                                    <label
                                        htmlFor="altitude"
                                        className="block text-sm font-medium leading-6 text-white"
                                    >
                                        Altitude
                                    </label>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            name="altitude"
                                            id="altitude"
                                            className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                            value={getPositionById(editID ? editID : -1).alt}
                                            onChange={e => {
                                                const newAlt = Number(e.target.value);
                                                if (!isNaN(newAlt)) {
                                                    setMarkerPosition(
                                                        editID ? editID : -1,
                                                        getPositionById(editID ? editID : -1).position.lat,
                                                        getPositionById(editID ? editID : -1).position.lng,
                                                        newAlt,
                                                    );
                                                }
                                            }}
                                        />
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeMarker(editID ? editID : -1)}
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
                                    {showJson && markers.length >= 2 && (
                                        <button
                                            type="button"
                                            className="ml-2 rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 cursor-pointer"
                                        >
                                            Copy Json
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="mt-8 flow-root">
                                <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                                    <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                                        {markers.length < 2 ? (
                                            <Alert type="danger" className="mx-4 sm:mx-6 lg:mx-0">
                                                Please select at least 2 waypoints
                                            </Alert>
                                        ) : showJson ? (
                                            <textarea
                                                name="longitude"
                                                id="longitude"
                                                value={generateMarkersJSON(markers)}
                                                readOnly
                                                className="block w-full rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                            />
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
                                                            Latitude
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                                        >
                                                            Longitude
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                                        >
                                                            Distance
                                                        </th>
                                                        <th
                                                            scope="col"
                                                            className="px-3 py-3.5 text-left text-sm font-semibold text-white"
                                                        >
                                                            Altitude
                                                        </th>
                                                        <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                                                            <span className="sr-only">Edit</span>
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-800">
                                                    {markers.map((marker, index) => {
                                                        if (index === 0) {
                                                            return (
                                                                <tr key={marker.id}>
                                                                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                                                                        {marker.id}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                        {marker.position.lat}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                        {marker.position.lng}
                                                                    </td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300"></td>
                                                                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                        {marker.alt === -5 ? (
                                                                            <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
                                                                                Hold
                                                                            </span>
                                                                        ) : (
                                                                            <>{marker.alt} feet</>
                                                                        )}
                                                                    </td>
                                                                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                                        <a
                                                                            onClick={() =>
                                                                                marketEditMode(marker.id, map)
                                                                            }
                                                                            className="text-indigo-400 hover:text-indigo-300"
                                                                        >
                                                                            Edit
                                                                            <span className="sr-only">
                                                                                , {marker.id}
                                                                            </span>
                                                                        </a>
                                                                    </td>
                                                                </tr>
                                                            );
                                                        }

                                                        const previousMarker = markers[index - 1];
                                                        const distanceToPrevious = calculateDistance(
                                                            marker.position.lat,
                                                            marker.position.lng,
                                                            previousMarker.position.lat,
                                                            previousMarker.position.lng,
                                                        );

                                                        return (
                                                            <tr key={marker.id}>
                                                                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-white sm:pl-0">
                                                                    {marker.id}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                    {marker.position.lat}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                    {marker.position.lng}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                    {distanceToPrevious}
                                                                </td>
                                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-300">
                                                                    {marker.alt === -5 ? (
                                                                        <span className="inline-flex items-center rounded-md bg-blue-400/10 px-2 py-1 text-xs font-medium text-blue-400 ring-1 ring-inset ring-blue-400/30">
                                                                            Hold
                                                                        </span>
                                                                    ) : (
                                                                        <>{marker.alt} feet</>
                                                                    )}
                                                                </td>
                                                                <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                                                                    <a
                                                                        onClick={() => marketEditMode(marker.id, map)}
                                                                        className="text-indigo-400 hover:text-indigo-300"
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