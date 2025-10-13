import '../lib/ui-components/styles/styles.scss';
import { components, BaseComponent, ComboBox } from 'ui-components';

async function load(): Promise<void> {
    const loadPromises = [];

    for (const [tag, c] of Object.entries(components)) {
        if (document.querySelector(tag)) {
            const p = c().then(c => (c as typeof BaseComponent).define(tag));
            loadPromises.push(p);
        }
    }

    await Promise.all(loadPromises);
}

load().then(() => {
    // import('./cb-countries.js');
});
