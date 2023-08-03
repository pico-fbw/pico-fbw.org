import { useState } from 'react';
import PageContentBlock from '../elements/planner/PageContentBlock';
import settings from '../helpers/settings';

export default function Settings() {
    const [gpsNumOffsetSamples, setGpsNumOffsetSamples] = useState(
        Number(settings.get(settings.setting.gpsNumOffsetSamples.name)),
    );

    return (
        <>
            <PageContentBlock title={'pico-fbw | Settings'}>
                <div className="divide-y divide-white/5">
                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <h2 className="text-2xl font-bold leading-7 text-sky-500 sm:text-3xl sm:tracking-tight sm:col-span-1 my-auto">
                            Settings
                        </h2>
                        <div className="sm:col-span-3 space-y-6">
                            <h3 className="text-xl font-bold leading-6 text-sky-500">GPS Number of Offset Samples</h3>
                            <p className="text-sm font-medium text-gray-500 w-auto">
                                The amount of samples the system will take on GPS initialization to calculate the
                                current altitude. Keep in mind that most GPS modules provide updates once per second, so
                                high values may take a while to complete. Valid values range from 0 to 100.
                                <br /> <br />
                                If zero, altitudes will be calculated before being sent to the system, but these are not
                                always accurate enough.
                            </p>
                            <div>
                                <input
                                    type="number"
                                    id="setting0"
                                    name="setting0"
                                    className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-auto pl-3 pr-2 py-1.5 shadow-sm sm:text-sm sm:leading-6 border-gray-300 rounded-md"
                                    value={gpsNumOffsetSamples}
                                    onChange={e => {
                                        let setting = Number(e.target.value);
                                        if (!isNaN(setting)) {
                                            setting = Math.min(Math.max(parseInt(e.target.value), 0), 100);
                                            setGpsNumOffsetSamples(setting);
                                            settings.set(settings.setting.gpsNumOffsetSamples.name, String(setting));
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </PageContentBlock>
        </>
    );
}
