import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate();

    return (
        <div 
            onClick={() => navigate(`/description/${job._id}`)} 
            className='p-6 rounded-lg shadow-lg bg-white border border-gray-200 hover:shadow-2xl transition-shadow duration-300 cursor-pointer transform hover:scale-105'
        >
            <div>
                <h1 className='text-xl font-semibold text-gray-800'>{job?.company?.name}</h1>
                <p className='text-sm text-gray-500'>{job?.location || 'India'}</p>
            </div>
            <div className='mt-3'>
                <h1 className='text-2xl font-bold text-gray-900'>{job?.title}</h1>
                <p className='text-sm text-gray-700 mt-1'>{job?.description}</p>
            </div>
            <div className='flex items-center gap-3 mt-4'>
                <Badge className='bg-blue-100 text-blue-800 font-semibold' variant="ghost">{job?.position} Positions</Badge>
                <Badge className='bg-orange-100 text-orange-700 font-semibold' variant="ghost">{job?.jobType}</Badge>
                <Badge className='bg-purple-100 text-purple-700 font-semibold' variant="ghost">{job?.salary}LPA</Badge>
            </div>
        </div>
    )
}

export default LatestJobCards;
