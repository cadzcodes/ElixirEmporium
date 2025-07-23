<?php

namespace App\Http\Controllers;

use App\Models\Address;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AddressController extends Controller
{
    // GET /addresses
    public function index()
    {
        $addresses = Auth::user()->addresses()->get()->map(function ($address) {
            return [
                'id' => $address->id,
                'full_name' => $address->full_name,
                'phone' => $address->phone,
                'address' => $address->address,
                'unit_number' => $address->unit_number,
                'province' => $address->province,
                'city' => $address->city,
                'barangay' => $address->barangay,
                'type' => $address->type,
                'is_default' => $address->is_default,
                'formatted_address' => implode(', ', array_filter([
                    $address->unit_number,
                    $address->barangay,
                    $address->city,
                    $address->province
                ])),
            ];
        });

        return response()->json($addresses);
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

        if ($request->is_default) {
            Address::where('user_id', Auth::id())->update(['is_default' => false]);
        }

        $address = Address::create([
            ...$validated,
            'user_id' => Auth::id(),
        ]);

        return response()->json(['message' => 'Address saved successfully', 'address' => $address], 201);
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
        $address = Address::where('user_id', Auth::id())->findOrFail($id);

        $address->delete();

        return response()->json(['message' => 'Address deleted successfully']);
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
