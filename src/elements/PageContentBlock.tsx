import type { ReactNode } from 'react';
import React, { useEffect } from 'react';
import Sidebar from './tools/Sidebar';

export interface PageContentBlockProps {
    title?: string;
    children: ReactNode;
    hideSidebar?: boolean;
}
const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, children, hideSidebar }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <>
            <div>
                {!hideSidebar && <Sidebar />}
                <div className={!hideSidebar ? 'xl:pl-72' : ''}>
                    <main>{children}</main>
                </div>
            </div>
        </>
    );
};

export default PageContentBlock;
