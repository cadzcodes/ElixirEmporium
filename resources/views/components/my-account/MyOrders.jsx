import React, { useEffect, useState } from 'react';
import axios from 'axios';

const filterTabs = ['All', 'To Ship', 'To Receive', 'Completed', 'Cancelled'];
const ITEMS_PER_PAGE = 5;

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [filter, setFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        axios.get('/my-orders')
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch orders:', err);
                setLoading(false);
            });
    }, []);

    const filtered = filter === 'All'
        ? orders
        : orders.filter(order => order.status === filter);

    const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    useEffect(() => {
        setPage(1); // Reset to first page when filter changes
    }, [filter]);

    if (loading) return <div className="text-white mt-10 text-center">Loading orders...</div>;

    return (
        <div className="space-y-6 px-4 max-w-5xl mx-auto">
            <h2 className="font-modern-negra text-5xl text-yellow mb-4">My Orders</h2>

            <div className="flex gap-3 mb-6 flex-wrap">
                {filterTabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setFilter(tab)}
                        className={`px-4 py-2 rounded-full border transition-all
                            ${filter === tab ? 'bg-yellow text-black' : 'border-yellow/30 text-yellow hover:bg-yellow/10'}`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {paginated.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center border border-yellow/20 rounded-2xl bg-gradient-to-br from-[#1a1a1a] via-[#222] to-[#1a1a1a] shadow-inner relative overflow-hidden">
                    {/* Glow effect */}
                    <div className="absolute -top-10 -left-10 w-64 h-64 bg-yellow/10 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-yellow/10 rounded-full blur-3xl animate-pulse delay-200"></div>

                    {/* Icon */}
                    <div className="text-yellow text-6xl mb-6 drop-shadow-lg">
                        🛍️
                    </div>

                    {/* Heading */}
                    <h3 className="text-white text-2xl font-semibold font-modern-negra mb-2 tracking-wide">
                        No Orders Yet
                    </h3>

                    {/* Description */}
                    <p className="text-gray-400 max-w-sm mb-6">
                        Looks like you haven’t placed any orders. Explore our exclusive collection and start your Elixir journey today.
                    </p>

                    {/* CTA Button */}
                    <a
                        href="/"
                        className="inline-block px-6 py-3 bg-yellow text-black rounded-full font-semibold shadow-md hover:bg-white transition-all"
                    >
                        Start Shopping
                    </a>
                </div>

            ) : (
                paginated.map(order => (
                    <div
                        key={order.id}
                        onClick={() => window.location.href = `/order-details/${order.id}`}
                        className="cursor-pointer bg-[#1a1a1a] border border-yellow/20 rounded-xl shadow-md p-6 space-y-4 hover:border-yellow/40 transition-all"
                    >
                        <div className="flex justify-between items-center flex-wrap gap-2">
                            <div className="text-lg font-semibold text-white">Order #{order.id}</div>
                            <span className="text-sm text-yellow">{order.status}</span>
                        </div>

                        <div className="flex gap-3 overflow-x-auto sm:flex-wrap sm:gap-4">
                            {order.products.map((p, idx) => (
                                <div
                                    key={idx}
                                    className="flex-shrink-0 w-16 h-16 rounded border border-white/10 overflow-hidden bg-white/5"
                                >
                                    <img
                                        src={p.image || '/images/placeholder.png'}
                                        alt={p.name}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-between text-sm text-gray-400">
                            <span>{order.item_count} item{order.item_count > 1 ? 's' : ''}</span>
                            <span>Total: ₱{Number(order.total).toFixed(2)}</span>
                        </div>

                        <div className="text-xs text-gray-500">Ordered on {order.created_at}</div>
                    </div>
                ))
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 1}
                        className="text-yellow/80 disabled:opacity-30"
                    >
                        &laquo; Prev
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => handlePageChange(i + 1)}
                            className={`px-3 py-1 rounded-full border ${page === i + 1
                                ? 'bg-yellow text-black'
                                : 'text-yellow border-yellow/30 hover:bg-yellow/10'
                                }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages}
                        className="text-yellow/80 disabled:opacity-30"
                    >
                        Next &raquo;
                    </button>
                </div>
            )}
        </div>
    );
};

export default MyOrders;
