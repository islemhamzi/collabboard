package com.collabboard.collab_backend.Config;

import java.util.Base64;
import java.security.SecureRandom;

public class JwtSecretGenerator {
    public static void main(String[] args) {
        byte[] key = new byte[32]; // 256-bit key
        new SecureRandom().nextBytes(key);
        String secret = Base64.getEncoder().encodeToString(key);
        System.out.println("JWT Secret: " + secret);
    }
}
