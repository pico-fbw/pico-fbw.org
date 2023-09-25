import Alert from '../elements/Alert';
import PageContentBlock from '../elements/planner/PageContentBlock';

export default function Config() {
    return (
        <>
            <PageContentBlock title={'pico-fbw | Config Editor'}>
                <div className="divide-y divide-white/5">
                    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
                        <h2 className="text-2xl font-bold leading-7 text-sky-500 sm:text-3xl sm:tracking-tight sm:col-span-1 my-auto">
                            Config Editor
                        </h2>
                        <div className="sm:col-span-3 space-y-6">
                            {'serial' in navigator && (
                                <>
                                    <Alert type="info" className="mx-4 sm:mx-6 lg:mx-0">
                                        Your browser supports WebSerial!
                                    </Alert>
                                    {/* TODO */}
                                </>
                            )}
                            {!('serial' in navigator) && (
                                <>
                                    <Alert type="danger" className="mx-4 sm:mx-6 lg:mx-0">
                                        Your browser does not support WebSerial, which is required for the config
                                        editor.
                                    </Alert>
                                    <Alert type="warning" className="mx-4 sm:mx-6 lg:mx-0">
                                        <a
                                            href="https://developer.mozilla.org/en-US/docs/Web/API/Serial#browser_compatibility"
                                            target="_blank"
                                            rel="noreferrer"
                                        >
                                            Please switch to a compatible browser.
                                        </a>
                                    </Alert>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </PageContentBlock>
        </>
    );
}
