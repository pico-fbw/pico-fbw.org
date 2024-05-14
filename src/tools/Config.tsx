import { useEffect, useState } from 'react';
import SerialManager from '../helpers/serialManager';
import Alert from '../elements/Alert';
import ConfigViewer from '../elements/ConfigViewer';
import PageContentBlock from '../elements/PageContentBlock';

enum SerialStatus {
    DISCONNECTED = 'disconnected',
    CONNECTING = 'connecting',
    CONNECTED = 'open',
}

interface DeviceInfo {
    version: string;
    version_api: string;
    version_fplan: string;
    platform: string;
    platform_version: string;
}

export default function Config() {
    const [port, setPort] = useState<SerialManager | null>(null);
    const [serialStatus, setSerialStatus] = useState<string>(SerialStatus.DISCONNECTED);
    const [deviceInfo, setDeviceInfo] = useState<DeviceInfo | null>(null);

    function serialSupported() {
        return 'serial' in navigator;
    }

    async function attemptSerialConnection(serial: SerialManager | null) {
        if (serial) {
            try {
                await serial.open();
                setSerialStatus(SerialStatus.CONNECTING);
                await serial.ping();
                const info = await serial.sendCommand('GET_INFO');
                setDeviceInfo(JSON.parse(info));
                setSerialStatus(SerialStatus.CONNECTED);
            } catch (error) {
                if (error instanceof Error) {
                    setSerialStatus(error.toString());
                }
            }
        }
    }

    useEffect(() => {
        if (serialSupported()) {
            const serial = new SerialManager();
            setPort(serial);
            attemptSerialConnection(serial);
            serial.addEventListener('connect', () => {
                setSerialStatus(SerialStatus.DISCONNECTED);
            });
            serial.addEventListener('disconnect', () => {
                setSerialStatus(SerialStatus.DISCONNECTED);
            });
            return () => {
                serial.close();
                serial.removeEventListener('connect', () => {
                    setSerialStatus(SerialStatus.DISCONNECTED);
                });
                serial.removeEventListener('disconnect', () => {
                    setSerialStatus(SerialStatus.DISCONNECTED);
                });
            };
        }
    }, []);

    return (
        <>
            <PageContentBlock sidebar title={'pico-fbw | Config Editor'}>
                <div className="divide-y divide-white/5">
                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <h2 className="text-2xl font-bold leading-7 text-sky-500 sm:text-3xl sm:tracking-tight sm:col-span-1 my-auto">
                            Config Editor
                            <span className="bg-blue-500/10 text-blue-400 ring-1 ring-inset ring-blue-400/30 text-sm font-semibold me-2 px-1.5 py-0.5 rounded ms-3 relative top-[-5px]">
                                Beta
                            </span>
                        </h2>
                        <div className="sm:col-span-3 space-y-6">
                            {serialSupported() ? (
                                <>
                                    {serialStatus === SerialStatus.CONNECTED ? (
                                        <div className="flex flex-col">
                                            <div className="flex-grow">
                                                <ConfigViewer serial={port} setSerialStatus={setSerialStatus} />
                                            </div>
                                            <footer className="bg-gray-900 text-gray-500 p-4">
                                                <div className="w-full max-w-screen-xl mx-auto">
                                                    <hr className="my-6 border-gray-700" />
                                                    <span className="block text-sm text-gray-500 text-center">
                                                        {deviceInfo ? (
                                                            <>
                                                                {deviceInfo.platform} v{deviceInfo.platform_version} |{' '}
                                                                {deviceInfo.version} | API v{deviceInfo.version_api}
                                                            </>
                                                        ) : (
                                                            <>No device information available</>
                                                        )}
                                                    </span>
                                                </div>
                                            </footer>
                                        </div>
                                    ) : serialStatus === 'connecting' ? (
                                        <>
                                            <div className="relative w-full">
                                                <img
                                                    src="../../loading.gif"
                                                    alt="Loading..."
                                                    className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 mx-auto"
                                                />
                                            </div>
                                        </>
                                    ) : serialStatus === SerialStatus.DISCONNECTED ? (
                                        <>
                                            <Alert type="info" className="mx-4 sm:mx-6 lg:mx-0">
                                                Disconnected.
                                            </Alert>
                                            <button
                                                type="button"
                                                onClick={() => attemptSerialConnection(port)}
                                                className="mt-3 w-full rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 cursor-pointer"
                                            >
                                                Reconnect
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Alert type="warning" className="mx-4 sm:mx-6 lg:mx-0">
                                                {serialStatus}
                                            </Alert>
                                            <button
                                                type="button"
                                                onClick={() => attemptSerialConnection(port)}
                                                className="mt-3 w-full rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 cursor-pointer"
                                            >
                                                Connect
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Alert type="danger" className="mx-4 sm:mx-6 lg:mx-0">
                                        <span>
                                            Your browser does not support WebSerial, which is required for the config
                                            editor. Please switch to a&nbsp;
                                            <a
                                                href="https://developer.mozilla.org/en-US/docs/Web/API/Serial#browser_compatibility"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline hover:underline"
                                            >
                                                compatible browser
                                            </a>
                                            .
                                        </span>
                                    </Alert>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </PageContentBlock>
        </>
    );
}
