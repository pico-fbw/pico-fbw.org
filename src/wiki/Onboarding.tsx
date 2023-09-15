import { useEffect } from 'react';
import Navigation from '../elements/Navigation';

export default function Onboarding() {
    useEffect(() => {
        document.title = 'pico-fbw | Getting Started';
    }, []);

    return <Navigation showNavbar={false} />;
}
