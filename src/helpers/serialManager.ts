export default class SerialManager {
    private port: SerialPort | null;
    private reader: ReadableStreamDefaultReader<Uint8Array> | undefined;

    private eventTarget: EventTarget;

    constructor() {
        this.port = null;
        this.reader = undefined;
        this.eventTarget = new EventTarget();
        navigator.serial.addEventListener('disconnect', () => {
            this.close();
            this.eventTarget.dispatchEvent(new Event('disconnect'));
        });
        navigator.serial.addEventListener('connect', () => {
            this.request().catch(() => {
                return;
            });
            this.eventTarget.dispatchEvent(new Event('connect'));
        });
    }

    // Raspberry Pi vendor ID
    private async request(vendorId = 0x2e8a): Promise<SerialPort> {
        const filters = [{ usbVendorId: vendorId }];
        try {
            const port = await navigator.serial.requestPort({ filters });
            return port;
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'NotFoundError') {
                    throw new Error('No compatible devices were found.');
                } else if (error.name === 'SecurityError') {
                    throw new Error('Device access permission denied, try again.');
                } else {
                    throw error;
                }
            } else {
                throw new Error('An unknown error occured.');
            }
        }
    }

    async open(vendorId = 0x2e8a): Promise<void> {
        const port = await this.request(vendorId);
        const [params] = [{ baudRate: 115200 }, { dataBits: 8 }, { stopBits: 1 }, { parity: 'none' }];
        this.port = port;
        await port.open(params);
        this.reader = port.readable?.getReader();
    }

    async close(): Promise<void> {
        if (this.port) {
            if (this.reader) await this.reader.cancel();
            await this.port.close();
            this.port = null;
            this.reader = undefined;
        }
    }

    async read(): Promise<string> {
        try {
            if (this.reader) {
                const { value, done } = await this.reader.read();
                if (done) {
                    throw new Error('Serial port closed.');
                }
                const textDecoder = new TextDecoder('utf-8');
                const text = textDecoder.decode(value);
                return text;
            } else {
                throw new Error('Serial port unavailable.');
            }
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to read from serial port: ${error.message}`);
            } else {
                throw new Error('An unknown error occurred.');
            }
        }
    }

    async write(data: string): Promise<void> {
        if (this.port?.writable) {
            const encoder = new TextEncoder();
            const writer = this.port.writable.getWriter();
            await writer.write(encoder.encode(data));
            writer.releaseLock();
        } else {
            this.close();
            throw new Error('Serial port unavailable.');
        }
    }

    async ping(maxRetries = 3, retryDelayMs = 500): Promise<boolean> {
        try {
            if (!this.port || !this.port.writable || !this.port.readable) {
                throw new Error('Serial port unavailable.');
            }

            for (let retry = 0; retry < maxRetries; retry++) {
                await this.write('PING\n');
                const response = await this.read();
                if (response.substring(0, 4) === 'PONG') {
                    return true;
                } else {
                    console.warn(`Unexpected PING response '${response}'`);
                }
                await new Promise(resolve => setTimeout(resolve, retryDelayMs));
            }
            throw new Error(`Failed to receive a valid response after ${maxRetries} retries.`);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to ping device: ${error.message}`);
            } else {
                throw new Error('An unknown error occurred.');
            }
        }
    }

    async sendCommand(command: string, timeoutMs = 0): Promise<string> {
        try {
            if (!this.port || !this.port.writable || !this.port.readable) {
                throw new Error('Serial port unavailable.');
            }

            await this.write(command + '\n');
            await new Promise(resolve => setTimeout(resolve, timeoutMs));
            const response = await this.read();
            return response;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to send command: ${error.message}`);
            } else {
                throw new Error('An unknown error occurred.');
            }
        }
    }

    addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        this.eventTarget.addEventListener(type, listener);
    }

    removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        this.eventTarget.removeEventListener(type, listener);
    }
}
