package com.example.demo.student;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.BufferedReader;
import java.io.InputStreamReader;

@RestController
@RequestMapping(path = "api/v1/reset_0")
public class reset_0 {
    @GetMapping
    public static String main(String args[]) {
        String s;
        Process p;
        Process pp;
        Process ppp;
        try {
            //Get the ip which rpi has
            //https://stackoverflow.com/questions/3403226/how-to-run-linux-commands-in-java
            p = Runtime.getRuntime().exec("bash reset_0.sh");
            BufferedReader br = new BufferedReader(
                    new InputStreamReader(p.getInputStream()));
            while ((s = br.readLine()) != null)
                System.out.println("rpi_ip: " + s);
            p.waitFor();
            System.out.println ("exit: " + p.exitValue());
            p.destroy();
            return "Success to get IPs";
        } catch (Exception e) {return "Fail to get IPs";}
    }
}

