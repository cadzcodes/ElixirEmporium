<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;


class ContactController extends Controller
{
    public function send(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        Mail::raw($validated['message'], function ($mail) use ($validated) {
            $mail->to('cadzofficial9074@gmail.com')
                ->subject('New Contact Message from ' . $validated['name'])
                ->replyTo($validated['email']);
        });

        return response()->json(['status' => 'success', 'message' => 'Message sent!']);

    }
}
