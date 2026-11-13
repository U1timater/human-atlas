import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {anatomyDescription, anatomyName, searchAnatomy} from '../app/anatomy-language.ts';
import {SYSTEMS} from '../app/anatomy.ts';

const atlas = JSON.parse(readFileSync(new URL('../public/models/atlas.json', import.meta.url), 'utf8'));
const chinese = 'zh-CN';

for (const concept of atlas.concepts) {
  const label = anatomyName(concept, chinese);
  assert.match(label, /\p{Script=Han}/u, concept.id);
  assert.doesNotMatch(label, /第$/, concept.id);
  if (!/\b(?:left|right)\b/i.test(concept.name)) assert.doesNotMatch(label, /[左右]/, concept.id);
  if (/\bleft\b/i.test(concept.name)) assert.match(label, /左/, concept.id);
  if (/\bright\b/i.test(concept.name)) assert.match(label, /右/, concept.id);
  assert.equal(anatomyName(concept, 'en'), concept.name);
}
for (const part of atlas.parts) {
  assert.match(anatomyName({ id: part.conceptId, name: part.name }, chinese), /\p{Script=Han}/u, part.id);
}

const expectedSearch = [
  ['股骨', 'femur'], ['左股骨', 'left femur'], ['右股骨', 'right femur'],
  ['心脏', 'heart'], ['heart', 'heart'], ['膈肌', 'diaphragm'],
  ['左肺', 'left lung'], ['胸骨', 'sternum'], ['左晶状体', 'left lens'],
  ['右第一肋间后动脉', 'right first posterior intercostal artery'],
  ['左足第一骨间足底肌', 'first plantar interosseous of left foot'],
];
for (const [query, name] of expectedSearch) {
  assert.equal(searchAnatomy(atlas.concepts, query, chinese)[0]?.name, name, query);
}
const heart = atlas.concepts.find(concept => concept.name === 'heart');
assert.equal(searchAnatomy(atlas.concepts, heart.id.toLowerCase(), chinese)[0]?.id, heart.id);
assert.equal(searchAnatomy(atlas.concepts, '股骨', 'en')[0]?.name, 'femur');
assert.equal(anatomyDescription('left femur', 'skeletal', chinese).specific, true);
for (const system of SYSTEMS) {
  const overview = anatomyDescription('unspecified structure', system.id, chinese);
  assert.equal(overview.specific, false);
  assert.match(overview.text, /\p{Script=Han}/u);
}
console.log(`Verified Simplified Chinese names for ${atlas.parts.length} modeled pieces and ${atlas.concepts.length} concepts, search, laterality, and descriptions.`);
