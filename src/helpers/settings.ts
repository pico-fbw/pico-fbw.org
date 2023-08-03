// I tried to use the react useCookies but it was causing too much trouble with components and stuff so L

export default class {
    static setting = {
        gpsNumOffsetSamples: { name: 'gpsNumOffsetSamples', defaultValue: '0' },
    } as const;

    static get(settingKey: keyof typeof this.setting): string {
        const name = this.setting[settingKey].name;
        const value = '; ' + document.cookie;
        const parts = value.split('; ' + name + '=');
        if (parts.length === 2) return parts.pop()?.split(';').shift() || '';

        // Cookie not yet set, initialize
        const defaultValue = this.setting[settingKey].defaultValue;
        this.set(settingKey, defaultValue);
        return defaultValue;
    }

    static set(settingKey: keyof typeof this.setting, value: string): void {
        const name = this.setting[settingKey].name;
        const expirationDate = new Date(Date.now() + 60 * 60 * 24 * 365);
        const cookie = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/; samesite=none; secure=true`;
        document.cookie = cookie;
    }
}
