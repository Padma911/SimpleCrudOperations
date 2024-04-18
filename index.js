const fastify = require('fastify')({logger:true})

fastify.listen({port:3000})

const blogsData = require('./blogs')
//console.log(blogsData)

const sqlite3 = require('sqlite3')
const {open } = require('sqlite');
const path = require('path')
const dbPath = path.join(__dirname,'./blogs.db')

let db =null
const initailizingDb = async()=> {
    try{
db = await open({
filename:dbPath,
driver: sqlite3.Database
})

    }catch(e){
        console.log(`DB Error: ${e}`)
        process.exit(1)
    }
}
initailizingDb()


// const insertingData  = async(object) => {
//     const sqlQuery = `INSERT INTO blogs (id,title,image_url,avatar_url,author,topic)
//     VALUES 
//     (
//         ${object.id}, '${object.title}','${object.imageUrl}','${object.avatarUrl}','${object.author}','${object.topic}'
//     )
//     `
//     await db.run(sqlQuery)
// }

// fastify.post('/insertData', async(request,response)=>{
// blogsData.map(blog => insertingData(blog) )
// response.status(200);
// response.send("Inserted Data")
// })


fastify.get('/blogs', async(req,res)=>{
    const sqlQuery = `SELECT * FROM blogs;`
    const data = await db.all(sqlQuery)
    res.status(200);
    res.send(data)
})


fastify.post('/blogs',async(req,res)=>{
    const {id,title,imageUrl,avatarUrl,author,topic} = req.body;
    
   // console.log("ajfaoivmaoieahigakrrajkajioeaiifyauafhdjjkfakfdakkafjakkfjakkd")
    
    const sqlQuery = `INSERT INTO blogs (id,title,image_url,avatar_url,author,topic)
    VALUES (
        ${id}, '${title}','${imageUrl}', '${avatarUrl}','${author}', '${topic}'
    );
    `


    await db.run(sqlQuery);
    res.status(201);
    res.send("Data created Successfully");
})

fastify.put('/blogs/:id',async(req,res)=>{
    const {id} = req.params;
    const {title,imageUrl,avatarUrl,author,topic} = req.body 
    const sqlQuery = `
    UPDATE blogs
    SET 
    title = '${title}',
    image_url = '${imageUrl}',
    avatar_url = '${avatarUrl}',  
    author = '${author}',
    topic='${topic}'
WHERE 
id =${id}

    `;


    await db.run(sqlQuery);
    res.status(201);
    res.send("Data  Updated Successfully");

})


fastify.delete ('/blogs/:id', async(req,res)=>{
const {id} = req.params
const sqlQuery = `DELETE FROM blogs WHERE id = ${id};`;

await db.run(sqlQuery);

res.status(200);
res.send("Blog Deleted Successfully")


})