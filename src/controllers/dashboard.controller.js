import mongoose from "mongoose"
import {Video} from "../models/video.model.js"
import {Subscription} from "../models/subscription.model.js"
import {Like} from "../models/like.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.
    const userId = req.user?._id
    const channelStats = await Video.aggregate([
        {
            $match: {
                owner: userId,
            },
        },
        {
            $group: {
                _id: null,
                totalVideos: { $sum: 1 },
                totalViews: { $sum: '$views' },
            },
        },
        {
            $lookup: {
                from: 'likes',
                localField: '_id',
                foreignField: 'video',
                as: 'likes',
            },
        },
        {
            $addFields: {
                totalLikes: { $size: '$likes' },
            },
        },
        {
            $lookup: {
                from: 'subscriptions',
                localField: 'owner',
                foreignField: 'channel',
                as: 'subscribers',
            },
        },
        {
            $addFields: {
                totalSubscribers: { $size: '$subscribers' },
            },
        },
        {
            $project: {
                _id: 0,
                totalVideos: 1,
                totalViews: 1,
                totalLikes: 1,
                totalSubscribers: 1,
            },
        },
    ]);
    
    

    
    return res.status(200).json(new ApiResponse(200,channelStats[0],"Channel Statics are fetched Successfully"))
    
    
    
})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const videos = await Video.find({
        owner:req.user?._id
    })
    

   return res.status(200).json(new ApiResponse(200,videos,"Videos are fetched Successfully"))
})

export {
    getChannelStats, 
    getChannelVideos
    }