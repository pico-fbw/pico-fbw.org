import { useEffect, useState } from 'react';
import Alert from '../elements/Alert';
import PageContentBlock from '../elements/planner/PageContentBlock';
import SerialManager from '../helpers/serialManager';

// TODO: setting for first-time onboarding to config editor with guided setup

const port = new SerialManager();

export default function Config() {
    const [serialStatus, setSerialStatus] = useState('closed');

    function serialSupported() {
        return 'serial' in navigator;
    }

    function attemptSerialConnection(serial: SerialManager) {
        serial
            .open()
            .then(() => {
                serial
                    .ping()
                    .then(result => {
                        if (result) {
                            setSerialStatus('open');
                            serial.sendCommand('GET_INFO').then(result => {
                                console.log(result);
                            });
                        }
                    })
                    .catch(error => {
                        setSerialStatus(error.toString());
                    });
            })
            .catch(error => {
                setSerialStatus(error.toString());
            });
    }

    useEffect(() => {
        if (serialSupported()) {
            attemptSerialConnection(port);
            port.addEventListener('connect', () => {
                setSerialStatus('closed');
            });
            port.addEventListener('disconnect', () => {
                setSerialStatus('closed');
            });
            return () => {
                port.close();
                port.removeEventListener('disconnect', () => {
                    setSerialStatus('closed');
                });
            };
        }
    }, []);

    return (
        <>
            <PageContentBlock title={'pico-fbw | Config Editor'}>
                <div className="divide-y divide-white/5">
                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <h2 className="text-2xl font-bold leading-7 text-sky-500 sm:text-3xl sm:tracking-tight sm:col-span-1 my-auto">
                            Config Editor
                        </h2>
                        <div className="sm:col-span-3 space-y-6">
                            {serialSupported() ? (
                                <>
                                    {serialStatus === 'open' ? (
                                        <div>
                                            <Alert type="info">Serial open</Alert>
                                            {/* TODO */}
                                        </div>
                                    ) : serialStatus === 'closed' ? (
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
                                                {serialStatus.substring(serialStatus.indexOf(':') + 1)}
                                            </Alert>
                                            <button
                                                type="button"
                                                onClick={() => attemptSerialConnection(port)}
                                                className="mt-3 w-full rounded-md bg-white/10 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-white/20 cursor-pointer"
                                            >
                                                Reconnect
                                            </button>
                                        </>
                                    )}
                                </>
                            ) : (
                                <>
                                    <Alert type="danger" className="mx-4 sm:mx-6 lg:mx-0">
                                        Your browser does not support WebSerial, which is required for the config
                                        editor.
                                    </Alert>
                                    <Alert type="warning" className="mx-4 sm:mx-6 lg:mx-0">
                                        <a
                                            href="https://developer.mozilla.org/en-US/docs/Web/API/Serial#browser_compatibility"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Please switch to a compatible browser (click to view a list).
                                        </a>
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
