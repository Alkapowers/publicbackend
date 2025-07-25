import mongoose, { Document, Schema } from 'mongoose';

export interface IFeaturedImage extends Document {
  image: string;
  createdAt: Date;
  updatedAt: Date;
}

const featuredImageSchema = new Schema<IFeaturedImage>({
  image: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const FeaturedImage = mongoose.model<IFeaturedImage>('FeaturedImage', featuredImageSchema);