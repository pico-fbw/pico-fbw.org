import Alert from '../Alert';

interface ConfigData {
    sections: {
        name: string;
        keys: (number | null)[];
    }[];
}

interface DisplayConfigDataProps {
    data: ConfigData | null;
}

function ConfigViewer({ data }: DisplayConfigDataProps) {
    if (!data) {
        return (
            <Alert type="danger" className="mx-4 sm:mx-6 lg:mx-0">
                No configuration data available.
            </Alert>
        );
    }

    return (
        <div className="divide-y divide-white/5">
            {data.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="py-6">
                    <h3 className="text-xl font-bold leading-6 text-sky-500">{section.name}</h3>
                    <ul className="mt-4 space-y-2">
                        {section.keys.map((value, keyIndex) => (
                            <li key={keyIndex} className="flex items-center">
                                <span className="w-1/12 font-semibold text-gray-400">{keyIndex}:</span>
                                <span className="m-2 text-gray-500">{value !== null ? value : 'N/A'}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
}

export default ConfigViewer;
