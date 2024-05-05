import React, { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import ethEntryABI from './ethEntry.json'; // Corrected import path
const ethers = require('ethers');



const contractAddress =  "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const provider = new ethers.providers.Web3Provider(window.ethereum);
const EthEntry = new ethers.Contract(contractAddress, ethEntryABI, provider);

    const navigation = [
        { name: 'About Us', href: '/' },
    ];

    const callContractFunction = async () => {
        if (typeof window.ethereum === 'undefined') {
            console.error('MetaMask not detected');
            return;
        }

        try {
            // Request account access
            await window.ethereum.request({method: 'eth_requestAccounts'});

            // Get the signer
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();

            // Connect to the contract using the signer
            const EthEntryWithSigner = new ethers.Contract(contractAddress, ethEntryABI, signer);

            // Call the contract function
            const tx = await EthEntryWithSigner.buyTicket(1);
            await tx.wait(); // Wait for the transaction to be mined
            console.log('Transaction successful:', tx.hash);
        } catch (error) {
            console.error('Error calling smart contract function:', error);
        }
    };

    const WithdrawFunds = async () => {
    try {
        // Connect to the contract using the signer
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, ethEntryABI, signer);

        // Call the withdraw function
        const tx = await contract.withdraw();
        await tx.wait(); // Wait for the transaction to be mined
        console.log('Withdrawal successful:', tx.hash);
    } catch (error) {
        console.error('Error withdrawing funds:', error);
    }
}


    const BigBlock = ({title, description, url}) => (
        <div
            className="p-8 gap-2 pb-4 rounded-lg shadow-md border border-purple-500 bg-opacity-80 hover:bg-opacity-100 hover:shadow-2xl transition duration-500 ease-in-out">
            <h2 className="text-xl font-semibold mb-2">{title}</h2>
            <p className="text-base font-semibold">{description}</p>
            <img src={url} alt="logo"
                 className="h-20 w-15 ml-60 mb-4" // Adjust the width as needed

            />
            <button
                className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                onClick={callContractFunction}> Get tickets
            </button>

        </div>
    );


    export default function Home() {
        const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
        const [connectButtonText, setConnectButtonText] = useState("Connect");
        const footerRef = useRef(null);


        async function connect() {
            if (typeof window.ethereum !== "undefined") {
                try {
                    await ethereum.request({method: "eth_requestAccounts"});
                    setConnectButtonText("Connected");
                    const accounts = await ethereum.request({method: "eth_accounts"});
                    console.log(accounts);
                } catch (error) {
                    console.log(error);
                }
            } else {
                setConnectButtonText("Please install MetaMask");
            }
        }

        function scrollToFooter() {
            footerRef.current.scrollIntoView({behavior: 'smooth'});
        }

        return (

            <div className="bg-indigo-200">
                <header className="absolute inset-x-0 top-0 z-50">
                    <nav className="flex items-center justify-between p-0 lg:px-8" aria-label="Global">
                        <div className="flex lg:flex-1 items-center">
                            <Link to="/">
                                <img
                                    className="h-24 w-24 mr-2"
                                    src={"../new.svg"}
                                    alt="EthLogo"
                                />
                            </Link>
                        </div>
                        <div className="flex lg:hidden">
                            <button
                                type="button"
                                className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
                                onClick={() => setMobileMenuOpen(true)}
                            >
                                <span className="sr-only">Open main menu</span>
                                <Bars3Icon className="h-6 w-6" aria-hidden="true"/>
                            </button>
                        </div>
                        <div className="hidden lg:flex lg:gap-x-12">
                            {navigation.map((item) => (
                                <Link key={item.name} to={item.href}
                                      className="text-sm font-semibold leading-6 text-gray-900">
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                        <div className="absolute right-36">
                            <button onClick={WithdrawFunds} className="text-sm font-semibold leading-6 text-gray-900">
                                Withdraw
                            </button>

                        </div>

                        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                            <button onClick={connect} className="text-sm font-semibold leading-6 text-gray-900">
                                {connectButtonText}
                            </button>
                        </div>

                    </nav>
                    <Dialog as="div" className="lg:hidden" open={mobileMenuOpen}
                            onClose={() => setMobileMenuOpen(false)}>
                        <div className="fixed inset-0 z-50"/>
                        <Dialog.Panel
                            className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                            <div className="flex items-center justify-between">
                                <Link to="/" className="-m-1.5 p-1.5">
                                    <span className="sr-only"></span>
                                    <img
                                        className="h-8 w-8"
                                        src="../new.jpg"
                                        alt=""
                                    />
                                </Link>
                                <button
                                    type="button"
                                    className="-m-2.5 rounded-md p-2.5 text-gray-700"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    <span className="sr-only">Close menu</span>
                                    <XMarkIcon className="h-6 w-6" aria-hidden="true"/>
                                </button>
                            </div>
                            <div className="mt-6 flow-root">
                                <div className="-my-6 divide-y divide-gray-500/10">
                                    <div className="space-y-2 py-6">
                                        {navigation.map((item) => (
                                            <Link
                                                key={item.name}
                                                to={item.href}
                                                className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                            >
                                                {item.name}
                                            </Link>
                                        ))}
                                    </div>
                                    <div className="py-6">
                                        <Link
                                            to="/signin"
                                            className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                                        >
                                            Log in
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </Dialog.Panel>
                    </Dialog>
                </header>
                <div className="relative isolate px-6 pt-14 lg:px-8">
                    <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
                        <div
                            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                    <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
                        </div>
                        <div className="text-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                <h1 className="text-6xl font-medium">EthEntry </h1>
                                <h2 className="mt-6 leading-8">
                                    Web3 solution simplifying Ticket Booking
                                </h2>
                                <p className="mt-6 text-lg leading-8 text-gray-500">
                                    It allows you to create events on Ethereum and sell NFT
                                    tickets.
                                </p>
                            </h1>

                            <div className="mt-10 flex items-center justify-center gap-x-6">
                                <Link
                                    onClick={scrollToFooter}
                                    to="#"
                                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                >
                                    Get Tickets
                                </Link>
                                <Link to="#" className="text-sm font-semibold leading-6 text-gray-900">
                                    <span aria-hidden="true"></span>
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="absolute inset-x-0  -z-10 blur-3xl sm:top-[calc(100%-30rem)]\">
                        <div
                            className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                            style={{
                                clipPath:
                                    'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                            }}
                        />
                    </div>
                    <div className="mt-10 gap-8">
                        <div
                            className="p-6 rounded-lg shadow-md border border-purple-500 bg-opacity-80 hover:bg-opacity-100 hover:shadow-2xl transition duration-500 ease-in-out">
                            <div className="flex lg:flex-1 items-center">
                                <img
                                    className="h-8 w-auto mr-2"
                                    src={"../download-modified.png"}
                                    
                                />
                                
                                    Trust and Transparency
                                
                            </div>
                            <p className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-opacity-100">All
                                transactions are recorded on the blockchain, providing a transparent
                                history of ticket sales and transfers.</p>
                        </div>

                        <div
                            className="p-6 rounded-lg shadow-md border border-purple-500 bg-opacity-80 hover:bg-opacity-100 hover:shadow-2xl transition duration-500 ease-in-out">
                            <div className="flex lg:flex-1 items-center">
                                <img
                                    className="h-8 w-auto mr-2"
                                    src={"../chat.png"}
                                    alt=" Ease Logo"
                                />+
                                <Link
                                    to="/chatwithbot"
                                    className="-mx-3 block rounded-lg px-3 py-2 text-xl font-semibold leading-7 text-gray-900 hover:bg-transparent"
                                >
                                    Preventing Counterfeit Tickets
                                </Link>
                            </div>
                            <p className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-opacity-100">
                                By using NFTs (Non-Fungible Tokens), each ticket is unique and ownership can
                                be verified on the blockchain. This makes it nearly impossible to create counterfeit
                                tickets
                            </p>
                        </div>

                        <div
                            className="p-6 rounded-lg shadow-md border border-purple-500 bg-opacity-80 hover:bg-opacity-100 hover:shadow-2xl transition duration-500 ease-in-out">
                            <div className="flex lg:flex-1 items-center">
                                <img
                                    className="h-8 w-auto mr-2"
                                    
                                    alt="EthEntry"
                                />
                                <Link
                                    className="-mx-3 block rounded-lg px-3 py-2 text-xl font-semibold leading-7 text-gray-900 hover:bg-transparent"
                                >
                                    No Scalping and Price Gouging
                                </Link>
                            </div>
                            <p className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold leading-7 text-gray-900 hover:bg-opacity-100">
                                We can program our smart contracts to enforce rules about ticket
                                transfers and pricing, which could help prevent scalping and price gouging
                            </p>
                        </div>

                        <div
                            className="p-6 rounded-lg shadow-md border border-purple-500 bg-opacity-80 hover:bg-opacity-100 hover:shadow-2xl transition duration-500 ease-in-out">
                            <div className="flex lg:flex-1 items-center">
                                
                                <Link
                                    className="-mx-3 block rounded-lg px-3 py-2 text-xl font-semibold leading-7 text-gray-900 hover:bg-transparent"
                                >
                                    Ownership Rights
                                </Link>
                            </div>
                            <p>
                                NFTs can give digital ownership rights back to the consumers. For example, if a
                                concert is recorded, the NFT could potentially include rights to a digital copy of that
                                concert.
                            </p>
                        </div>
                        <h2 className="text-4xl font-bold mt-10 mb-6 text-center">Upcoming Events</h2>
                        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                            <BigBlock title="Concert" description="Description for Concert" url="concert.jpeg"
                                      onClick={callContractFunction}/>
                            <BigBlock title="IPL Tickets" description="Description for IPL Tickets" url="ipl.jpeg"
                                      onClick={callContractFunction}/>
                            <BigBlock title="Movie Tickets" description="Description for Movie Tickets" url="movie.jpeg"
                                      onClick={callContractFunction}/>
                            <BigBlock title="Music Shows" description="Description for Music Shows" url="music.jpeg"
                                      onClick={callContractFunction}/>
                        </div>
                    </div>
                    <footer className="bg-indigo-200 text-black py-12 mt-20" ref={footerRef}>
                        <div className="container mx-auto flex flex-col items-center">
                            <div className="mb-6 text-center">
                                <h3 className="text-xl font-semibold mb-3">Quick Links</h3>
                                <ul className="text-sm">
                                    <li><Link to="/about">About Us</Link></li>
                                    <li><Link to="/services">Our Services</Link></li>
                                    <li><Link to="/contact">Contact Us</Link></li>
                                </ul>
                            </div>
                            <div className="mb-6 text-center">
                                <h3 className="text-xl font-semibold mb-3">EthEntry</h3>
                                <p className="text-sm"></p>
                            </div>
                            <div className="text-center">
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        );
    }

