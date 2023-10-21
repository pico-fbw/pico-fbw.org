export default class Settings {
    static setting = {
        gpsNumOffsetSamples: { name: 'gpsNumOffsetSamples', defaultValue: '0' },
        configAutoSave: { name: 'configAutoSave', defaultValue: '0' },
        internal_configOnboarded: { name: 'configOnboarded', defaultValue: '0' },
    } as const;

    static get(settingKey: keyof typeof this.setting): string {
        const name = this.setting[settingKey].name;
        const value = localStorage.getItem(name);

        if (value !== null) {
            return value;
        } else {
            // If not found in local storage, use the default value
            const defaultValue = this.setting[settingKey].defaultValue;
            this.set(settingKey, defaultValue);
            return defaultValue;
        }
    }

    static set(settingKey: keyof typeof this.setting, value: string): void {
        const name = this.setting[settingKey].name;
        localStorage.setItem(name, value);
    }
}
