<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class ViewController extends Controller
{
    public function orderDetailsPage($id)
    {
        return view('order-details', [
            'user' => Auth::user(),
            'orderId' => $id
        ]);
    }
}