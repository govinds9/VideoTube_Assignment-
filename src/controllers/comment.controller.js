import mongoose from "mongoose"
import {Comment} from "../models/comment.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const {videoId} = req.params
    const {page = 1, limit = 10} = req.query

    const comments = await Comment.find({video:videoId}).skip((page-1)*limit).limit(limit)


    return res.status(200).json(new ApiResponse(200,comments,"Comments fetched Successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
     const {videoId} = req.params;
     const owner = req.user?._id
     const {content} = req.body;

     if(content.trim()===""){
       throw new ApiError(400,"comment is required")
     }

     const comment = await Comment.create({
        content,
        video:videoId,
        owner
     })
    
     const newComment = await Comment.findById(comment._id);
     if(!newComment){
        throw new ApiError(500, " Something went wrong while creatin a comment")
     }

     return res.status(200).json(new ApiResponse(200,newComment,"Comment Created Successfully"))


})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const {commentId} = req.params
    const {content} = req.body
    
    const comment = await Comment.findOne({_id:commentId})

    if(!comment)throw new ApiError(400, "Invalid comment Id")

    const updateComment = await Comment.findByIdAndUpdate(commentId,{
        $set:{
            content
        }
},{
    new:true
})

return res.status(200).json(new ApiResponse(200,updateComment,"Comment Updated Successfully"))


})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const {commentId} = req.params

    const comment = await Comment.findOne({id:commentId});
    if(!comment)throw new ApiError(400, "Invalid Comment Id")

    const deleteComment = await Comment.findByIdAndDelete(commentId)

    res.status(200).json(new ApiResponse(200,deleteComment,"Comment Deleted Successfully"))
})

export {
    getVideoComments, 
    addComment, 
    updateComment,
     deleteComment
    }
