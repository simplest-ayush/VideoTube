import mongoose from 'mongoose'
import { ApiError } from '../utils/ApiError.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { Video } from '../models/video.model.js'
import { Like } from '../models/like.model.js'
import { Subscription } from '../models/subscription.model.js'


const getChannelStats = asyncHandler(async (req, res) => {

    const userId = req.user?._id

    const videos = await Video.find({
        owner: userId
    }).select("videoFile thumbnail title description duration views createdAt")

    if (!videos) {
        throw new ApiError(500, "Couldn't fetch videos")
    }

    const videoCount = await Video.countDocuments({
        owner: userId
    })

    const subscriberCount = await Subscription.countDocuments({
        channel: userId
    })

    const totalViews = await Video.aggregate([
        {
            $match: {
                owner: userId
            }
        },
        {
            $group: {
                _id: null,
                totalViews: {
                    $sum: "$views"
                }
            }
        }
    ])

    const stats = {
        videos,
        videoCount,
        subscriberCount,
        totalViews: totalViews[0]?.totalViews || 0
    }
    if (!stats) {
        throw new ApiError(500, "Couldn't get stats of the channel")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                stats,
                "Channel Stats fetched successfully"
            )
        )
})


const getChannelVideos = asyncHandler(async (req, res) => {

    const userId = req.user?._id

    const videos = await Video.find(
        {
            owner: userId
        }
    ).select("videoFile thumbnail title description duration views createdAt")

    if (!videos) {
        throw new ApiError(500, "Couldn't fetch videos")
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "Videos fetched successfully"
            )
        )
})


export {
    getChannelStats,
    getChannelVideos
}