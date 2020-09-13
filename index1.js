const util = require("util");
const exec = util.promisify(require("child_process").exec);
const inquirer = require("inquirer");
let extension = "";
let dirBase = "";
let dirDestiny = "";

class Comand {
  async findFiles() {
    const { stdout, stderr } = await exec(
      ` find ${dirBase} -name *.${extension}`
    );
    let list = stdout.split("\n");
    list.pop();
    return list;
  }

  async moveFiles(list) {
    let stringlist = "";
    console.log(list);
    list.map((file) => {
      stringlist += `${file.trim()} `;
    });
    try {
      const { stdout, stderr } = await exec(` mv ${stringlist}  ${dirDestiny}`);
      console.log("operacion completada");
    } catch (error) {
      console.log(error);
    }
  }
}
const comand = new Comand();
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
        this.qStructure(
          "Agregue el directorio el el que desa buscar:",
          "dirBase"
        )
      )
    ).dirBase;
    console.log(`Directorio en el que se va a realizar la busqueda:${dirBase}`);
  }
  async extension() {
    extension = (
      await inquirer.prompt(
        this.qStructure(
          "Agregue la extension del archivo que desea buscar:",
          "extension"
        )
      )
    ).extension;
    console.log(`Extensiones que se va a buscar:${extension}`);
    //comand.findFiles();
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
    comand.moveFiles(await comand.findFiles());
  }
}

async function init() {
  const questions = new Questions();
  await questions.destinyBase();
  await questions.extension();
  await questions.destinyDirectory();
}

init();
