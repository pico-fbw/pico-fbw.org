import Alert from '../Alert';

export interface ConfigData {
    sections: {
        name: string;
        keys: (number | null)[];
    }[];
}

// TODO: finish keys and descriptions

const keys = [
    'Control mode',
    'Switch type',
    'Max calibration offset',
    'Servo HZ',
    'ESC HZ',
    'API enabled',
    'Use network password',
    'Skip calibration',
    'Control sensitivity',
    'Rudder sensitivity',
    'Control deadband',
    'Throttle IDLE detent',
    'Throttle MCT detent',
    'Throttle MAX detent',
    'Throttle MAX time',
    '',
    'Roll limit',
    // ...
];

const descriptions = [
    'The type of controls for your aircraft. Conventional uses the typical control layout with ailerons, elevators, and a rudder, while flying wing uses elevons and no rudder.',
    'The type of switch you are using, three-position is default and highly recomended.',
    'The maximum value the system will accept as a calibration offset value for PWM input signals. Increase this value if you are experiening error FBW-500, however note you may be unprotected from bad calibration data.',
    // ...
];

interface DisplayConfigDataProps {
    data: ConfigData | null;
}

function ConfigViewer({ data }: DisplayConfigDataProps) {
    if (!data) {
        return (
            <Alert type="danger" className="mx-4 sm:mx-6 lg:mx-0">
                No configuration data available.
            </Alert>
        );
    }

    return (
        <div className="divide-y divide-white/5">
            {data.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="py-6">
                    <h3 className="text-xl font-bold leading-6 text-sky-500">{section.name}</h3>
                    <ul className="mt-4 space-y-4">
                        {section.keys.map(
                            (value, keyIndex) =>
                                value !== null && (
                                    <li key={keyIndex} className="bg-gray-800 p-4 rounded-md shadow-md">
                                        <div className="text-xl font-semibold text-white">
                                            {keys[sectionIndex * section.keys.length + keyIndex]}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-2">
                                            {descriptions[sectionIndex * section.keys.length + keyIndex]}
                                        </div>
                                        <div className="mt-2">
                                            <input
                                                type="text"
                                                className="block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-opacity-50"
                                                value={value.toString()}
                                                onChange={e => {
                                                    // TODO: Handle value change to serial here
                                                }}
                                            />
                                        </div>
                                    </li>
                                ),
                        )}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default ConfigViewer;
