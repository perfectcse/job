import React, { useEffect, useState } from 'react'
import Navbar from '../shared/Navbar'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { RadioGroup } from '../ui/radio-group'
import { Button } from '../ui/button'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { setLoading } from '@/redux/authSlice'
import { Loader2 } from 'lucide-react'

const Signup = () => {
    const [input, setInput] = useState({
        fullname: "",
        email: "",
        phoneNumber: "",
        password: "",
        role: "",
        profilePhoto: null,
        resume: null
    });
    const { loading, user } = useSelector(store => store.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const changeFileHandler = (e) => {
        setInput({ ...input, profilePhoto: e.target.files?.[0] });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("password", input.password);
        formData.append("role", input.role);

        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }

        try {
            dispatch(setLoading(true));
            const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
                headers: { 'Content-Type': "multipart/form-data" },
                withCredentials: true,
            });
            if (res.data.success) {
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            dispatch(setLoading(false));
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className='bg-gray-50 min-h-screen'>
            <Navbar />
            <div className='flex items-center justify-center max-w-7xl mx-auto'>
                <form onSubmit={submitHandler} className='w-full sm:w-3/4 md:w-1/2 bg-white border border-gray-300 rounded-lg shadow-xl p-8 my-10 transition-all duration-300 hover:shadow-2xl'>
                    <h1 className='font-extrabold text-2xl mb-6 text-gray-800'>Sign Up</h1>
                    <div className='my-4'>
                        <Label className='text-gray-700'>Full Name</Label>
                        <Input
                            type="text"
                            value={input.fullname}
                            name="fullname"
                            onChange={changeEventHandler}
                            placeholder="John Doe"
                            className='mt-1 p-3 border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:bg-white transition-all duration-200'
                        />
                    </div>
                    <div className='my-4'>
                        <Label className='text-gray-700'>Email</Label>
                        <Input
                            type="email"
                            value={input.email}
                            name="email"
                            onChange={changeEventHandler}
                            placeholder="example@gmail.com"
                            className='mt-1 p-3 border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:bg-white transition-all duration-200'
                        />
                    </div>
                    <div className='my-4'>
                        <Label className='text-gray-700'>Phone Number</Label>
                        <Input
                            type="text"
                            value={input.phoneNumber}
                            name="phoneNumber"
                            onChange={changeEventHandler}
                            placeholder="123-456-7890"
                            className='mt-1 p-3 border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:bg-white transition-all duration-200'
                        />
                    </div>
                    <div className='my-4'>
                        <Label className='text-gray-700'>Password</Label>
                        <Input
                            type="password"
                            value={input.password}
                            name="password"
                            onChange={changeEventHandler}
                            placeholder="••••••••"
                            className='mt-1 p-3 border border-gray-300 rounded-md bg-gray-100 focus:border-blue-500 focus:bg-white transition-all duration-200'
                        />
                    </div>
                    <div className='flex items-center gap-4 my-5'>
                        <RadioGroup className="flex items-center gap-6">
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="student"
                                    checked={input.role === 'student'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label className='text-gray-700'>Student</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Input
                                    type="radio"
                                    name="role"
                                    value="recruiter"
                                    checked={input.role === 'recruiter'}
                                    onChange={changeEventHandler}
                                    className="cursor-pointer"
                                />
                                <Label className='text-gray-700'>Recruiter</Label>
                            </div>
                        </RadioGroup>
                    </div>
                    <div className='flex items-center gap-4 my-5'>
                        <Label className='text-gray-700'>Profile Photo</Label>
                        <Input
                            accept="image/*"
                            type="file"
                            onChange={changeFileHandler}
                            className="cursor-pointer border border-gray-300 rounded-md p-2 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
                        />
                    </div>
                    {
                        loading ? (
                            <Button className="w-full my-4 flex items-center justify-center bg-gray-300 hover:bg-gray-400 text-white transition-all duration-200">
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait
                            </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4 bg-[#6A38C2] hover:bg-[#5b30a6] text-white rounded-md transition-all duration-300">
                                Signup
                            </Button>
                        )
                    }
                    <span className='text-sm text-gray-600'>
                        Already have an account? <Link to="/login" className='text-blue-600 hover:underline'>Login</Link>
                    </span>
                </form>
            </div>
        </div>
    )
}

export default Signup;
