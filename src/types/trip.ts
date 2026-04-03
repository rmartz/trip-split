export interface Trip {
  createdAt: Date;
  createdBy: string;
  description: string | undefined;
  id: string;
  name: string;
  updatedAt: Date;
}

export interface TripMember {
  addedBy: string;
  createdAt: Date;
  id: string;
  name: string;
  userId: string | undefined;
}
