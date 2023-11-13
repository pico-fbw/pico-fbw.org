export default class Settings {
    static setting = {
        altNumOffsetSamples: { name: 'altNumOffsetSamples', defaultValue: '0' },
        dropSecsRelease: { name: 'dropSecsRelease', defaultValue: '10' },
        configAutoSave: { name: 'configAutoSave', defaultValue: '1' },
        plannerMap: { name: 'plannerMap', defaultValue: '0' },
        plannerOnboarded: { name: 'plannerOnboarded', defaultValue: '0' },
        configOnboarded: { name: 'configOnboarded', defaultValue: '0' },
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
