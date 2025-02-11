package com.metropolitan.backend.test;

import static org.junit.jupiter.api.Assertions.*;

import org.junit.jupiter.api.Test;

public class SimpleTest {
    @Test
    void testThatAlwaysPasses() {
        String expected = "test";
        String actual = "test";
        assertEquals(expected, actual);
    }

    @Test
    void anotherPassingTest() {
        assertTrue(true);
    }
}
