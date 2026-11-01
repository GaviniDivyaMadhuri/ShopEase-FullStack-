package com.shopease.service;

import com.shopease.dto.AddressRequest;
import com.shopease.dto.AddressResponse;
import com.shopease.exception.ResourceNotFoundException;
import com.shopease.model.Address;
import com.shopease.model.User;
import com.shopease.repository.AddressRepository;
import com.shopease.security.CurrentUserProvider;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AddressService {

    private final AddressRepository addressRepository;
    private final CurrentUserProvider currentUserProvider;

    public AddressService(AddressRepository addressRepository,
                          CurrentUserProvider currentUserProvider) {
        this.addressRepository = addressRepository;
        this.currentUserProvider = currentUserProvider;
    }

    @Transactional
    public AddressResponse addAddress(AddressRequest request) {

        User user = currentUserProvider.getCurrentUser();

        Address address = new Address();

        applyRequestToAddress(address, request);

        address.setUser(user);

        boolean isFirstAddress =
                !addressRepository.existsByUser_UserId(user.getUserId());

        address.setDefaultAddress(
                request.isDefaultAddress() || isFirstAddress
        );

        if (address.isDefaultAddress()) {
            clearExistingDefault(user.getUserId());
        }

        Address saved = addressRepository.save(address);

        return toResponse(saved);
    }

    public List<AddressResponse> getAddresses() {

        User user = currentUserProvider.getCurrentUser();

        List<Address> addresses =
                addressRepository.findByUser_UserId(user.getUserId());

        List<AddressResponse> responses = new ArrayList<>();

        for (Address address : addresses) {
            responses.add(toResponse(address));
        }

        return responses;
    }

    @Transactional
    public AddressResponse updateAddress(
            Long id,
            AddressRequest request) {

        User user = currentUserProvider.getCurrentUser();

        Address address =
                addressRepository
                        .findByAddressIdAndUser_UserId(
                                id,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Address not found."
                                )
                        );

        applyRequestToAddress(address, request);

        if (request.isDefaultAddress()
                && !address.isDefaultAddress()) {

            clearExistingDefault(user.getUserId());

            address.setDefaultAddress(true);
        }

        Address updated = addressRepository.save(address);

        return toResponse(updated);
    }

    @Transactional
    public void deleteAddress(Long id) {

        User user = currentUserProvider.getCurrentUser();

        Address address =
                addressRepository
                        .findByAddressIdAndUser_UserId(
                                id,
                                user.getUserId()
                        )
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Address not found."
                                )
                        );

        boolean wasDefault = address.isDefaultAddress();

        addressRepository.delete(address);

        if (wasDefault) {

            List<Address> remaining =
                    addressRepository.findByUser_UserId(
                            user.getUserId()
                    );

            if (!remaining.isEmpty()) {

                Address newDefault = remaining.get(0);

                newDefault.setDefaultAddress(true);

                addressRepository.save(newDefault);
            }
        }
    }

    private void clearExistingDefault(Long userId) {

        List<Address> addresses =
                addressRepository.findByUser_UserId(userId);

        for (Address existing : addresses) {

            if (existing.isDefaultAddress()) {

                existing.setDefaultAddress(false);

                addressRepository.save(existing);
            }
        }
    }

    private void applyRequestToAddress(
            Address address,
            AddressRequest request) {

        address.setFullName(request.getFullName());
        address.setPhoneNumber(request.getPhoneNumber());
        address.setAddress(request.getAddress());
        address.setCity(request.getCity());
        address.setState(request.getState());
        address.setPincode(request.getPincode());
    }

    private AddressResponse toResponse(Address address) {

        return new AddressResponse(
                address.getAddressId(),
                address.getFullName(),
                address.getPhoneNumber(),
                address.getAddress(),
                address.getCity(),
                address.getState(),
                address.getPincode(),
                address.isDefaultAddress()
        );
    }
}