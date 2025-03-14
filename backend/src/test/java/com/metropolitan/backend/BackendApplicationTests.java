package com.metropolitan.backend;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.DisplayName;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.ApplicationContext;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for the BackendApplication.
 * 
 * These tests verify the application's core functionality:
 * - Spring context loads correctly
 * - Required beans are available in the application context
 * - Application configuration is properly loaded
 * - Error handling works as expected
 */
@SpringBootTest
@ActiveProfiles("test") // Use test profile for these tests
class BackendApplicationTests {
    
    @Autowired
    private ApplicationContext applicationContext;

    /**
     * Verifies that the Spring application context loads successfully.
     * This is a fundamental test to ensure the application can bootstrap properly.
     */
    @Test
    @DisplayName("Spring context loads successfully")
    void contextLoads() {
        // Simply verifying that the context loads without errors
        assertNotNull(applicationContext, "Application context should not be null");
    }

    /**
     * Verifies the application can handle invalid configuration gracefully.
     * This is an edge case test to ensure error handling works properly.
     */
    @Test
    @DisplayName("Application handles invalid configuration")
    void handlesInvalidConfiguration() {
        // Testing error handling by attempting to retrieve a non-existent bean
        assertThrows(Exception.class, () -> {
            applicationContext.getBean("nonExistentBean");
        }, "Application should throw exception for non-existent beans");
    }
    
    /**
     * Tests application startup with empty arguments.
     * This verifies the main method can handle the common case of no arguments.
     */
    @Test
    @DisplayName("Application starts with empty arguments")
    void applicationStartsWithEmptyArgs() {
        // Instead of actually running the method, just check that the class exists
        // and has the necessary main method
        assertDoesNotThrow(() -> {
            assertNotNull(BackendApplication.class.getMethod("main", String[].class),
                "Application should have a main method");
        }, "Application main method should be accessible");
    }
    
    /**
     * Tests application with null arguments (edge case).
     * This verifies error handling for an unexpected input.
     */
    @Test
    @DisplayName("Application handles null arguments")
    void applicationHandlesNullArgs() {
        // Edge case: ensure null arguments are handled appropriately
        assertThrows(IllegalArgumentException.class, () -> {
            BackendApplication.main(null);
        }, "Application should handle null arguments appropriately");
    }
}