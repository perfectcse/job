import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
    const [query, setQuery] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const searchJobHandler = () => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className='text-center bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white py-20'>
            <div className='flex flex-col gap-6 my-10'>
                {/* <span className='mx-auto px-5 py-2 rounded-full bg-[#F83002] text-white font-semibold hover:bg-[#ff4500] transition-all duration-300 cursor-pointer'>
                    No. 1 Job Hunt Website
                </span> */}
                <span className='mx-auto px-5 py-2 rounded-full bg-gradient-to-r from-[#F83002] to-[#ff4500] text-white font-semibold shadow-lg transform hover:scale-105 transition-transform duration-300 ease-out cursor-pointer hover:shadow-2xl'>No. 1 Job Hunt Website</span>

                {/* <h1 className='text-6xl font-extrabold leading-tight'>
                    Search, Apply & <br /> Get Your <span className='text-[#6A38C2] hover:text-[#5b30a6] transition-all duration-300'>Dream Jobs</span>
                </h1> */}
                <h1 className='text-6xl font-extrabold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-[#6A38C2] to-[#F83002] hover:from-[#5b30a6] hover:to-[#ff4500] transition-all duration-300'>Search, Apply & <br /> Get Your <span className='text-white'>Dream Jobs</span></h1>

                {/* <p className='text-lg max-w-2xl mx-auto text-gray-300'>
                    Clear, concise, and highlight your most relevant qualifications for the job you're applying for. 
                    It can include key skills, years of experience, 
                    job titles, or any other information that makes you stand out as a candidate.
                </p> */}
                <p className='text-lg max-w-2xl mx-auto text-gray-300 bg-gradient-to-r from-gray-800 to-gray-900 p-6 rounded-lg shadow-lg border border-gray-700 hover:shadow-2xl transition-shadow duration-300'>Clear, concise, and highlight your most relevant qualifications for the job you're applying for. It can include key skills, years of experience, job titles, or any other information that makes you stand out as a candidate.</p>
                <div className='flex w-[60%] lg:w-[40%] shadow-lg border border-gray-700 pl-3 rounded-full items-center gap-4 mx-auto bg-white'>
                    <input
                        type="text"
                        placeholder='Find your dream jobs'
                        onChange={(e) => setQuery(e.target.value)}
                        className='outline-none border-none w-full px-3 py-2 text-gray-800 rounded-full'
                    />
                    <Button onClick={searchJobHandler} className="rounded-r-full bg-[#6A38C2] hover:bg-[#5b30a6] transition-all duration-300 px-6 py-2">
                        <Search className='h-5 w-5 text-white' />
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default HeroSection;
