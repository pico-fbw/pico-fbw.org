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

    private async request(): Promise<SerialPort> {
        try {
            const port = await navigator.serial.requestPort();
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

    async open(baudRate = 115200, dataBits = 8, stopBits = 1, parity = false): Promise<void> {
        const port = await this.request();
        const [params] = [
            { baudRate: baudRate },
            { dataBits: dataBits },
            { stopBits: stopBits },
            { parity: parity ? 'true' : 'false' },
        ];
        this.port = port;
        await port.open(params);
        // Many esp32 devboards have the DTR and RTS pins connected to the EN and IO0 pins,
        // so the chip will reset when the port is opened.
        // Webserial doesn't provide a way to control these on init (only later), so the current solution
        // is just to be very lenient with how many ping attempts we make.
        // Not too much of an issue anyway considering the esp32 has its own wifi based config editor, but still notable.
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
                const code = Number(match[1]);
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

    async ping(maxRetries = 50, retryDelayMs = 150): Promise<boolean> {
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
