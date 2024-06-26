import { useEffect, useState } from 'react';
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid';
import SerialManager from '../helpers/serialManager';
import Settings from '../helpers/settings';
import { unstable_usePrompt } from 'react-router-dom';

interface ConfigData {
    sections: {
        name: string;
        keys: (number | string)[];
    }[];
}

interface ConfigItem {
    name: string;
    id: string;
    desc: string;
    enumMap?: { [key: number]: string };
    readOnly?: boolean;
}

interface Config {
    General: ConfigItem[];
    Control: ConfigItem[];
    Pins: ConfigItem[];
    Sensors: ConfigItem[];
    System: ConfigItem[];
    WiFi: ConfigItem[];
}

interface DisplayConfigDataProps {
    serial: SerialManager | null;
    setSerialStatus: (status: string) => void;
}

const config: Config = {
    General: [
        {
            name: 'Control Mode',
            id: 'controlMode',
            desc: 'The type of controls for your aircraft. Conventional uses the typical control layout with ailerons, elevators, and a rudder, while flying wing uses elevons and no rudder.',
            enumMap: {
                0: 'Conventional (3-axis) with Autothrottle',
                1: 'Conventional (3-axis)',
                2: 'Rudderless (2-axis) with Autothrottle',
                3: 'Rudderless (2-axis)',
                4: 'Flying Wing with Autothrottle',
                5: 'Flying Wing',
            },
        },
        {
            name: 'Switch Type',
            id: 'switchType',
            desc: 'The type of switch you are using, three-position is default and highly recommended.',
            enumMap: {
                0: 'Two-position',
                1: 'Three-position',
            },
        },
        {
            name: 'Max Calibration Offset',
            id: 'maxCalibrationOffset',
            desc: 'The maximum value the system will accept as a calibration offset value for PWM input signals. Increase this value if you are experiencing error FBW-500, however note you may be unprotected from bad calibration data.',
        },
        {
            name: 'Servo Frequency',
            id: 'servoHz',
            desc: 'The frequency to run your servos at (most are 50) in Hz.',
        },
        {
            name: 'ESC Frequency',
            id: 'escHz',
            desc: 'The frequency to run your ESC at (most are 50) in Hz.',
        },
        {
            name: 'API Enabled',
            id: 'apiEnabled',
            desc: 'Whether or not to enable the API. Be aware that disabling this will prevent the use of the config editor.',
            enumMap: {
                0: 'Disabled',
                1: 'Enabled',
            },
        },
        {
            name: 'Wi-Fi Enabled',
            id: 'wifiEnabled',
            desc: 'Whether or not Wi-Fly is enabled. If you would like the network to be password-protected, select that option and configure the password in the `Wi-Fly` section.',
            enumMap: {
                0: 'Disabled',
                1: 'Enabled (no password)',
                2: 'Enabled (with password)',
            },
        },
        {
            name: 'Skip Calibration',
            id: 'skipCalibration',
            desc: 'Whether or not to skip calibration of critical systems on bootup. If skipped, no calibration will be performed and thus the skipped systems will be disabled.',
            enumMap: {
                0: "Don't skip",
                1: 'Skip',
            },
        },
    ],

    Control: [
        {
            name: 'Maximum Roll Rate',
            id: 'maxRollRate',
            desc: 'The maximum rate of roll that the system will allow, in degrees per second.',
        },
        {
            name: 'Maximum Pitch Rate',
            id: 'maxPitchRate',
            desc: 'The maximum rate of pitch that the system will allow, in degrees per second.',
        },
        {
            name: 'Rudder Sensitivity',
            id: 'rudderSensitivity',
            desc: '',
        },
        {
            name: 'Control Deadband',
            id: 'controlDeadband',
            desc: 'If the degree reading from any of the inputs is below this value, the inputs will be disregarded, does not apply during direct mode.',
        },
        {
            name: 'Throttle MAX Time',
            id: 'throttleMaxTime',
            desc: 'The maximum time in seconds that the throttle can be held above `Throttle MCT` before `Throttle MCT` must be set.',
        },
        {
            name: 'Throttle Cooldown Time',
            id: 'throttleCooldownTime',
            desc: 'The duration that must elapse after the throttle surpasses MCT before it is allowed to exceed MCT again.',
        },
        {
            name: 'Throttle Sensitivity',
            id: 'throttleSensitivity',
            desc: 'Determines the sensitivity (smoothness/responsiveness) of throttle commands. Values range from 0 to 1. Smaller values will result in more smooth and therefore less responsive throttle movements, and larger values will result in more responsive and aggressive throttle movements.',
        },
        {
            name: 'Drop Detent (Closed)',
            id: 'dropDetentClosed',
            desc: 'The value, in degrees (0-180), to set the drop servo to when closed.',
        },
        {
            name: 'Drop Detent (Open)',
            id: 'dropDetentOpen',
            desc: 'The value, in degrees (0-180), to set the drop servo to when open.',
        },
        {
            name: 'Roll Limit',
            id: 'rollLimit',
            desc: 'The maximum roll angle that the system will attempt to stabilize; a constant input is required to keep a roll within this and `Roll Limit Hold`.',
        },
        {
            name: 'Roll Limit Hold',
            id: 'rollLimitHold',
            desc: 'The maximum roll angle that the system will allow, nothing higher is allowed.',
        },
        {
            name: 'Pitch Lower Limit',
            id: 'pitchLowerLimit',
            desc: 'The minimum pitch angle that the system will hold and stabilize, nothing lower is allowed. This value DOES need to be negative!',
        },
        {
            name: 'Pitch Upper Limit',
            id: 'pitchUpperLimit',
            desc: 'The maximum pitch angle that the system will hold and stabilize, nothing higher is allowed.',
        },
        {
            name: 'Max Aileron Deflection',
            id: 'maxAilDeflection',
            desc: 'The maximum degree value the system is allowed to move the aileron servos to.',
        },
        {
            name: 'Max Elevator Deflection',
            id: 'maxElevDeflection',
            desc: 'The maximum degree value the system is allowed to move the elevator servos to.',
        },
        {
            name: 'Max Rudder Deflection',
            id: 'maxRudDeflection',
            desc: 'The maximum degree value the system is allowed to move the rudder servo to.',
        },
        {
            name: 'Max Elevon Deflection',
            id: 'maxElevonDeflection',
            desc: 'The maximum degree value the system is allowed to move the elevon servos to, if in the `Flying Wing` control mode.',
        },
        {
            name: 'Elevon Mixing Gain',
            id: 'elevonMixingGain',
            desc: 'The gain between the aileron and elevator channels for elevon mixing. For example, a value of 0.5 (the default) will result in the maximum travel of the elevons being reached when both full aileron and elevator are applied. Only half travel will be applied when only the aileron/elevator is applied. Increase this if you desire more elevon deflection when using only one input, but beware this can result in input saturation!',
        },
        {
            name: 'Aileron Mixing Bias',
            id: 'ailMixingBias',
            desc: 'The bias of the aileron input in elevon mixing.',
        },
        {
            name: 'Elevator Mixing Bias',
            id: 'elevMixingBias',
            desc: 'The bias of the elevator input in elevon mixing.',
        },
    ],

    Pins: [
        {
            name: 'Aileron Input',
            id: 'inputAil',
            desc: 'Pin that the PWM (signal) wire from the receiver AILERON channel is connected to.',
        },
        {
            name: 'Aileron Servo',
            id: 'servoAil',
            desc: 'Pin that the PWM (signal) wire on the AILERON/ELEVON LEFT servo is connected to, depending on the Control Mode.',
        },
        {
            name: 'Elevator Input',
            id: 'inputEle',
            desc: 'Pin that the PWM (signal) wire from the receiver ELEVATOR channel is connected to.',
        },
        {
            name: 'Elevator Servo',
            id: 'servoEle',
            desc: 'Pin that the PWM (signal) wire on the ELEVATOR/ELEVON RIGHT servo is connected to, depending on the Control Mode.',
        },
        {
            name: 'Rudder Input',
            id: 'inputRud',
            desc: 'Pin that the PWM (signal) wire from the receiver RUDDER channel is connected to.',
        },
        {
            name: 'Rudder Servo',
            id: 'servoRud',
            desc: 'Pin that the PWM (signal) wire on the RUDDER servo is connected to.',
        },
        {
            name: 'Throttle Input',
            id: 'inputThrottle',
            desc: 'Pin that the PWM (signal) wire from the receiver THROTTLE channel is connected to.',
        },
        {
            name: 'Throttle ESC',
            id: 'escThrottle',
            desc: 'Pin that the PWM (signal) wire on the THROTTLE ESC is connected to.',
        },
        {
            name: 'Switch Input',
            id: 'inputSwitch',
            desc: 'Pin that the PWM (signal) wire from the receiver SWITCH channel is connected to.',
        },
        {
            name: 'Bay Servo',
            id: 'servoBay',
            desc: 'Pin that the PWM (signal) wire on the BAY servo is connected to.',
        },
        {
            name: 'AAHRS SDA Pin',
            id: 'aahrsSda',
            desc: "The SDA pin of the AAHRS system (IMU + Baro). Note that this must line up with the Pico's I2C0 interface, see a pinout if you're not sure!",
        },
        {
            name: 'AAHRS SCL Pin',
            id: 'aahrsScl',
            desc: "The SCL pin of the AAHRS system (IMU + Baro). Note that this must line up with the Pico's I2C0 interface, see a pinout if you're not sure!",
        },
        {
            name: 'GPS TX Pin',
            id: 'gpsTx',
            desc: "The TX pin of the GPS. Note that this must line up with the Pico's UART1 interface, see a pinout if you're not sure!",
        },
        {
            name: 'GPS RX Pin',
            id: 'gpsRx',
            desc: "The RX pin of the GPS. Note that this must line up with the Pico's UART1 interface, see a pinout if you're not sure!",
        },
        {
            name: 'Reverse Roll',
            id: 'reverseRoll',
            desc: 'Reverses the direction of the roll servo.',
            enumMap: {
                0: 'Normal',
                1: 'Reversed',
            },
        },
        {
            name: 'Reverse Pitch',
            id: 'reversePitch',
            desc: 'Reverses the direction of the pitch servo.',
            enumMap: {
                0: 'Normal',
                1: 'Reversed',
            },
        },
        {
            name: 'Reverse Yaw',
            id: 'reverseYaw',
            desc: 'Reverses the direction of the yaw servo.',
            enumMap: {
                0: 'Normal',
                1: 'Reversed',
            },
        },
    ],

    Sensors: [
        {
            name: 'IMU Model',
            id: 'imuModel',
            desc: "The model of the IMU that is being used. Please let us know if there's an IMU you would like supported!",
            enumMap: {
                1: 'ICM20948',
            },
        },
        {
            name: 'Barometer Model',
            id: 'baroModel',
            desc: "The model of the barometer that is being used, if applicable. Can also be used to disable the barometer, which is the case by default. Please let us know if there's a barometer you would like supported!",
            enumMap: {
                0: 'Barometer Disabled',
                1: 'DPS310',
            },
        },
        {
            name: 'AAHRS Bus Frequency',
            id: 'aahrsBusFreq',
            desc: 'The frequency to be used on the AAHRS I2C bus, in KHz. The default is 400 KHz which should work for most devices, but you can try lowering it if you are experiencing issues.',
        },
        {
            name: 'GPS Command Type',
            id: 'gpsCommandType',
            desc: "The command type of the GPS, if applicable. Can also be used to disable the GPS. Please let us know if there's a command type you would like supported!",
            enumMap: {
                0: 'GPS Disabled',
                1: 'MTK',
            },
        },
        {
            name: 'GPS Baudrate',
            id: 'gpsBaudrate',
            desc: 'The baudrate of the GPS. Almost all GPS modules use either 4600 or 9600 baud rates with 9600 being more common. Check the documentation of your GPS module and find its baudrate if you are experiencing communication issues.',
        },
    ],

    WiFi: [
        {
            name: 'Network Name',
            id: 'ssid',
            desc: 'The name of the wireless network that Wi-Fly creates.',
        },
        {
            name: 'Network Password',
            id: 'pass',
            desc: 'The password for the wireless network that Wi-Fly creates. Must be at least eight characters long, and will only be used if `Wi-Fly Enabled` is set to `Enabled (with password)` in the `General` section.',
        },
    ],

    System: [
        {
            name: 'Use Display',
            id: 'useDisplay',
            desc: 'Whether or not to use the display, if supported.',
            enumMap: {
                0: 'Disabled',
                1: 'Enabled',
            },
        },
        {
            name: 'Debug',
            id: 'printFBW',
            desc: 'Enables miscellaneous logs, warnings, and error statements.',
            enumMap: {
                0: 'Disabled',
                1: 'Enabled',
            },
        },
        {
            name: 'Debug: AAHRS',
            id: 'printAAHRS',
            desc: 'Enables more specific logs, warnings, and errors pertaining to the AAHRS system.',
            enumMap: {
                0: 'Disabled',
                1: 'Enabled',
            },
        },
        {
            name: 'Debug: Aircraft',
            id: 'printAircraft',
            desc: "Enables more specific logs, warnings, and errors pertaining to the aicraft's flight.",
            enumMap: {
                0: 'Disabled',
                1: 'Enabled',
            },
        },
        {
            name: 'Debug: GPS',
            id: 'printGPS',
            desc: 'Enables more specific logs, warnings, and errors pertaining to the GPS.',
            enumMap: {
                0: 'Disabled',
                1: 'Enabled',
            },
        },
        {
            name: 'Debug: Network',
            id: 'printNetwork',
            desc: 'Enables more specific logs, warnings, and errors pertaining to the network stack.',
            enumMap: {
                0: 'Disabled',
                1: 'Enabled',
            },
        },
    ],
};

function ConfigViewer({ serial, setSerialStatus }: DisplayConfigDataProps) {
    const [data, setData] = useState<ConfigData | null>(null);
    const [unsavedChanges, setUnsavedChanges] = useState(false);
    const [sectionVisibility, setSectionVisibility] = useState<boolean[]>(
        data ? new Array(data.sections.length).fill(false) : [],
    );

    const autosave = Settings.get('configAutoSave') === '1';

    if (!serial) {
        setSerialStatus('No serial port available.');
        return;
    }

    const toggleSection = (sectionIndex: number) => {
        const newSectionVisibility = [...sectionVisibility];
        newSectionVisibility[sectionIndex] = !newSectionVisibility[sectionIndex];
        setSectionVisibility(newSectionVisibility);
    };

    const getConfigData = async () => {
        try {
            const response = await serial.sendCommand('GET_CONFIG');
            setData(JSON.parse(response));
        } catch (error) {
            console.error(error);
            if (error instanceof Error) {
                setSerialStatus(`Failed to retrieve config: ${error.message}`);
            }
        }
    };

    const handleSaveConfig = async () => {
        try {
            await serial.sendCommand('SET_CONFIG', 400);
            if (JSON.stringify(JSON.parse(await serial.sendCommand('GET_CONFIG'))) !== JSON.stringify(data)) {
                console.error('Failed to verify config save');
                throw new Error('Failed to verify config save');
            }
            setUnsavedChanges(false);
        } catch (error) {
            if (error instanceof Error) {
                setSerialStatus(`Failed to save config: ${error.message}`);
            }
        }
    };

    const handleConfigChange = async (
        sectionName: string,
        sectionIndex: number,
        keyIndex: number,
        value: string,
        write = true,
    ) => {
        let toSet: number | string = value;
        let toSetNum = parseFloat(value);
        if (write) {
            // Normalize fields if writing
            if (isNaN(toSetNum)) {
                if (value === '') {
                    // Blank in a number field
                    toSet = '0.0';
                    toSetNum = 0.0;
                }
            } else {
                toSet = toSetNum;
            }
        }
        setData(prevData => {
            if (!prevData) return null;
            const updatedData = { ...prevData };
            updatedData.sections[sectionIndex].keys[keyIndex] = toSet;
            return updatedData;
        });

        if (!write) return;

        try {
            const key = config[sectionName as keyof typeof config][keyIndex].id;
            const command = JSON.stringify({
                changes: [
                    {
                        section: sectionName,
                        key: key,
                        value: String(toSet),
                    },
                ],
                save: autosave,
            });

            await serial.sendCommand(`SET_CONFIG ${command}`, autosave ? 200 : 50);

            if (!autosave) {
                setUnsavedChanges(true);
            }

            const getConfigCommand = JSON.stringify({ section: sectionName, key: key });
            const response = await serial.sendCommand(`GET_CONFIG ${getConfigCommand}`, 50);
            const newc = JSON.parse(response)?.key;

            if ((!newc || newc !== toSet) && toSetNum !== 0) {
                console.warn(`Value read back was ${newc}, should have been ${toSet}`);
                throw new Error('Failed to verify config change, please try again');
            }
        } catch (error) {
            if (error instanceof Error) {
                setSerialStatus(`Failed to set new config value: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        getConfigData();
    }, []);
    unstable_usePrompt({
        when: unsavedChanges,
        message: 'You have unsaved changes to your config, are you sure you want to leave?',
    });
    return data ? (
        <div className="divide-y divide-white/5">
            {data.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="py-6">
                    <div
                        className="flex w-full items-start justify-between text-left text-white cursor-pointer"
                        onClick={() => toggleSection(sectionIndex)}
                    >
                        <span className="text-base font-semibold leading-7">
                            {section.name === 'WiFi' ? 'Wi-Fi' : section.name}
                        </span>
                        <span className="ml-6 flex h-7 items-center">
                            {sectionVisibility[sectionIndex] ? (
                                <MinusIcon className="h-6 w-6" aria-hidden="true" />
                            ) : (
                                <PlusIcon className="h-6 w-6" aria-hidden="true" />
                            )}
                        </span>
                    </div>
                    {sectionVisibility[sectionIndex] && (
                        <ul className="mt-4 space-y-4">
                            {section.keys.map(
                                (value, keyIndex) =>
                                    value !== null && (
                                        <li key={keyIndex} className="bg-gray-800 p-4 rounded-md shadow-md">
                                            <div className="text-xl font-semibold text-white">
                                                {config[section.name as keyof typeof config]?.[keyIndex]?.name}
                                            </div>
                                            <div className="text-xs text-gray-400 mt-2">
                                                {config[section.name as keyof typeof config]?.[keyIndex]?.desc}
                                            </div>
                                            <div className="mt-3">
                                                {config[section.name as keyof typeof config]?.[keyIndex]?.enumMap ? (
                                                    // Dropdown for enums
                                                    <select
                                                        className="block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-opacity-50"
                                                        disabled={
                                                            config[section.name as keyof typeof config][keyIndex]
                                                                .readOnly
                                                        }
                                                        value={value.toString()}
                                                        onChange={e =>
                                                            handleConfigChange(
                                                                section.name,
                                                                sectionIndex,
                                                                keyIndex,
                                                                e.target.value,
                                                                false,
                                                            )
                                                        }
                                                        onBlur={e =>
                                                            handleConfigChange(
                                                                section.name,
                                                                sectionIndex,
                                                                keyIndex,
                                                                e.target.value,
                                                                true,
                                                            )
                                                        }
                                                    >
                                                        {Object.entries(
                                                            config[section.name as keyof typeof config][keyIndex]
                                                                .enumMap!,
                                                        ).map(([enumKey, enumValue]) => (
                                                            <option key={enumKey} value={enumKey}>
                                                                {enumValue}
                                                            </option>
                                                        ))}
                                                    </select>
                                                ) : (
                                                    // Input for strings and numerical values
                                                    <input
                                                        type="text"
                                                        className="block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring focus:ring-opacity-50"
                                                        value={value.toString()}
                                                        onChange={e =>
                                                            handleConfigChange(
                                                                section.name,
                                                                sectionIndex,
                                                                keyIndex,
                                                                e.target.value,
                                                                false,
                                                            )
                                                        }
                                                        onBlur={e =>
                                                            handleConfigChange(
                                                                section.name,
                                                                sectionIndex,
                                                                keyIndex,
                                                                e.target.value,
                                                                true,
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </li>
                                    ),
                            )}
                        </ul>
                    )}
                </div>
            ))}
            {!autosave && (
                <div>
                    <button
                        onClick={() => {
                            handleSaveConfig();
                        }}
                        className="mt-6 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg"
                    >
                        Save config
                    </button>
                </div>
            )}
        </div>
    ) : (
        <div className="relative w-full">
            <img
                src="../../loading.gif"
                alt="Loading..."
                className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto"
            />
        </div>
    );
}

export default ConfigViewer;
