import { useState } from 'react';
import PageContentBlock from '../elements/PageContentBlock';
import Settings from '../helpers/settings';

export default function Setting() {
    const [gpsNumOffsetSamples, setGpsNumOffsetSamples] = useState(Number(Settings.get('altNumOffsetSamples')));
    const [defaultSpeed, setDefaultSpeed] = useState(Number(Settings.get('defaultSpeed')));
    const [dropSecsRelease, setDropSecsRelease] = useState(Number(Settings.get('dropSecsRelease')));
    const [configAutoSave, setConfigAutoSave] = useState(Settings.get('configAutoSave'));

    return (
        <>
            <PageContentBlock title={'pico-fbw | Settings'}>
                <div className="divide-y divide-white/5">
                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <h2 className="text-2xl font-bold leading-7 text-sky-500 sm:text-3xl sm:tracking-tight sm:col-span-1 my-auto">
                            Settings
                        </h2>
                        <div className="sm:col-span-3 space-y-6">
                            <h3 className="text-xl font-bold leading-6 text-sky-500">Altitude Offset Samples</h3>
                            <p className="text-sm font-medium text-gray-200 w-auto">
                                Choose how the autopilot system determines altitude:
                                <br /> <br />
                                <b>- 0:</b> Altitude is pre-calculated based on a database (accuracy within 100 feet,
                                more applicable for hilly areas or high flying).
                                <br />
                                <b>- 1-100 (default 10):</b> Uses GPS/barometric altitude as an offset for more precise
                                altitude control during flight (more applicable for flatter areas and lower flying).
                                <br /> <br />
                                Note that higher values will require additional time before auto mode may be engaged,
                                especially for systems that rely on GPS for altitude.
                            </p>

                            <div>
                                <input
                                    type="number"
                                    id="setting0"
                                    name="setting0"
                                    className="block rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                    value={gpsNumOffsetSamples}
                                    onChange={e => {
                                        let setting = Number(e.target.value);
                                        if (!isNaN(setting)) {
                                            setting = Math.min(Math.max(Number(e.target.value), 0), 100);
                                            setGpsNumOffsetSamples(setting);
                                            Settings.set('altNumOffsetSamples', String(setting));
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3 space-y-6">
                            <h3 className="text-xl font-bold leading-6 text-sky-500">Default Waypoint Speed</h3>
                            <p className="text-sm font-medium text-gray-200 w-auto">
                                The default speed (in knots) to set at each waypoint. This is measured as the speed over
                                the ground, not as airspeed.
                            </p>

                            <div>
                                <input
                                    type="number"
                                    id="setting1"
                                    name="setting1"
                                    className="block rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                    value={defaultSpeed}
                                    onChange={e => {
                                        let setting = Number(e.target.value);
                                        if (!isNaN(setting)) {
                                            setting = Math.min(Math.max(Number(e.target.value), 1), 100);
                                            setDefaultSpeed(setting);
                                            Settings.set('defaultSpeed', String(setting));
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3 space-y-6">
                            <h3 className="text-xl font-bold leading-6 text-sky-500">Drop Release Time</h3>
                            <p className="text-sm font-medium text-gray-200 w-auto">
                                The number of seconds the drop mechanism will stay released for, after a drop is
                                initiated.
                                <br />
                                Setting this to -1 will keep the mechanism open indefinetly after a drop occurs.
                            </p>

                            <div>
                                <input
                                    type="number"
                                    id="setting2"
                                    name="setting2"
                                    className="block rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                    value={dropSecsRelease}
                                    onChange={e => {
                                        let setting = Number(e.target.value);
                                        if (!isNaN(setting)) {
                                            setting = Math.min(Math.max(Number(e.target.value), -1), 60);
                                            if (setting === 0) setting = -1;
                                            setDropSecsRelease(setting);
                                            Settings.set('dropSecsRelease', String(setting));
                                        }
                                    }}
                                />
                            </div>
                        </div>
                        <div className="sm:col-span-3 space-y-6">
                            <h3 className="text-xl font-bold leading-6 text-sky-500">Config Auto-Save</h3>
                            <p className="text-sm font-medium text-gray-200 w-auto">
                                Whether the config editor will auto-save your edits after changes are made.
                            </p>

                            <div>
                                <select
                                    id="setting3"
                                    name="setting3"
                                    className="block rounded-md border-0 bg-white/5 px-2 py-1.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                                    value={configAutoSave}
                                    onChange={e => {
                                        const setting = e.target.value;
                                        setConfigAutoSave(setting);
                                        Settings.set('configAutoSave', String(setting));
                                    }}
                                >
                                    <option value="0">Disabled</option>
                                    <option value="1">Enabled</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </PageContentBlock>
        </>
    );
}
