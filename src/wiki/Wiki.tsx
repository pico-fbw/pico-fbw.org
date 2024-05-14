import { useEffect } from 'react';
import PageContentBlock from '../elements/PageContentBlock';
import { NavLink } from 'react-router-dom';

export default function Wiki() {
    useEffect(() => {
        setTimeout(() => {
            const isInternalReferrer = document.referrer.includes(window.location.origin);
            if (!isInternalReferrer) {
                window.location.href = 'https://github.com/pico-fbw/pico-fbw/wiki';
            }
        }, 1000);
    }, []);

    return (
        <PageContentBlock title="pico-fbw | Wiki">
            <div className="flex flex-col items-center justify-center h-screen">
                <h2 className="text-4xl font-bold mb-4 text-gray-300">Redirecting you to the wiki...</h2>
                <p>
                    <NavLink to="/" className="text-blue-600 hover:text-sky-500 hover:underline">
                        Return to the home page
                    </NavLink>
                </p>
            </div>
        </PageContentBlock>
    );
}
