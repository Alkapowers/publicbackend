import mongoose, { Document, Schema } from 'mongoose';

export interface IFAQ extends Document {
  question: string;
  answer: string;
  createdAt: Date;
  updatedAt: Date;
}

const faqSchema = new Schema<IFAQ>({
  question: {
    type: String,
    required: true,
    trim: true,
  },
  answer: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export const FAQ = mongoose.model<IFAQ>('FAQ', faqSchema);