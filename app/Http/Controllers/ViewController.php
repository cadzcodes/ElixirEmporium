<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;
use App\Models\Order;

class ViewController extends Controller
{
    public function orderDetailsPage($id)
    {
        $order = Order::find($id);

        // If order not found or does not belong to current user
        if (!$order || $order->user_id !== Auth::id()) {
            return redirect('/');
        }

        return view('order-details', [
            'user' => Auth::user(),
            'orderId' => $id
        ]);
    }
}
