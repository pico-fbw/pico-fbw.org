import type { ReactNode } from 'react';
import React, { useEffect } from 'react';
import Sidebar from './Sidebar';

export interface PageContentBlockProps {
    title?: string;
    children: ReactNode;
}
const PageContentBlock: React.FC<PageContentBlockProps> = ({ title, children }) => {
    useEffect(() => {
        if (title) {
            document.title = title;
        }
    }, [title]);

    return (
        <>
            <div>
                <Sidebar />
                <div className="xl:pl-72">
                    <main>{children}</main>
                </div>
            </div>
        </>
    );
};

export default PageContentBlock;
