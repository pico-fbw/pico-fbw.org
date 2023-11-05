import Navigation from './elements/Navigation';
import PageContentBlock from './elements/PageContentBlock';

export default function About() {
    return (
        <PageContentBlock hideSidebar title="pico-fbw | About">
            <Navigation />
            {/* TODO for when we have more content */}
        </PageContentBlock>
    );
}
