import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video
    if(!isValidObjectId(videoId)){
        throw new ApiError(400,"Invalid videoId")
    }

    const createLike = await Like.create({
        video:videoId,
        likedBy:req.user?._id

    })

    const newLike = await Like.findById(createLike._id);


    if(!newLike){
        throw new ApiError(500," Something went wrong while creating like")
    }

    return res.status(200).json(new ApiResponse(200,newLike,"Video liked Successfully"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!isValidObjectId(commentId)){
        throw new ApiError(400,"Invalid Comment Id")
    }

    const createLike = await Like.create({
        comment:commentId,
        likedBy:req.user?._id

    })

    const newLike = await Like.findById(createLike._id);


    if(!newLike){
        throw new ApiError(500," Something went wrong while creating like")
    }

    return res.status(200).json(new ApiResponse(200,newLike,"Comment liked Successfully"))



})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid TweetId")
    }

    const createLike = await Like.create({
        tweet:tweetId,
        likedBy:req.user?._id

    })

    const newLike = await Like.findById(createLike._id);


    if(!newLike){
        throw new ApiError(500," Something went wrong while creating like")
    }

    return res.status(200).json(new ApiResponse(200,newLike,"Tweet liked Successfully"))


}
)

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const userId = req.user?._id

const data = await Like.aggregate(
    [
        {
            $match:{
                likedBy: new mongoose.Types.ObjectId(userId)
            }
        },
        {
                    $lookup:{
                        from:'videos',
                        localField:'video',
                        foreignField:'_id',
                        as:"likedvideos"
                    }
        },
                {
                    $unwind: '$likedvideos', // Unwind the array
                  },
                  {
                    $project: {
                      _id: '$likedvideos._id',
                      videoFile: '$likedvideos.videoFile',
                      thumbnail: '$likedvideos.thumbnail',
                      title: '$likedvideos.title',
                      description: '$likedvideos.description',
                      duration: '$likedvideos.duration',
                      views: '$likedvideos.views',
                      owner: '$likedvideos.owner',
                    },
                  },
    ]
    
)

 
 if(!data?.length){
    throw new ApiError(404, "videos does not exists")
 }

 return res.status(200).json(new ApiResponse(200,data,"Liked Video Fetched Successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}