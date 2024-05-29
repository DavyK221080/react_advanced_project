import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Image,
  Button,
  Alert,
  AlertIcon,
  useToast,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  CheckboxGroup,
  Checkbox,
} from "@chakra-ui/react";
import { useParams, Link, useNavigate } from "react-router-dom"; // Updated import
import axios from "axios";

const EventPage = ({ events, users, categories, deleteEvent }) => {
  const { eventId } = useParams();
  const navigate = useNavigate(); // Updated usage
  const toast = useToast();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
    details: "",
    createdBy: "",
    categoryIds: [],
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/events/${eventId}`
        );
        setEvent(response.data);
        setFormData(response.data);
      } catch (error) {
        setError("Error fetching event");
      }
    };

    fetchEvent();
  }, [eventId]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      categoryIds: checked
        ? [...prevData.categoryIds, parseInt(value)]
        : prevData.categoryIds.filter((id) => id !== parseInt(value)),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/events/${eventId}`, formData);
      setEvent(formData);
      setIsEditing(false);
      toast({
        title: "Event updated.",
        description: "The event has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      setError("Error updating event");
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await axios.delete(`http://localhost:5000/events/${eventId}`);
        navigate("/"); // Updated usage
      } catch (error) {
        setError("Error deleting event");
      }
    }
  };

  if (!event) {
    return <Text>Loading...</Text>;
  }

  return (
    <Box bg="blue.50" minHeight="100vh" p={4}>
      <Box bg="blue.600" color="white" p={4} borderRadius="md" mb={4}>
        <Heading textAlign="center">{event.title}</Heading>
      </Box>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <Box bg="white" p={4} borderRadius="md" boxShadow="md">
        <Image src={event.image} alt={event.title} mb={4} />
        <Text mb={4}>
          By: {users.find((user) => user.id === event.createdBy)?.name}
        </Text>
        {users.find((user) => user.id === event.createdBy)?.image && (
          <Image
            src={users.find((user) => user.id === event.createdBy)?.image}
            alt="User"
            mb={4}
          />
        )}
        <Text mb={4}>
          Start Time: {new Date(event.startTime).toLocaleString()}
        </Text>
        <Text mb={4}>End Time: {new Date(event.endTime).toLocaleString()}</Text>
        <Text mb={4}>{event.description}</Text>
        <Text mb={4}>{event.details}</Text>
        <Text mb={4}>
          Categories:{" "}
          {categories
            .filter((cat) => event.categoryIds.includes(cat.id))
            .map((cat) => cat.name)
            .join(", ")}
        </Text>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <FormControl id="title" mb={4}>
              <FormLabel>Title</FormLabel>
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="date" mb={4}>
              <FormLabel>Date</FormLabel>
              <Input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="location" mb={4}>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="description" mb={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="details" mb={4}>
              <FormLabel>Details</FormLabel>
              <Textarea
                name="details"
                value={formData.details}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="createdBy" mb={4}>
              <FormLabel>Created By</FormLabel>
              <Select
                name="createdBy"
                value={formData.createdBy}
                onChange={handleChange}
              >
                <option value="">Select User</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl id="categories" mb={4}>
              <FormLabel>Categories</FormLabel>
              <CheckboxGroup>
                {categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    value={category.id}
                    isChecked={formData.categoryIds.includes(category.id)}
                    onChange={handleCategoryChange}
                  >
                    {category.name}
                  </Checkbox>
                ))}
              </CheckboxGroup>
            </FormControl>
            <Button type="submit" colorScheme="teal">
              Save Changes
            </Button>
          </form>
        ) : (
          <>
            <Button onClick={handleEdit} mt={4} mr={4}>
              Edit
            </Button>
            <Button colorScheme="red" onClick={handleDelete} mt={4}>
              Delete
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default EventPage;
