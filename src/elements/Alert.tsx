import React from 'react';
import { ExclamationTriangleIcon, InformationCircleIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';

interface AlertProps {
    type: 'warning' | 'danger' | 'info';
    className?: string;
    children: React.ReactNode;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ');
}

function getColors(type: AlertProps['type']) {
    switch (type) {
        case 'warning':
            return 'bg-yellow-400/10 text-yellow-500';
        case 'danger':
            return 'bg-red-400/10 text-red-400';
        case 'info':
            return 'bg-blue-400/10 text-blue-500';
    }
}

const Alert: React.FC<AlertProps> = ({ type, className = '', children }) => {
    return (
        <div className={classNames('rounded-md p-4', getColors(type), className)}>
            <div className="flex">
                <div className="flex-shrink-0">
                    {type === 'danger' ? (
                        <ShieldExclamationIcon className={'mr-2 h-6 w-6 text-red-400'} />
                    ) : type === 'warning' ? (
                        <ExclamationTriangleIcon className={'mr-2 h-6 w-6 text-yellow-500'} />
                    ) : (
                        <InformationCircleIcon className={'mr-2 h-6 w-6 text-blue-500'} />
                    )}
                </div>
                <div className="ml-3 flex-1 md:flex md:justify-between">{children}</div>
            </div>
        </div>
    );
};

export default Alert;
