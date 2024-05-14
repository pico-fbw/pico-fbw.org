import MapElement from './MapElement';
import PageContentBlock from '../elements/PageContentBlock';

export default function Planner() {
    return (
        <>
            <PageContentBlock sidebar title={'pico-fbw | Planner'}>
                <MapElement />
            </PageContentBlock>
        </>
    );
}
