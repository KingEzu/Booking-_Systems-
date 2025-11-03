import React, { useState } from 'react';
import { snacksData } from '../../assets/assets';
import { TrashIcon, PencilIcon } from '@heroicons/react/16/solid';
import toast from 'react-hot-toast';

const ManageSnacks = () => {
  const [snacks, setSnacks] = useState(snacksData);
  const [newSnack, setNewSnack] = useState({
    name: '',
    desc: '',
    price: '',
    type: 'Snack',
    image: null, // for new image
  });

  // Handle price update
  const handlePriceChange = (id, value) => {
    setSnacks((prev) =>
      prev.map((snack) => (snack.id === id ? { ...snack, price: Number(value) } : snack))
    );
  };

  // Handle image update
  const handleImageChange = (id, file) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setSnacks((prev) =>
        prev.map((snack) => (snack.id === id ? { ...snack, image: e.target.result } : snack))
      );
    };
    if (file) reader.readAsDataURL(file);
  };

  // Remove snack
  const handleRemoveSnack = (id) => {
    setSnacks((prev) => prev.filter((snack) => snack.id !== id));
    toast.success('Snack removed!');
  };

  // Add new snack
  const handleAddSnack = () => {
    if (!newSnack.name || !newSnack.desc || !newSnack.price || !newSnack.image) {
      toast.error('Please fill all fields and add an image!');
      return;
    }

    const id = Math.max(...snacks.map((s) => s.id)) + 1;
    setSnacks((prev) => [
      ...prev,
      { ...newSnack, id, price: Number(newSnack.price) },
    ]);
    setNewSnack({ name: '', desc: '', price: '', type: 'Snack', image: null });
    toast.success('Snack added!');
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Manage Snacks & Drinks</h1>

      {/* List snacks */}
      <div className="space-y-4">
        {snacks.map((snack) => (
          <div
            key={snack.id}
            className="flex flex-wrap items-center gap-4 border p-3 rounded-lg"
          >
            <div className="flex-1 flex items-center gap-3">
              {/* Snack Image */}
              {snack.image && (
                <img
                  src={snack.image}
                  alt={snack.name}
                  className="w-20 h-20 object-cover rounded aspect-video"
                />
              )}

              <div>
                <p className="font-semibold">{snack.name}</p>
                <p className="text-gray-400 text-sm">{snack.desc}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <p className="text-gray-400">{snack.type}</p>
              <input
                type="number"
                min={0}
                value={snack.price}
                onChange={(e) => handlePriceChange(snack.id, e.target.value)}
                className="border border-gray-500 rounded-md px-2 py-1 w-20 text-sm outline-none"
              />

              {/* Image edit */}
              <label className="cursor-pointer">
                <PencilIcon className="w-5 h-5 text-blue-500 hover:text-blue-700" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageChange(snack.id, e.target.files[0])}
                />
              </label>

              <TrashIcon
                className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                onClick={() => handleRemoveSnack(snack.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Add new snack */}
      <div className="mt-6 border p-4 rounded-lg">
        <h2 className="font-semibold mb-2">Add New Snack/Drink</h2>
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Name"
            value={newSnack.name}
            onChange={(e) => setNewSnack({ ...newSnack, name: e.target.value })}
            className="border border-gray-500 rounded-md px-3 py-2 outline-none text-sm flex-1"
          />
          <input
            type="text"
            placeholder="Description"
            value={newSnack.desc}
            onChange={(e) => setNewSnack({ ...newSnack, desc: e.target.value })}
            className="border border-gray-500 rounded-md px-3 py-2 outline-none text-sm flex-1"
          />
          <input
            type="number"
            min={0}
            placeholder="Price"
            value={newSnack.price}
            onChange={(e) => setNewSnack({ ...newSnack, price: e.target.value })}
            className="border border-gray-500 rounded-md px-3 py-2 outline-none text-sm w-24"
          />
          <select
            value={newSnack.type}
            onChange={(e) => setNewSnack({ ...newSnack, type: e.target.value })}
            className="border border-gray-500 rounded-md px-3 py-2 outline-none text-sm"
          >
            <option value="Snack">Snack</option>
            <option value="Drink">Drink</option>
          </select>

          {/* Image upload */}
          <label className="cursor-pointer border border-gray-500 rounded-md px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100">
            {newSnack.image ? 'Change Image' : 'Add Image'}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setNewSnack({ ...newSnack, image: URL.createObjectURL(e.target.files[0]) })
              }
            />
          </label>

          <button
            onClick={handleAddSnack}
            className="bg-primary/80 text-white px-3 py-2 rounded-lg hover:bg-primary text-sm"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageSnacks;
