import { createBrowserRouter, createRoutesFromElements, Link, Route } from 'react-router-dom';
import About from './About';
import Index from './Index';
import Planner from './tools/Planner';
import Setting from './tools/Setting';
import Config from './tools/Config';
import Wiki from './wiki/Wiki';
import Onboarding from './wiki/Onboarding';

function NoMatch() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-4xl font-bold mb-4 text-gray-300">(404) Nothing to see here!</h2>
            <p>
                <Link to="/" className="text-blue-600 hover:text-sky-500 hover:underline">
                    Return to the home page
                </Link>
            </p>
        </div>
    );
}

const App = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/">
                <Route index element={<Index />} />
                <Route path="about" element={<About />} />
                <Route path="*" element={<NoMatch />} />
            </Route>
            <Route path="/tools">
                <Route index element={<NoMatch />} />
                <Route path="planner">
                    <Route index element={<Planner />} />
                    <Route path="*" element={<NoMatch />} />
                </Route>
                <Route path="settings" element={<Setting />} />
                <Route path="config" element={<Config />} />
                <Route path="*" element={<NoMatch />} />
            </Route>
            <Route path="/wiki">
                <Route index element={<Wiki />} />
                <Route path="onboarding" element={<Onboarding />} />
                <Route path="*" element={<NoMatch />} />
            </Route>
        </>,
    ),
);

export default App;
