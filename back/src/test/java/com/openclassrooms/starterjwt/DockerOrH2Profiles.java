package com.openclassrooms.starterjwt;

import org.jetbrains.annotations.NotNull;
import org.springframework.test.context.ActiveProfilesResolver;
import org.testcontainers.DockerClientFactory;

public class DockerOrH2Profiles implements ActiveProfilesResolver {
    @Override
    public String @NotNull [] resolve(@NotNull Class<?> testClass) {
        try {
            DockerClientFactory.instance().client();
            return new String[] { "docker" };
        } catch (Throwable t) {
            return new String[] { "h2" };
        }
    }
}
