import React, { createContext, useCallback, useContext, useMemo } from 'react';
import { usePersistedState } from '../utils/storage';
import type { Address, AddressInput } from '../types/address';

type AddressContextValue = {
  addresses: Address[];
  addAddress: (input: AddressInput) => void;
  updateAddress: (id: string, input: AddressInput) => void;
  removeAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
};

// Seed data shown on first launch; changes are saved on the device.
const seedAddresses: Address[] = [
  {
    id: 'addr-1',
    label: 'Home',
    fullName: 'Ayesha Khan',
    phone: '9242712601',
    line1: 'Jal Tank Road',
    line2: 'Lalgola',
    pincode: '742148',
    district: 'Murshidabad',
    state: 'West Bengal',
    isDefault: true,
  },
  {
    id: 'addr-2',
    label: 'Work',
    fullName: 'Ayesha Khan',
    phone: '9242712601',
    line1: '24 Park Street',
    line2: '',
    pincode: '700016',
    district: 'Kolkata',
    state: 'West Bengal',
    isDefault: false,
  },
];

const AddressContext = createContext<AddressContextValue | undefined>(undefined);

// Exactly one address is the default whenever any exist.
const normalizeDefault = (list: Address[], preferredId?: string): Address[] => {
  if (list.length === 0) {
    return list;
  }
  const defaultId =
    preferredId ?? list.find(item => item.isDefault)?.id ?? list[0].id;
  return list.map(item => ({ ...item, isDefault: item.id === defaultId }));
};

export function AddressProvider({ children }: { children: React.ReactNode }) {
  const [addresses, setAddresses] = usePersistedState<Address[]>('addresses', seedAddresses);

  const addAddress = useCallback((input: AddressInput) => {
    setAddresses(current => {
      const created: Address = {
        ...input,
        id: `addr-${Date.now()}`,
        isDefault: Boolean(input.isDefault) || current.length === 0,
      };
      return normalizeDefault(
        [...current, created],
        created.isDefault ? created.id : undefined,
      );
    });
  }, [setAddresses]);

  const updateAddress = useCallback((id: string, input: AddressInput) => {
    setAddresses(current =>
      normalizeDefault(
        current.map(item =>
          item.id === id
            ? { ...item, ...input, isDefault: Boolean(input.isDefault) }
            : item,
        ),
        input.isDefault ? id : undefined,
      ),
    );
  }, [setAddresses]);

  const removeAddress = useCallback((id: string) => {
    setAddresses(current =>
      normalizeDefault(current.filter(item => item.id !== id)),
    );
  }, [setAddresses]);

  const setDefaultAddress = useCallback((id: string) => {
    setAddresses(current => normalizeDefault(current, id));
  }, [setAddresses]);

  const value = useMemo(
    () => ({ addresses, addAddress, updateAddress, removeAddress, setDefaultAddress }),
    [addresses, addAddress, updateAddress, removeAddress, setDefaultAddress],
  );

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export function useAddresses(): AddressContextValue {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddresses must be used within an AddressProvider');
  }
  return context;
}
