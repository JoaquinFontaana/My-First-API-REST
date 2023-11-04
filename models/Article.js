const {Schema,model} = require("mongoose")
const ArticleSchema= Schema({
    title:{
        type:String,
        required:true 
    },
    content:{
        type:String,
        required:true
    },
    imagen:{
        type:String,
        default:"Default.png"
    },
    fecha:{
        type:Date,
        default:Date.now
    }})

module.exports=model("Article",ArticleSchema)