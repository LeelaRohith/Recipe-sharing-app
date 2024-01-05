package com.example.backend.controllers;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EdituserDTO {
    private Integer id;
    private String email;
    private String firstname;
    private String lastname;

}
