package vn.edu.hust.vrgamesapp.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;

@Configuration
public class RedisConfig {

    @Value("${spring.data.redis.url:redis://localhost:6379}")
    private String redisUrl;

    @Bean
    public RedisConnectionFactory redisConnectionFactory() {
        // Phân tích Url
        io.lettuce.core.RedisURI redisUri = io.lettuce.core.RedisURI.create(redisUrl);

        // Cấu hình Server
        RedisStandaloneConfiguration serverConfig = new RedisStandaloneConfiguration();
        serverConfig.setHostName(redisUri.getHost());
        serverConfig.setPort(redisUri.getPort());
        if (redisUri.getPassword() != null) {
            serverConfig.setPassword(String.valueOf(redisUri.getPassword()));
        }

        // Cấu hình Client và SSL
        LettuceClientConfiguration.LettuceClientConfigurationBuilder clientConfigBuilder =
                LettuceClientConfiguration.builder();

        if (redisUrl.startsWith("rediss://")) {
            clientConfigBuilder.useSsl();
        }

        return new LettuceConnectionFactory(serverConfig, clientConfigBuilder.build());
    }
}