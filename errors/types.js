class ValidationError extends Error {
    super(message){
        this.super(message)
        this.name="ValidationError"
    }
}

class ConectionError extends Error{
    super(message){
        this.super(message)
        this.name(ConectionError)
    }
}
class DataBaseError extends Error{
    super(message){
        this.super(message)
        this.name(DataBaseError)
    }
}
class ExtensionError extends Error{
    super(message){
        this.super(message)
        this.name(ExtensionError) 
    }
}
module.exports={
    ExtensionError,
    ValidationError,
    DataBaseError,
    ConectionError
}