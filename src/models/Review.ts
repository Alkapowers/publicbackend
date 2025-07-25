import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  firstName: string;
  lastName: string;
  stars: number;
  position: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  stars: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  position: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

export const Review = mongoose.model<IReview>('Review', reviewSchema);