const path = require("path"),
  fs = require("fs"),
  os = require("os");
const inquirer = require("inquirer");
let extension = "";
let dirBase = "";
let dirDestiny = "";
let list = [];
let operation = "";
let allFormat=['jpg','jpeg','png','gif','webp','tiff','bmp','heif','svg','eps','pdf','psd','ai','xcf','indd',]
function fromDir(startPath, filter) {
  if (!fs.existsSync(startPath)) {
    console.log("no dir ", startPath);
    return;
  }

  var files = fs.readdirSync(startPath);
  for (var i = 0; i < files.length; i++) {
    var filename = path.join(startPath, files[i]);
    var stat = fs.lstatSync(filename);
 
    if (stat.isDirectory()) {
      fromDir(filename, filter); //recurse
    } else if (filterValidation(filename, filter)) {
      list.push(filename);
      console.log(filename);
    }
  }
}

function filterValidation(filename,filter) {

  if (filter!='') {
  return  filename.indexOf(filter) >= 0
  }
  const ext = filename.split('.')[1]
  return allFormat.includes(ext)
}

function moveFiles() {
  let file = [];
  list.map((baseFile) => {
    if (os.type() == "Windows_NT") {
      file = baseFile.split("\\");
    } else {
      file = baseFile.split("/");
    }
    console.log(file);
    file = file[file.length - 1];
    fs.rename(baseFile, `${dirDestiny}/${file}`, function (err) {
      if (err) {
        console.log(`error:${err}`);
      }
      console.log(`Move complete.${dirDestiny}/${file}`);
    });
  });
}

function copyFiles() {
  let file = [];
  list.map((baseFile) => {
    if (os.type() == "Windows_NT") {
      file = baseFile.split("\\");
    } else {
      file = baseFile.split("/");
    }
    console.log(file);
    file = file[file.length - 1];
    fs.copyFile(baseFile, `${dirDestiny}/${file}`, function (err) {
      if (err) {
        console.log(`error:${err}`);
      }
      console.log(`Copy complete.${dirDestiny}/${file}`);
    });
  });
}

class Questions {
  qStructure(ques, name) {
    let questions = [
      {
        type: "input",
        name: `${name}`,
        message: `${ques}`,
      },
    ];
    return questions;
  }

  async destinyBase() {
    dirBase = (
      await inquirer.prompt(
        this.qStructure("Agregue el directorio el que desea buscar:", "dirBase")
      )
    ).dirBase;
    console.log(`Directorio en el que se va a realizar la busqueda:${dirBase}`);
  }
  async operation() {
    operation = (
      await inquirer.prompt(
        this.qStructure(
          "Operaciones: copiar ingrese 'C', mover 'M':",
          "operation"
        )
      )
    ).operation;
    console.log(`Directorio en el que se va a realizar la busqueda:${dirBase}`);
  }
  async extension() {
    extension = (
      await inquirer.prompt(
        this.qStructure(
          "Agregue la extensión del archivo que desea buscar:",
          "extension"
        )
      )
    ).extension;
    console.log(`Extensiones que se va a buscar:${extension}`);
    fromDir(`${dirBase}`, `${extension}`);
  }
  async destinyDirectory() {
    dirDestiny = (
      await inquirer.prompt(
        this.qStructure(
          "Agregue la direccion donde desea guardar todos los archivos:",
          "dirDestiny"
        )
      )
    ).dirDestiny;
    console.log(`Extensiones que se va a buscar:${dirDestiny}`);
    if (operation == "M") {
      moveFiles();
    } else {
      copyFiles();
    }
  }
}

async function init() {
  const questions = new Questions();
  await questions.destinyBase();
  await questions.operation();
  await questions.extension();
  await questions.destinyDirectory();
}

init();
