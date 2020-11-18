const weak = [
  1, 2, 3, 4, 5, 6, 7, 23, 24, 25,
  26, 30, 34, 47, 48, 54, 55, 57, 59
];
const strong = [
  8, 9, 10, 11, 13, 14, 15, 16,
  17, 18, 19, 20, 21, 22, 27, 28,
  29, 31, 32, 33, 35, 36, 37, 38,
  39, 40, 41, 42, 43, 44, 45, 46,
  49, 50, 51, 52, 53, 56, 58
];

const getIndex = obj => Number(obj.index);
const getPower = obj => Number(obj.power);
const getNumber = obj => Number(obj.number);

const computeWeakStrong = (acc, subArr, index) => {
  let accStrong = 0;
  let accWeak = 0;
  let resultStrong = 0;
  let resultWeak = 0;
  let helper;
  let sumPower = 0;
  let amountStrong = 0;
  let amountWeak = 0;
  //console.log(`index = ${index}`);

  for (let i = 0; i < subArr.length; i += 1) {
    const curr = subArr[i];
    const layer = getIndex(curr);
    const power = getPower(curr);
    const number = getNumber(curr);
    // console.log(`layer = ${layer}`);
    // console.log(`power = ${power}`);
    // console.log(`number = ${number}`);
    sumPower += power;

    if (strong.includes(layer)) {
      accStrong += power;
      //console.log(`strong.includes(layer) accStrong= ${accStrong}`);
    } else if (weak.includes(layer) && power < 3) {
      accWeak += power;
      //console.log(`weak.includes(layer) && power < 3 accWeak= ${accWeak}`);
    } else if (weak.includes(layer) && power >= 3) {
      resultWeak += power;
      helper = accWeak + accStrong;
      //console.log(`weak.includes(layer) && power >= 3 resultWeak= ${resultWeak}`);
      //console.log(`helper = ${helper}`);
      if (helper >= 30) {
        resultStrong += helper;
        //console.log(`helper >= 30 resultStrong= ${resultStrong}`);
        accStrong = 0;
        accWeak = 0;
        amountStrong += 1;
      } else {
        resultWeak += helper;
        //console.log(`helper < 30 resultWeak= ${resultWeak}`);
        accStrong = 0;
        accWeak = 0;
        amountWeak += 1;
      };
    };
    if (i === (subArr.length - 1)) {
      helper = accWeak + accStrong;
      //console.log(`i = ${i}`);
      //console.log(`Last_helper = ${helper}`);
      if (helper >= 30) {
        resultStrong += helper;
        //console.log(`Last_helper >= 30 resultStrong= ${resultStrong}`);
        accStrong = 0;
        accWeak = 0;
        amountStrong += 1;
      } else {
        resultWeak += helper;
        //console.log(`Last_helper < 30 resultWeak= ${resultWeak}`);
        accStrong = 0;
        accWeak = 0;
        amountWeak += 1;
      };
    }
  };
  const averagePowerStrong = Math.round(resultStrong / amountStrong);
  const numberOfInterval = index + 1;
  const contentOfWeak = Math.round((1 - (resultStrong / sumPower)) * 100);
  const roofType = (strong, weak) => {
    if (strong < 120 && weak >= 30) {
      return 'I';
    } else if ((strong >= 120 && strong < 200) && (weak < 30 && weak >= 15)) {
      return 'II';
    } else {
      return 'III';
    }
  };
  // console.log(`strong: ${resultStrong},
  //   weak: ${resultWeak},
  //   power: ${sumPower},
  //   numberOfInterval: ${numberOfInterval}`);

  acc = [...acc, {
    Number: numberOfInterval,
    Strong: resultStrong,
    Weak: resultWeak,
    Power: sumPower,
    Amount_strong: amountStrong,
    Amount_weak: amountWeak,
    Average_power_strong: averagePowerStrong,
    Content_weak: contentOfWeak,
    Type_roof: roofType(averagePowerStrong, contentOfWeak)
  }];
  return acc;
};

const countLayerIterator = arr => arr.reduce((computeWeakStrong), []);

const chunk = (arr, quantity = 2000) => {
  //console.log(`chunkArr = ${arr}`);
  if (arr.length === 0) {
    return [];
  }
  const iter = (workingArr, subArr, resArr, power, part = 0) => {
    if (workingArr.length === 0) {
      const result = [...resArr, subArr]
      //console.log(`result_chunk = ${result}`);
      return result;
    }
    if (power === quantity || power > quantity) {
      //console.log(`power === quantity`);
      part += 1;
      //console.log(`part === ${part}`);
      power = 0;
      return iter(workingArr, [], [...resArr, subArr], power, part);
    }
    const [first, ...rest] = workingArr;
    const sumPower = getPower(first) + power;
    //console.log(`sumPower === ${sumPower}`);
    return iter(rest, [...subArr, first], resArr, sumPower, part);
  };
  return iter(arr, [], [], 0);
};


// Table generator
const tableGenerator = (jsonText) => {
  //console.log(`jsonText = ${jsonText}`);
  function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      let th = document.createElement("th");
      let translate;
      console.log(`key = ${key}`);
      console.log(`type_of_key = ${typeof(key)}`);
      switch (key) {
        case 'Number':
          translate = '№ интервала';
          break;
        case 'Strong':
          translate = 'Прочные, мм';
          break;
        case 'Weak':
          translate = 'Слабые, мм';
          break;
        case 'Power':
          translate = 'Мощность, мм';
          break;
        case 'Amount_strong':
          translate = 'Количество прочных';
          break;
        case 'Amount_weak':
          translate = 'Количество слабых';
          break;
        case 'Average_power_strong':
          translate = 'Ср. мощность прочных, мм';
          break;
        case 'Content_weak':
          translate = 'Содержание слабых, %';
          break;
        case 'Type_roof':
          translate = 'Тип кровли';
          break;
        default: 'error';
      }
      let text = document.createTextNode(translate);
      console.log(`translate = ${translate}`);
      th.appendChild(text);
      row.appendChild(th);
    }
  }

  const generateTable = (table, data) => {
    for (let element of data) {
      let row = table.insertRow();
      for (key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(element[key]);
        cell.appendChild(text);
      }
    }
  };

  let table = document.querySelector("table");
  let data = Object.keys(jsonText[0]);
  //console.log(`data = ${data}`);
  generateTableHead(table, data);
  generateTable(table, jsonText);
};

// Main functional
const mainFunction = (file) => {
  const chunkedFile = chunk(file);
  //console.log(`chunkedFile = ${chunkedFile}`);

  const reduced = countLayerIterator(chunkedFile);
  //console.log(`reducer = ${reduced}`);

  tableGenerator(reduced);
}


const getFile = (file) => {
  //console.log(`file = ${file}`);

  const reader = new FileReader();
  reader.onload = function (e) {
    var data = e.target.result;
    var workbook = XLSX.read(data, {
      type: 'binary'
    });
    const sheetName = workbook.SheetNames[0];
    var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
    const json_object = JSON.stringify(XL_row_object);
    //jQuery('#workbook').val(json_object);
    const result = JSON.parse(json_object);
    //console.log(`json_parse = ${result}`);
    return mainFunction(result);
  };


  reader.onerror = function (ex) {
    console.log(ex);
  };

  reader.readAsBinaryString(file);
};

const begin = () => {
  const x = document.getElementById("file");
  const file = x.files[0];
  getFile(file);
};