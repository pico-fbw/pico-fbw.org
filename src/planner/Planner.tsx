import MapElement from './MapElement';
import PageContentBlock from '../elements/planner/PageContentBlock';

export default function Planner() {
    return (
        <>
            <PageContentBlock title={'WiFly Planner'}>
                <MapElement />
            </PageContentBlock>
        </>
    );
}
