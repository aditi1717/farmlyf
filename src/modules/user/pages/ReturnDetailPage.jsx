
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useShop } from '../../../context/ShopContext';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, RefreshCw, CheckCircle, Clock, Truck, XCircle, AlertCircle, Search, Package, ShoppingBag } from 'lucide-react';

const ReturnDetailPage = () => {
    const { returnId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getReturnById, getVariantById } = useShop();
    const [returnRequest, setReturnRequest] = React.useState(null);

    React.useEffect(() => {
        if (user && returnId) {
            const fetchReturn = () => {
                const found = getReturnById(user.id, returnId);
                setReturnRequest(found);
            };

            fetchReturn();
            const interval = setInterval(fetchReturn, 5000);
            return () => clearInterval(interval);
        }
    }, [user, returnId, getReturnById]);

    if (!returnRequest) {
        return <div className="min-h-screen flex items-center justify-center">Return request not found</div>;
    }

    const isReplace = returnRequest.type === 'replace';

    const refundSteps = [
        { status: 'Pending', label: 'Requested', icon: Clock },
        { status: 'Approved', label: 'Approved', icon: CheckCircle },
        { status: 'Picked Up', label: 'Picked Up', icon: Truck },
        { status: 'Refunded', label: 'Refunded', icon: RefreshCw }
    ];

    const replaceSteps = [
        { status: 'Pending', label: 'Requested', icon: Clock },
        { status: 'Approved', label: 'Approved', icon: CheckCircle },
        { status: 'Picked Up', label: 'Picked Up', icon: Truck },
        { status: 'Quality Check', label: 'QC Check', icon: Search },
        { status: 'Dispatched', label: 'Dispatched', icon: Package },
        { status: 'Delivered', label: 'Delivered', icon: ShoppingBag }
    ];

    const steps = isReplace ? replaceSteps : refundSteps;
    const currentStepIndex = steps.findIndex(s => s.status === returnRequest.status);
    const isRejected = returnRequest.status === 'Rejected';
    const isCompleted = isReplace
        ? returnRequest.status === 'Delivered'
        : returnRequest.status === 'Refunded';

    const replacementVariant = isReplace && returnRequest.replacementVariantId
        ? getVariantById(returnRequest.replacementVariantId)
        : null;

    return (
        <div className="bg-[#fcfcfc] min-h-screen py-12">
            <div className="px-4 md:px-12 w-full">
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={() => navigate('/returns')} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                        <ArrowLeft size={24} />
                    </button>
                    <div>
                        <h1 className="text-2xl font-black text-footerBg uppercase tracking-tight">{isReplace ? 'Replacement Status' : 'Return Status'}</h1>
                        <p className="text-gray-500 text-sm mt-1 font-mono">ID: {returnRequest.id}</p>
                    </div>
                </div>

                <div className="max-w-4xl mx-auto">
                    {/* Status Timeline Card */}
                    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-6 mb-6">
                        <h3 className="font-bold text-footerBg mb-6">Request Timeline</h3>

                        {isRejected ? (
                            <div className="bg-red-50 p-4 rounded-xl flex items-center gap-3 text-red-700 border border-red-100">
                                <XCircle size={24} />
                                <div>
                                    <p className="font-bold">Request Rejected</p>
                                    <p className="text-sm">Your return request was rejected. Please contact support for details.</p>
                                </div>
                            </div>
                        ) : (
                            <div className="relative mb-8 px-4 py-4">
                                {/* Background Line */}
                                <div className="absolute top-9 left-0 h-1 bg-gray-100 -translate-y-1/2 rounded-full z-0" style={{ left: '12.5%', width: '75%' }} />

                                {/* Progress Line */}
                                <div
                                    className="absolute top-9 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000 ease-out z-0"
                                    style={{
                                        left: '12.5%',
                                        width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 75}%`
                                    }}
                                />

                                {/* Steps */}
                                <div className="relative z-10 flex w-full">
                                    {steps.map((step, index) => {
                                        const isActive = index <= currentStepIndex;
                                        const isStepCompleted = index < currentStepIndex || (index === currentStepIndex && isCompleted);
                                        const isCurrent = index === currentStepIndex;
                                        const Icon = step.icon;

                                        return (
                                            <div key={index} className="flex-1 flex flex-col items-center">
                                                {/* Icon Circle */}
                                                <div
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 mb-3
                                                        ${isStepCompleted ? 'bg-primary border-primary text-white' : 'bg-white'}
                                                        ${isCurrent && !isStepCompleted ? 'border-primary text-primary shadow-md ring-4 ring-primary/10' : ''}
                                                        ${!isActive ? 'border-gray-200 text-gray-300' : ''}
                                                    `}
                                                >
                                                    <Icon size={isCurrent ? 20 : 18} />
                                                </div>

                                                {/* Label */}
                                                <p className={`text-[9px] font-black uppercase tracking-wider text-center transition-colors
                                                    ${isActive ? 'text-footerBg' : 'text-gray-300'}
                                                `}>
                                                    {step.label}
                                                </p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Item Details */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-6">
                            <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Original Item(s)</h3>
                            <div className="space-y-4">
                                {returnRequest.items.map((item, i) => (
                                    <div key={i} className="flex gap-4 p-4 bg-[#F9F9F9] rounded-2xl border border-gray-50">
                                        <div className="relative shrink-0">
                                            <div className="w-16 h-16 bg-white rounded-xl overflow-hidden border border-gray-100 p-1">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply" />
                                            </div>
                                            <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 bg-footerBg text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                                                {item.qty}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-bold text-footerBg text-sm line-clamp-1">{item.name}</p>
                                            <p className="text-xs text-gray-500 mt-1 font-medium">Qty: {item.qty} × ₹{item.price}</p>
                                            <p className="text-xs font-black text-primary mt-1">₹{item.price * item.qty}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">{isReplace ? 'Original Value' : 'Total Refund'}</span>
                                <span className="text-xl font-black text-footerBg">₹{returnRequest.refundAmount}</span>
                            </div>
                        </div>

                        {/* Request Details / Replacement Info */}
                        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm p-6 flex flex-col">
                            <div className="flex-1 space-y-6">
                                <div className="flex justify-between items-center">
                                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Request Details</h3>
                                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${isReplace ? 'bg-orange-50 text-orange-600 border border-orange-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'}`}>
                                        {isReplace ? 'Replacement' : 'Refund'}
                                    </span>
                                </div>

                                <div className="space-y-4">
                                    {isReplace && replacementVariant && (
                                        <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                                            <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-3">Replacement Choice</p>
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 bg-white rounded-lg border border-primary/20 p-1">
                                                    <img src={replacementVariant.product.image} className="w-full h-full object-contain mix-blend-multiply" alt="" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-bold text-footerBg">{replacementVariant.product.name}</p>
                                                    <div className="flex items-center gap-2 mt-0.5">
                                                        <span className="text-xs font-black text-primary">{replacementVariant.weight}</span>
                                                        <span className="text-xs text-gray-400 font-bold">₹{replacementVariant.price}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            {returnRequest.priceDifference !== 0 && (
                                                <div className="mt-3 pt-3 border-t border-primary/10 flex justify-between items-center">
                                                    <span className="text-xs font-bold text-gray-500">Price Difference</span>
                                                    <span className={`text-xs font-black ${returnRequest.priceDifference > 0 ? 'text-red-500' : 'text-emerald-500'}`}>
                                                        {returnRequest.priceDifference > 0 ? `+₹${returnRequest.priceDifference} (Payable)` : `-₹${Math.abs(returnRequest.priceDifference)} (Refund)`}
                                                    </span>
                                                </div>
                                            )}
                                            {returnRequest.replacementMethod && (
                                                <div className="mt-2 flex items-center gap-2">
                                                    <Truck size={12} className="text-gray-400" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">
                                                        Mode: {returnRequest.replacementMethod === 'advance' ? 'Advance Exchange' : 'Standard Exchange'}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Reason</p>
                                        <p className="text-sm font-bold text-footerBg leading-tight">{returnRequest.reason}</p>
                                    </div>

                                    {returnRequest.comments && (
                                        <div>
                                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-left">Customer Comments</p>
                                            <p className="text-sm text-gray-500 font-medium border-l-2 border-gray-100 pl-3 text-left">"{returnRequest.comments}"</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertCircle size={16} className="text-blue-600" />
                                    <span className="font-bold text-blue-800 text-sm">Instructions</span>
                                </div>
                                <p className="text-xs text-blue-700 leading-relaxed">
                                    Please keep the item ready for pickup. Ensure all original tags and packaging are intact. Our executive will contact you before arriving.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ReturnDetailPage;
