import mongoose, { Document, Schema } from 'mongoose';

export interface ICaseStudy extends Document {
  title: string;
  subtitle: string;
  image?: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const caseStudySchema = new Schema<ICaseStudy>({
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

export const CaseStudy = mongoose.model<ICaseStudy>('CaseStudy', caseStudySchema);