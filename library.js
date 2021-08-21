const express=require('express');
const mongoose=require('mongoose');
const app=express();
app.use(express.json());


const connect=()=>{
    return mongoose.connect("mongodb://127.0.0.1:27017/libraryDb",{
        useNewUrlParser:true,
        useCreateIndex:true,
        useUnifiedTopology:true,
        useFindAndModify:false
    })
}

const userSchema=new mongoose.Schema({
    first_name:{type:String,required:true},
    last_name:{type:String,required:true}
},{
    versionKey:false
})

const User=mongoose.model("user",userSchema);


const sectionSchema=new mongoose.Schema({
   section:{type:String,required:true},

},{
    versionKey:false
});

const Section=mongoose.model("section",sectionSchema);



const bookSchema=new mongoose.Schema({
    name:{type:String,required:true},
    body:{type:String,required:true},
    sectionId:{type:mongoose.Schema.Types.ObjectId,
        ref:"section",
        required:true
        }
},{
    versionKey:false
});

const Book=mongoose.model("book",bookSchema);


const authorSchema=new mongoose.Schema({
    first_name:{type:String,required:true},
    last_name:{type:String,required:true},
    bookId:[{type:mongoose.Schema.Types.ObjectId,
              ref:"book",
              required:true
            }]
},{
    versionKey:false
});

const Author=mongoose.model("author",authorSchema);


const checkedoutSchema=new mongoose.Schema({
    bookId:{type:mongoose.Schema.Types.ObjectId,
                ref:"book",
            required:true,
        },

},{
    versionKey:false,
    timestamps:true
})


const Checkedout=mongoose.model("checkout",checkedoutSchema);

//------------------------CRUD operation for user------------------------

app.post("/users",async function(req,res){
    const user=await User.create(req.body);
    return res.send(user)
})

app.get("/users",async function(req,res){
    try{
        const user=await User.find().lean().exec()
        return res.status(200).send(user)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})


app.patch("/users/:id",async function(req,res){
    try{
        const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean()
        return res.status(200).send(user)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})


app.delete("/users/:id",async function(req,res){
    try{
        const user=await User.findByIdAndDelete(req.params.id).lean()
        return res.status(200).send(user)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})


//----------------------------------CRUD Operations for section----------------

app.post("/sections",async function(req,res){
    const section=await Section.create(req.body);
    return res.send(section)
})

app.get("/sections",async function(req,res){
    try{
        const section=await Section.find().lean().exec()
        return res.status(200).send(section)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})

app.get("/sections/:id/books",async function(req,res){
    try{
        const sectionbook=await Book.find({sectionId:req.params.id}).lean().exec()
        const section=await Section.findById(req.params.id)
        return res.status(200).json({sectionbook:sectionbook,section:section})
    }catch(err){
        return res.status(400).send(err.message)
    }
})

app.get("/sections/:id/books/authors",async function(req,res){
    try{
        const authorbook=await Author.find({bookId:req.params.id}).lean().exec()
        const sectionbook=await Book.find({sectionId:req.params.id}).lean().exec()
        const section=await Section.findById(req.params.id)
        return res.status(200).json({authorbook:authorbook,sectionbook:sectionbook,section:section})
    }catch(err){
        return res.status(400).send(err.message)
    }
})


app.patch("/sections/:id",async function(req,res){
    try{
        const section=await Section.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean()
        return res.status(200).send(section)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})


app.delete("/sections/:id",async function(req,res){
    try{
        const section=await Section.findByIdAndDelete(req.params.id).lean()
        return res.status(200).send(section)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})

//---------------------------------CRUD Operation for book---------------

app.post("/books",async function(req,res){
    const book=await Book.create(req.body);
    return res.send(book)
})

app.get("/books",async function(req,res){
    try{
        const book=await Book.find().populate("sectionId").lean().exec()
        return res.status(200).send(book)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})


app.patch("/books/:id",async function(req,res){
    try{
        const book=await Book.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean()
        return res.status(200).send(book)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})


app.delete("/books/:id",async function(req,res){
    try{
        const book=await Book.findByIdAndDelete(req.params.id).lean()
        return res.status(200).send(book)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})


//-----------------------------------CRUD Operation for author-----------


app.post("/authors",async function(req,res){
    const author=await Author.create(req.body);
    return res.send(author)
})

app.get("/authors",async function(req,res){
    try{
        const author=await Author.find().populate("bookId").populate("sectionId").lean().exec()
        return res.status(200).send(author)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})

app.get("/authors/:id",async function(req,res){
    try{
        const authorsBook=await  Author.findById(req.params.id).populate("bookId").lean().exec()
        return res.status(200).send(authorsBook)
    }catch(err){
        return res.status(400).send(err.message)
    }
})


app.patch("/authors/:id",async function(req,res){
    try{
        const author=await Author.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean()
        return res.status(200).send(author)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})


app.delete("/authors/:id",async function(req,res){
    try{
        const author=await Author.findByIdAndDelete(req.params.id).lean()
        return res.status(200).send(author)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})



//------------------------------CRUD Operations for checkedout--------


app.post("/checkedouts",async function(req,res){
    const checkout=await Checkedout.create(req.body);
    return res.send(checkout)
})

app.post("/checkedouts/book",async function(req,res){})

app.get("/checkedouts",async function(req,res){
    try{
        const checkout=await Checkedout.find().populate("bookId").lean().exec()
        return res.status(200).send(checkout)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})


app.patch("/checkedouts/:id",async function(req,res){
    try{
        const checkout=await Checkedout.findByIdAndUpdate(req.params.id,req.body,{new:true}).lean()
        return res.status(200).send(checkout)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})


app.delete("/checkedouts/:id",async function(req,res){
    try{
        const checkout=await Checkedout.findByIdAndDelete(req.params.id).lean()
        return res.status(200).send(checkout1)
    }
    catch(err){
        return res.status(400).send(err.message)
    }
})




app.listen(2348,async()=>{
    await connect();
    console.log("listening on port 2348");
})