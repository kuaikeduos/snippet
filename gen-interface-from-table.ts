interface KeyIndexMap {
  field?: number
  type?: number
  note?: number
  isRequired?: number
}

type Parse = (node: HTMLElement) => any

interface ParseMap {
  field?: Parse
  type?: Parse
  note?: Parse
  isRequired?: Parse
}

const defaultParse = (node: HTMLElement): string => node.innerText;
const boolParse = (node: HTMLElement) => node.innerText === 'bool' ? 'boolean' : node.innerText;
const isRequiredParse = (node: HTMLElement) => node.innerText === '是';

function genInterface(
  tbodySelector: string,
  keyIndex: KeyIndexMap = {},
  parse: ParseMap = {}
) {

  function getArray(index: number, parse: Parse = defaultParse) {
    return Array
            .from(document.querySelectorAll(`${tbodySelector} > tr > td:nth-child(${index})`))
            .map(parse)
  }

  const fieldArray = getArray(keyIndex.field, parse.field)
  const typeArray = getArray(keyIndex.type, parse.type || boolParse)
  const noteArray = getArray(keyIndex.note, parse.note)
  const isRequiredArray = getArray(keyIndex.isRequired, parse.isRequired || isRequiredParse)
  const startTemplate = `\nexport declare class Foo {\n`
  const endTemplate = `\n}\n`
  const mainTemplate = fieldArray.map((field, index) => `  ${field}${isRequiredArray[index] ? '' : '?'}: ${typeArray[index]} //${noteArray[index]}`).join(',\n');
  return startTemplate + mainTemplate + endTemplate;
}

/**
genInterface('table:nth-child(6) > tbody', {
  field: 1,
  type: 2,
  note: 3,
  isRequired: 4
})
 */

/**
  <table>
   <thead>
    <tr>
     <th>属性名</th>
     <th>类型</th>
     <th>描述</th>
     <th>是否必须</th>
     <th>默认值</th>
     <th>字典</th>
    </tr>
   </thead>
   <tbody>
    <tr>
     <td>tabTitles</td>
     <td>array<a href="">string</a></td>
     <td>标题列表</td>
     <td>否</td>
     <td>[]</td>
     <td>-</td>
    </tr>
    <tr>
     <td>curIndex</td>
     <td>number</td>
     <td>选中tab序号</td>
     <td>否</td>
     <td>0</td>
     <td>-</td>
    </tr>
    <tr>
     <td>tabStyle</td>
     <td>object</td>
     <td>tab样式</td>
     <td>否</td>
     <td>{}</td>
     <td>-</td>
    </tr>
    <tr>
     <td>tabBarStyle</td>
     <td>object</td>
     <td>tab样式</td>
     <td>否</td>
     <td>{}</td>
     <td>-</td>
    </tr>
   </tbody>
  </table>
*/