import Navigation from './elements/Navigation';
import PageContentBlock from './elements/PageContentBlock';

const links = [
    { name: 'See it in action', href: 'https://www.youtube.com/@pico-fbw/' },
    { name: 'Hardware', href: 'https://pico-fbw.com/products' },
    { name: 'We ❤️ open source', href: 'https://github.com/pico-fbw/' },
];

const members = [
    {
        avatar: 'https://avatars.githubusercontent.com/u/43725835',
        name: 'MylesAndMore',
        role: 'professional plane crasher',
    },
    {
        avatar: 'https://avatars.githubusercontent.com/u/64759244',
        name: 'Camden Rush',
        role: 'it will be done soon™',
    },
    {
        avatar: 'https://avatars.githubusercontent.com/u/119150909',
        name: 'CraivMan',
        role: 'the best profile picture',
    },
    {
        avatar: 'https://avatars.githubusercontent.com/u/56371693',
        name: 'Thomas',
        role: 'they crashed wrong',
    },
];

const libraries = [
    { name: 'drbitboy', href: 'https://github.com/drbitboy/PID' },
    { name: 'GitJer', href: 'https://github.com/GitJer/Some_RPI-Pico_stuff/tree/main/PwmIn/PwmIn_4pins' },
    { name: 'h2non', href: 'https://github.com/h2non/semver.c' },
    { name: 'kgabis', href: 'https://github.com/kgabis/parson' },
    { name: 'kosma', href: 'https://github.com/kosma/minmea' },
    { name: 'Leaflet', href: 'https://leafletjs.com/' },
    { name: 'littlefs', href: 'https://github.com/littlefs-project/littlefs' },
    { name: 'markushi', href: 'https://github.com/markushi/pico-servo' },
    { name: 'Mongoose OS', href: 'https://mongoose-os.com/' },
    { name: 'Raspberry Pi', href: 'https://github.com/raspberrypi/pico-examples' },
];

export default function About() {
    return (
        <PageContentBlock title="pico-fbw | About">
            <Navigation />
            <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
                <video
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="absolute inset-0 -z-10 h-full w-full object-cover object-right md:object-center hidden sm:block opacity-10"
                >
                    <source src="../assets/prod.mp4" type="video/mp4" />
                    Sorry, your browser does not support video.
                </video>
                <div className="sm:hidden">
                    <div
                        className="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"
                        aria-hidden="true"
                    >
                        <div
                            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                    <div
                        className="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:top-[-28rem] sm:ml-16 sm:translate-x-0 sm:transform-gpu"
                        aria-hidden="true"
                    >
                        <div
                            className="aspect-[1097/845] w-[68.5625rem] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                </div>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">About pico-fbw</h2>
                        <p className="mt-6 text-lg leading-8 text-gray-300">
                            pico-fbw is a fly-by-wire and autopilot system for RC airplanes.
                        </p>
                    </div>
                    <div className="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">
                        <div className="grid grid-cols-1 gap-x-8 gap-y-6 text-base font-semibold leading-7 text-white sm:grid-cols-2 md:flex lg:gap-x-10">
                            {links.map(link => (
                                <a key={link.name} href={link.href} target="_blank" rel="noopener noreferrer">
                                    {link.name} <span aria-hidden="true">&rarr;</span>
                                </a>
                            ))}
                        </div>
                        <h2 className="mt-20 text-base leading-7 text-gray-300">
                            <span className="text-2xl font-bold">pico-fbw</span> is a cost-effective and user-friendly
                            flight control system designed for RC airplanes. Born from the Raspberry Pi Pico, it offers
                            simplicity, accessibility, and reliability.
                            <br /> <br />
                            Both easy to use and affordable, pico-fbw breaks previous barriers to entry, and makes it
                            simple for both beginners and seasoned flyers to enjoy assisted and autonomous flights.
                            <br /> <br />
                            We&apos;re excited to share pico-fbw with you, confident that its straightforward yet
                            powerful features will enhance your flying experience. As we continue to evolve and improve,
                            we invite you to join us in the skies. Happy flying!
                            <br />
                        </h2>
                        <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:max-w-none">
                            <h2 className="text-2xl font-bold leading-7 text-white mb-6">Meet the Team</h2>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                                {members.map((member, index) => (
                                    <div key={index} className="text-white">
                                        <img
                                            src={member.avatar}
                                            alt={member.name}
                                            className="w-16 h-16 object-cover rounded-full mb-4"
                                        />
                                        <p className="font-semibold">{member.name}</p>
                                        <p className="text-gray-300">{member.role}</p>
                                    </div>
                                ))}
                            </div>
                            <h2 className="mt-10 text-2xl font-bold leading-7 text-white mb-2">Open Source</h2>
                            <p className="text-md leading-8 text-gray-300 mb-6">
                                pico-fbw would not have been possible without the hard work and dedication of open
                                source software developers and organizations!
                            </p>
                            <ul className="list-disc list-inside text-gray-300">
                                {libraries.map((library, index) => (
                                    <li key={index}>
                                        <a
                                            key={library.name}
                                            href={library.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="hover:underline"
                                        >
                                            {library.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                            <p className="mt-10 text-md leading-8 text-gray-300 mb-6">
                                Both&nbsp;
                                <a
                                    href="https://github.com/pico-fbw/pico-fbw"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300/80 hover:underline"
                                >
                                    pico-fbw
                                </a>
                                &nbsp;and&nbsp;
                                <a
                                    href="https://github.com/pico-fbw/pico-fbw.org"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300/80 hover:underline"
                                >
                                    this website
                                </a>
                                &nbsp;have their source code accessible&nbsp;
                                <a
                                    href="https://github.com/pico-fbw/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-gray-300/80 hover:underline"
                                >
                                    on GitHub
                                </a>
                                .
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </PageContentBlock>
    );
}
