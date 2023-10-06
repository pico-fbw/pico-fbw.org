import { useEffect, useState } from 'react';
import SerialManager from '../../helpers/serialManager';

interface ConfigData {
    sections: {
        name: string;
        keys: (number | string | null)[];
    }[];
}

interface DisplayConfigDataProps {
    serial: SerialManager | null;
    setSerialStatus: (status: string) => void;
}

const config = {
    General: [
        {
            name: 'Control Mode',
            id: 'controlMode',
            desc: 'The type of controls for your aircraft. Conventional uses the typical control layout with ailerons, elevators, and a rudder, while flying wing uses elevons and no rudder.',
        },
        {
            name: 'Switch Type',
            id: 'switchType',
            desc: 'The type of switch you are using, three-position is default and highly recommended.',
        },
        {
            name: 'Max Calibration Offset',
            id: 'maxCalibrationOffset',
            desc: 'The maximum value the system will accept as a calibration offset value for PWM input signals. Increase this value if you are experiencing error FBW-500, however note you may be unprotected from bad calibration data.',
        },
        {
            name: 'Servo HZ',
            id: 'servoHz',
            desc: 'The frequency to run your servos at (most are 50).',
        },
        {
            name: 'ESC HZ',
            id: 'escHz',
            desc: 'The frequency to run your ESC at (most are 50).',
        },
        {
            name: 'API Enabled',
            id: 'apiEnabled',
            desc: 'Whether or not to enable the API.',
        },
        {
            name: 'Use Network Password',
            id: 'wiflyUsePass',
            desc: 'Whether or not to use a password on the Wi-Fly network. If disabled, the network will appear as "open".',
        },
        {
            name: 'Skip Calibration',
            id: 'skipCalibration',
            desc: 'Whether or not to skip calibration of critical systems on bootup. If enabled, no calibration will be performed and thus the systems will be disabled.',
        },
    ],

    Control: [
        {
            name: 'Control Sensitivity',
            id: 'controlSensitivity',
            desc: 'Values from the receiver are multiplied by this in normal mode. Smaller values mean handling will be more sluggish like a larger plane, and larger values mean handling will be more agile like a typical RC plane. This must be quite a small value--the setpoint is calculated many times per second!',
        },
        {
            name: 'Rudder Sensitivity',
            id: 'rudderSensitivity',
            desc: 'Decides how much the aileron input is scaled up/down to become the rudder input during turns, does not apply during direct mode.',
        },
        {
            name: 'Control Deadband',
            id: 'controlDeadband',
            desc: 'If the degree reading from any of the inputs is below this value, the inputs will be disregarded, does not apply during direct mode.',
        },
        {
            name: 'Throttle IDLE Detent',
            id: 'throttleDetentIdle',
            desc: 'Most ESCs have a cutout; the motor does not start spinning exactly after 0%, so set the actual idle here.',
        },
        {
            name: 'Throttle MCT Detent',
            id: 'throttleDetentMCT',
            desc: 'Maximum throttle that is allowed for an extended period of time.',
        },
        {
            name: 'Throttle MAX Detent',
            id: 'throttleDetentMax',
            desc: 'Maximum throttle that is allowed for a short duration, set in the `Throttle MAX Time`.',
        },
        {
            name: 'Throttle MAX Time',
            id: 'throttleMaxTime',
            desc: 'The maximum time in seconds that the throttle can be held at `Throttle MAX` before `Throttle MCT` must be set.',
        },
    ],

    Limits: [
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
            name: 'Pitch Upper Limit',
            id: 'pitchUpperLimit',
            desc: 'The maximum pitch angle that the system will hold and stabilize, nothing higher is allowed.',
        },
        {
            name: 'Pitch Lower Limit',
            id: 'pitchLowerLimit',
            desc: 'The minimum pitch angle that the system will hold and stabilize, nothing lower is allowed. This value DOES need to be negative!',
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
    ],

    FlyingWing: [
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
        {
            name: '',
            id: '',
            desc: '',
        },
        {
            name: '',
            id: '',
            desc: '',
        },
        {
            name: '',
            id: '',
            desc: '',
        },
        {
            name: '',
            id: '',
            desc: '',
        },
        {
            name: '',
            id: '',
            desc: '',
        },
    ],

    Pins0: [
        {
            name: 'Aileron Input',
            id: 'inputAil',
            desc: 'Pin that the PWM signal wire from the receiver AILERON channel is connected to.',
        },
        {
            name: 'Aileron Servo',
            id: 'servoAil',
            desc: 'Pin that the PWM wire on the AILERON servo is connected to.',
        },
        {
            name: 'Elevator Input',
            id: 'inputElev',
            desc: 'Pin that the PWM signal wire from the receiver ELEVATOR channel is connected to.',
        },
        {
            name: 'Elevator Servo',
            id: 'servoElev',
            desc: 'Pin that the PWM wire on the ELEVATOR servo is connected to.',
        },
        {
            name: 'Rudder Input',
            id: 'inputRud',
            desc: 'Pin that the PWM signal wire from the receiver RUDDER channel is connected to.',
        },
        {
            name: 'Rudder Servo',
            id: 'servoRud',
            desc: 'Pin that the PWM wire on the RUDDER servo is connected to.',
        },
        {
            name: 'Switch Input',
            id: 'inputSwitch',
            desc: 'Pin that the PWM signal wire from the receiver SWITCH channel is connected to.',
        },
        {
            name: '',
            id: '',
            desc: '',
        },
    ],

    Pins1: [
        {
            name: 'Throttle Input',
            id: 'inputThrottle',
            desc: 'Pin that the PWM signal wire from the receiver THROTTLE channel is connected to.',
        },
        {
            name: 'Throttle ESC',
            id: 'escThrottle',
            desc: 'Pin that the PWM wire on the THROTTLE ESC is connected to.',
        },
        {
            name: 'Elevon Left Servo',
            id: 'servoElevonL',
            desc: 'Pin that the PWM wire on the ELEVON LEFT servo is connected to.',
        },
        {
            name: 'Elevon Right Servo',
            id: 'servoElevonR',
            desc: 'Pin that the PWM wire on the ELEVON RIGHT servo is connected to.',
        },
        {
            name: 'Reverse Roll',
            id: 'reverseRoll',
            desc: 'Reverses the roll direction.',
        },
        {
            name: 'Reverse Pitch',
            id: 'reversePitch',
            desc: 'Reverses the pitch direction.',
        },
        {
            name: 'Reverse Yaw',
            id: 'reverseYaw',
            desc: 'Reverses the yaw direction.',
        },
        {
            name: '',
            id: '',
            desc: '',
        },
    ],

    Sensors: [
        {
            name: 'IMU Model',
            id: 'imuModel',
            desc: 'The model of the IMU that is being used.',
        },
        {
            name: 'IMU SDA Pin',
            id: 'imuSda',
            desc: "The SDA pin on the IMU. Note that this must line up with the Pico's I2C0 interface, see a pinout if you're not sure!",
        },
        {
            name: 'IMU SCL Pin',
            id: 'imuScl',
            desc: "The SCL pin on the IMU. Note that this must line up with the Pico's I2C0 interface, see a pinout if you're not sure!",
        },
        {
            name: 'GPS Enabled',
            id: 'gpsEnabled',
            desc: 'Whether or not to enable the GPS. There are no module types, almost all GPS modules use the NMEA-0183 standard so that is what is supported here.',
        },
        {
            name: 'GPS Baudrate',
            id: 'gpsBaudrate',
            desc: 'The baudrate of the GPS. Almost all GPS modules use either 4600 or 9600 baud rates with 9600 being more common. Check the documentation of your GPS module and find its baudrate if you are experiencing communication issues.',
        },
        {
            name: 'GPS Command Type',
            id: 'gpsCommandType',
            desc: "The command type of the GPS. Please let me know if there's a command type you would like supported! MTK appears to be the most common.",
        },
        {
            name: 'GPS TX Pin',
            id: 'gpsTx',
            desc: 'The TX pin of the GPS.',
        },
        {
            name: 'GPS RX Pin',
            id: 'gpsRx',
            desc: 'The RX pin of the GPS.',
        },
    ],

    PID0: [
        {
            name: 'Roll Tau',
            id: 'rollTau',
            desc: '',
        },
        {
            name: 'Roll Integrator Minimum',
            id: 'rollIntegMin',
            desc: '',
        },
        {
            name: 'Roll Integrator Maximum',
            id: 'rollIntegMax',
            desc: '',
        },
        {
            name: 'Roll kT',
            id: 'rollKt',
            desc: '',
        },
        {
            name: 'Pitch Tau',
            id: 'pitchTau',
            desc: '',
        },
        {
            name: 'Pitch Integrator Minimum',
            id: 'pitchIntegMin',
            desc: '',
        },
        {
            name: 'Pitch Integrator Maximum',
            id: 'pitchIntegMax',
            desc: '',
        },
        {
            name: 'Pitch kT',
            id: 'pitchKt',
            desc: '',
        },
    ],

    PID1: [
        {
            name: 'Yaw kP',
            id: 'yawKp',
            desc: '',
        },
        {
            name: 'Yaw kI',
            id: 'yawKi',
            desc: '',
        },
        {
            name: 'Yaw kD',
            id: 'yawKd',
            desc: '',
        },
        {
            name: 'Yaw Tau',
            id: 'yawTau',
            desc: '',
        },
        {
            name: 'Yaw Integrator Minimum',
            id: 'yawIntegMin',
            desc: '',
        },
        {
            name: 'Yaw Integrator Maximum',
            id: 'yawIntegMax',
            desc: '',
        },
        {
            name: 'Yaw kT',
            id: 'yawKt',
            desc: '',
        },
        {
            name: '',
            id: '',
            desc: '',
        },
    ],

    Debug: [
        {
            name: 'Debug Enabled',
            id: 'debug',
            desc: 'Whether the current firmware build is considered a debug build. This value may be modified, but will be reset upon the next reboot.',
        },
        {
            name: 'Debug: FBW',
            id: 'debug_fbw',
            desc: 'Enables miscellaneous logs, warnings, and error statements.',
        },
        {
            name: 'Debug: IMU',
            id: 'debug_imu',
            desc: 'Enables more specific logs, warnings, and errors pertaining to the IMU.',
        },
        {
            name: 'Debug: GPS',
            id: 'debug_gps',
            desc: 'Enables more specific logs, warnings, and errors pertaining to the GPS.',
        },
        {
            name: 'Debug: Wi-Fly',
            id: 'debug_wifly',
            desc: 'Enables more specific logs, warnings, and errors pertaining to Wi-Fly.',
        },
        {
            name: 'Debug: Network',
            id: 'debug_network',
            desc: 'Enables more specific logs, warnings, and errors pertaining to the network stack.',
        },
        {
            name: 'Debug: Network Dump',
            id: 'dump_network',
            desc: 'Dumps the contents of Wi-Fly network communication.',
        },
        {
            name: 'Watchdog Timeout',
            id: 'watchdog_timeout_ms',
            desc: 'The maximum amount of time (in ms) that the system can run the main program loop without rebooting.',
        },
    ],

    Wifly: [
        {
            name: 'Network Name',
            id: 'ssid',
            desc: 'The name of the wireless network that Wi-Fly creates.',
        },
        {
            name: 'Network Password',
            id: 'pass',
            desc: 'The password for the wireless network that Wi-Fly creates. Must be at least eight characters long, and will only be used if `Use Network Password` is enabled in the `General` section.',
        },
    ],
};

function ConfigViewer({ serial, setSerialStatus }: DisplayConfigDataProps) {
    const [data, setData] = useState<ConfigData | null>(null);

    if (!serial) {
        setSerialStatus('No serial port available.');
        return;
    }

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

    const handleConfigChange = async (sectionName: string, sectionIndex: number, keyIndex: number, value: string) => {
        let toSet: number | string = value;
        let toSetNum = parseFloat(value);
        if (isNaN(toSetNum)) {
            if (value === '') {
                // Blank in a number field
                toSet = '0';
                toSetNum = 0;
            }
        } else {
            toSet = toSetNum;
        }
        setData(prevData => {
            if (!prevData) return null;
            const updatedData = { ...prevData };
            updatedData.sections[sectionIndex].keys[keyIndex] = toSet;
            return updatedData;
        });
        try {
            const keyId = config[sectionName as keyof typeof config][keyIndex].id;
            await serial.sendCommand(`SET_CONFIG ${sectionName} ${keyId} ${toSet}`, 50);
            const response = await serial.sendCommand(`GET_CONFIG ${sectionName} ${keyId}`, 50);
            const newc = JSON.parse(response)?.key;
            if (!newc || newc !== toSet) {
                console.warn(newc);
                console.warn(toSet);
                throw new Error('Failed to verify config change');
            }
        } catch (error) {
            if (error instanceof Error) {
                setSerialStatus(`Failed to set new config value.: ${error.message}`);
            }
        }
    };

    const handleSetConfig = async () => {
        try {
            await serial.sendCommand('SET_CONFIG', 400);
            if (JSON.stringify(JSON.parse(await serial.sendCommand('GET_CONFIG'))) !== JSON.stringify(data)) {
                console.error('Failed to verify config save');
                throw new Error('Failed to verify config save');
            }
        } catch (error) {
            if (error instanceof Error) {
                setSerialStatus(`Failed to save config: ${error.message}`);
            }
        }
    };

    useEffect(() => {
        getConfigData();
    }, []);

    return data ? (
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
                                            {config[section.name as keyof typeof config][keyIndex].name}
                                        </div>
                                        <div className="text-xs text-gray-400 mt-2">
                                            {config[section.name as keyof typeof config][keyIndex].desc}
                                        </div>
                                        <div className="mt-2">
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
                                                    )
                                                }
                                            />
                                        </div>
                                    </li>
                                ),
                        )}
                    </ul>
                </div>
            ))}
            <div className="mt-4">
                <button
                    onClick={() => {
                        handleSetConfig();
                    }}
                    className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-semibold rounded-md shadow-md hover:shadow-lg"
                >
                    Save config
                </button>
            </div>
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
