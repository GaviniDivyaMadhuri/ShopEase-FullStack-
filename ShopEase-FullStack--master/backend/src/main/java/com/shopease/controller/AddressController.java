package com.shopease.controller;

import com.shopease.dto.AddressRequest;
import com.shopease.dto.AddressResponse;
import com.shopease.service.AddressService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/addresses")
public class AddressController {

    private final AddressService addressService;

    public AddressController(AddressService addressService) {
        this.addressService = addressService;
    }

    @GetMapping
    public List<AddressResponse> getAddresses() {
        return addressService.getAddresses();
    }

    @PostMapping
    public AddressResponse addAddress(
            @Valid @RequestBody AddressRequest request) {

        return addressService.addAddress(request);
    }

    @PutMapping("/{id}")
    public AddressResponse updateAddress(
            @PathVariable Long id,
            @Valid @RequestBody AddressRequest request) {

        return addressService.updateAddress(id, request);
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deleteAddress(
            @PathVariable Long id) {

        addressService.deleteAddress(id);

        return Map.of(
                "message",
                "Address deleted successfully."
        );
    }
}