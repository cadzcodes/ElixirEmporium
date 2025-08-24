<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $verificationCode = rand(100000, 999999); // 6-digit code

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'is_verified' => false,
            'verification_code' => $verificationCode,
            'verification_expires_at' => now()->addMinutes(10),
        ]);

        // Send Email
        \Mail::raw("Your verification code is: $verificationCode", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Verify your email');
        });

        return response()->json([
            'message' => 'User registered successfully. Please check your email for verification code.',
            'user_id' => $user->id
        ], 201);
    }


    public function verify(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'code' => 'required'
        ]);

        $user = User::find($request->user_id);

        if ($user->is_verified) {
            return response()->json(['message' => 'Already verified'], 200);
        }

        if (
            $user->verification_code === $request->code &&
            $user->verification_expires_at !== null &&
            $user->verification_expires_at->isFuture()
        ) {
            $user->is_verified = true;
            $user->verification_code = null;
            $user->verification_expires_at = null;
            $user->save();

            Auth::login($user);

            return response()->json(['message' => 'Verification successful']);
        }

        return response()->json(['message' => 'Invalid or expired code'], 422);
    }



    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $credentials = $request->only('email', 'password');
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Prevent admin login from here (your existing rule)
        if ($user->user_type === 'admin') {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // ✅ If not verified
        if (!$user->is_verified) {
            return response()->json([
                'message' => 'Email not verified',
                'needs_verification' => true,
                'user_id' => $user->id
            ], 403);
        }

        // ✅ Verified → proceed with login
        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return response()->json([
                'message' => 'Login successful',
                'needs_verification' => false
            ]);
        }

        return response()->json(['message' => 'Invalid credentials'], 401);
    }


    public function resendCode(Request $request)
    {
        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json(['message' => 'User not found'], 404);
        }

        if ($user->is_verified) {
            return response()->json(['message' => 'User is already verified'], 400);
        }

        // Generate new code
        $code = rand(100000, 999999);
        $user->verification_code = $code;
        $user->verification_expires_at = now()->addMinutes(10);
        $user->save();

        // Send email (same way as in register)
        \Mail::raw("Your new verification code is: $code", function ($message) use ($user) {
            $message->to($user->email)
                ->subject('Resend: Verify your email');
        });

        return response()->json(['message' => 'Verification code resent successfully']);
    }

}
