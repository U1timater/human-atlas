import { explanation, SYSTEMS, type Concept, type SystemId } from './anatomy.ts';
import labels from './atlas-zh.json' with { type: 'json' };
import type { Language } from './locale.ts';

const chineseNames: Readonly<Record<string, string>> = labels;

export function anatomyName(entry: { id: string; name: string }, language: Language) {
  return language === 'zh-CN' ? chineseNames[entry.id] ?? entry.name : entry.name;
}

const systems: Record<SystemId, [name: string, description: string]> = {
  skeletal: ['骨骼', '骨骼支撑身体、保护内部器官，并为肌肉提供附着点。骨组织还储存矿物质，骨髓参与造血。'],
  muscular: ['肌肉', '骨骼肌收缩时牵拉附着处，与肌腱共同带动关节、维持姿势并产生热量。'],
  cardiac: ['心脏', '心脏通过四个心腔推动血液在肺循环和体循环中流动。心脏瓣膜有助于保持血流方向。'],
  sensory: ['感觉器官', '眼、耳等结构接收光、声音或位置变化等刺激，并通过神经系统传递信息。'],
  arterial: ['动脉', '动脉把血液从心脏送往身体组织或肺部。较大的动脉逐级分支，形成供应不同部位的血管网络。'],
  venous: ['静脉', '静脉把血液送回心脏。体循环的浅静脉和深静脉收集组织回流，肺静脉把血液从肺送回左心房。'],
  nervous: ['神经系统', '脑、脊髓和周围神经接收、传导和处理信息，参与感觉、运动、记忆以及体内活动的调节。'],
  respiratory: ['呼吸系统', '呼吸道将空气导入肺部。氧气与二氧化碳在肺泡和周围毛细血管之间交换。'],
  digestive: ['消化系统', '消化道分解食物、吸收营养和水分，并排出残渣。肝、胆囊和胰腺等结构协助消化。'],
  urinary: ['泌尿系统', '肾脏过滤血液并调节水分和电解质。尿液经输尿管进入膀胱，最后经尿道排出。'],
  lymphatic: ['淋巴系统', '淋巴管回收组织间液并送回血液循环。淋巴结等淋巴器官参与免疫反应。'],
  endocrine: ['内分泌系统', '内分泌器官分泌激素，调节代谢、生长、应激和生殖等生理活动。'],
  reproductive: ['生殖系统', '图谱中的男性生殖结构参与产生、储存和输送精子，以及分泌性激素。'],
  integumentary: ['体表', '皮肤等体表结构形成保护屏障，并参与感觉与体温调节。'],
  connective: ['结缔组织', '软骨、韧带等结缔组织支撑、连接和分隔其他结构，并帮助关节保持稳定。'],
};

export function systemName(system: typeof SYSTEMS[number], language: Language) {
  return language === 'zh-CN' ? systems[system.id][0] : system.name;
}

const descriptions: Readonly<Record<string, string>> = {
  heart: '位于胸腔内，由心肌收缩推动血液流动。右心把血液送往肺部，左心把血液送往全身。',
  brain: '位于颅腔内，是中枢神经系统的重要部分。不同区域共同参与感知、运动、语言和记忆。',
  liver: '主要位于右上腹、膈下。肝脏加工和储存营养物质，产生胆汁，并合成多种血浆蛋白。',
  stomach: '位于食管与十二指肠之间，暂时储存食物，并通过肌肉收缩将食物与胃液混合。',
  spleen: '位于左上腹，是淋巴器官之一，参与免疫反应并清除老化的红细胞。',
  pancreas: '主要位于胃的后方。胰腺把含消化酶的胰液送入十二指肠，也分泌胰岛素等激素。',
  'urinary bladder': '位于骨盆内，暂时储存由输尿管送来的尿液。膀胱壁的肌肉收缩时推动尿液排出。',
  trachea: '连接喉与左右主支气管。管壁的软骨帮助气道保持开放。',
  diaphragm: '分隔胸腔与腹腔。吸气时膈肌收缩、穹隆下降，胸腔容积随之增加。',
  femur: '大腿的长骨。上端与髋骨构成髋关节，下端与胫骨和髌骨共同构成膝关节。',
  tibia: '位于小腿内侧，承担小腿的大部分负重。近端参与膝关节，远端参与踝关节。',
  fibula: '位于小腿外侧。它为多块肌肉提供附着点，远端形成外踝并参与踝关节稳定。',
  patella: '位于膝关节前方，嵌在股四头肌腱中。它可增加股四头肌伸膝时的力臂。',
  humerus: '上臂的长骨。近端与肩胛骨相接，远端与桡骨、尺骨共同构成肘关节。',
  radius: '位于前臂的拇指侧。前臂旋前和旋后时，桡骨相对于尺骨转动。',
  ulna: '位于前臂的小指侧，近端的鹰嘴构成肘后突起并参与肘关节。',
  scapula: '位于胸廓后外侧，为肩部肌肉提供附着点。肩胛骨的关节盂与肱骨头构成肩关节。',
  clavicle: '连接胸骨与肩胛骨，帮助维持肩部位置，并将上肢承受的力传向躯干。',
  sternum: '位于胸廓前正中，由胸骨柄、胸骨体和剑突组成。多对肋骨通过肋软骨与其相连。',
  sacrum: '位于脊柱下段，由骶椎融合形成，通过骶髂关节将躯干的负重传向骨盆。',
  mandible: '构成下颌并承托下牙。它通过颞下颌关节参与张口、闭口和咀嚼。',
  skull: '构成头部的骨性支架。脑颅围成颅腔，面颅构成面部、眼眶和鼻腔的部分边界。',
  cerebellum: '位于颅后窝，参与协调运动、维持平衡和运动学习。',
  pons: '位于中脑与延髓之间，属于脑干。许多神经传导通路经过脑桥。',
  'medulla oblongata': '位于脑干下部，与脊髓相连，参与调节呼吸和心血管活动。',
  hypothalamus: '位于丘脑下方，参与调节体温、摄食、昼夜节律和内分泌活动。',
  esophagus: '由咽通向胃，管壁肌肉通过蠕动将食物和液体推送入胃。',
  gallbladder: '位于肝脏下方，储存和浓缩胆汁，并将胆汁经胆道排入小肠。',
  duodenum: '是小肠的起始段，接收从胃排出的食糜，以及来自胆道和胰管的消化液。',
  kidney: '位于腹后壁，过滤血液并形成尿液，同时参与调节体液容量、电解质和酸碱平衡。',
  ureter: '连接肾盂与膀胱，通过管壁平滑肌的蠕动输送尿液。',
  'adrenal gland': '位于肾上方。皮质和髓质分泌不同激素，参与代谢、血压和应激反应的调节。',
  prostate: '位于膀胱下方，围绕尿道起始段，其分泌液构成精液的一部分。',
  testis: '位于阴囊内，产生精子并分泌睾酮等激素。',
  lung: '位于胸腔内，气道在肺内逐级分支，空气中的氧和血液中的二氧化碳主要在肺泡处交换。',
  cornea: '位于眼球前部，是透明的外层组织，参与眼球对光线的折射。',
  lens: '位于虹膜后方，改变形状以帮助眼睛对不同距离的物体对焦。',
  choroid: '位于巩膜和视网膜之间，富含血管，为视网膜外层提供血液供应。',
  'optic nerve': '把视网膜产生的神经信号传向脑，是视觉通路的一部分。',
  aorta: '从左心室发出，经主动脉弓延续至胸、腹部，是体循环的主干动脉。',
  'superior vena cava': '将头颈、上肢及上半身部分组织的静脉血送入右心房。',
  'inferior vena cava': '将下肢、骨盆和腹部等区域的静脉血送入右心房。',
  'left atrium': '接收肺静脉回流的血液，再经二尖瓣送入左心室。',
  'right atrium': '接收上、下腔静脉及冠状窦回流的血液，再经三尖瓣送入右心室。',
  'left ventricle': '收缩时经主动脉瓣将血液射入主动脉，供应体循环。',
  'right ventricle': '收缩时经肺动脉瓣将血液送入肺动脉干，进入肺循环。',
  'mitral valve': '又称二尖瓣，位于左心房与左心室之间。左心室收缩时，瓣膜关闭以减少血液反流。',
  'tricuspid valve': '位于右心房与右心室之间。右心室收缩时，瓣膜关闭以减少血液反流。',
  'aortic valve': '位于左心室与主动脉之间。心室射血时开放，心室舒张时关闭。',
  'pulmonary valve': '位于右心室与肺动脉干之间，限制血液从肺动脉干回流到右心室。',
  'pectoralis major': '覆盖前胸壁，主要参与上臂内收和内旋。不同肌束也参与肩关节屈曲或从屈曲位伸展。',
  deltoid: '覆盖肩部。中部纤维主要负责上臂外展，前部和后部纤维分别参与上臂前举和后伸。',
  'biceps brachii': '位于上臂前方，有长头和短头，参与屈肘和前臂旋后。',
  'triceps brachii': '位于上臂后方，有长头、外侧头和内侧头，主要负责伸肘。',
  'gluteus maximus': '位于臀部浅层，参与伸髋和大腿外旋，起身和上楼时会用到它。',
  'gluteus medius': '位于臀部外侧，参与大腿外展，并在单腿承重时帮助稳定骨盆。',
  'gluteus minimus': '位于臀中肌深面，参与大腿外展，并在步行时帮助稳定髋关节。',
  'rectus femoris': '位于大腿前侧，是股四头肌中跨过髋、膝两个关节的部分，参与屈髋和伸膝。',
  'vastus lateralis': '位于大腿前外侧，是股四头肌的一部分，参与伸膝。',
  'vastus medialis': '位于大腿前内侧，是股四头肌的一部分，参与伸膝和稳定髌骨。',
  'vastus intermedius': '位于股直肌深面，是股四头肌的一部分，参与伸膝。',
  soleus: '位于腓肠肌深面，参与足跖屈，并在站立时帮助维持姿势。',
  'serratus anterior': '位于胸廓外侧，将肩胛骨拉向前方并使其贴近胸壁，也参与肩胛骨上回旋。',
  sternocleidomastoid: '位于颈前外侧。单侧收缩使头转向对侧，并向同侧侧屈。',
  'calcaneal tendon': '又称跟腱，连接小腿三头肌和跟骨，将肌肉收缩产生的力量传给足部。',
};

export function anatomyDescription(name: string, system: SystemId, language: Language) {
  if (language === 'en') return explanation(name, system);
  const key = name.toLowerCase();
  const unsided = key.replace(/^(left|right) /, '');
  const muscle = unsided.match(/(?:part|head) of (?:(?:left|right) )?(.+)$/)?.[1];
  const specific = descriptions[key] ?? descriptions[unsided]
    ?? (system === 'muscular' && muscle ? descriptions[muscle] : undefined);
  return specific ? { text: specific, specific: true } : { text: systems[system][1], specific: false };
}

const aliases: Readonly<Record<string, readonly string[]>> = {
  heart: ['心'],
  liver: ['肝脏'],
  spleen: ['脾脏'],
  brain: ['大脑'],
  diaphragm: ['膈肌', '横膈膜'],
  kidney: ['肾脏'],
  patella: ['膝盖骨'],
  'calcaneal tendon': ['跟腱', '阿基里斯腱', 'Achilles tendon'],
  'radial side of index finger': ['示指桡侧', '食指桡侧'],
  'arteria radialis indicis': ['食指桡侧动脉'],
  'zone of quadriceps femoris': ['股四头肌', 'quadriceps'],
  'cranial nerve': ['颅神经'],
};

export function searchAnatomy(concepts: readonly Concept[], query: string, language: Language, limit = 80) {
  const term = query.trim().normalize('NFKC').toLowerCase();
  if (!term) {
    const suggestions = ['heart', 'brain', 'liver', 'stomach', 'spleen', 'pancreas', 'urinary bladder', 'trachea'];
    return suggestions.map(name => concepts.find(concept => concept.name.toLowerCase() === name))
      .filter((concept): concept is Concept => !!concept);
  }
  const matches = [];
  for (const concept of concepts) {
    const english = concept.name.toLowerCase();
    const chinese = chineseNames[concept.id];
    const keywords = [concept.id.toLowerCase(), english, chinese, ...(aliases[english] ?? [])];
    if (!keywords.some(keyword => keyword?.toLowerCase().includes(term))) continue;
    const exact = keywords.some(keyword => keyword?.toLowerCase() === term);
    const prefix = keywords.some(keyword => keyword?.toLowerCase().startsWith(term));
    matches.push({ concept, rank: exact ? 0 : prefix ? 1 : 2, length: anatomyName(concept, language).length });
  }
  return matches.sort((a, b) => a.rank - b.rank || a.length - b.length).slice(0, limit).map(match => match.concept);
}
