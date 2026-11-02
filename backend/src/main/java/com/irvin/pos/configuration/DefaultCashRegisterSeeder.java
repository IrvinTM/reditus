package com.irvin.pos.configuration;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.irvin.pos.entities.CashRegister;
import com.irvin.pos.repositories.CashRegisterRepository;

/**
 * Fresh installs get one register so sales can start right away.
 */
@Configuration
public class DefaultCashRegisterSeeder {

    @Bean
    public CommandLineRunner seedDefaultCashRegister(CashRegisterRepository cashRegisterRepository) {
        return args -> {
            if (cashRegisterRepository.count() == 0) {
                cashRegisterRepository.save(new CashRegister("Caja 1"));
            }
        };
    }
}
