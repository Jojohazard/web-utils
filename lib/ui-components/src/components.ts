export const components: Record<string, () => Promise<CustomElementConstructor>> = {
    'wu-combo-box': () => import('./input/combo-box.js').then(c => c.ComboBox),
    'wu-editable-text': () => import('./input/editable-text.js').then(c => c.EditableText),
    'wu-loadable-container': () => import('./layout/loadable-container.js').then(c => c.LoadableContainer)
}