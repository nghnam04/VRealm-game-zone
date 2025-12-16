package vn.edu.hust.vrgamesapp.security;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RateLimitService {

    private final RedisTemplate<String, String> redisTemplate;

    public boolean isAllowed(String key, int maxRequests, int windowSeconds) {
        Long count = redisTemplate.opsForValue().increment(key);

        // set TTL for first time request
        if (count == 1) {
            redisTemplate.expire(key, windowSeconds, TimeUnit.SECONDS);
        }

        return count <= maxRequests;
    }
}
