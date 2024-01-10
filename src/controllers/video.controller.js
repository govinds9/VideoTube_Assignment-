import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.model.js"
import {User} from "../models/user.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    const videoLocalpath = req.files?.videoFile[0]?.path;
  const thumbnailLocalpath = req.files?.thumbnail[0]?.path;
    

  if(!title || !description || !videoLocalpath || !thumbnailLocalpath){
    if(videoLocalpath)fs.unlinkSync(videoLocalpath);
    if(thumbnailLocalpath)fs.unlinkSync(thumbnailLocalpath);
    throw new ApiError(400, " All Fields are Required")
  }

  //upload to cloaudinary
  const videores = await uploadOnCloudinary(videoLocalpath)
  // console.log(videores)
  const thumbnailres = await uploadOnCloudinary(thumbnailLocalpath)
 
  if(!videores || !thumbnailres){
    throw new ApiError(400," Video and Thumbnail are Required")
  }
  const videofile = await Video.create({
    videoFile:videores.url,
    thumbnail:thumbnailres.url,
    title,
    description,
    duration:videores.duration,
    owner:req.user?._id,
  })

  const newVideo = await Video.findById(videofile._id)

  if(!newVideo){
    throw new ApiError(500, "Something went wrong while adding Video to database")
  }

  return res.status(200).json(new ApiResponse(200,newVideo,"Video Uploaded Successfully"))
  


})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    const check = !isValidObjectId(videoId)
  
    if(check){
       throw new ApiError(400, "Invalid Video Id ")
    }

    const video = await Video.findById(videoId)

    if(!video){
      throw new ApiError(500, "Something Went wrong while Fetching video or video may be not exist")
    }


    return res.status(200).json(new ApiResponse(200,video,"Video Feched Successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
     const {title, description} = req.body
    //TODO: update video details like title, description, thumbnail
   
    const thumbnailLocalpath = req.file?.path;
    
    if(!title || !description || !thumbnailLocalpath){
      
      if(thumbnailLocalpath)fs.unlinkSync(thumbnailLocalpath);
      throw new ApiError(400, " All Fields are Required")
    }


    if(!isValidObjectId(videoId)){
      throw new ApiError(400, "Invalid Video Id ")
    }
    const thumbnailres = await uploadOnCloudinary(thumbnailLocalpath)
 
  if( !thumbnailres){
    throw new ApiError(400,"  Thumbnail are Required")
  }


    const updateVideoInformation = await Video.findByIdAndUpdate(videoId,{
      $set:{
        title,
        description,
        thumbnail:thumbnailres.url
      }
    },{
      new:true
    })



    return res.status(200).json(new ApiResponse(200,updateVideoInformation,"video Information Updated Successfully"))


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

    if(!isValidObjectId(videoId)){
      throw new ApiError(400, "Invalid Video Id ")
    }

    const delVideo = await Video.findByIdAndDelete(videoId)
if(!delVideo){
  throw new ApiError(500, "Something Went wrong while Deleting Video")
}
    return res.status(200).json(new ApiResponse(200,delVideo, " Video Deleted Successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    if(!isValidObjectId(videoId)){
      throw new ApiError(400, "Invalid Video Id ")
    }

    const toggleVideo = await Video.findByIdAndUpdate(videoId,{
      $set:{
        isPublished:true
      }
    },{
      new:true
    })


    return res.status(200).json(new ApiResponse(200,toggleVideo,"Video Published Successfully"))
    

  
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
