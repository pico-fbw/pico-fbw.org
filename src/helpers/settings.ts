export default class Settings {
    static setting = {
        altNumOffsetSamples: { value: '10' },
        defaultSpeed: { value: '25' },
        dropSecsRelease: { value: '10' },
        configAutoSave: { value: '1' },
        plannerMap: { value: '0' },
    } as const;

    static get<K extends keyof typeof this.setting>(key: K): string {
        const value = localStorage.getItem(key);
        if (value) {
            return value;
        }
        // No local storage entry found, return default value
        return this.setting[key].value;
    }

    static set<K extends keyof typeof this.setting>(key: K, value: string): void {
        localStorage.setItem(key, value);
    }
}
