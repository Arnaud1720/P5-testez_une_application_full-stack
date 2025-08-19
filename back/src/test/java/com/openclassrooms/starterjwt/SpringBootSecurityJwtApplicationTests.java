package com.openclassrooms.starterjwt;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles(resolver = DockerOrH2Profiles.class)
public class SpringBootSecurityJwtApplicationTests {

	@Test
	public void contextLoads() {
	}

}
