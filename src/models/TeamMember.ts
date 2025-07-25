import mongoose, { Document, Schema } from 'mongoose';

export interface ITeamMember extends Document {
  firstName: string;
  lastName: string;
  position: string;
  message: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const teamMemberSchema = new Schema<ITeamMember>({
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
  position: {
    type: String,
    required: true,
    trim: true,
  },
  message: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

export const TeamMember = mongoose.model<ITeamMember>('TeamMember', teamMemberSchema);