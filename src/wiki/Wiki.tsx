import Navigation from '../elements/Navigation';
import PageContentBlock from '../elements/PageContentBlock';

export default function Wiki() {
    return (
        <PageContentBlock hideSidebar title="pico-fbw | Wiki">
            <Navigation />
            {/* TODO: Implement wiki--content on left, navigation on right (content larger) */}
        </PageContentBlock>
    );
}
