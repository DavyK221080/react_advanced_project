// src/components/EventForm.jsx
import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Input,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Select,
  CheckboxGroup,
  Checkbox,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom"; // Updated import
import axios from "axios";

const EventForm = ({ addEvent, editEvent, events, users, categories }) => {
  const { id } = useParams();
  const navigate = useNavigate(); // Updated usage
  const eventToEdit = events?.find((event) => event.id === parseInt(id));

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
    if (eventToEdit) {
      setFormData(eventToEdit);
    }
  }, [eventToEdit]);

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
      if (eventToEdit) {
        await axios.put(
          `http://localhost:5000/events/${formData.id}`,
          formData
        );
        editEvent(formData);
      } else {
        const response = await axios.post(
          "http://localhost:5000/events",
          formData
        );
        addEvent(response.data);
      }
      navigate("/"); // Updated usage
    } catch (error) {
      console.error("Error saving event", error);
    }
  };

  return (
    <Box p={4}>
      <Heading>{eventToEdit ? "Edit Event" : "Add Event"}</Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="title" mb={4}>
          <FormLabel>Title</FormLabel>
          <Input name="title" value={formData.title} onChange={handleChange} />
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
        <Button type="submit">
          {eventToEdit ? "Save Changes" : "Add Event"}
        </Button>
      </form>
    </Box>
  );
};

export default EventForm;
