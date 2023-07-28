import PageContentBlock from '../elements/planner/PageContentBlock';

export default function Settings() {
    return (
        <>
            <PageContentBlock title={'pico-fbw | Settings'}>
                <div className="divide-y divide-white/5">
                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <h2 className="text-2xl font-bold leading-7 text-sky-500 sm:text-3xl sm:tracking-tight sm:col-span-1 my-auto">
                            Soon&trade;
                        </h2>
                    </div>
                </div>
            </PageContentBlock>
        </>
    );
}
