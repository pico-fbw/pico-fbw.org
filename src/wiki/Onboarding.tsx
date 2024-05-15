import { forwardRef, useEffect, useState } from 'react';
import { TransitionChild, Transition } from '@headlessui/react';
import Navigation from '../elements/Navigation';
import PageContentBlock from '../elements/PageContentBlock';
import { ArrowRightIcon } from '@heroicons/react/20/solid';
import { NavLink } from 'react-router-dom';

interface ClickableProps {
    link: string;
    external: boolean;
    children: React.ReactNode;
}
function Clickable({ link, external, children }: ClickableProps) {
    if (external) {
        return (
            <a href={link} rel="noopener noreferrer">
                {children}
            </a>
        );
    } else {
        // Render a NavLink for internal links
        return <NavLink to={link}>{children}</NavLink>;
    }
}

interface OptionCardProps {
    bgColor: string;
    imageSrc: string;
    title: string;
    description: string;
    link: string;
    external?: boolean;
}

const OptionCard = forwardRef<HTMLDivElement, OptionCardProps>((props, ref) => {
    const { bgColor, imageSrc, title, link, external, description } = props;

    return (
        <div className={`option-card ${bgColor}`} ref={ref}>
            <Clickable link={link} external={external ? external : false}>
                <div
                    className={`relative flex rounded-xl ${bgColor} text-white cursor-pointer p-5 duration-250 transition-all transform scale-100 hover:scale-105 hover:shadow-lg`}
                >
                    <span className="flex flex-1">
                        <span className="flex flex-col">
                            <div className="h-60 mb-4">
                                <img src={imageSrc} alt={title} className="h-full w-auto" />
                            </div>
                            <h2 className="text-lg font-semibold mb-2">{title}</h2>
                            <span className="text-sm font-medium text-gray-200">{description}</span>
                        </span>
                    </span>
                    <ArrowRightIcon className={'h-5 w-5 text-white'} aria-hidden="true" />
                </div>
            </Clickable>
        </div>
    );
});
OptionCard.displayName = 'OptionCard';

export default function Onboarding() {
    const [showInfo, setShowInfo] = useState(false);

    useEffect(() => {
        setShowInfo(true);
    }, []);
    return (
        <PageContentBlock title={'pico-fbw | Get Started'}>
            <Navigation hideLinks />
            <Transition show={showInfo}>
                <div className="h-screen flex flex-col justify-center items-center mx-4 mt-16 sm:mt-0">
                    <TransitionChild
                        enter="transition-opacity duration-700"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="transition-opacity duration-700 delay-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">
                            Let&apos;s get you set up.
                        </h1>

                        {/* Option card group */}
                    </TransitionChild>
                    <div className="flex items-center">
                        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4 md:grid-cols-2 md:gap-x-8">
                            {/* "Blue Buy" option card */}
                            <TransitionChild
                                enter="transition-opacity duration-700"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-700"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <OptionCard
                                    bgColor="bg-blue-600"
                                    imageSrc="../../assets/prodstill.png"
                                    title="Buy pico-fbw"
                                    link={'https://pico-fbw.com/products'}
                                    external
                                    description="Purchase our custom-built, ready-to-go boards"
                                />
                            </TransitionChild>

                            {/* "Gray DIY option card" */}
                            <TransitionChild
                                enter="transition-opacity duration-700 delay-100"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition-opacity duration-700"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <OptionCard
                                    bgColor="bg-white/5"
                                    imageSrc="../../icon.svg"
                                    title="Make it yourself"
                                    link={'/wiki/Home'}
                                    description="Build and install pico-fbw on your own Raspberry Pi Pico"
                                />
                            </TransitionChild>
                        </div>
                    </div>
                </div>
            </Transition>

            <Transition show={false}>
                <div className="h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <TransitionChild
                            enter="transition-opacity duration-700"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-700 delay-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8">
                                Redirecting...
                            </h1>
                        </TransitionChild>
                    </div>
                </div>
            </Transition>
        </PageContentBlock>
    );
}
