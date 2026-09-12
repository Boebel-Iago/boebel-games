import * as Blockly from 'blockly';

export const blocklyDarkTheme = Blockly.Theme.defineTheme('emergencyEscapeDark', {
    base: Blockly.Themes.Classic,
    componentStyles: {
        workspaceBackgroundColour: '#1e293b',
        toolboxBackgroundColour: '#0f172a',
        toolboxForegroundColour: '#ffffff',
        flyoutBackgroundColour: '#1e293b',
        flyoutForegroundColour: '#ffffff',
        flyoutOpacity: 1,
        scrollbarColour: '#475569',
        insertionMarkerColour: '#ffffff',
        insertionMarkerOpacity: 0.3,
        scrollbarOpacity: 0.4,
        cursorColour: '#d0d0d0'
    },
    fontStyle: { family: 'sans-serif', weight: 'bold', size: 12 },
    startHats: true,
    name: ''
});