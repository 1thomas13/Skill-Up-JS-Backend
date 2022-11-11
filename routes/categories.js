const express = require('express')
const {
   createCategory, getCategories, getCategoryById, modifyCategory, deleteCategory
} = require('../controllers/categories')

const router = express.Router()

router.post("/", async function(req, res){
    let {name, description} = req.body
    try{
        var cat = await createCategory(name, description )
        res.send("Category created")
    }
    catch(e){
        res.send(e.message)
    }
})

router.get("/", async function(req, res){
    try{
        var cat = await getCategories()
        res.json(cat)
    }
    catch(e){
        res.send(e.message)
    }
})

router.get("/:id", async function(req, res){
    let {id}=req.params
    try{
        var cat = await getCategoryById(id)
        res.json(cat)
    }
    catch(e){
        res.send(e.message)
    }
})

router.put("/:id", async function(req,res){
    let{id}=req.params
    let {name, description} = req.body
    try{
        var cat = await modifyCategory(id, name, description)
        res.send("Category updated")
    }
    catch(e){
        res.send(e.message)
    }
})

router.delete("/:id", async function(req, res){
    let{id}=req.params
    try{
        var cat = await deleteCategory(id)
        res.send("Category deleted")
    }
    catch(e){
        res.send(e.message)
    }
})

module.exports = router