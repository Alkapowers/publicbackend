import mongoose, { Document, Schema } from 'mongoose';

interface IProductDetail {
  content: string;
  image?: string;
}

export interface IProduct extends Document {
  title: string;
  description: string;
  keypoints: string[];
  featuredImage?: string;
  details: IProductDetail[];
  createdAt: Date;
  updatedAt: Date;
}

const productDetailSchema = new Schema<IProductDetail>({
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  keypoints: [{
    type: String,
    trim: true,
  }],
  featuredImage: {
    type: String,
  },
  details: [productDetailSchema],
}, {
  timestamps: true,
});

export const Product = mongoose.model<IProduct>('Product', productSchema);