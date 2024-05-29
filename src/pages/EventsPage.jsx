import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Image,
  Text,
  Button,
  Input,
  Select,
  VStack,
  Flex,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/events");
        setEvents(response.data);
      } catch (error) {
        console.error("Error fetching events", error);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://localhost:5000/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories", error);
      }
    };

    fetchEvents();
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleFilter = (e) => {
    setCategoryFilter(e.target.value);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearchQuery = event.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategoryFilter =
      categoryFilter === "" ||
      event.categoryIds.includes(parseInt(categoryFilter));
    return matchesSearchQuery && matchesCategoryFilter;
  });

  return (
    <Box bg="blue.50" minHeight="100vh" p={4}>
      <Box bg="blue.600" color="white" p={4} borderRadius="md">
        <Heading mb={4} textAlign="center">
          Events
        </Heading>
      </Box>
      <Flex direction="column" align="center" mt={4}>
        <Button as={Link} to="/add" colorScheme="teal" mb={4}>
          Add Event
        </Button>
        <Input
          placeholder="Search events"
          value={searchQuery}
          onChange={handleSearch}
          mb={4}
          width="80%"
          bg="white"
        />
        <Select
          placeholder="Filter by category"
          onChange={handleFilter}
          mb={4}
          width="80%"
          bg="white"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </Flex>
      <VStack spacing={4} align="center">
        {filteredEvents.map((event) => (
          <Box
            key={event.id}
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            p={4}
            width="80%"
            bg="white"
          >
            <Heading size="md" mb={2}>
              {event.title}
            </Heading>
            <Text mb={2}>{event.description}</Text>
            {event.image && (
              <Image src={event.image} alt={event.title} mb={2} />
            )}
            <Text mb={2}>
              Start Time: {new Date(event.startTime).toLocaleString()}
            </Text>
            <Text mb={2}>
              End Time: {new Date(event.endTime).toLocaleString()}
            </Text>
            <Text mb={2}>
              Categories:{" "}
              {event.categoryIds
                .map((id) => categories.find((cat) => cat.id === id)?.name)
                .filter(Boolean)
                .join(", ")}
            </Text>
            <Button
              as={Link}
              to={`/events/${event.id}`}
              mt={4}
              colorScheme="teal"
            >
              View Details
            </Button>
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default EventsPage;
