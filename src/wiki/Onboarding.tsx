import { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import Navigation from '../elements/Navigation';

export default function Onboarding() {
    const [isHovered1, setIsHovered1] = useState(false);
    const [isHovered2, setIsHovered2] = useState(false);

    const [currentStep, setCurrentStep] = useState(1);
    const [showStep1, setshowStep1] = useState(false);
    const [showStep2, setshowStep2] = useState(false);
    const handleChoiceClick = () => {
        switch (currentStep) {
            case 1:
                setshowStep1(false);
                setTimeout(() => {
                    setshowStep2(true);
                    setCurrentStep(2);
                }, 800);
                break;
            case 2:
                setshowStep2(false);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        document.title = 'pico-fbw | Getting Started';
        setshowStep1(true);
    }, []);

    return (
        <div className="bg-gray-900">
            <Navigation showNavbar={false} />
            <Transition.Root show={showStep1}>
                <div className="h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <Transition.Child
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
                        </Transition.Child>
                        <Transition.Child
                            className="w-4/5 h-auto mt-4"
                            enter="transition-opacity duration-700"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-700"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div
                                className={`relative rounded-xl bg-blue-600 text-white p-4 mx-4 transition-all duration-500 ease-in-out ${
                                    isHovered1 ? 'transform scale-105 hover:shadow-lg' : 'transform scale-100'
                                }`}
                                onMouseEnter={() => setIsHovered1(true)}
                                onMouseLeave={() => setIsHovered1(false)}
                                onClick={handleChoiceClick}
                            >
                                <img
                                    src="../../temp.png"
                                    alt="pico-fbw board image"
                                    className="w-auto h-40 lg:h-48 mb-4"
                                />
                                {/* TODO: short descriptions and titles for each option */}
                                <h2 className="text-lg font-semibold mb-2">pico-fbw board</h2>
                                <p className="text-sm">Description</p>
                                <p className="absolute bottom-2 right-2 text-white text-xl">&rarr;</p>
                            </div>
                        </Transition.Child>

                        <Transition.Child
                            className="w-4/5 h-auto mt-4"
                            enter="transition-opacity duration-700 delay-100"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-700"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <div
                                className={`relative rounded-xl bg-pink-600 text-white p-4 mx-4 transition-all duration-500 ease-in-out ${
                                    isHovered2 ? 'transform scale-105 hover:shadow-lg' : 'transform scale-100'
                                }`}
                                onMouseEnter={() => setIsHovered2(true)}
                                onMouseLeave={() => setIsHovered2(false)}
                                onClick={handleChoiceClick}
                            >
                                <img src="" alt="Image 2" className="w-auto h-40 lg:h-48 mb-4" />
                                <h2 className="text-lg font-semibold mb-2">Title 2</h2>
                                <p className="text-sm">Description</p>
                                <p className="absolute bottom-2 right-2 text-white text-xl">&rarr;</p>
                            </div>
                        </Transition.Child>
                    </div>
                </div>
            </Transition.Root>
            <Transition.Root show={showStep2}>
                <div className="h-screen flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center">
                        <Transition.Child
                            enter="transition-opacity duration-700"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="transition-opacity duration-700 delay-100"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <h1
                                className="text-4xl font-bold tracking-tight text-white sm:text-6xl mb-8"
                                onClick={handleChoiceClick}
                            >
                                Im not doing this tonight lol
                            </h1>
                        </Transition.Child>
                    </div>
                </div>
            </Transition.Root>
        </div>
    );
}
