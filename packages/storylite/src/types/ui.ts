export enum SLCoreAddon {
  DarkMode = 'darkmode',
  FullScreen = 'fullscreen',
  Grid = 'grid',
  Outline = 'outline',
  Responsive = 'responsive',
  SourceCode = 'sourcecode',
  Measure = 'measure',
  Zoom = 'zoom',
  Props = 'props',
}

export enum SLPanel {
  Sidebar = 'sidebar', // left sidebar
  Addons = 'addons', // top toolbar
  Canvas = 'canvas', // main content, iframe
  Properties = 'properties', // bottom toolbar
  Inspector = 'inspector', // right sidebar
}

export type SLAddonPanel = SLPanel.Addons | SLPanel.Inspector
