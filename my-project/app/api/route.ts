import { NextRequest } from "next/server";
import { pool } from "@/lib/db";


//Create a new blog post
export async function POST(req: NextRequest) {
    try{ 
        const body = await req.json(); 
        const {title, content, category, tags } = body; 

        if(title === null || content === null || category === null){ 
            return Response.json(
                {message: "Require data is empty..."}, 
                {status: 400}
            );
        }
        
            const posts = await pool.query(
                 `INSERT INTO posts (title, content, category, tags)
                    VALUES ($1, $2, $3, $4)
                    RETURNING *`, [title, content, category, tags]
            );
        return Response.json (
            {message: "Creating a new post successfully!", posts: posts.rows},
            {status: 201}
        );
        
    }catch(err){
        console.error(err);
        return Response.json(
            {message: "Interal error"},
            {status: 500}
        );
     }
}


//Get all blog posts
export async function GET(req: NextRequest) {
    try{
        const search = req.nextUrl.searchParams.get("search"); 
        const value: string[] = [];
        let query = "SELECT * FROM posts";

        if(search){ 
            query += `WHERE title ILIKE $1 OR content ILIKE $1 OR category ILIKE $1 OR tags ILIKE $1` ;
            value.push(`%${search}%`);
        }
        
        const post = await pool.query(query,value);

        return Response.json(
            {massage: "Getting all post succesfully", post: post.rows},
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
//Filter blog posts by a search term
