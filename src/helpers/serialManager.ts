export default class SerialManager {
    private port: SerialPort | null;
    private eventTarget: EventTarget;
    private isLocked: boolean;

    constructor() {
        this.port = null;
        this.eventTarget = new EventTarget();
        this.isLocked = false;
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

    private async request(vendorId = 0x2e8a): Promise<SerialPort> {
        const filters = [{ usbVendorId: vendorId }];
        try {
            const port = await navigator.serial.requestPort({ filters });
            return port;
        } catch (error) {
            if (error instanceof Error) {
                if (error.name === 'NotFoundError') {
                    throw new Error('No compatible devices found.');
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

    async open(vendorId = 0x2e8a, baudRate = 115200, dataBits = 8, stopBits = 1, parity = false): Promise<void> {
        const port = await this.request(vendorId);
        const [params] = [
            { baudRate: baudRate },
            { dataBits: dataBits },
            { stopBits: stopBits },
            { parity: parity ? 'true' : 'false' },
        ];
        this.port = port;
        await port.open(params);
    }

    async close(): Promise<void> {
        if (this.port) {
            await this.port.close();
            this.port = null;
        }
    }

    async read(timeoutMs: number): Promise<string> {
        try {
            if (this.port?.readable) {
                const reader = this.port.readable.getReader();
                this.isLocked = true;
                let text = '';
                const start = Date.now();
                while (Date.now() - start < timeoutMs) {
                    const { value, done } = await reader.read();
                    if (done) {
                        throw new Error('Serial port closed.');
                    }
                    text += new TextDecoder().decode(value);
                    if (text.includes('\n')) {
                        break;
                    }
                }
                reader.releaseLock();
                this.isLocked = false;
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
            this.isLocked = true;
            await writer.write(encoder.encode(data));
            writer.releaseLock();
            this.isLocked = false;
        } else {
            throw new Error('Serial port unavailable.');
        }
    }

    async sendCommand(command: string, waitMs = 200, readTimeoutMs = 500): Promise<string> {
        try {
            if (this.isLocked) {
                await new Promise(resolve => setTimeout(resolve, readTimeoutMs));
                return await this.sendCommand(command, waitMs, readTimeoutMs);
            }
            await this.write(command + '\n');
            await new Promise(resolve => setTimeout(resolve, waitMs));
            const response = await this.read(readTimeoutMs);
            // We want to filter out the status response if it's there but we also don't want to ignore it
            const match = response.match(/\npico-fbw (\d+)/);
            if (match) {
                const code = parseInt(match[1]);
                if (code !== 200) {
                    throw new Error(`Command failed with code ${code}`);
                }
                const responseText = response.substring(0, response.indexOf('\n'));
                return responseText;
            }
            return response;
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to send command: ${error.message}`);
            } else {
                throw new Error('An unknown error occurred.');
            }
        }
    }

    async ping(maxRetries = 5, retryDelayMs = 500): Promise<boolean> {
        try {
            for (let retry = 0; retry < maxRetries; retry++) {
                const response = await this.sendCommand('PING', 150);
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

    addEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        this.eventTarget.addEventListener(type, listener);
    }

    removeEventListener(type: string, listener: EventListenerOrEventListenerObject) {
        this.eventTarget.removeEventListener(type, listener);
    }
}
