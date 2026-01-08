
import { NextRequest, NextResponse } from "next/server";
import { pool } from "@/lib/db";

//Update an existing blog post

export async function PUT(req: NextRequest, context: {params: Promise<{id: string}>}) {
   try{ 
    const {id: postID} = await context.params; 
        const body = await req.json(); 
        const {title, content, category, tags, createdAt, updateAt} = body; 
        if(!title || !content || !category || !tags){ 
            return Response.json(
                {message: "mising field"},
                {status: 400}
            )
        }; 

        const updatePost = await pool.query(
            `UPDATE posts
            SET title = $1, content = $2, category = $3, tags = $4, createdAt = $5, updateAt = $6
            WHERE id = $7
            RETURNING *`, [title, content, category, tags, createdAt, updateAt, postID]
        ); 
        if (updatePost.rows.length === 0) {
            return Response.json(
                { message: "Not Found!" },
                { status: 404 }
            );
        }

        return Response.json(
            {message: "Updating post successfully!"}, 
            {status: 200}
        );
   }catch(err){
        console.error(err); 
       return Response.json(
            {message: "Bad Request"}, 
            {status: 400}
        ); 
   }
}
//Delete an existing blog post
export async function DELETE(context: {params: Promise <{id: string}>}) {
    try{
     const {id: postID} = await context.params; 
     const postDelete = await pool.query(
        `DELETE FROM posts
        WHERE id = $1 RETURNING *`, [postID]
     )
     if(postDelete.rows.length === 0){
         return Response.json(
            {message: "Not Found"}, 
            {status: 404}
        );
     }

     return Response.json(
        {message: "No Content"},
        {status: 204}
     );

    }catch (err){
        console.error(err); 
        return Response.json(
            {message: "Interal error"}, 
            {status: 500}
        );
    }
}

//Get a single blog post
export async function GET(context: {params: Promise<{id: string}>}) {
    try{
        const {id: postID} = await context.params; 
        
        const post = await pool.query(
            `SELECT * FROM posts
            WHERE id = $1`, [postID]
        );

        if(post.rows.length ===0){ 
            return Response.json(
                {message: "Not Found"}, 
                {status: 404}
            );            
        }

        return Response.json(
            {message: "OK"}, 
            {status: 200}
        );
        
    }catch(err){ 
        console.error(err); 
        return Response.json(
            {message: "Interal error"}, 
            {status: 500}
        );
    }
}