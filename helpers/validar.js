const validator = require("validator");
const { ValidationError } = require("../errors/types");

const validarArticulo= (parametros) =>{

    let validar_titulo = !validator.isEmpty(parametros.title) 
    let validar_contenido = !validator.isEmpty(parametros.content)

    if(!validar_titulo || !validar_contenido) throw new ValidationError("No se ha cumplido la validacion")

}

module.exports={
    validarArticulo
}