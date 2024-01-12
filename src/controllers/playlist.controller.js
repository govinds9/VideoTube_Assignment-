import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.model.js"
import {ApiError} from "../utils/ApiError.js"
import {ApiResponse} from "../utils/ApiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description} = req.body
    //TODO: create playlist
     if(!name.trim() || !description?.trim()){
        throw new ApiError(400,"All fields are required")
     }

     const playlist = await Playlist.create({
        name,
        description,
        owner: req.user?._id
     })

     const newPlaylist = await Playlist.findById(playlist._id)

     if(!newPlaylist){
        throw new ApiError(500, " Something Went Wrong while Creating Playlist ")
     }

     return res.status(200).json(new ApiResponse(200,newPlaylist, "Playlist Created Successfully"))
    
})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const {userId} = req.params
    //TODO: get user playlists
   if(!isValidObjectId(userId)){
    throw new ApiError(400," Invalid userId ")
   }
   const playlists = await Playlist.find({
    owner:userId
   })
   if(!playlists){
    throw new ApiError(500,"No playlists Exist for given User")
   }
   
   return res.status(200).json(new ApiResponse(200,playlists,"Playlists fetched Successfully"))

})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id

if(!isValidObjectId(playlistId)){
    throw new ApiError(400," Invalid PlaylistId")
}
 const playlist = await Playlist.findById(playlistId)
 if(!playlist){
    throw new ApiError(500," Playlist not exist ")
 }

 return res.status(200).json(new ApiResponse(200,"Playlist is fetched successfully"))
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, " Invalid Playlist or video Id ")
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(500,"Playlist not exist ")
    }
    const availableVideo = await Video.findById(videoId)
    if(!availableVideo){
        throw new ApiError(500,"Video not Exist ")
    }

    if(availableVideo.owner!==req.user._id  || playlist.owner !== req.user._id){
        throw new ApiError(400, "UnAuthorized User trying to change playlist ")
    }
    playlist.videos.push(videoId)
   const videoAdded= await playlist.save()


    return res.status(200).json(200,videoAdded,"Video is added to plylist Successfully")

    

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    
    if(!isValidObjectId(playlistId) || !isValidObjectId(videoId)){
        throw new ApiError(400, " Invalid Playlist or video Id ")
    }

    const playlist = await Playlist.findById(playlistId);

    if(!playlist){
        throw new ApiError(500,"Playlist not exist ")
    }
    const availableVideo = await Video.findById(videoId)
    if(!availableVideo){
        throw new ApiError(500,"Video not Exist ")
    }

    if(availableVideo.owner!==req.user._id  || playlist.owner !== req.user._id){
        throw new ApiError(400, "UnAuthorized User trying to change playlist ")
    }
     
    const afterRemovePlaylist = await Playlist.findByIdAndUpdate(playlistId,{
        $pull:{
            videos:videoId
        }
    },{
        new:true
    })

    return res.status(200).json(new ApiResponse(200,afterRemovePlaylist,"Video Removed from playlist Successfully"))
})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist
    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, " Invalid playlist Id")

    }

    const deletedPlaylist  = await Playlist.findByIdAndDelete(playlistId)

    return res.status(200).json (new ApiResponse(200,deletedPlaylist, "Playlist Deleted Successfully"))
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(name.trim()==="" || description.trim()===""){
        throw new ApiError(400," All fields are required")
    }

    if(!isValidObjectId(playlistId)){
        throw new ApiError(400, "Invalid Playlist Id ")
    }

     const updatedPlaylist  = await Playlist.findByIdAndUpdate(playlistId,{
        $set:{
            name,
            description
        }
     },{
        new:true
     })


     res.status(200).json(new ApiResponse(200,updatedPlaylist, "Playlist Name and description Updated Successfully"))
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
