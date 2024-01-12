import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    // TODO: toggle subscription
    if(!isValidObjectId(channelId)){
        throw new ApiError(200,"Invalid Channel Id ")
    }

    const subsriber = await Subscription.create({
        subscriber:req.user?._id,
        channel:channelId
    })

    const newSubscriber = await Subscription.findById(subsriber._id);

    if(!newSubscriber){
        throw new ApiError(500,"Something went wrong while creating subscription")
    }

    return res.status(200).json(new ApiResponse(200,newSubscriber,"Channel Subscribe Successfully"))
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    if(!isValidObjectId(channelId)){
        throw new ApiError(400,"Invalid Channel Id ")
    }

    const subscriberList = await Subscription.aggregate([
        {
            $match:{
                channel:new mongoose.Types.ObjectId
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscribers"
            }
        },
        {
            $addFields:{
                subscriberCount:{
                    $size:"$subscribers"
                }
            }
        },
        {
            $project:{
                username:1,
                email:1,
                fullName:1,
                avatar:1,
                coverImage:1,
            }
        }
    ])

    res.status(200).json(new ApiResponse(200,subscriberList,"Subscriber are Fetched Successfully"))
})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    if(!isValidObjectId(subscriberId)){
        throw new ApiError(400,"Invalid SubriberId")

    }
   const channelList = await Subscription.aggregate([
    {
        $match:{
            subscriber:new mongoose.Types.ObjectId(subscriberId)
        }
    },
    {
    $lookup:{
        from:"users",
        localField:"channel",
        foreignField:"_id",
        as:"channels"
    }
    },
    
   {
            $project:{
                username:1,
                email:1,
                fullName:1,
                avatar:1,
                coverImage:1,
            }
      }
    
   ])


   res.status(200).json(new ApiResponse(200,channelList,"Subscribed Channel are fetched Successfully"))

})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}