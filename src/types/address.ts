export type AddressLabel = 'Home' | 'Work' | 'Other';

export type Address = {
  id: string;
  label: AddressLabel;
  fullName: string;
  phone: string;
  line1: string;
  line2: string;
  pincode: string;
  district: string;
  state: string;
  isDefault: boolean;
};

export type AddressInput = Omit<Address, 'id' | 'isDefault'> & {
  isDefault?: boolean;
};
