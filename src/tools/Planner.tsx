import MapElement from './MapElement';
import PageContentBlock from '../elements/tools/PageContentBlock';

export default function Planner() {
    return (
        <>
            <PageContentBlock title={'pico-fbw | Flight Planner'}>
                <MapElement />
            </PageContentBlock>
        </>
    );
}
