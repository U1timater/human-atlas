export type Language = 'en' | 'zh-CN';
export type ViewerError = 'catalogueError' | 'downloadError' | 'incompleteError'
  | 'geometryError' | 'webglError' | 'contextError' | 'loadError';

export function modelError(error: unknown): ViewerError {
  if (error instanceof Error && (error.message === 'downloadError'
    || error.message === 'incompleteError' || error.message === 'geometryError')) {
    return error.message;
  }
  return 'loadError';
}

const storageKey = 'human-atlas-language';

export function initialLanguage(): Language {
  const requested = new URLSearchParams(location.search).get('lang')?.toLowerCase();
  if (requested === 'en') return 'en';
  if (requested === 'zh' || requested === 'zh-cn') return 'zh-CN';
  try {
    const saved = localStorage.getItem(storageKey);
    if (saved === 'en' || saved === 'zh-CN') return saved;
  } catch {
    // Storage can be unavailable in embedded or private browsers.
  }
  return navigator.language.toLowerCase().startsWith('zh') ? 'zh-CN' : 'en';
}

export function saveLanguage(language: Language) {
  const url = new URL(location.href);
  url.searchParams.set('lang', language === 'en' ? 'en' : 'zh');
  history.replaceState(history.state, '', url);
  try {
    localStorage.setItem(storageKey, language);
  } catch {
    // The URL still preserves the chosen language.
  }
}

export const messages = {
  en: {
    title: 'Human Atlas',
    tagline: 'INTERACTIVE ANATOMY',
    modeled: (count: string) => `${count} modeled pieces`,
    panels: 'Explorer panels',
    searchButton: 'Search anatomy',
    find: 'Find a structure',
    about: 'About this atlas',
    layers: 'Anatomical layers',
    systems: 'Systems',
    closeSystems: 'Close systems',
    openSystems: 'Open system layers',
    all: 'All',
    skeleton: 'Skeleton',
    organs: 'Organs',
    showOnly: (name: string) => `Show only ${name.toLowerCase()}`,
    show: (name: string) => `Show ${name.toLowerCase()}`,
    visible: (count: string) => `${count} pieces visible`,
    hide: 'Hide all',
    searchPanel: 'Find anatomy',
    closeSearch: 'Close search',
    searchInput: 'Search named anatomical structures',
    placeholder: 'Heart, femur, cranial nerve…',
    empty: 'No structures match your search.',
    pieces: (count: number) => `${count.toLocaleString('en')} ${count === 1 ? 'piece' : 'pieces'}`,
    searchHint: 'Start with a major organ, or search every named structure.',
    resultsHint: 'Showing up to 80 matches. Refine your search to find smaller structures.',
    camera: 'Camera controls',
    views: {
      'three-quarter': ['three-quarter view', '¾'],
      front: ['front view', 'F'],
      side: ['side view', 'S'],
      back: ['back view', 'B'],
    },
    rotate: 'Rotate body',
    pause: 'Pause rotation',
    autoRotate: 'Auto rotate',
    resetView: 'Reset view and layers',
    reset: 'Reset',
    resetAll: 'Assemble and reset',
    selected: 'SELECTED STRUCTURE',
    inventory: 'ANATOMICAL INVENTORY',
    separated: 'SEPARATED STRUCTURES',
    adult: 'ADULT HUMAN · MALE',
    explode: 'Explode anatomy',
    assembled: 'Assembled',
    everyPiece: 'Every piece',
    dragPan: 'Drag to pan',
    dragOrbit: 'Drag to orbit',
    zoom: 'Pinch to zoom',
    tap: 'Tap to inspect',
    credits: 'Source & credits',
    loading: 'Preparing the anatomy',
    loadingPieces: (progress: number, count: string) => `${progress}% · Loading ${count} pieces`,
    reload: 'Reload viewer',
    catalogueError: 'The anatomy catalogue could not be loaded.',
    downloadError: 'An anatomy file could not be loaded.',
    incompleteError: 'An anatomy file was incomplete. Please reload the viewer.',
    geometryError: 'Could not assemble anatomy geometry.',
    webglError: 'This browser could not start the 3D viewer. Please try a browser with WebGL enabled.',
    contextError: 'The 3D session was paused by your device. Reload to continue.',
    loadError: 'Could not load the anatomy.',
    canvas: 'Interactive human anatomy. Drag to orbit, pinch or scroll to zoom, and tap a structure to inspect it.',
    close: 'Close',
    anatomy: 'ANATOMY',
    context: 'System overview · structure identified from source anatomy',
    reference: 'Atlas reference',
    selectedPieces: 'Selected pieces',
    included: 'Included structures',
    more: (count: number) => `And ${count.toLocaleString('en')} more modeled pieces.`,
    viewSource: 'View anatomical source',
    isolate: 'Isolate structure',
    surround: 'Show surrounding anatomy',
    clear: 'Clear selection',
    scope: 'SOURCE & SCOPE',
    aboutTitle: 'About the atlas',
    aboutIntro: 'Explore the adult male reference anatomy from BodyParts3D.',
    specimen: 'Male · BodyParts3D',
    aboutCount: '2,234 individual meshes and 3,432 named concepts from an adult male reference anatomy.',
    aboutModel: 'Named concepts can contain multiple pieces. Each source mesh is rendered once.',
    aboutEducation: 'The reference geometry is simplified for the web. This educational atlas is not a diagnostic or surgical tool.',
    source: 'Source',
    attribution: 'BodyParts3D, © The Database Center for Life Science, licensed under CC BY 4.0.',
    dataLicense: 'Dataset license',
    original: 'Original geometry & metadata',
    publication: 'Read the source publication',
    glossary: 'Chinese terminology credits',
  },
  'zh-CN': {
    title: '人体解剖图谱',
    tagline: '交互式人体解剖',
    modeled: (count: string) => `${count} 个模型部件`,
    panels: '图谱工具',
    searchButton: '搜索解剖结构',
    find: '查找部位',
    about: '关于本图谱',
    layers: '解剖系统图层',
    systems: '系统',
    closeSystems: '关闭系统面板',
    openSystems: '打开系统面板',
    all: '全部',
    skeleton: '骨骼',
    organs: '器官',
    showOnly: (name: string) => `仅显示${name}`,
    show: (name: string) => `显示${name}`,
    visible: (count: string) => `已显示 ${count} 个部件`,
    hide: '全部隐藏',
    searchPanel: '查找解剖结构',
    closeSearch: '关闭搜索',
    searchInput: '搜索解剖结构名称',
    placeholder: '心脏、股骨、脑神经…',
    empty: '没有找到匹配的解剖结构。',
    pieces: (count: number) => `${count.toLocaleString('zh-CN')} 个部件`,
    searchHint: '支持中文名、英文名和图谱编号。',
    resultsHint: '最多显示 80 个结果，可输入更具体的名称缩小范围。',
    camera: '视角控制',
    views: {
      'three-quarter': ['斜前视图', '斜'],
      front: ['正面视图', '前'],
      side: ['侧面视图', '侧'],
      back: ['背面视图', '后'],
    },
    rotate: '旋转模型',
    pause: '暂停旋转',
    autoRotate: '自动旋转',
    resetView: '重置视角和图层',
    reset: '重置',
    resetAll: '合拢模型并重置',
    selected: '所选结构',
    inventory: '解剖部件全览',
    separated: '部件分离视图',
    adult: '成年男性参考模型',
    explode: '爆炸视图',
    assembled: '合拢',
    everyPiece: '完全展开',
    dragPan: '拖动平移',
    dragOrbit: '拖动旋转',
    zoom: '双指缩放',
    tap: '点选查看',
    credits: '来源与致谢',
    loading: '正在准备人体模型',
    loadingPieces: (progress: number, count: string) => `${progress}% · 正在加载 ${count} 个部件`,
    reload: '重新加载',
    catalogueError: '无法加载解剖目录。',
    downloadError: '无法加载解剖模型文件。',
    incompleteError: '解剖模型文件不完整，请重新加载。',
    geometryError: '无法组装解剖模型。',
    webglError: '当前浏览器无法启动 3D 查看器，请使用启用了 WebGL 的浏览器。',
    contextError: '设备暂停了 3D 渲染，请重新加载。',
    loadError: '无法加载人体模型。',
    canvas: '交互式人体解剖模型。拖动旋转，滚动或双指缩放，点选查看部位。',
    close: '关闭',
    anatomy: '解剖结构',
    context: '所属系统概览',
    reference: '图谱编号',
    selectedPieces: '所选部件',
    included: '包含的结构',
    more: (count: number) => `另有 ${count.toLocaleString('zh-CN')} 个模型部件。`,
    viewSource: '查看解剖数据来源',
    isolate: '单独显示此结构',
    surround: '显示周围结构',
    clear: '清除选择',
    scope: '来源与适用范围',
    aboutTitle: '关于本图谱',
    aboutIntro: '探索 BodyParts3D 的成年男性参考解剖模型。',
    specimen: '成年男性 · BodyParts3D',
    aboutCount: '图谱包含 2,234 个独立模型部件和 3,432 个解剖条目。',
    aboutModel: '一个解剖条目可以包含多个部件。每个模型网格只渲染一次。',
    aboutEducation: '模型几何经过简化以便在网页中加载。本图谱用于解剖学习，不用于诊断或手术。',
    source: '数据来源',
    attribution: 'BodyParts3D 由日本生命科学数据库中心（DBCLS）提供，按 CC BY 4.0 授权。',
    dataLicense: '数据集许可证',
    original: '原始模型与元数据',
    publication: '阅读数据集论文',
    glossary: '中文术语来源与致谢',
  },
};
