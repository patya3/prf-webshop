const mongoose = require('mongoose');

var productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    brand: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: [
        'shoes',
        't-shirt',
        'jeans',
        'trousers',
        'hoodies-sweatshirts',
        'jacket',
      ],
    },
    imageUrl: { type: String },
    price: { type: Number },
    modificationDate: { type: Date, default: Date.now },
  },
  { collection: 'products' }
);

mongoose.model('product', productSchema);
