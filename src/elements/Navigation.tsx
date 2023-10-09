import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';
import { NavLink } from 'react-router-dom';

export interface NavigationProps {
    showNavbar?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ showNavbar = true }) => {
    const navigation = [
        { name: 'Home', to: '/' },
        { name: 'Flight Planner', to: '/tools/planner' },
        { name: 'Wiki', to: '/wiki' },
        { name: 'Shop', to: 'https://shop.pico-fbw.com' },
    ];

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <header className="absolute inset-x-0 top-0 z-50">
            <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                <div className="flex lg:flex-1">
                    <NavLink to={'/'} className="-m-1.5 p-1.5">
                        <span className="sr-only">pico-fbw</span>
                        <svg viewBox="0 0 24 24" className="h-10 w-auto -m-4" xmlns="http://www.w3.org/2000/svg">
                            <path
                                className="fill-blue-600"
                                d="M4.875 4.117v.002a.75.75 0 0 0-.75.748v.75a.75.75 0 0 0 .75.75c2.869 0 5.516.948 7.646 2.547a34.04 34.04 0 0 1 .352-.096 34.04 34.04 0 0 1 2.275-.45.422.422 0 0 1 .114-.003.422.422 0 0 1 .09.022 14.95 14.95 0 0 0-10.477-4.27Z"
                            />
                            <path
                                className="fill-pink-600"
                                d="m4.78 13.156 3.574 1.893.457-.457a6 6 0 0 0-3.92-1.46v.003a.75.75 0 0 0-.112.021z"
                            />
                            <path
                                className="fill-blue-600"
                                d="M4.89 17.633v.002a.75.75 0 0 0-.75.748v.75a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75 1.5 1.5 0 0 0-1.5-1.5zm1.536-6.6a34.04 34.04 0 0 1 2.015-.853 34.04 34.04 0 0 1 1.204-.414 10.444 10.444 0 0 0-4.77-1.149v.002a.75.75 0 0 0-.75.748v.75a.75.75 0 0 0 .75.75 8.25 8.25 0 0 1 1.55.166z"
                            />
                            <path
                                className="fill-pink-600"
                                d="m10.398 13.004 1.342-1.342a.422.422 0 0 1 .233-.119.422.422 0 0 1 .2.031 10.53 10.53 0 0 0-2.528-1.808 34.04 34.04 0 0 0-1.204.414 34.04 34.04 0 0 0-2.015.853 8.25 8.25 0 0 1 3.972 1.97z"
                            />
                            <path
                                className="fill-blue-600"
                                d="m10.996 13.602 1.342-1.342a.422.422 0 0 0 .119-.233.422.422 0 0 0-.031-.203 10.56 10.56 0 0 0-.252-.25.422.422 0 0 0-.201-.031.422.422 0 0 0-.233.12l-1.342 1.34a8.25 8.25 0 0 1 .598.599z"
                            />
                            <path
                                className="fill-pink-600"
                                d="M10.873 19.28a.75.75 0 0 0 .018-.147 6 6 0 0 0-1.48-3.945l-.46.458z"
                            />
                            <path
                                className="fill-blue-600"
                                d="m10.873 19.28-1.922-3.634.46-.459a6 6 0 0 0-.6-.595l-.457.457-3.575-1.893a.75.75 0 0 0-.638.727v.75a.75.75 0 0 0 .75.75 3.75 3.75 0 0 1 3.75 3.75.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .732-.604z"
                            />
                            <path
                                className="fill-pink-600"
                                d="M14.234 14.36a10.53 10.53 0 0 0-1.808-2.536.422.422 0 0 1 .031.203.422.422 0 0 1-.12.233l-1.34 1.342a8.25 8.25 0 0 1 1.966 3.982 34.042 34.042 0 0 0 .857-2.025 34.042 34.042 0 0 0 .414-1.2z"
                            />
                            <path
                                className="fill-blue-600"
                                d="M14.234 14.36a34.042 34.042 0 0 1-.414 1.199 34.042 34.042 0 0 1-.857 2.025 8.25 8.25 0 0 1 .162 1.533.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75c0-1.713-.413-3.329-1.14-4.758zm1.379-5.71a.422.422 0 0 1 .022.088.422.422 0 0 1-.002.114 34.042 34.042 0 0 1-.451 2.275 34.042 34.042 0 0 1-.096.353 12.696 12.696 0 0 1 2.539 7.637.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75A14.95 14.95 0 0 0 15.613 8.65z"
                            />
                            <path
                                className="fill-pink-600"
                                d="M15.352 8.387a.422.422 0 0 0-.09-.022.422.422 0 0 0-.114.002 34.04 34.04 0 0 0-2.275.451 34.04 34.04 0 0 0-.352.096c.972.73 1.836 1.594 2.565 2.566a34.042 34.042 0 0 0 .096-.353 34.042 34.042 0 0 0 .45-2.275.422.422 0 0 0 .003-.114.422.422 0 0 0-.022-.088 15.244 15.244 0 0 0-.261-.263Z"
                            />
                        </svg>
                    </NavLink>
                </div>
                <div className="flex lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-400"
                        onClick={() => setMobileMenuOpen(showNavbar)}
                    >
                        <span className="sr-only">Open main menu</span>
                        <div className="h-6 w-6">
                            {showNavbar && <Bars3Icon className="h-6 w-6" aria-hidden="true" />}
                        </div>
                    </button>
                </div>
                <div className="hidden lg:flex lg:gap-x-12 h-6">
                    {showNavbar && (
                        <>
                            {navigation.map(item => (
                                <NavLink
                                    key={item.name}
                                    to={item.to}
                                    className="text-sm font-semibold leading-6 text-white"
                                >
                                    {item.name}
                                </NavLink>
                            ))}
                        </>
                    )}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end h-6">
                    {showNavbar && (
                        <>
                            {location.pathname === '/' && (
                                <NavLink to={'/wiki/onboarding'} className="text-sm font-semibold leading-6 text-white">
                                    About <span aria-hidden="true">&rarr;</span>
                                </NavLink>
                            )}
                        </>
                    )}
                </div>
            </nav>
            <Transition show={mobileMenuOpen} as={Fragment}>
                <Dialog as="div" className="lg:hidden" onClose={() => setMobileMenuOpen(false)}>
                    <Transition.Child
                        enter="transition-opacity duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-300"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 z-50" />
                    </Transition.Child>
                    <Transition.Child
                        as={Fragment}
                        enter="transition ease-in-out duration-300 transform"
                        enterFrom="-translate-y-full"
                        enterTo="translate-y-0"
                        leave="transition ease-in-out duration-300 transform"
                        leaveFrom="translate-y-0"
                        leaveTo="-translate-y-full"
                    >
                        <Dialog.Panel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-gray-900 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-white/10">
                            <div className="flex items-center justify-between">
                                <a href="#" className="-m-1.5 p-1.5">
                                    <span className="sr-only">pico-fbw</span>
                                    <svg
                                        viewBox="0 0 24 24"
                                        className="h-10 w-auto -m-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            className="fill-blue-600"
                                            d="M4.875 4.117v.002a.75.75 0 0 0-.75.748v.75a.75.75 0 0 0 .75.75c2.869 0 5.516.948 7.646 2.547a34.04 34.04 0 0 1 .352-.096 34.04 34.04 0 0 1 2.275-.45.422.422 0 0 1 .114-.003.422.422 0 0 1 .09.022 14.95 14.95 0 0 0-10.477-4.27Z"
                                        />
                                        <path
                                            className="fill-pink-600"
                                            d="m4.78 13.156 3.574 1.893.457-.457a6 6 0 0 0-3.92-1.46v.003a.75.75 0 0 0-.112.021z"
                                        />
                                        <path
                                            className="fill-blue-600"
                                            d="M4.89 17.633v.002a.75.75 0 0 0-.75.748v.75a.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75 1.5 1.5 0 0 0-1.5-1.5zm1.536-6.6a34.04 34.04 0 0 1 2.015-.853 34.04 34.04 0 0 1 1.204-.414 10.444 10.444 0 0 0-4.77-1.149v.002a.75.75 0 0 0-.75.748v.75a.75.75 0 0 0 .75.75 8.25 8.25 0 0 1 1.55.166z"
                                        />
                                        <path
                                            className="fill-pink-600"
                                            d="m10.398 13.004 1.342-1.342a.422.422 0 0 1 .233-.119.422.422 0 0 1 .2.031 10.53 10.53 0 0 0-2.528-1.808 34.04 34.04 0 0 0-1.204.414 34.04 34.04 0 0 0-2.015.853 8.25 8.25 0 0 1 3.972 1.97z"
                                        />
                                        <path
                                            className="fill-blue-600"
                                            d="m10.996 13.602 1.342-1.342a.422.422 0 0 0 .119-.233.422.422 0 0 0-.031-.203 10.56 10.56 0 0 0-.252-.25.422.422 0 0 0-.201-.031.422.422 0 0 0-.233.12l-1.342 1.34a8.25 8.25 0 0 1 .598.599z"
                                        />
                                        <path
                                            className="fill-pink-600"
                                            d="M10.873 19.28a.75.75 0 0 0 .018-.147 6 6 0 0 0-1.48-3.945l-.46.458z"
                                        />
                                        <path
                                            className="fill-blue-600"
                                            d="m10.873 19.28-1.922-3.634.46-.459a6 6 0 0 0-.6-.595l-.457.457-3.575-1.893a.75.75 0 0 0-.638.727v.75a.75.75 0 0 0 .75.75 3.75 3.75 0 0 1 3.75 3.75.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .732-.604z"
                                        />
                                        <path
                                            className="fill-pink-600"
                                            d="M14.234 14.36a10.53 10.53 0 0 0-1.808-2.536.422.422 0 0 1 .031.203.422.422 0 0 1-.12.233l-1.34 1.342a8.25 8.25 0 0 1 1.966 3.982 34.042 34.042 0 0 0 .857-2.025 34.042 34.042 0 0 0 .414-1.2z"
                                        />
                                        <path
                                            className="fill-blue-600"
                                            d="M14.234 14.36a34.042 34.042 0 0 1-.414 1.199 34.042 34.042 0 0 1-.857 2.025 8.25 8.25 0 0 1 .162 1.533.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75c0-1.713-.413-3.329-1.14-4.758zm1.379-5.71a.422.422 0 0 1 .022.088.422.422 0 0 1-.002.114 34.042 34.042 0 0 1-.451 2.275 34.042 34.042 0 0 1-.096.353 12.696 12.696 0 0 1 2.539 7.637.75.75 0 0 0 .75.75h.75a.75.75 0 0 0 .75-.75A14.95 14.95 0 0 0 15.613 8.65z"
                                        />
                                        <path
                                            className="fill-pink-600"
                                            d="M15.352 8.387a.422.422 0 0 0-.09-.022.422.422 0 0 0-.114.002 34.04 34.04 0 0 0-2.275.451 34.04 34.04 0 0 0-.352.096c.972.73 1.836 1.594 2.565 2.566a34.042 34.042 0 0 0 .096-.353 34.042 34.042 0 0 0 .45-2.275.422.422 0 0 0 .003-.114.422.422 0 0 0-.022-.088 15.244 15.244 0 0 0-.261-.263Z"
                                        />
                                    </svg>
                                </a>
                                <Transition.Child
                                    as={Fragment}
                                    enter="ease-in-out duration-300"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="ease-in-out duration-300"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <button
                                        type="button"
                                        className="-m-2.5 rounded-md p-2.5 text-gray-400"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <span className="sr-only">Close menu</span>
                                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                    </button>
                                </Transition.Child>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/25">
                                    <div className="space-y-2 py-6">
                                        {navigation.map(item => (
                                            <NavLink
                                                key={item.name}
                                                to={item.to}
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-white hover:bg-gray-800"
                                            >
                                                {item.name}
                                            </NavLink>
                                        ))}
                                    </div>
                                    <div className="py-6"></div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Transition.Child>
                </Dialog>
            </Transition>
        </header>
    );
};

export default Navigation;
