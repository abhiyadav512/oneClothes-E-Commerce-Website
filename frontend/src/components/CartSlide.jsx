import { Minus, Plus, ShoppingCart, Trash2, X } from "lucide-react";
import { Button } from "./ui/button";

const CartSlide = ({ isOpen, onClose, cartItems, updateQuantity, removeItem }) => {
    const total = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

    // console.log(cartItems);
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={onClose}
                />
            )}

            <div className={`fixed top-0 right-0 h-full w-96 bg-white shadow-xl transform transition-transform duration-300 ease-in-out z-50 ${isOpen ? 'translate-x-0' : 'translate-x-full'
                }`}>
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h2 className="text-lg font-semibold">Shopping Cart ({cartItems.length})</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {cartItems.length === 0 ? (
                            <div className="text-center py-8">
                                <ShoppingCart className="mx-auto mb-4 text-gray-400" size={48} />
                                <p className="text-gray-500">Your cart is empty</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {[...cartItems]
                                    .sort((a, b) => a.createdAt.localeCompare(b.createdAt)) // or sort by product.name
                                    .map((item) => (
                                        <div key={`${item.product.id}-${item.id}`}
                                            className="flex gap-3 p-3 border rounded-lg">
                                            <img
                                                src={item.product.imageUrl}
                                                alt={item.product.name}
                                                className="w-16 h-16 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <h3 className="font-medium text-sm">{item.product.name}</h3>
                                                <p className="text-gray-500 text-xs">{item.product.size}</p>
                                                <p className="font-semibold text-sm">${item.product.price}</p>

                                                <div className="flex items-center gap-2 mt-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                        disabled={item.quantity <= 1}
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-medium">{item.quantity}</span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 hover:bg-gray-100 rounded"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-1 hover:bg-red-100 text-red-500 rounded ml-auto"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                            </div>
                        )}
                    </div>


                    {cartItems.length > 0 && (
                        <div className="border-t p-4 space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="font-semibold">Total: ${total.toFixed(2)}</span>
                            </div>
                            <Button
        
                            className="w-full bg-black text-white hover:bg-gray-800">
                                Checkout
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
export default CartSlide  