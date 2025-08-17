<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class AddressController extends Controller
{
    // GET /addresses
    public function index()
    {
        $userId = Auth::id();

        $apiBase = config('services.python_api.base_url');

        $response = Http::get("{$apiBase}/addresses/{$userId}");

        if ($response->failed()) {
            return response()->json(['error' => 'Unable to fetch addresses'], 500);
        }

        // Ensure array is preserved
        return response($response->body(), 200)
            ->header('Content-Type', 'application/json');
    }


    // POST /addresses
    public function store(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'province' => 'required|string',
            'city' => 'required|string',
            'barangay' => 'required|string',
            'unit_number' => 'nullable|string',
            'type' => 'nullable|string',
            'is_default' => 'boolean'
        ]);

        // Add the logged-in user ID
        $validated['user_id'] = Auth::id();

        $apiBase = config('services.python_api.base_url');

        $response = Http::withHeaders([
            'X-User-ID' => Auth::id()
        ])->post("{$apiBase}/addresses", $validated);

        if ($response->failed()) {
            return response()->json([
                'message' => 'Failed to save address',
                'error' => $response->json()
            ], $response->status());
        }

        return $response->json();
    }

    // PUT /addresses/{id}
    public function update(Request $request, $id)
    {
        $address = Address::where('user_id', Auth::id())->findOrFail($id);

        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string',
            'province' => 'required|string',
            'city' => 'required|string',
            'barangay' => 'required|string',
            'unit_number' => 'nullable|string',
            'type' => 'nullable|string',
            'is_default' => 'boolean'
        ]);

        if ($request->is_default) {
            Address::where('user_id', Auth::id())->update(['is_default' => false]);
        }

        $address->update($validated);

        return response()->json(['message' => 'Address updated successfully', 'address' => $address]);
    }

    // DELETE /addresses/{id}
    public function destroy($id)
    {
        $apiBase = config('services.python_api.base_url');

        $response = Http::withHeaders([
            'X-User-ID' => Auth::id()
        ])->delete("{$apiBase}/addresses/{$id}");

        if ($response->failed()) {
            return response()->json([
                'message' => 'Failed to delete address',
                'error' => $response->json()
            ], $response->status());
        }

        return $response->json();
    }


    public function setDefault($id)
    {
        $user = Auth::user();

        // Remove default from all user's addresses
        Address::where('user_id', $user->id)->update(['is_default' => false]);

        // Set selected one as default
        $address = Address::where('user_id', $user->id)->findOrFail($id);
        $address->is_default = true;
        $address->save();

        return response()->json(['message' => 'Default address updated', 'address' => $address]);
    }

}
