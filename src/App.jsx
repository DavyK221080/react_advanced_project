import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { Container } from "@chakra-ui/react";
import axios from "axios";
import EventsPage from "./pages/EventsPage";
import EventPage from "./pages/EventPage";
import EventForm from "./components/EventForm";
import Header from "./components/Header";

const App = () => {
  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const eventsResponse = await axios.get("http://localhost:5000/events");
        const usersResponse = await axios.get("http://localhost:5000/users");
        const categoriesResponse = await axios.get(
          "http://localhost:5000/categories"
        );

        setEvents(eventsResponse.data);
        setUsers(usersResponse.data);
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchData();
  }, []);

  const addEvent = async (event) => {
    try {
      const response = await axios.post("http://localhost:5000/events", event);
      setEvents([...events, response.data]);
    } catch (error) {
      console.error("Error adding event", error);
    }
  };

  const editEvent = async (updatedEvent) => {
    try {
      await axios.put(
        `http://localhost:5000/events/${updatedEvent.id}`,
        updatedEvent
      );
      setEvents(
        events.map((event) =>
          event.id === updatedEvent.id ? updatedEvent : event
        )
      );
    } catch (error) {
      console.error("Error editing event", error);
    }
  };

  const deleteEvent = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/events/${id}`);
      setEvents(events.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting event", error);
    }
  };

  return (
    <Container maxW="container.lg">
      <Header />
      <Routes>
        <Route path="/" element={<EventsPage />} />
        <Route
          path="/events/:eventId"
          element={
            <EventPage
              events={events}
              users={users}
              categories={categories}
              deleteEvent={deleteEvent}
            />
          }
        />
        <Route
          path="/add"
          element={
            <EventForm
              addEvent={addEvent}
              users={users}
              categories={categories}
            />
          }
        />
        <Route
          path="/edit/:id"
          element={
            <EventForm
              editEvent={editEvent}
              events={events}
              users={users}
              categories={categories}
            />
          }
        />
      </Routes>
    </Container>
  );
};

export default App;
