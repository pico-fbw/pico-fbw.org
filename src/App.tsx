import { Routes, Route, Link } from 'react-router-dom';
import Index from './Index';
import Planner from './planner/Planner';
import Settings from './planner/Settings';

function NoMatch() {
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <h2 className="text-3xl font-bold mb-4 text-sky-500">Nothing to see here!</h2>
            <p>
                <Link to="/" className="text-blue-500 hover:text-blue-700">
                    Go to the home page
                </Link>
            </p>
        </div>
    );
}

export default function App() {
    return (
        <Routes>
            <Route path="/">
                <Route index element={<Index />} />
                <Route path="*" element={<NoMatch />} />
            </Route>
            <Route path="/planner">
                <Route index element={<Planner />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<NoMatch />} />
            </Route>
        </Routes>
    );
}
