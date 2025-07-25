import mongoose, { Document, Schema } from 'mongoose';

export interface ILog extends Document {
  data: any;
  createdAt: Date;
}

const logSchema = new Schema<ILog>({
  data: {
    type: Schema.Types.Mixed,
    required: true,
  },
}, {
  timestamps: true,
});

export const Log = mongoose.model<ILog>('Log', logSchema);