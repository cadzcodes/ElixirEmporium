<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;


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

    public function checkCodeValid(Request $request)
    {
        $request->validate([
            'user_id' => 'required|integer|exists:users,id',
        ]);

        $user = User::find($request->user_id);

        if (!$user) {
            return response()->json([
                'valid' => false,
                'message' => 'User not found',
            ], 404);
        }

        if ($user->is_verified) {
            return response()->json([
                'valid' => false,
                'message' => 'User is already verified',
            ], 400);
        }

        if ($user->verification_expires_at && $user->verification_expires_at->isFuture()) {
            return response()->json([
                'valid' => true,
                'message' => 'Current code is still valid',
            ]);
        }

        return response()->json([
            'valid' => false,
            'message' => 'No valid code, can resend',
        ]);
    }


    public function forgotPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if ($user) {
            // create secure random token
            $token = Str::random(64);

            // delete any existing tokens for this email
            DB::table('password_reset_tokens')->where('email', $user->email)->delete();

            // insert new token
            DB::table('password_reset_tokens')->insert([
                'email' => $user->email,
                'token' => Hash::make($token), // hash it for safety
                'created_at' => now(),
            ]);

            // Send Email with link
            $resetUrl = url('/reset-password?email=' . urlencode($user->email) . '&token=' . $token);

            \Mail::raw("Click here to reset your password: $resetUrl", function ($message) use ($user) {
                $message->to($user->email)
                    ->subject('Password Reset Link');
            });
        }

        // always return same response to prevent user enumeration
        return response()->json([
            'message' => 'If this email exists, a reset link has been sent.'
        ], 200);
    }

    public function verifyResetCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|string',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['message' => 'Invalid email or code'], 422);
        }

        if (
            $user->reset_code === $request->code &&
            $user->reset_expires_at &&
            $user->reset_expires_at->isFuture()
        ) {
            // ✅ Clear code after success (so it can’t be reused)
            $user->reset_code = null;
            $user->reset_expires_at = null;
            $user->save();

            return response()->json([
                'message' => 'Code verified successfully.',
                'redirect' => url('/reset-password?email=' . urlencode($user->email))
            ], 200);
        }

        return response()->json(['message' => 'Invalid or expired code'], 422);
    }

    public function reset(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'password' => 'required|string|min:8|confirmed',
            'token' => 'required|string',
        ]);

        // get token row
        $record = DB::table('password_reset_tokens')->where('email', $request->email)->first();

        if (!$record || !Hash::check($request->token, $record->token)) {
            return response()->json(['message' => 'Invalid or expired reset token'], 422);
        }

        // check expiration (optional: e.g., 60 minutes)
        if (Carbon::parse($record->created_at)->addMinutes(60)->isPast()) {
            return response()->json(['message' => 'Reset token expired'], 422);
        }

        // reset password
        $user = User::where('email', $request->email)->firstOrFail();
        $user->password = Hash::make($request->password);
        $user->save();

        // delete token after use
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Password reset successful'], 200);
    }

}
