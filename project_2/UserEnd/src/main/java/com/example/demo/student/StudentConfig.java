package com.example.demo.student;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.time.Month;
import java.util.List;

//下@Configuration註記後，此檔案會被java是為純粹的設定檔
@Configuration
public class StudentConfig {

    //Bean意指由Spring管理的實例，@Bean則告知Java其返回的指令為Bean物件
    @Bean
    CommandLineRunner commandLineRunner(StudentRepository studentRepository) {
        //@Component 可配合CommandLineRunner使用，在程式啟動後執行一些基礎任務。
        return args -> {
            Student mariam = new Student(
                    "Mariam",
                    "mariam.jamal@gmail.com",
                    LocalDate.of(2000, Month.JANUARY, 5)
            );
            Student alex = new Student(
                    "Alex",
                    "alex@gmail.com",
                    LocalDate.of(2004, Month.JANUARY, 5)
            );

            Student lilian = new Student(
                    "Lilian",
                    "lilian@gmail.com",
                    LocalDate.of(2009, Month.JANUARY, 5)
            );

            studentRepository.saveAll(
                    List.of(mariam, alex, lilian)
            );
        };
    }
}
