import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { Button } from './ui/button';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setSearchedQuery } from '@/redux/jobSlice';

const category = [
    "Frontend Developer",
    "Backend Developer",
    "Data Science",
    "Graphic Designer",
    "FullStack Developer"
]

const CategoryCarousel = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    const searchJobHandler = (query) => {
        dispatch(setSearchedQuery(query));
        navigate("/browse");
    }

    return (
        <div className="relative w-full max-w-4xl mx-auto my-20">
            <Carousel className="w-full overflow-hidden relative bg-gray-100 rounded-lg shadow-lg">
                <CarouselContent className="flex space-x-4 transition-transform duration-500 ease-in-out">
                    {
                        category.map((cat, index) => (
                            <CarouselItem key={index} className="flex-shrink-0 w-1/2 md:w-1/3 lg:w-1/4 p-4 flex items-center justify-center">
                                <Button
                                    onClick={() => searchJobHandler(cat)}
                                    variant="outline"
                                    className="w-full h-24 flex items-center justify-center rounded-lg bg-gradient-to-r from-purple-400 to-indigo-600 text-white font-semibold shadow-lg hover:bg-gradient-to-l transition-all duration-300 transform hover:scale-105"
                                >
                                    {cat}
                                </Button>
                            </CarouselItem>
                        ))
                    }
                </CarouselContent>
                <CarouselPrevious className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-purple-600 text-white p-3 rounded-full cursor-pointer hover:bg-purple-700 transition-colors duration-300 shadow-lg" />
                <CarouselNext className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-purple-600 text-white p-3 rounded-full cursor-pointer hover:bg-purple-700 transition-colors duration-300 shadow-lg" />
            </Carousel>
        </div>
    )
}

export default CategoryCarousel;
