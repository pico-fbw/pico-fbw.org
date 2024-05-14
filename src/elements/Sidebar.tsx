import React, { Fragment, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Bars3Icon, ChevronRightIcon } from '@heroicons/react/20/solid';
import classNames from '../helpers/classNames';

export interface SidebarNavigation {
    name: string;
    to: string;
    icon?: React.ForwardRefExoticComponent<
        Omit<React.SVGProps<SVGSVGElement>, 'ref'> & {
            title?: string | undefined;
            titleId?: string | undefined;
        } & React.RefAttributes<SVGSVGElement>
    >;
    end: boolean;
    children?: SidebarNavigation[];
}

export interface SidebarProps {
    navigation: SidebarNavigation[];
}

interface SidebarEntryProps {
    item: SidebarNavigation;
    onClick?: () => void;
}

const SidebarEntry: React.FC<SidebarEntryProps> = ({ item, onClick }) => {
    return (
        <>
            {!item.children ? (
                <NavLink
                    end={item.end}
                    to={item.to}
                    onClick={onClick}
                    className={({ isActive }) =>
                        classNames(
                            isActive ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800',
                            'group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold',
                        )
                    }
                >
                    {item.icon && <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />}
                    {item.name}
                </NavLink>
            ) : (
                <Disclosure as="div">
                    {({ open }) => (
                        <>
                            <Disclosure.Button
                                className={({ open }) =>
                                    classNames(
                                        open || useLocation().pathname.startsWith(item.to)
                                            ? 'bg-gray-800 text-white'
                                            : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                        'flex items-center w-full text-left rounded-md p-2 gap-x-3 text-sm leading-6 font-semibold',
                                    )
                                }
                            >
                                {item.icon && <item.icon className="h-6 w-6 shrink-0" aria-hidden="true" />}
                                {item.name}
                                <ChevronRightIcon
                                    className={classNames(
                                        open ? 'rotate-90 text-white' : 'text-gray-400',
                                        'ml-auto h-5 w-5 shrink-0',
                                    )}
                                    aria-hidden="true"
                                />
                            </Disclosure.Button>
                            <Disclosure.Panel as="ul" className="mt-1 px-2">
                                {item.children?.map(subItem => (
                                    <li key={subItem.name}>
                                        <NavLink
                                            end={subItem.end}
                                            to={subItem.to}
                                            onClick={onClick}
                                            className={({ isActive }) =>
                                                classNames(
                                                    isActive
                                                        ? 'bg-gray-800 text-white'
                                                        : 'text-gray-400 hover:text-white hover:bg-gray-800',
                                                    'block rounded-md py-2 pr-2 pl-9 text-sm leading-6',
                                                )
                                            }
                                        >
                                            {subItem.name}
                                        </NavLink>
                                    </li>
                                ))}
                            </Disclosure.Panel>
                        </>
                    )}
                </Disclosure>
            )}
        </>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ navigation }) => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const onClick = () => {
        setSidebarOpen(false);
    };

    return (
        <>
            <div>
                <Transition.Root show={sidebarOpen} as={Fragment}>
                    {/* z index is crazy bc leaflet has 800 z and you cant change it :( */}
                    <Dialog as="div" className="relative z-[1000] xl:hidden" onClose={setSidebarOpen}>
                        <Transition.Child
                            as={Fragment}
                            enter="transition-opacity ease-linear duration-300"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity ease-linear duration-300"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div className="fixed inset-0 bg-gray-900/80" />
                        </Transition.Child>

                        <div className="fixed inset-0 flex">
                            <Transition.Child
                                as={Fragment}
                                enter="transition ease-in-out duration-300 transform"
                                enterFrom="-translate-x-full"
                                enterTo="translate-x-0"
                                leave="transition ease-in-out duration-300 transform"
                                leaveFrom="translate-x-0"
                                leaveTo="-translate-x-full"
                            >
                                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                    <Transition.Child
                                        as={Fragment}
                                        enter="ease-in-out duration-300"
                                        enterFrom="opacity-0"
                                        enterTo="opacity-100"
                                        leave="ease-in-out duration-300"
                                        leaveFrom="opacity-100"
                                        leaveTo="opacity-0"
                                    >
                                        <div className="absolute left-full top-0 flex w-16 justify-center pt-5 z-[100]">
                                            <button
                                                type="button"
                                                className="-m-2.5 p-2.5"
                                                onClick={() => setSidebarOpen(false)}
                                            >
                                                <span className="sr-only">Close sidebar</span>
                                                <XMarkIcon className="h-6 w-6 text-white" aria-hidden="true" />
                                            </button>
                                        </div>
                                    </Transition.Child>
                                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 ring-1 ring-white/10">
                                        <div className="flex h-16 shrink-0 items-center">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className="h-10 w-auto -m-2"
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
                                        </div>
                                        <nav className="flex flex-1 flex-col">
                                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                                <li>
                                                    <ul role="list" className="-mx-2 space-y-1">
                                                        {navigation.map(item => (
                                                            <SidebarEntry
                                                                item={item}
                                                                key={item.name}
                                                                onClick={onClick}
                                                            />
                                                        ))}
                                                    </ul>
                                                </li>
                                            </ul>
                                        </nav>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </Dialog>
                </Transition.Root>

                {/* Static sidebar for desktop */}
                <div className="hidden xl:fixed xl:inset-y-0 xl:z-50 xl:flex xl:w-72 xl:flex-col">
                    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-black/10 px-6 ring-1 ring-white/5">
                        <NavLink to={'/'} className="flex h-[4.5rem] shrink-0 items-center">
                            <svg viewBox="0 0 24 24" className="h-10 w-auto -m-2" xmlns="http://www.w3.org/2000/svg">
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
                        <nav className="flex flex-1 flex-col">
                            <ul role="list" className="flex flex-1 flex-col gap-y-7">
                                <li>
                                    <ul role="list" className="-mx-2 space-y-1">
                                        {navigation.map(item => (
                                            <li key={item.name}>
                                                <SidebarEntry item={item} key={item.name} />
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
                <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
                    <button
                        type="button"
                        className="-m-2.5 p-2.5 text-gray-400 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    <div className="flex-1 text-sm font-semibold leading-6 text-white">
                        <NavLink to="/" className="flex items-center gap-x-2">
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
                </div>
            </div>
        </>
    );
};

export default Sidebar;
