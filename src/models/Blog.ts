import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  subtitle: string;
  image?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  subtitle: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
  },
  content: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const Blog = mongoose.model<IBlog>('Blog', blogSchema);