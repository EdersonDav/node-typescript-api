import mongoose, { Document, Model } from "mongoose";

export enum BeachPosition {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}

export interface Beach {
  _id?: string;
  lat: number;
  name: string;
  position: BeachPosition;
  lng: number;
}

const schema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
  },
  {
    //mutation saida do banco, tirando _id colocando o id e tirando __v
    toJSON: {
      transform: (_, ret): void => {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

interface BeachModel extends Omit<Beach, '_id'>, Document { }
export const Beach = mongoose.model<BeachModel>('Beach', schema);