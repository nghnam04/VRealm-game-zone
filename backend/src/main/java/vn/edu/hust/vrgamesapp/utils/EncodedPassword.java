package vn.edu.hust.vrgamesapp.utils;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class EncodedPassword {
    public static void main(String[] args) {
        System.out.println(new BCryptPasswordEncoder().encode("eva_dao"));
    }
}
