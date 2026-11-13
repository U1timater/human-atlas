import {flushSync} from 'react-dom';
import {registerAtlasTools} from './agent-tools';
import {useEffect,useMemo,useRef,useState} from 'react';
import {Activity,ArrowUpRight,ChevronRight,Focus,Info,Layers3,Pause,RotateCcw,RotateCw,Search,X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Badge} from '@/components/ui/badge';
import {Slider} from '@/components/ui/slider';
import {Switch} from '@/components/ui/switch';
import {Sheet,SheetContent,SheetTitle,SheetDescription} from '@/components/ui/sheet';
import {Combobox,ComboboxInput,ComboboxContent,ComboboxList,ComboboxItem,ComboboxEmpty} from '@/components/ui/combobox';
import AnatomyScene from './scene';
import {anatomyDescription,anatomyName,searchAnatomy,systemName} from './anatomy-language';
import {initialLanguage,messages,saveLanguage,type ViewerError} from './locale';
import {modelAssetUrl} from './model-download';
import {DEFAULT_VISIBLE,SYSTEMS,type Atlas,type Concept,type SceneState,type SystemId,type View} from './anatomy';

const initial:SceneState={explode:0,visible:DEFAULT_VISIBLE,selected:[],isolate:false,view:'three-quarter',rotate:false,reset:0};
const organs: SystemId[] = ['cardiac', 'respiratory', 'digestive', 'urinary', 'endocrine', 'reproductive'];
const views: View[] = ['three-quarter', 'front', 'side', 'back'];

export default function Home(){
  const detailTitle = useRef<HTMLHeadingElement>(null);
  const [language, setLanguage] = useState(initialLanguage);
  const [atlas, setAtlas] = useState<Atlas | null>(null);
  const [state, setState] = useState(initial);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<ViewerError | null>(null);
  const [panel, setPanel] = useState<'layers' | 'search' | null>(null);
  const [details, setDetails] = useState(false);
  const [about, setAbout] = useState(false);
  const [query, setQuery] = useState('');
  const [chosen, setChosen] = useState<Concept | null>(null);
  const t = messages[language];
  const chinese = language === 'zh-CN';
  const formatCount = (count: number) => count.toLocaleString(language);

  useEffect(() => {
    document.documentElement.lang = language;
    document.title = messages[language].title;
  }, [language]);

  useEffect(() => {
    const abort = new AbortController();
    fetch(modelAssetUrl('/models/atlas.json'), { signal: abort.signal }).then(response => {
      if (!response.ok) throw new Error('catalogueError');
      return response.json();
    }).then(data => {
      if (!abort.signal.aborted) setAtlas(data as Atlas);
    }).catch(() => {
      if (!abort.signal.aborted) setError('catalogueError');
    });
    return () => abort.abort();
  }, []);

  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if (event.key === '/' && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        setPanel('search');
        setDetails(false);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);

  const parts = useMemo(() => new Map(atlas?.parts.map(part => [part.id, part])), [atlas]);
  const counts = useMemo(() => Object.fromEntries(
    SYSTEMS.map(system => [system.id, atlas?.parts.filter(part => part.system === system.id).length ?? 0]),
  ), [atlas]);
  const activeSystems = SYSTEMS.filter(system => counts[system.id] > 0);
  const selectedParts = state.selected.map(id => parts.get(id)).filter(part => !!part);
  const system = SYSTEMS.find(item => item.id === selectedParts[0]?.system);
  const chosenName = chosen ? anatomyName(chosen, language) : '';
  const description = chosen && system ? anatomyDescription(chosen.name, system.id, language) : null;
  const visibleCount = atlas?.parts.filter(part =>
    state.selected.includes(part.id) || (!state.isolate && state.visible.includes(part.system)),
  ).length ?? 0;
  const results = useMemo(() => atlas ? searchAnatomy(atlas.concepts, query, language) : [], [atlas, query, language]);
  const modeledCount = formatCount(atlas?.parts.length ?? 2234);

  const choose = (concept: Concept) => {
    setChosen(concept);
    setState(current => ({ ...current, selected: concept.elements, isolate: false, rotate: false }));
    setDetails(true);
    setPanel(null);
  };
  useEffect(() => {
    if (atlas) return registerAtlasTools(atlas, concept => flushSync(() => choose(concept)));
  }, [atlas]);

  const choosePart = (id: string) => {
    const part = parts.get(id);
    if (part) choose({ id: part.conceptId, name: part.name, elements: [id] });
  };
  const setLayers = (visible: SystemId[]) => setState(current => ({ ...current, visible, selected: [], isolate: false }));
  const toggle = (id: SystemId) => {
    setDetails(false);
    setState(current => ({
      ...current, selected: [], isolate: false,
      visible: current.visible.includes(id) ? current.visible.filter(item => item !== id) : [...current.visible, id],
    }));
  };
  const reset = () => {
    setState(current => ({ ...initial, reset: current.reset + 1 }));
    setChosen(null);
    setDetails(false);
    setPanel(null);
  };
  const openPanel = (next: 'layers' | 'search') => {
    setDetails(false);
    setPanel(current => current === next ? null : next);
  };
  const showAbout = () => {
    setDetails(false);
    setPanel(null);
    setAbout(true);
  };
  const changeLanguage = () => {
    const next = chinese ? 'en' : 'zh-CN';
    saveLanguage(next);
    setLanguage(next);
  };
  const changeExplosion = (value: number | readonly number[]) => {
    const percent = typeof value === 'number' ? value : value[0];
    setState(current => ({ ...current, explode: percent / 100, view: percent > 80 ? 'front' : current.view, rotate: false }));
  };
  const caption = state.isolate ? chosenName || t.selected
    : state.explode > .95 ? t.inventory : state.explode > .05 ? t.separated : t.adult;

  return (
    <main className="studio">
      {atlas && (
        <AnatomyScene atlas={atlas} language={language}
          state={{ ...state, inspectorOpen: details && selectedParts.length > 0 }}
          onSelect={choosePart} onProgress={setProgress} onError={setError}/>
      )}
      <div className="vignette"/>
      <header className="identity">
        <div className="eyebrow"><span className="status-dot"/>{t.tagline}</div>
        <h1>{t.title}<Badge variant="outline" className="edition">3D</Badge></h1>
        <div className="identity-meta">{t.modeled(modeledCount)} <span>·</span> BodyParts3D</div>
      </header>
      <nav className="top-actions" aria-label={t.panels}>
        <Button variant="ghost" className="language-toggle" onClick={changeLanguage}
          aria-label={chinese ? 'Switch to English' : '切换到简体中文'} lang={chinese ? 'en' : 'zh-CN'}>
          {chinese ? 'EN' : '中文'}
        </Button>
        <Button variant="ghost" className={panel === 'search' ? 'active' : ''}
          onClick={() => openPanel('search')} aria-label={t.searchButton}>
          <Search size={18}/><span>{t.find}</span><kbd>/</kbd>
        </Button>
        <Button variant="ghost" className="icon-button" aria-label={t.about} onClick={showAbout}>
          <Info size={18}/>
        </Button>
      </nav>

      <section className={`layers-panel glass ${panel === 'layers' ? 'mobile-open' : ''}`} aria-label={t.layers}>
        <div className="panel-heading">
          <span>{t.systems}</span>
          <Button variant="ghost" className="mobile-only icon-button" onClick={() => setPanel(null)} aria-label={t.closeSystems}>
            <X size={18}/>
          </Button>
          <Badge variant="secondary" className="desktop-only small-number">{activeSystems.length}</Badge>
        </div>
        <div className="layer-presets">
          <Button variant="ghost" aria-pressed={activeSystems.every(item => state.visible.includes(item.id))}
            onClick={() => setLayers(activeSystems.map(item => item.id))}>{t.all}</Button>
          <Button variant="ghost" aria-pressed={state.visible.length === 1 && state.visible[0] === 'skeletal'}
            onClick={() => setLayers(['skeletal'])}>{t.skeleton}</Button>
          <Button variant="ghost" aria-pressed={state.visible.length === organs.length && organs.every(id => state.visible.includes(id))}
            onClick={() => setLayers(organs)}>{t.organs}</Button>
        </div>
        <div className="system-list">
          {activeSystems.map(item => {
            const name = systemName(item, language);
            const visible = state.visible.includes(item.id);
            return (
              <div className={`system-row ${visible ? 'enabled' : ''}`} key={item.id}>
                <Button variant="ghost" className="system-name" title={t.showOnly(name)} onClick={() => setLayers([item.id])}>
                  <span className="system-dot" style={{ background: item.color }}/>{name}
                  <span className="system-count">{counts[item.id]}</span>
                </Button>
                <Switch checked={visible} onCheckedChange={() => toggle(item.id)} aria-label={t.show(name)}/>
              </div>
            );
          })}
        </div>
        <div className="panel-foot">
          <span>{t.visible(formatCount(visibleCount))}</span>
          <Button variant="ghost" onClick={() => setLayers([])}>{t.hide}</Button>
        </div>
      </section>

      {panel === 'search' && (
        <section className="search-panel glass" aria-label={t.searchPanel}>
          <div className="panel-heading">
            <span>{t.find}</span>
            <Button variant="ghost" className="icon-button" onClick={() => setPanel(null)} aria-label={t.closeSearch}>
              <X size={18}/>
            </Button>
          </div>
          <Combobox<Concept> items={results} value={null} onValueChange={value => { if (value) choose(value); }}
            inputValue={query} onInputValueChange={setQuery} itemToStringLabel={concept => anatomyName(concept, language)}
            filter={null} open onOpenChange={open => { if (!open) setPanel(null); }}>
            <ComboboxInput autoFocus placeholder={t.placeholder} aria-label={t.searchInput} showTrigger={false}/>
            <ComboboxContent className="anatomy-search-results">
              <ComboboxEmpty>{t.empty}</ComboboxEmpty>
              <ComboboxList>
                {(concept: Concept) => (
                  <ComboboxItem key={concept.id} value={concept}>
                    <span className="search-result-name">
                      {anatomyName(concept, language)}
                      {chinese && <small className="original-name" lang="en">{concept.name}</small>}
                    </span>
                    <span className="small-number">{t.pieces(concept.elements.length)}</span>
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          <p className="search-note">{query ? t.resultsHint : t.searchHint}</p>
        </section>
      )}

      <nav className="view-controls glass" aria-label={t.camera}>
        {views.map(view => {
          const [label, short] = t.views[view];
          return (
            <Button variant="ghost" key={view} className={state.view === view ? 'active' : ''}
              aria-pressed={state.view === view} disabled={state.explode > .8 && view !== 'front'}
              onClick={() => setState(current => ({ ...current, view, reset: current.reset + 1, rotate: false }))}
              title={label} aria-label={label}>
              <span>{short}</span>
            </Button>
          );
        })}
        <i/>
        <Button variant="ghost" disabled={state.explode >= .4} aria-label={state.rotate ? t.pause : t.rotate}
          title={t.autoRotate} className={state.rotate ? 'active' : ''}
          onClick={() => setState(current => ({ ...current, rotate: !current.rotate }))}>
          {state.rotate ? <Pause size={17}/> : <RotateCw size={18}/>}
        </Button>
        <Button variant="ghost" aria-label={t.resetView} title={t.reset} onClick={reset}><RotateCcw size={17}/></Button>
      </nav>
      <div className="scene-caption"><span className="caption-line"/><span>{caption}</span><span className="caption-line"/></div>
      <div className="bottom-dock glass">
        <Button variant="ghost" className="mobile-only dock-layers" onClick={() => openPanel('layers')} aria-label={t.openSystems}>
          <Layers3 size={20}/><span>{t.systems}</span>
        </Button>
        <div className="explode-control">
          <div className="explode-label">
            <label id="explode-label">{t.explode}</label>
            <output>{Math.round(state.explode * 100)}<span>%</span></output>
          </div>
          <Slider aria-labelledby="explode-label" min={0} max={100} step={1} value={[state.explode * 100]} onValueChange={changeExplosion}/>
          <div className="slider-endpoints"><span>{t.assembled}</span><span>{t.everyPiece}</span></div>
        </div>
        <Button variant="ghost" className="dock-reset" onClick={reset} aria-label={t.resetAll}>
          <RotateCcw size={18}/><span>{t.reset}</span>
        </Button>
      </div>
      <footer className="studio-footer">
        <span>{state.explode > .8 ? t.dragPan : t.dragOrbit} <b>·</b> {t.zoom} <b>·</b> {t.tap}</span>
        <Button variant="ghost" onClick={showAbout}>{t.credits} <ArrowUpRight size={12}/></Button>
      </footer>
      {progress < 100 && !error && (
        <div className="loading glass" role="status">
          <Activity size={18}/>
          <div>
            <strong>{t.loading}</strong>
            <span>{t.loadingPieces(progress, modeledCount)}</span>
            <div className="loading-track"><i style={{ width: `${progress}%` }}/></div>
          </div>
        </div>
      )}
      {error && (
        <div className="loading glass error" role="alert">
          <p>{t[error]}</p><Button variant="ghost" onClick={() => location.reload()}>{t.reload}</Button>
        </div>
      )}

      <Sheet open={details && selectedParts.length > 0} modal={false} disablePointerDismissal onOpenChange={setDetails}>
        <SheetContent initialFocus={detailTitle} closeLabel={t.close} className={`detail-sheet glass ${state.isolate ? 'is-isolated' : ''}`}>
          <div className="detail-header">
            <div className="detail-accent" style={{ background: system?.color }}/>
            <div className="eyebrow">{system ? systemName(system, language) : t.anatomy}</div>
            <SheetTitle ref={detailTitle} tabIndex={-1} className="structure-title">{chosenName}</SheetTitle>
          </div>
          <div className="detail-scroll" key={`${chosen?.id}-${state.isolate}`}>
            {chinese && chosen && <p className="original-name" lang="en">{chosen.name}</p>}
            <SheetDescription className="structure-description">{description?.text}</SheetDescription>
            {description && !description.specific && <span className="context-note">{t.context}</span>}
            <div className="structure-meta">
              <span>{t.reference}<strong>{chosen?.id}</strong></span>
              <span>{t.selectedPieces}<strong>{formatCount(state.selected.length)}</strong></span>
            </div>
            {selectedParts.length > 1 && (
              <div className="member-list">
                <h3>{t.included}</h3>
                {selectedParts.slice(0, 50).map(part => (
                  <Button variant="ghost" key={part.id} onClick={() => choosePart(part.id)}>
                    <span>{anatomyName({ id: part.conceptId, name: part.name }, language)}</span><ChevronRight size={14}/>
                  </Button>
                ))}
                {selectedParts.length > 50 && <p>{t.more(selectedParts.length - 50)}</p>}
              </div>
            )}
            <a className="source-link" href="https://lifesciencedb.jp/bp3d/" target="_blank" rel="noreferrer">
              {t.viewSource} <ArrowUpRight size={14}/>
            </a>
          </div>
          <div className="detail-actions">
            <Button className={`primary-action ${state.isolate ? 'active' : ''}`}
              onClick={() => setState(current => ({ ...current, isolate: !current.isolate, explode: 0 }))}>
              <Focus size={18}/>{state.isolate ? t.surround : t.isolate}<ChevronRight size={16}/>
            </Button>
            <Button variant="ghost" className="secondary-action" onClick={() => {
              setState(current => ({ ...current, selected: [], isolate: false }));
              setDetails(false);
            }}>{t.clear}</Button>
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={about} onOpenChange={setAbout}>
        <SheetContent className="about-sheet glass" closeLabel={t.close}>
          <div className="eyebrow">{t.scope}</div>
          <SheetTitle className="structure-title">{t.aboutTitle}</SheetTitle>
          <SheetDescription>{t.aboutIntro}</SheetDescription>
          <div className="about-copy">
            <p><strong>{t.specimen}</strong><br/>{t.aboutCount}</p>
            <p>{t.aboutModel}</p><p>{t.aboutEducation}</p>
            <h3>{t.source}</h3><p>{t.attribution}</p>
            <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html" target="_blank" rel="noreferrer">
              {t.dataLicense} <ArrowUpRight size={14}/>
            </a>
            <a href="https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html" target="_blank" rel="noreferrer">
              {t.original} <ArrowUpRight size={14}/>
            </a>
            <a href="https://academic.oup.com/nar/article/37/suppl_1/D782/1000752" target="_blank" rel="noreferrer">
              {t.publication} <ArrowUpRight size={14}/>
            </a>
            <a href={modelAssetUrl('ATTRIBUTION.md')} target="_blank" rel="noreferrer">
              {t.glossary} <ArrowUpRight size={14}/>
            </a>
          </div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
