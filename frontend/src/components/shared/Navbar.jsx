import React from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Button } from '../ui/button'
import { Avatar, AvatarImage } from '../ui/avatar'
import { LogOut, User2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const Navbar = () => {
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const logoutHandler = async () => {
        try {
            const res = await axios.get(`${USER_API_END_POINT}/logout`, { withCredentials: true });
            if (res.data.success) {
                dispatch(setUser(null));
                navigate("/");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    return (
        <div className='bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white shadow-lg'>
            <div className='flex items-center justify-between mx-auto max-w-7xl h-16 px-4'>
                <div>
                    <h1 className='text-3xl font-extrabold tracking-wide'>
                        Job<span className='text-[#F83002]'>Portal</span>
                    </h1>
                </div>
                <div className='flex items-center gap-12'>
                    <ul className='flex font-semibold items-center gap-6'>
                        {
                            user && user.role === 'recruiter' ? (
                                <>
                                    <li className="hover:text-[#F83002] transition-colors duration-300"><Link to="/admin/companies">Companies</Link></li>
                                    <li className="hover:text-[#F83002] transition-colors duration-300"><Link to="/admin/jobs">Jobs</Link></li>
                                </>
                            ) : (
                                <>
                                    <li className="hover:text-[#F83002] transition-colors duration-300"><Link to="/">Home</Link></li>
                                    <li className="hover:text-[#F83002] transition-colors duration-300"><Link to="/jobs">Jobs</Link></li>
                                    <li className="hover:text-[#F83002] transition-colors duration-300"><Link to="/browse">Browse</Link></li>
                                </>
                            )
                        }
                    </ul>
                    {
                        !user ? (
                            <div className='flex items-center gap-3'>
                                <Link to="/login"><Button variant="outline" className="bg-gradient-to-r from-green-400 to-blue-500 text-white border-transparent hover:bg-gradient-to-l hover:from-blue-500 hover:to-green-400 hover:text-white hover:shadow-lg transition-transform duration-300 transform hover:scale-105 px-6 py-2 rounded-full">Login</Button></Link>
                                <Link to="/signup"><Button className="bg-[#6A38C2] hover:bg-[#5b30a6] text-white">Signup</Button></Link>
                            </div>
                        ) : (
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Avatar className="cursor-pointer ring-2 ring-white hover:ring-[#F83002] transition-all duration-300">
                                        <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname || "User"} />
                                    </Avatar>
                                </PopoverTrigger>
                                <PopoverContent className="w-80 bg-gray-800 text-white border-none shadow-lg">
                                    <div className='p-4'>
                                        <div className='flex gap-4'>
                                            <Avatar className="cursor-pointer ring-2 ring-white">
                                                <AvatarImage src={user?.profile?.profilePhoto} alt={user?.fullname || "User"} />
                                            </Avatar>
                                            <div>
                                                <h4 className='font-medium text-lg'>{user?.fullname}</h4>
                                                <p className='text-sm text-gray-400'>{user?.profile?.bio}</p>
                                            </div>
                                        </div>
                                        <div className='flex flex-col mt-4 space-y-2'>
                                            {
                                                user && user.role === 'student' && (
                                                    <div className='flex w-fit items-center gap-2 cursor-pointer text-[#F83002]'>
                                                        <User2 />
                                                        <Button variant="link" className="text-white hover:text-[#F83002]"><Link to="/profile">View Profile</Link></Button>
                                                    </div>
                                                )
                                            }

                                            <div className='flex w-fit items-center gap-2 cursor-pointer text-[#F83002]'>
                                                <LogOut />
                                                <Button onClick={logoutHandler} variant="link" className="text-white hover:text-[#F83002]">Logout</Button>
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                </div>
            </div>
        </div>
    )
}

export default Navbar;
