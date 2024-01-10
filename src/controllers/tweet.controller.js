import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content} = req.body
    if(!content){
        throw new ApiError(400," All fields are required ")
    }

    const tweet = await Tweet.create({
        content,
        owner:req.user?._id
    })

    const newTweet = await Tweet.findById(tweet._id)

   if(!newTweet){
    throw new ApiError(500," Something Went Wrong while creating tweet")
   }

   return res.status(200).json(new ApiResponse(200,newTweet,"Tweet Created Successfully"))
})

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const {userId} = req.params

    if(!isValidObjectId(userId)){
        throw new ApiError(400,"Invalid User Id")

    }
    const tweets = await Tweet.find({
        owner:userId
    })

    
    return res.status(200).json(new ApiResponse(200, tweets,"Tweets are fetched Successfully"))

})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {tweetId} = req.params
    const {content } =req.body
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid TweetId ")
    }

    if(!content?.trim()){
      throw new ApiError(400,"content is required for update a tweet")
    }

    const updatedTweet  = await Tweet.findByIdAndUpdate(tweetId,{
        $set:{
            content
        }
    },{
        new:true
    })

    return res.status(200).json(new ApiResponse(200,updatedTweet,"Tweet Updated Successfully"))
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const {tweetId} = req.params
    if(!isValidObjectId(tweetId)){
        throw new ApiError(400,"Invalid tweetId")
    }
    const deletedTweet = await Tweet.findByIdAndDelete(tweetId)
   

    return res.status(200).json(new ApiResponse(200,deletedTweet,"Tweet Deleted Successfully"))

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
