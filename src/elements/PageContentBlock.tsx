import type { ReactNode } from 'react';
import React, { useEffect } from 'react';
import { HomeIcon, DocumentTextIcon, GlobeAmericasIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Sidebar, { SidebarNavigation } from './Sidebar';

const defaultNavigation: SidebarNavigation[] = [
    { name: 'Home', to: '/', icon: HomeIcon, end: true },
    { name: 'Planner', to: '/tools/planner', icon: GlobeAmericasIcon, end: true },
    { name: 'Settings', to: '/tools/settings', icon: Cog6ToothIcon, end: false },
    { name: 'Config Editor', to: '/tools/config', icon: DocumentTextIcon, end: true },
];

export interface PageContentBlockProps {
    title?: string;
    children: ReactNode;
    sidebar?: boolean;
    sidebarNav?: SidebarNavigation[];
}

const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, children, sidebar, sidebarNav }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    let navigation = [...defaultNavigation];
    if (sidebarNav) {
        navigation = [...sidebarNav];
    }

    return (
        <>
            <div>
                {sidebar && <Sidebar navigation={navigation} />}
                <div className={sidebar ? 'xl:pl-72' : ''}>
                    <main>{children}</main>
                </div>
            </div>
        </>
    );
};

export default PageContentBlock;
