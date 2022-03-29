package com.example.demo.student;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping(path = "api/v1/getIp")
public class testController {

    //Get is used to specify that it could accept get request from http
    @GetMapping
    public int getStudent() {
        for (int i = 0; i < 10; i++) {
            System.out.println("cc");
        }
        return 1;
    }
}