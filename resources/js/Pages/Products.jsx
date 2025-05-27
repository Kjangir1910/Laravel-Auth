// import React from 'react';
// import { useForm, usePage } from '@inertiajs/react';
// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

// export default function Products({ auth, products }) {
//     const { data, setData, post, processing, errors } = useForm({
//         product_id: '',
//         product_name: '',
//         description: '',
//     });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         post(route('products.store'));
//     };

//     return (
//         <AuthenticatedLayout user={auth.user}>
//             <div className="max-w-4xl mx-auto mt-8">
//                 <h1 className="text-2xl font-bold mb-4">Your Products</h1>

//                 <form onSubmit={handleSubmit} className="space-y-4 mb-6">
//                     <input type="text" placeholder="Product ID" value={data.product_id}
//                         onChange={(e) => setData('product_id', e.target.value)}
//                         className="border p-2 w-full" />
//                     {errors.product_id && <div className="text-red-600">{errors.product_id}</div>}

//                     <input type="text" placeholder="Product Name" value={data.product_name}
//                         onChange={(e) => setData('product_name', e.target.value)}
//                         className="border p-2 w-full" />
//                     {errors.product_name && <div className="text-red-600">{errors.product_name}</div>}

//                     <textarea placeholder="Description" value={data.description}
//                         onChange={(e) => setData('description', e.target.value)}
//                         className="border p-2 w-full" />
//                     {errors.description && <div className="text-red-600">{errors.description}</div>}

//                     <button type="submit" disabled={processing} className="bg-blue-600 text-white px-4 py-2 rounded">
//                         Add Product
//                     </button>
//                 </form>

//                 <ul className="list-disc pl-5 space-y-2">
//                     {products.length ? (
//                         products.map((product) => (
//                             <li key={product.id}>
//                                 <strong>{product.product_id}</strong>: {product.product_name} — {product.description}
//                             </li>
//                         ))
//                     ) : (
//                         <li>No products added yet.</li>
//                     )}
//                 </ul>
//             </div>
//         </AuthenticatedLayout>
//     );
// }


import React, { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Products({ auth, products }) {
    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        product_id: '',
        product_name: '',
        description: '',
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            put(route('products.update', editId), {
                onSuccess: () => {
                    reset();
                    setIsEditing(false);
                    setEditId(null);
                },
            });
        } else {
            post(route('products.store'), {
                onSuccess: () => reset(),
            });
        }
    };

    const handleEdit = (product) => {
        setData({
            product_id: product.product_id,
            product_name: product.product_name,
            description: product.description,
        });
        setIsEditing(true);
        setEditId(product.id);
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
        setEditId(null);
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            destroy(route('products.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="max-w-4xl mx-auto mt-8">
                <h1 className="text-2xl font-bold mb-4">Your Products</h1>

                <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                    <input type="text" placeholder="Product ID" value={data.product_id}
                        onChange={(e) => setData('product_id', e.target.value)}
                        className="border p-2 w-full" disabled={isEditing} />
                    {errors.product_id && <div className="text-red-600">{errors.product_id}</div>}

                    <input type="text" placeholder="Product Name" value={data.product_name}
                        onChange={(e) => setData('product_name', e.target.value)}
                        className="border p-2 w-full" />
                    {errors.product_name && <div className="text-red-600">{errors.product_name}</div>}

                    <textarea placeholder="Description" value={data.description}
                        onChange={(e) => setData('description', e.target.value)}
                        className="border p-2 w-full" />
                    {errors.description && <div className="text-red-600">{errors.description}</div>}

                    <div className="flex space-x-2">
                        <button type="submit" disabled={processing}
                            className="bg-blue-600 text-white px-4 py-2 rounded">
                            {isEditing ? 'Update Product' : 'Add Product'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={handleCancel}
                                className="bg-gray-400 text-white px-4 py-2 rounded">
                                Cancel
                            </button>
                        )}
                    </div>
                </form>

                <ul className="space-y-4">
                    {products.length ? (
                        products.map((product) => (
                            <li key={product.id} className="border p-4 rounded flex justify-between items-center">
                                <div>
                                    <strong>{product.product_id}</strong>: {product.product_name} — {product.description}
                                </div>
                                <div className="space-x-2">
                                    <button onClick={() => handleEdit(product)}
                                        className="text-sm bg-yellow-400 px-3 py-1 rounded text-white">
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(product.id)}
                                        className="text-sm bg-red-600 px-3 py-1 rounded text-white">
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li>No products added yet.</li>
                    )}
                </ul>
            </div>
        </AuthenticatedLayout>
    );
}

