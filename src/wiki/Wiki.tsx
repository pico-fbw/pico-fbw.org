import { useEffect } from 'react';
import Navigation from '../elements/Navigation';

export default function Wiki() {
    useEffect(() => {
        document.title = 'pico-fbw | Wiki';
    }, []);

    return <Navigation />;
}
