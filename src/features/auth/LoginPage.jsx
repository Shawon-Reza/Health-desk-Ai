import React, { useState } from 'react';
import img from "../../assets/authimg.png";
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import icon from "../../assets/python.png";
import CommonButton from '../../Components/CommonButton';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Email:', email);
        console.log('Password:', password);
        // Add your authentication logic here
    };


    return (
        <div className='min-h-screen md:flex'>
            {/* Left Section - Login Form */}
            <section className='relative w-full h-screen md:w-1/2 flex items-center justify-center bg-white p-8'>
                <div className='w-full max-w-md'>
                    <div className='text-center mb-8'>
                        <h1 className='text-3xl font-bold primarycolor mb-2'>
                            Sign in to your account
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Email Section */}
                        <div className='space-y-4'>
                            <h2 className='text-lg font-semibold text-gray-700'>
                                Email address
                            </h2>
                            <div className='w-full'>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className='w-full p-3 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Section */}
                        <div className='space-y-4'>
                            <h2 className='text-lg font-semibold text-gray-700'>
                                Password
                            </h2>
                            <div className='relative w-full'>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    className='w-full p-3 pr-10 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                                    required
                                />
                                <span
                                    className='absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500'
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </span>
                            </div>
                        </div>


                        {/* Sign In Section */}
                        <div className='space-y-4'>
                           

                            <CommonButton
                                className="w-full "
                                type="submit"
                                text="Login"
                            />


                        </div>

                        {/* Target Password Question */}
                        <div className='text-center mt-6'>
                            <p className='text-gray-600 font-medium'>
                                Target password?
                            </p>
                        </div>
                    </form>

                    {/* Disclaimer */}
                    <div className='mt-12 text-center'>
                        <p className='text-sm text-gray-500'>
                            <strong>Disclaimer:</strong><br />
                            All Rights Reserved
                        </p>
                    </div>
                </div>
                {/* Absolute title display */}
                <div className='absolute top-8 left-7 flex items-center gap-2 primarycolor'>
                    <img src={icon} alt=""
                        className='h-12 w-12'
                    />
                    <p className='text-3xl font-bold'>AI.Desk</p>
                </div>

            </section>

            {/* Right Section - Image */}
            <section className='w-full md:w-1/2 h-screen hidden md:block'>
                <figure className='h-full'>
                    <img
                        src={img}
                        alt="Authentication visual"
                        className='w-full h-full object-cover'
                    />
                </figure>
            </section>
        </div>
    );
};

export default LoginPage;