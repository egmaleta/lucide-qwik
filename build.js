import { mkdir, writeFile } from "fs/promises";
import { createWriteStream, readFileSync } from "fs";
import camelcase from "camelcase";

import lucide from "lucide";
import iconNames from './tags.json' assert { type: 'json' };

// icon keys to lowercase
const icons = Object.fromEntries(Object.entries(lucide.icons).map(entry => {
  const [key, value] = entry;
  return [key.toLowerCase(), value];
}));

function buildContent(icon) {
  const elements = icon[2].map(t => {
    const tag = t[0];
    const attrs = Object.entries(t[1]).map(v => `${v[0]}="${v[1]}"`).join(' ');
    return `<${tag} ${attrs}/>`;
  });

  return `<>${elements.join('')}</>`;
};

function buildIcon(typesRelPath, baseIconRelPath) {
  const template = readFileSync("./icon.tsx.template", "utf8")
    .replace("{{TYPES_REL_PATH}}", typesRelPath)
    .replace("{{BASE_ICON_REL_PATH}}", baseIconRelPath);

  return function(name, content) {
    return template
      .replace("{{ICON_NAME}}", name)
      .replace("{{CONTENT}}", content);
  };
};

function buildExportLine(name, iconsRelPath) {
  return `export { default as ${camelcase(name, {pascalCase: true})}Icon } from '${iconsRelPath}${name}';\n`;
}


async function build() {
  // build icons
  const iconsPath = "./src/components/icons/";
  const build = buildIcon("../../types", "../base-icon")

  await mkdir(iconsPath, {recursive: true});
  await Promise.all(Object.keys(iconNames).map(k => {
    const name = k;
    const icon = icons[camelcase(name).toLowerCase()];

    return writeFile(`${iconsPath}${name}.tsx`, build(name, buildContent(icon)), "utf8");
  }));

  // export icons
  const indexFile = createWriteStream("./src/index.ts", "utf8");
  Object.keys(iconNames).forEach(k => indexFile.write(buildExportLine(k, "./components/icons/")));
  indexFile.close();
}

build();
