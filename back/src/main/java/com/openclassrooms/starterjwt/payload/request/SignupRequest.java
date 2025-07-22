package com.openclassrooms.starterjwt.payload.request;

import javax.validation.constraints.*;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SignupRequest {
  @NotBlank
  @Size(max = 50)
  @Email
  private String email;

  @NotBlank
  @Size(min = 3, max = 20)
  private String firstName;

  @NotBlank
  @Size(min = 3, max = 20)
  private String lastName;

  @NotBlank
  @Size(min = 6, max = 40)
  private String password;
}
