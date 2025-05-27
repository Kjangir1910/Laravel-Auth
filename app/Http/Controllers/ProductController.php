<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    // Show the Products page with the logged-in user's products
    public function index()
    {
        $products = Product::where('user_id', Auth::id())->get();

        return Inertia::render('Products', [
            'auth' => [
                'user' => Auth::user(),
            ],
            'products' => $products,
        ]);
    }

    // Store a new product
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|unique:products',
            'product_name' => 'required',
            'description' => 'required',
        ]);

        Product::create([
            'user_id' => Auth::id(),
            'product_id' => $request->product_id,
            'product_name' => $request->product_name,
            'description' => $request->description,
        ]);

        return redirect()->route('products.index')->with('success', 'Product added successfully.');
    }

    // Update an existing product
    public function update(Request $request, $id)
    {
        $request->validate([
            'product_name' => 'required',
            'description' => 'required',
        ]);

        $product = Product::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $product->update([
            'product_name' => $request->product_name,
            'description' => $request->description,
        ]);

        return redirect()->route('products.index')->with('success', 'Product updated successfully.');
    }

    // Delete a product
    public function destroy($id)
    {
        $product = Product::where('id', $id)->where('user_id', Auth::id())->firstOrFail();

        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully.');
    }
}
